from flask import Flask, jsonify, request
import pika

app = Flask(__name__)

# conexão com o RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='livros_queue')

livros = [
    {
        'id': 1,
        'nome': 'Nome do Livro'
    },
    {
        'id': 2,
        'nome': 'Nome do Livro'
    }
]

@app.route('/livros', methods= ['GET'])
def obter_livros():
    return jsonify(livros)

#Listar livro por id
@app.route('/livros/<int:id>', methods= ['GET'])
def obter_livro_por_id(id):
    for livro in livros:
       if livro.get('id') == id:
           return jsonify(livro)

#editar livro por id

@app.route('/livros/<int:id>', methods= ['PUT'])
def editar_livro_por_id(id):
    livro_alterado = request.get_json()
    for indice,livro in enumerate(livros):
        if livro.get('id') == id:
            livros[indice].update(livro_alterado)
            return jsonify(livros[indice])

# criar livro
@app.route('/livros', methods=['POST'])
def incluir_novo_livro():
    novo_livro = request.get_json()
    livros.append(novo_livro)

    # Enviar mensagem para o RabbitMQ
    channel.basic_publish(exchange='ex_livros', routing_key='livros_queue', body=str(novo_livro))

    return jsonify(livros)

def excluir_livro_por_id(id):
    for indice, livro in enumerate(livros):
        if livro.get('id') == id:
            del livros[indice]

    return jsonify(livros)

app.config['DEBUG'] = True
app.run(port=8000, host='localhost', debug=True)





