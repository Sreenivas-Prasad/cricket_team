const express = require("express");

const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Govinda Govinda");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;
  const playerArray = await db.all(getPlayersQuery);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const addPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES ('${playerName}', '${jerseyNumber}', '${role}')`;
  const dbResponse = await db.run(addPlayerQuery);
  const bookId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const onePlayerQuery = `SELECT * FROM cricket_team WHERE player_id =${playerId}`;
  const player = await db.get(onePlayerQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `UPDATE cricket_team 
  SET 
  player_name = '${playerName}',
  jersey_number = '${jerseyNumber}',
  role = '${role}' 
  WHERE player_id = ${playerId}`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
