const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    res.send(`deployment successful ${process.env.TEST}`);
    console.log(process.env);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getPUUID", async (req, res) => {
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

app.get("/getSummonerInfo", async (req, res) => {
  const { puuid } = req.query;

  try {
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getTopPlayers", async (req, res) => {
  const { number = 10, queue = "RANKED_SOLO_5x5" } = req.query;

  const getPlayers = async (number) => {
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/${queue}?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();

    return data.entries
      .sort((a, b) => b.leaguePoints - a.leaguePoints)
      .slice(0, number);
  };

  const getPlayerInfo = async (players) => {
    const promises = players.map(async (player) => {
      const response = await fetch(
        `https://na1.api.riotgames.com/lol/summoner/v4/summoners/${player.summonerId}?api_key=${process.env.API_KEY}`
      );
      const data = await response.json();

      return {
        puuid: data.puuid,
        summonerLevel: data.summonerLevel,
        profileIconId: data.profileIconId,
        leaguePoints: player.leaguePoints,
        wins: player.wins,
        losses: player.losses,
      };
    });

    return await Promise.all(promises);
  };

  const getPlayerAccount = async (players) => {
    const promises = players.map(async (player) => {
      const response = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${player.puuid}?api_key=${process.env.API_KEY}`
      );
      const data = await response.json();

      return {
        ...player,
        gameName: data.gameName,
        tagLine: data.tagLine,
      };
    });

    return await Promise.all(promises);
  };

  try {
    const players = await getPlayers(number);
    const playersInfo = await getPlayerInfo(players);
    const data = await getPlayerAccount(playersInfo);

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen("3000", () => console.log("Server is running"));
