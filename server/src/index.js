const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());


const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {
  res.send("Hello from '/'");
});


//pings the mc server to see if it is online
app.get('/serverStatus', (_req, res) => {

  //need to ping the mc server ip to see if it is online
  const dns = require('node:dns');
  dns.lookup(process.env.MC_SERVER_IP, (err, address, family) => {

    //if there was an error, assume the server is offline (as this would likely have caused the error)
    if (err) {
      res.send(false);
    }

    //if there was no error and there is an address, then the server is online
    else if (address) {
      res.send(true);
    }

    //if there was no error, but there is also no address, the server is offline
    else {
      res.send(false);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
