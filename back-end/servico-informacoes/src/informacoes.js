const express = require("express");
const axios = require("axios");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const informacoesPorEventoId = {};
let id = 0;

app.get("/eventos/:id/informacoes", (req, res) => {
  res.send(informacoesPorEventoId[req.params.id] || []);
});

app.put("/eventos/:id/informacoes", async (req, res) => {
  id++;
  const { texto } = req.body;

  const informacoesDoEvento = informacoesPorEventoId[req.params.id] || [];
  informacoesDoEvento.push({ id, id_evento: req.params.id, texto });
  informacoesPorEventoId[req.params.id] = informacoesDoEvento;

  await axios.post("http://localhost:5000/eventosBarramento", {
    tipo: "InformacaoCriada",
    dados: {
      id,
      id_evento: req.params.id,
      texto,
    },
  });

  res.status(201).send(informacoesDoEvento);
});

//Barramento de Eventos
app.post("/eventosBarramento", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Serviço de Informações rodando na porta ${port}`);
});
