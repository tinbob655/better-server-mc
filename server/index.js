const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const serverStatus = require('./routes/serverStatus');

app.use(cors());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../client/dist')));

//routes
app.use('/serverStatus', serverStatus);

// Fallback: serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));