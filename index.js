//First thing we need to do is require our libraries
const cors = require("cors")
//const nodemon = require("nodemon")
const express = require("express")
const pg = require("pg")
const app = express()
const client = new pg.Client("postgres://localhost/anime")

//app.use(cors())

app.get("/api/anime", async(req, res, next) =>{
  //try and catch and response
  try{
    const SQL = `
    SELECT *
    FROM anime
    `;
    const response = await client.query(SQL);
    res.send(response.rows)
  }
  catch(error){
    next(error)
  }
});


//Second, need to have express server listen to a port
const start = async() =>{
  await client.connect()
  //SQL
  const SQL = `
  DROP TABLE IF EXISTS anime;
  CREATE TABLE anime(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    main_character VARCHAR(50)
  );
  INSERT INTO anime (title, main_character) VAlUES ('Inuyasha', 'Inuyasha');
  INSERT INTO anime (title, main_character) VAlUES ('Attack On Titan', 'Eren');
  INSERT INTO anime (title, main_character) VAlUES ('One Piece', 'Luffy');
  `;
  await client.query(SQL)

  const port = process.env.PORT || 2500;
  app.listen(port, () =>{
    console.log(`listening on port ${port}`)
  })
}
start()