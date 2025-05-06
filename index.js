const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const svg2png = require('svg2png');
const https = require('https');
//const html2canvas = require("html2canvas-pro");

//const cors = require('cors');
//const domtoimage = require('dom-to-image');

const app = express();
const port = 3000;


app.use(express.static('public'));

app.get('/api/roster/:team', async (req, res) => {
  const team = req.params.team;  // For example: "TOR"
  const url = `https://api-web.nhle.com/v1/roster/${team}/current`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/player/:id', async (req, res) => {
    const player = req.params.id;
    const url = `https://api-web.nhle.com/v1/player/${player}/landing`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const headshotUrl = data.headshot;
        const teamName = data.fullTeamName.default;
        const teamLogoUrl = data.teamLogo;

        if (headshotUrl && teamName &&teamLogoUrl) {
          const safeTeamName = teamName.replace(/[<>:"\/\\|?*]/g, '_');

          const headshotDirPath = path.join(__dirname, 'public', 'img', 'players', safeTeamName);
          const headshotFilePath = path.join(__dirname, 'public', 'img', 'players', `${data.fullTeamName.default}`, `${data.lastName.default}_${data.firstName.default}.png`);

          if (!fs.existsSync(headshotDirPath)) {
            fs.mkdirSync(headshotDirPath, {recursive: true});
          }

          if (fs.existsSync(headshotFilePath)) {
            return res.json(data);
          }

          const imageResponse = await axios.get(headshotUrl, {responseType: 'stream'});
          const imageWriter = fs.createWriteStream(headshotFilePath);

          imageResponse.data.pipe(imageWriter);

          imageWriter.on('finish', () => {
            res.json(data)
          })

          imageWriter.on('error', err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to save image' });
          })



      // LOGO DOWNLOADER - FIGURE OUT LATER
      /*   const logoDirPath = path.join(__dirname, 'public', 'img', 'teams');
        const logoFilePath = path.join(__dirname, 'public', 'img', 'teams', `${data.fullTeamName.default}.svg`);


          if (!fs.existsSync(logoDirPath)) {
            fs.mkdirSync(logoDirPath, {recursive: true});
          }

          if (fs.existsSync(logoFilePath)) {
            return res.json(data);
          }

         const logoResponse = await axios.get(teamLogoUrl, {responseType: 'stream'});
          const logoWriter = fs.createWriteStream(logoFilePath);

          logoResponse.data.pipe(logoWriter);
          logoWriter.on('finish', () => {
            res.json(data)
          })
          logoWriter.on('error', err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to save image' });
          })
        } else {
          res.json({ message: 'Player data fetched. No headshot found.', data }); */
      } 
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data'});
    }
});



/* TOHLE VRAŤ KDYŽ TO NEBUDE FUNGOVAT
app.get('/api/player/:id', async (req, res) => {
  const player = req.params.id;
  const url = `https://api-web.nhle.com/v1/player/${player}/landing`;

  try {
      const response = await axios.get(url);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({error: 'Failed to fetch data'});
  }
}); */



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});