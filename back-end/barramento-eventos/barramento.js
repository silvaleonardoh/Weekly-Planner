const express = require("express");
const axios = require('axios');
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/eventosBarramento", (req, res) => {
  const evento = req.body;
  //envia o evento para o microsserviço de eventos
  axios.post("http://localhost:3001/eventosBarramento", evento);
  //envia o evento para o microsserviço de informacoes
  axios.post("http://localhost:3002/eventosBarramento", evento);
  //envia o evento para o microsserviço de calendario
  axios.post("http://localhost:3003/eventosBarramento", evento);
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Barramento de eventos. Porta ${port}.`);
});
