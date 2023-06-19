const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3000;

const rabbitmqHost = 'localhost';
const rabbitmqPort = 5672;
const rabbitmqUsername = 'guest';
const rabbitmqPassword = 'guest';
const rabbitmqQueue = 'avisos-alertas';

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

// Rota para estabelecer a conexão SSE
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Conecta ao RabbitMQ e aguarda novas mensagens
  startConsumer(res);
});

async function startConsumer(response) {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(rabbitmqQueue, { durable: false });

    console.log('Consumer conectado ao RabbitMQ. Aguardando mensagens...');

    channel.consume(rabbitmqQueue, (msg) => {
      console.log('Nova mensagem recebida:', msg.content.toString());

      // Envia a mensagem para o cliente usando SSE
      response.write(`data: ${msg.content.toString()}\n\n`);
      
      channel.ack(msg);
    });
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ:', error);
  }
}
