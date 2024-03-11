import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db=new pg.Client({
  user:'postgres',
  database:'permalist_project',
  password:'a1b2c3@#',
  host:'localhost',
  port:5432
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async(req, res) => {
  try{
  const data=await db.query('SELECT * FROM permalist ORDER BY id');
  const items=data.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  }
  catch(err){
    console.log(err);
  }
  
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
  await db.query("INSERT INTO permalist (title) VALUES ($1)",[item]);
  }
  catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const id = req.body.updatedItemId;
  const new_name=req.body.updatedItemTitle
  try{
    await db.query("UPDATE permalist SET title = ($1) WHERE id=($2)",[new_name,id]);
  }
  catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  console.log(id);
  try{
    await db.query("DELETE FROM permalist WHERE id=($1)",[id]);
  }
  catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
