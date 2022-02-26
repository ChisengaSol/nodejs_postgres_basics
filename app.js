const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();

let pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
  // response.send("Hello world");
  response.sendFile(__dirname + "/add.html");
});

app.get("/info", (request, response) => {
  pool.connect(async (error, client, release) => {
    let resp = await client.query(`SELECT * FROM person`);
    release();
    //response.send(resp.rows);
    //response.send(resp.rows[0].first_name);
    response.json(resp);
  });
});

app.post("/", (request, response) => {
  pool.connect(async (error, client, release) => {
    let resp = client.query(
      `INSERT INTO person(first_name, last_name,gender, date_of_birth, email)
        VALUES('${request.body.fname}', '${request.body.lname}','${request.body.gender}', 
        '${request.body.dob}','${request.body.email}')`
    );
    response.redirect("/info");
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
