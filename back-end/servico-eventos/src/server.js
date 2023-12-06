const express = require('express');
const amqp = require('amqplib');
const app = express();
const port = 3001;

// Conexão com o RabbitMQ e funções relacionadas

app.listen(port, () => {
  console.log(`Serviço de Eventos rodando na porta ${port}`);
});
