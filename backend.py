from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Simulação de banco de dados (em produção, use um BD real)
pedidos = []

@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    try:
        # Recebe os dados do frontend
        pedido_data = request.get_json()

        # Valida os dados recebidos
        if not pedido_data:
            return jsonify({'error': 'Dados do pedido não fornecidos'}), 400

        cliente = pedido_data.get('cliente')
        itens = pedido_data.get('itens', [])
        total = pedido_data.get('total', 0)

        if not cliente or not itens:
            return jsonify({'error': 'Dados do cliente ou itens faltando'}), 400

        # Cria o pedido com ID e timestamp
        pedido = {
            'id': len(pedidos) + 1,
            'cliente': cliente,
            'itens': itens,
            'total': total,
            'status': 'pendente',
            'data_criacao': datetime.now().isoformat()
        }

        # Salva o pedido (em produção, salve no banco)
        pedidos.append(pedido)

        # Aqui você pode adicionar lógica para:
        # - Enviar email/SMS de confirmação
        # - Integrar com sistema de pagamento
        # - Notificar restaurante
        # - etc.

        print(f"Novo pedido recebido: {pedido}")

        return jsonify({
            'success': True,
            'pedido_id': pedido['id'],
            'mensagem': 'Pedido criado com sucesso!'
        }), 201

    except Exception as e:
        print(f"Erro ao processar pedido: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    # Endpoint para listar pedidos (útil para admin)
    return jsonify(pedidos), 200

@app.route('/api/pedidos/<int:pedido_id>', methods=['GET'])
def obter_pedido(pedido_id):
    # Buscar pedido específico
    pedido = next((p for p in pedidos if p['id'] == pedido_id), None)
    if pedido:
        return jsonify(pedido), 200
    return jsonify({'error': 'Pedido não encontrado'}), 404

if __name__ == '__main__':
    print("Servidor backend iniciado na porta 5000")
    print("Endpoint: POST /api/pedidos")
    app.run(debug=True, port=5000)