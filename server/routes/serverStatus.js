const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const util = require('minecraft-server-util');
    util.status('thursday-threefold.gl.joinmc.link')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.json({
                error: error
            });
        });
});

module.exports = router;