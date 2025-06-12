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
  async function getServerStatus() {
    const mcServer = await import('minecraftstatuspinger');
    const serverOnline = await mcServer.lookup({host: process.env.MC_SERVER_IP});
    
    if (serverOnline) {

      //sever is online
      return JSON.stringify(serverOnline);
    }
    else {

      //server was not online
      console.error('MC server is not online');
      return false;
    };
  };

  getServerStatus().then((result) => {
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
