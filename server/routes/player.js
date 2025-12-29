const express = require('express');
const router = express.Router();
const {Sequelize, Model, DataTypes} = require('sequelize');


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
}, {sequelize, modelName: 'player'});
sequelize.sync();


//routes
//get entire players table
router.get('/', async (req, res) => {
    const players = await Player.findAll();
    res.json(players);
});


//create new player
router.post('/', async (req, res) => {
    const { name, description, date } = req.body;
    const newPlayer = await Player.create({
        name,
        description,
        date,
    });
    res.json(newPlayer);
});


//update an existing player
router.put('/:name', async (req, res) => {
    const playerToEdit = await Player.findOne({ where: { name: req.params.name } });
    if (playerToEdit) {
        const { description, date } = req.body;
        await playerToEdit.update({
            description,
            date,
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