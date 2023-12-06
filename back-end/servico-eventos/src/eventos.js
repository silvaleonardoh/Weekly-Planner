const express = require("express");
const amqp = require("amqplib");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const eventos = {};
let id = 0;

app.get("/eventos", (req, res) => {
  res.send(eventos);
});

app.put("/eventos", (req, res) => {
  id ++;
  let {nome} = req.body;
  let {data} = req.body;
  let {categoria} = req.body;
  let {concluido} = false;
  
  eventos[id] = {
    id,nome,data,categoria,concluido
  };

  res.status(201).send(eventos[id]);
});

// Conexão com o RabbitMQ e funções relacionadas

app.listen(port, () => {
  console.log(`Serviço de Eventos rodando na porta ${port}`);
});
