const express = require("express");
const amqp = require("amqplib");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const informacoesPorEventoId = {};
let id = 0;

app.get("/eventos/:id/informacoes", (req, res) => {
  res.send(informacoesPorEventoId[req.params.id] || []);
});

app.put("/eventos/:id/informacoes", (req, res) => {
    id ++;
    const { texto } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const informacoesDoEvento = informacoesPorEventoId[req.params.id] || [];
    informacoesDoEvento.push({ id,id_evento: req.params.id, texto });
    informacoesPorEventoId[req.params.id] = informacoesDoEvento;
    res.status(201).send(informacoesDoEvento);
});

// Conexão com o RabbitMQ e funções relacionadas

app.listen(port, () => {
  console.log(`Serviço de Informações rodando na porta ${port}`);
});
