from flask import Flask, request, jsonify, send_from_directory
import os
import sys
import webbrowser
from threading import Timer
from pathlib import Path
from flask_cors import CORS
from datetime import datetime
from math import isfinite
from main3 import CLIENTES, IMOVEIS, USUARIOS, retornaListaJson, salvarListJson, proximo_id

app = Flask(__name__)

# Permite chamadas locais e de qualquer origem caso hospedado
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/clientes', methods=['GET'])
def consultar_clientes():
    clientes = retornaListaJson(CLIENTES)
    return jsonify(clientes)


@app.route('/api/clientes', methods=['POST'])
def cadastrar_cliente_api():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'JSON inválido'}), 400

    nome = str(dados.get('nome') or '').strip()
    telefone = str(dados.get('telefone') or '').strip()
    email = str(dados.get('email') or '').strip()
    interesse = str(dados.get('interesse') or '').strip().lower()

    if not nome or not telefone:
        return jsonify({'erro': 'Nome e telefone são obrigatórios'}), 400

    if interesse not in ('compra', 'venda', 'aluguel'):
        return jsonify({'erro': 'Interesse inválido'}), 400

    clientes = retornaListaJson(CLIENTES)
    novo_cliente = {
        'id': proximo_id(clientes),
        'nome': nome,
        'telefone': telefone,
        'email': email,
        'interesse': interesse
    }
    clientes.append(novo_cliente)
    salvarListJson(clientes, CLIENTES)

    return jsonify(novo_cliente), 201


@app.route('/api/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente_api(id):
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'JSON inválido'}), 400

    clientes = retornaListaJson(CLIENTES)
    cliente = next((c for c in clientes if c['id'] == id), None)

    if cliente is None:
        return jsonify({'erro': 'Cliente não encontrado'}), 404

    nome = str(dados.get('nome') or '').strip()
    telefone = str(dados.get('telefone') or '').strip()
    email = str(dados.get('email') or '').strip()
    interesse = str(dados.get('interesse') or '').strip().lower()

    if not nome or not telefone:
        return jsonify({'erro': 'Nome e telefone são obrigatórios'}), 400

    if interesse not in ('compra', 'venda', 'aluguel'):
        return jsonify({'erro': 'Interesse inválido'}), 400

    cliente.update({
        'nome': nome,
        'telefone': telefone,
        'email': email,
        'interesse': interesse
    })
    salvarListJson(clientes, CLIENTES)

    return jsonify(cliente), 200


@app.route('/api/clientes/<int:id>', methods=['DELETE'])
def excluir_cliente_api(id):
    clientes = retornaListaJson(CLIENTES)
    cliente = next((c for c in clientes if c['id'] == id), None)

    if cliente is None:
        return jsonify({'erro': 'Cliente não encontrado'}), 404

    clientes.remove(cliente)
    salvarListJson(clientes, CLIENTES)

    return jsonify({
        'mensagem': 'Cliente excluído com sucesso',
        'id': id
    }), 200


@app.route('/api/imoveis', methods=['GET'])
def listar_imoveis():
    imoveis = retornaListaJson(IMOVEIS)
    return jsonify(imoveis)


@app.route('/api/imoveis', methods=['POST'])
def cadastrar_imovel_api():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'JSON inválido.'}), 400

    campos = ['titulo', 'tipo', 'endereco', 'bairro', 'cidade', 'finalidade', 'valor', 'areaM2']
    if any(dados.get(campo) is None or str(dados[campo]).strip() == '' for campo in campos):
        return jsonify({'erro': 'Preencha todos os campos obrigatórios.'}), 400

    tipos_validos = ('apartamento', 'casa', 'terreno', 'comercial', 'cobertura')
    finalidades_validas = ('venda', 'aluguel')

    tipo = str(dados['tipo']).strip().lower()
    finalidade = str(dados['finalidade']).strip().lower()

    if tipo not in tipos_validos:
        return jsonify({'erro': 'Tipo de imóvel inválido.'}), 400

    if finalidade not in finalidades_validas:
        return jsonify({'erro': 'Finalidade inválida.'}), 400

    try:
        valor = float(dados['valor'])
        area = float(dados['areaM2'])
    except (ValueError, TypeError):
        return jsonify({'erro': 'Valor ou área inválidos.'}), 400

    if not isfinite(valor) or not isfinite(area) or valor <= 0 or area <= 0:
        return jsonify({'erro': 'Valor e área devem ser números positivos e finitos.'}), 400

    imoveis = retornaListaJson(IMOVEIS)
    novo_id = proximo_id(imoveis)

    codigo = str(dados.get('codigo') or '').strip() or f"IMV-{novo_id:03d}"

    imovel = {
        'id': novo_id,
        'codigo': codigo,
        'titulo': str(dados['titulo']).strip(),
        'tipo': tipo,
        'finalidade': finalidade,
        'valor': valor,
        'endereco': str(dados['endereco']).strip(),
        'bairro': str(dados['bairro']).strip(),
        'cidade': str(dados['cidade']).strip(),
        'areaM2': area,
        'quartos': dados.get('quartos'),
        'vagas': dados.get('vagas'),
        'descricao': dados.get('descricao', ''),
        'dataCadastro': datetime.now().strftime('%d/%m/%Y')
    }

    imoveis.append(imovel)
    salvarListJson(imoveis, IMOVEIS)

    return jsonify(imovel), 201


