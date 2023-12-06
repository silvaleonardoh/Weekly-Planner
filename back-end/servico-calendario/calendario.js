const express = require("express");
const app = express();
const porta = 3003;

const baseConsulta = {};

const funcoes = {
  EventoCriado: (eventos) => {
    baseConsulta[eventos.id] = eventos;
  },
  InformacaoCriada: (informacoesDoEvento) => {
    const observacoes =
      baseConsulta[informacoesDoEvento.id]["informacoes"] || [];
    observacoes.push(informacoesDoEvento);
    baseConsulta[informacoesDoEvento.id]["informacoes"] = informacoesDoEvento;
  },
};

app.use(express.json());

app.get("/eventos", (req, res) => {
  res.status(200).send(baseConsulta);
});

app.post("/eventosBarramento", (req, res) => {
  funcoes[req.body.tipo](req.body.dados);
  res.status(200).send(baseConsulta);
});

app.listen(porta, () => {
  console.log(`Serviço de Calendário rodando na porta ${porta}`);
});
