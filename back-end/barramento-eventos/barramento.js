const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/eventosBarramento", (req, res) => {
  const evento = req.body;
  //envia o evento para o microsserviço de eventos
  axios
    .post("http://localhost:3001/eventosBarramento", evento)
    .then((response) => {
      console.log("Sucesso:", response.data);
    })
    .catch((error) => {
      console.error("Erro ao enviar para 3001:", error.message);
    });
  //envia o evento para o microsserviço de informacoes
  axios
    .post("http://localhost:3002/eventosBarramento", evento)
    .then((response) => {
      console.log("Sucesso:", response.data);
    })
    .catch((error) => {
      console.error("Erro ao enviar para 3002:", error.message);
    });
  //envia o evento para o microsserviço de calendario
  axios
    .post("http://localhost:3003/eventosBarramento", evento)
    .then((response) => {
      console.log("Sucesso:", response.data);
    })
    .catch((error) => {
      console.error("Erro ao enviar para 3003:", error.message);
    });
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Barramento de eventos. Porta ${port}.`);
});
