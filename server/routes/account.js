const express = require('express');
const router = express.Router();
const {Sequelize, Model, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();
const sharp = require('sharp');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/account.sqlite',
});

class Account extends Model {};
Account.init({
    username: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    profilePicture: DataTypes.BLOB,
}, {sequelize, modelName: 'account'});
sequelize.sync();


//routes
//query if a user is logged in
router.get('/queryLoggedIn', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    };
});

//create a new account
router.post('/createAccount', upload.single('profilePicture'), async (req, res) => {
    const {username, password} = req.body;

    //make sure we have a username, password, and profile picture
    if (!username || !password || !req.file) {
         return res.status(400).json({message: "Did not receive username, password, and profile picture"});
    };

    //make sure the username provided is unique
    try {
        const duplicates = await Account.findAll({where: {username: username}});
        if (duplicates?.length > 0) {
            return res.status(409).json({message: "An account with that username already exists"});
        };

        //validate password
        if (!validatePassword(password)) {

            //password was invalid
            return res.status(409).json({message: "Password was not valid (must have at least: 5 characters, 1 uppercase character, 1 lowercase character, 1 number and 2 symbol)"});
        };

        //process the profile picture
        const profilePicture = await cropToCircle(req.file.buffer);

        //we are good to go, store the username and a hash of the user's password
        const passwordHash = await bcrypt.hash(password, 10);
        await Account.create({
            username: username,
            passwordHash: passwordHash,
            profilePicture: profilePicture,
        });

        // Log the user in by setting session
        req.session.user = { username };

        res.json({
            loggedIn: true,
            username: username,
        });
    }
    catch (error) {
        res.status(400).json(error);
    };
});

//log a new user in
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    //make sure we got a username and a password
    if (!username || !password) {
        return res.status(400).json({message: "Did not receive either a username or a password"});
    };

    const user = await Account.findOne({where: {username}});

    if (!user) {
        return res.status(401).json({message: "No account with that username exists"});
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
        return res.status(401).json({message: "Invalid credentials"});
    };

    req.session.user = {username: user.username};
    res.json({loggedIn: true, username: user.username});
});

//log a user out
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({loggedIn: false});
    });
});

//query if a username exists
router.post('/usernameExists', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ exists: false, message: "No username provided" });
    };
    const user = await Account.findOne({ where: { username } });
    res.json({ exists: !!user });
});


//get profile picture by username
router.get('/profilePicture/:username', async (req, res) => {
    const { username } = req.params;
    
    if (!username) {
        return res.status(400).json({ message: "No username provided" });
    };
    
    try {
        const user = await Account.findOne({ where: { username } });
        
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: "Profile picture not found" });
        };
        
        res.set('Content-Type', 'image/png');
        res.send(user.profilePicture);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profile picture" });
    };
});


function validatePassword(password) {

    //min 5 chars, one uppercase, one lowercase, one number, one symbol
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
    return ((typeof password === 'string') && (regex.test(password)));
};


//helper function to crop any image to be a circle and be a *.png
async function cropToCircle(buffer, size = 256) {
    const svg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`;
    return await sharp(buffer)
        .resize(size, size, { fit: 'cover' })
        .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
        .png()
        .toBuffer();
};

module.exports = router;