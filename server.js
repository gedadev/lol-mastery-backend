const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    res.send("deployment successful");
  } catch (error) {
    console.log(error);
  }
});

app.get("/getPPUID", async (req, res) => {
  const { name, tag } = req.query;

  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getChampList", async (req, res) => {
  const { puuid } = req.query;
  console.log(puuid);

  try {
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen("3000", () => console.log("Server is running"));
