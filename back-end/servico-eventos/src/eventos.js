const express = require("express");
const axios = require("axios");
const mysql = require("mysql2");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

const eventos = {};
let id = 0;

const baseConsulta = {};
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/eventos", (req, res) => {
  res.send(eventos);
});

app.put("/eventos", async (req, res) => {
  id++;
  let { nome } = req.body;
  let { data } = req.body;
  let { categoria } = req.body;
  let { concluido } = req.body;

  eventos[id] = {
    id,
    nome,
    data,
    categoria,
    concluido,
  };

  await axios.post("http://localhost:5000/eventosBarramento", {
    tipo: "EventoCriado",
    dados: {
      id,
      nome,
      data,
      categoria,
      concluido,
    },
  });

  res.status(201).send(eventos[id]);
});

app.post("/eventos", (req, res) => {
  id++;
  let { nome } = req.body;
  let { data } = req.body;
  let { categoria } = req.body;
  let { concluido } = false;

  const sql =
    "INSERT INTO tb_eventos (id, nome, data, categoria, concluido) VALUES (?, ?)";
  pool.query(
    sql,
    [id, nome, data, categoria, concluido],
    (err, results, fields) => {
      console.log(results);
      console.log(fields);
      res.send("ok");
    }
  );
});

//Barramento de Eventos
app.post("/eventosBarramento", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Serviço de Eventos rodando na porta ${port}`);
});
