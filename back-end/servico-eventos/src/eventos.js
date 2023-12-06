const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const eventos = {};
let id = 0;

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

//Barramento de Eventos
app.post("/eventosBarramento", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Serviço de Eventos rodando na porta ${port}`);
});