@app.route('/api/imoveis/<int:id>', methods=['DELETE'])
def excluir_imovel_api(id):
    imoveis = retornaListaJson(IMOVEIS)
    imovel = next((item for item in imoveis if item['id'] == id), None)

    if imovel is None:
        return jsonify({'erro': 'Imóvel não encontrado'}), 404

    imoveis.remove(imovel)
    salvarListJson(imoveis, IMOVEIS)

    return jsonify({
        'mensagem': 'Imóvel excluído com sucesso',
        'id': id
    }), 200


@app.route('/api/login', methods=['POST'])
def login_api():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'JSON inválido.'}), 400

    username = str(dados.get('username') or '').strip()
    password = str(dados.get('password') or '')

    if not username or not password:
        return jsonify({'erro': 'Usuário e senha são obrigatórios.'}), 400

    usuarios = retornaListaJson(USUARIOS)
    usuario = next(
        (u for u in usuarios if u.get('username', '').strip().lower() == username.lower() and (u.get('password') or u.get('senha')) == password),
        None
    )

    if usuario is None:
        return jsonify({'erro': 'Usuário ou senha incorretos.'}), 401

    perfis = {
        'adm': 'admin',
        'administrador': 'admin',
        'corretor': 'corretor',
        'atendente': 'atendente'
    }
    role = perfis.get(str(usuario.get('direitoAcesso') or '').strip().lower())

    if role is None:
        return jsonify({'erro': 'Perfil de acesso inválido.'}), 403

    return jsonify({
        'id': usuario['id'],
        'nome': usuario.get('nome') or usuario['username'],
        'email': usuario.get('email', ''),
        'role': role,
        'criadoEm': usuario.get('criadoEm', '')
    }), 200


@app.route('/api/usuarios', methods=['POST'])
def cadastrar_usuario_api():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'JSON inválido.'}), 400

    nome = str(dados.get('nome') or '').strip()
    username = str(dados.get('username') or '').strip()
    email = str(dados.get('email') or '').strip().lower()
    senha = str(dados.get('senha') or '')
    role = str(dados.get('role') or '').strip().lower()

    if not nome or not username or not email or not senha:
        return jsonify({'erro': 'Preencha todos os campos obrigatórios.'}), 400

    if len(senha) < 4:
        return jsonify({'erro': 'A senha deve ter pelo menos 4 caracteres.'}), 400

    perfis = {
        'admin': 'adm',
        'corretor': 'corretor',
        'atendente': 'atendente'
    }

    if role not in perfis:
        return jsonify({'erro': 'Perfil inválido.'}), 400

    usuarios = retornaListaJson(USUARIOS)

    if any(str(u.get('username') or '').strip().lower() == username.lower() for u in usuarios):
        return jsonify({'erro': 'Nome de usuário já cadastrado.'}), 409

    if any(str(u.get('email') or '').strip().lower() == email for u in usuarios):
        return jsonify({'erro': 'E-mail já cadastrado.'}), 409

    novo_usuario = {
        'id': proximo_id(usuarios),
        'nome': nome,
        'username': username,
        'email': email,
        'password': senha,
        'direitoAcesso': perfis[role],
        'criadoEm': datetime.now().strftime('%d/%m/%Y')
    }

    usuarios.append(novo_usuario)
    salvarListJson(usuarios, USUARIOS)

    return jsonify({
        'id': novo_usuario['id'],
        'nome': nome,
        'email': email,
        'role': role,
        'criadoEm': novo_usuario['criadoEm']
    }), 201


@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios_api():
    usuarios = retornaListaJson(USUARIOS)
    usuarios_publicos = []
    for usuario in usuarios:
        usuarios_publicos.append({
            'id': usuario['id'],
            'nome': usuario.get('nome') or usuario.get('username', ''),
            'username': usuario.get('username', ''),
            'email': usuario.get('email', ''),
            'direitoAcesso': usuario.get('direitoAcesso', ''),
            'criadoEm': usuario.get('criadoEm', '')
        })
    return jsonify(usuarios_publicos), 200


@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def excluir_usuario_api(id):
    usuarios = retornaListaJson(USUARIOS)
    usuario = next((u for u in usuarios if u.get('id') == id), None)

    if usuario is None:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404

    usuarios.remove(usuario)
    salvarListJson(usuarios, USUARIOS)

    return jsonify({'mensagem': 'Usuário excluído com sucesso.'}), 200


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def servir_frontend(path):
    if getattr(sys, 'frozen', False):
        dist = Path(sys.executable).resolve().parent / 'dist'
    else:
        dist = Path(__file__).resolve().parent / 'dist'
        if not dist.exists():
            dist = Path(__file__).resolve().parent.parent / 'dist'

    arquivo = dist / path
    if path and arquivo.is_file() and arquivo.resolve().is_relative_to(dist.resolve()):
        return send_from_directory(dist, path)

    if dist.exists() and (dist / 'index.html').is_file():
        return send_from_directory(dist, 'index.html')

    return jsonify({
        'status': 'API Imobiliária Horizonte ativa',
        'rotas': ['/api/clientes', '/api/imoveis', '/api/usuarios', '/api/login']
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    is_cloud = os.environ.get('RENDER') or os.environ.get('PORT')
    host = '0.0.0.0' if is_cloud else '127.0.0.1'

    if not is_cloud:
        url = f'http://{host}:{port}'
        Timer(1.5, lambda: webbrowser.open(url)).start()

    app.run(host=host, port=port, debug=False, use_reloader=False)
