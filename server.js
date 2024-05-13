const express = require("express");
const cors = require("cors");

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
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=RGAPI-86f810e9-60fa-4ef0-8c32-c5f80bde18b4`
    );
    const data = await response.json();

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen("3000", () => console.log("Server is running"));
