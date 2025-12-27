const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const serverStatus = require('./routes/serverStatus');

app.use(cors());

//routes
app.use('/api/serverStatus', serverStatus);


// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback: serve index.html for React Router (SPA)
app.get(/^\/(?!.*\..*).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Website running on port ${PORT}`));