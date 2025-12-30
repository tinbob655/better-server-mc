const express = require('express');
const router = express.Router();
const {Sequelize, Model, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/feed.sqlite',
});


//classes
class Feed extends Model {}
Feed.init({
    posterUsername: DataTypes.STRING,
    textContent: DataTypes.STRING,
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
}, {sequelize, modelName: 'feed'});
sequelize.sync();


//routes
//get all feed posts
router.get('/', async (req, res) => {
    const data = await Feed.findAll();
    res.json(data);
});


//create a new post to the feed
router.post('/', async (req, res) => {
    const { posterUsername, textContent } = req.body;

    //make sure we got a username and content
    if (!posterUsername || !textContent) {
        return res.status(401).json({ message: "Did not receive either a username or content" });
    };

    //attempt to write to db
    try {
        const feed = await Feed.create({
            posterUsername,
            textContent
        });
        res.json(feed);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating feed record", error: error.message });
    };
});


//edit an existing post to the feed
router.put('/:id', async (req, res) => {
    const feedToEdit = await Feed.findOne({where: {id: req.params.id}});
    if (!feedToEdit) {
        return res.status(400).json({message: "Could not find feed to edit"});
    };
    const {newUsername, newTextContent} = req.body;
    if (!newUsername || !newTextContent) {
        return res.status(400).json({message: "Did not receive either a username or content"});
    };
    await feedToEdit.update({
        posterUsername: newUsername,
        textContent: newTextContent,
    });

    //return all feeds
    const feeds = await Feed.findAll();
    res.json(feeds);
});


//delete a post
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(401).json({message: "No id received"});
    };
    const feedToDelete = await Feed.findOne({where: {id: id}});
    if (!feedToDelete) {
        return res.status(400).json({message: "Could not find feed to delete"});
    };
    await feedToDelete.destroy();

    //return an updated list of players
    const feeds = await Feed.findAll();
    res.json(feeds);
});

module.exports = router;