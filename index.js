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

//Third, if we want to be able to get item by id we need to create a route to "GET"
app.get("/api/anime/:id", async (req, res, next) =>{
  // console.log("hello") //shows up
  try {
    const SQL = `SELECT * FROM anime WHERE id=$1`
    const response = await client.query(SQL, [req.params.id])

    //for error when id does not exist
    if(!response.rows.length){
      next({
        title: "missing title error",
        message: `anime with id ${req.params.id} does not exist`
      })
    }

    res.send(response.rows);
  } catch (error){
    next(error)
  }

})
//ERROR HANDLER
app.use((error, req,res,next) =>{
  res.status(500)
  res.send(error)
})
//Second, need to have express server listen to a port
const start = async() =>{
  await client.connect()
  //SQL route
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