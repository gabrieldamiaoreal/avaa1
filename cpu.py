
import psutil
import pika


rabbitmq_host = 'localhost'
rabbitmq_port = 5672
rabbitmq_username = 'guest'
rabbitmq_password = 'guest'
rabbitmq_queue = 'avisos-alertas'

credentials = pika.PlainCredentials(rabbitmq_username, rabbitmq_password)
connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port, '/', credentials))
channel = connection.channel()
channel.queue_declare(queue=rabbitmq_queue)

def monitorar_cpu():
    percentual_cpu = psutil.cpu_percent()
    if percentual_cpu > 30:  
        mensagem = f"Uso da CPU excedeu o limite: {percentual_cpu}%"
        channel.basic_publish(exchange='', routing_key=rabbitmq_queue, body=mensagem)
        print("Mensagem enviada para o RabbitMQ:", mensagem)

while True:
    monitorar_cpu()

