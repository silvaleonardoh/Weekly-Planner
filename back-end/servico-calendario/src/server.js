const express = require("express");
const app = express();
const porta = 3000;

// Defina as rotas e lógica aqui

app.listen(porta, () => {
  console.log(`Serviço de Calendário rodando na porta ${porta}`);
});
