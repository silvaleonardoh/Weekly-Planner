const express = require("express");
const mysql = require("mysql2");
const app = express();
const porta = 3003;
const cors = require("cors");
require("dotenv").config();
app.use(cors());

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

// app.get("/eventos", (req, res) => {
//   pool.query("SELECT * FROM tb_eventos", (err, results, fields) => {
//     res.json(results);
//   });
// });

app.get("/eventos", (req, res) => {
  res.status(200).send(baseConsulta);
});

app.post("/eventosBarramento", (req, res) => {
  funcoes[req.body.tipo](req.body.dados);
  res.status(200).send(baseConsulta);
});

app.delete("/eventos/:id", (req, res) => {
  const { id } = req.params;

  // Verifica se o evento com esse ID existe
  if (baseConsulta[id]) {
    delete baseConsulta[id]; // Exclui o evento do objeto de armazenamento
    res.status(200).send({ msg: "Evento excluído com sucesso" });
  } else {
    // Se o evento não existir, retorna um erro
    res.status(404).send({ msg: "Evento não encontrado" });
  }
});

app.listen(porta, () => {
  console.log(`Serviço de Calendário rodando na porta ${porta}`);
});
