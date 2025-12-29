const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
const serverStatus = require('./routes/serverStatus');
app.use('/api/serverStatus', serverStatus);

const playerDB = require('./routes/player');
app.use('/api/playerDb', playerDB);

const accountDB = require('./routes/account');
app.use('/api/accountDb', accountDB);


//server the frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback: serve index.html for React Router (SPA)
app.get(/^\/(?!.*\..*).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Website running on port ${PORT}`));