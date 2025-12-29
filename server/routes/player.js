const express = require('express');
const router = express.Router();
const {Sequelize, Model, DataTypes} = require('sequelize');
const multer = require('multer');
const upload = multer();
const sharp = require('sharp');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/player.sqlite',
});


//classes
class Player extends Model {}
Player.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATE,
    profilePicture: DataTypes.BLOB,
}, {sequelize, modelName: 'player'});
sequelize.sync();


//routes
//get entire players table
router.get('/', async (req, res) => {
    const players = await Player.findAll();
    res.json(players);
});


//create new player
router.post('/', upload.single('profilePicture'), async (req, res) => {
    const { name, description, date } = req.body;
    let profilePicture = null;
    if (req.file) {
        profilePicture = await cropToCircle(req.file.buffer);
    }
    const newPlayer = await Player.create({
        name,
        description,
        date,
        profilePicture
    });
    res.json(newPlayer);
});


//update an existing player
router.put('/:name', upload.single('profilePicture'), async (req, res) => {
    const playerToEdit = await Player.findOne({ where: { name: req.params.name } });
    if (playerToEdit) {
        const { description, date } = req.body;
        let profilePicture = playerToEdit.profilePicture;
        if (req.file) {
            profilePicture = await cropToCircle(req.file.buffer);
        }
        await playerToEdit.update({
            description,
            date,
            profilePicture
        });
        res.json(playerToEdit);
    } else {
        res.status(404).json({ message: "Could not find user to edit." });
    }
});


//delete a player
router.delete('/:name', async (req, res) => {
    try {
        const playerToDelete = await Player.findOne({ where: { name: req.params.name } });
        if (!playerToDelete) {
            return res.status(404).json({ message: "Could not find user to delete." });
        }

        await playerToDelete.destroy();

        // Return the updated list of players
        const players = await Player.findAll();
        res.json(players);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting player." });
    }
});

module.exports = router;


//helper function to crop any image to be a circle and be a *.png
async function cropToCircle(buffer, size = 256) {
    const svg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`;
    return await sharp(buffer)
        .resize(size, size, { fit: 'cover' })
        .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
        .png()
        .toBuffer();
};