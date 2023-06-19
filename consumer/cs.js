  const amqp = require('amqplib');
  const rabbitmqHost = 'localhost';
  const rabbitmqPort = 5672;
  const rabbitmqUsername = 'guest';
  const rabbitmqPassword = 'guest';
  const rabbitmqQueue = 'avisos-alertas';

  async function startConsumer() {
    try {
    
      const connection = await amqp.connect(`amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}`);
      const channel = await connection.createChannel();

      
      await channel.assertQueue(rabbitmqQueue, { durable: false });

      console.log('Consumer conectado ao RabbitMQ. Aguardando mensagens...');

      
      channel.consume(rabbitmqQueue, (msg) => {
        console.log('Nova mensagem recebida:', msg.content.toString());

        // Aqui você pode exibir a mensagem na interface do usuário ou realizar outras ações necessárias
        let mensagem = msg.content.toString();

      

       
        channel.ack(msg);
      });
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  startConsumer();

