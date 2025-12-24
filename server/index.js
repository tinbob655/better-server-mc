const express = require('express');
const app = express();
const cors = require('cors');

//get routes
const serverStatus = require('./routes/serverStatus');


app.use(cors());
app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
app.get('/', (req, res) => {
    res.send("Hello from backend!");
});


//routes
app.use('/serverStatus', serverStatus);