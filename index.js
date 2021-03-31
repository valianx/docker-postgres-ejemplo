const express = require("express");
const app = express();

const { Client } = require("pg");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8888;

const client = new Client({
  host: "db",
  user: "admin",
  password: "1234",
  database: "db",
});

client.connect();

app.post("/data", async (req, res) => {
  const datosA = req.body.datos;
  console.log(datosA);
  try {
    await client
      .query(
        `CREATE TABLE IF NOT EXISTS users (
        nombre VARCHAR(100) ,
        apellido VARCHAR(100) 
        );`
      )
      .then((res) => console.error("CREADA"))
      .catch((e) => console.error("NO CREADA"));

    // await datos();

    // console.log(await selectData());
  } catch (error) {
    console.log(error);
  }

  res.status(200).json("creado");
  // client.end()
});

const datos = async () => {
  const query = {
    // give the query a unique name
    name: "fetch-user",
    text: "INSERT INTO users(nombre,apellido) VALUES ($1,$2)",
    values: ["Mario", "Guitierrez"],
  };

  // callback
  client.query(query, (err, res) => {
    if (err) {
      console.log("ERROR", err);
    } else {
      console.log("INSERTADO");
    }
  });
};

const selectData = async () => {
  // callback
  await client.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows);
    }
  });
};

app.listen(PORT, () => {
  console.log("Server on port ", PORT);
});
