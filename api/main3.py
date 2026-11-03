"""
Projeto AVC - Lógica de Programação e Estrutura de Dados
Sistema de Cadastro de Clientes - Imobiliária Horizonte
Execução: python main.py
Os dados são armazenados localmente em clientes.json.
"""

import json
import sys
from pathlib import Path

if getattr(sys, 'frozen', False):
    PASTA_BASE = Path(sys.executable).resolve().parent
else:
    PASTA_BASE = Path(__file__).resolve().parent

CLIENTES = PASTA_BASE / 'clientes.json'
USUARIOS = PASTA_BASE / 'usuarios.json'
IMOVEIS = PASTA_BASE / 'imoveis.json'


def retornaListaJson(arquivo_):
    if arquivo_.exists():
        try:
            with arquivo_.open('r', encoding='utf-8') as arquivo:
                dados = json.load(arquivo)
                return dados if isinstance(dados, list) else []
        except (json.JSONDecodeError, OSError):
            print('Aviso: não foi possível ler o arquivo de dados. Iniciando lista vazia.')
    return []


def salvarListJson(clientes, file):
    with file.open('w', encoding='utf-8') as arquivo:
        json.dump(clientes, arquivo, ensure_ascii=False, indent=4)


def proximo_id(clientes):
    return max((cliente.get('id', 0) for cliente in clientes), default=0) + 1


def cadastrarUser(usuarios):
    while True:
        print('\n--- Cadastro de usuários ---')
        username = input('Digite o Username: ').strip()
        encontrados = [u for u in usuarios if u['username'].lower() == username.lower()]
        if encontrados:
            print('Usuário já criado.')
            continue
        senha = input('Senha: ')
        if not username or not senha:
            print('O usuário e senha são obrigatórios, digite novamente, por favor.')
            continue
        while True:
            direitoAcesso_ = input('Tipo de Direito de acesso: ').strip().lower()
            if direitoAcesso_ in ('corretor', 'atendente', 'administrador'):
                print('Direito de acesso válido...\nCadastrando usuário')
                break
            else:
                print('Direito de acesso inválido, digite entre Administrador, corretor ou atendente.')

        listUsuarios = {
            'id': proximo_id(usuarios),
            'username': username,
            'password': senha,
            'direitoAcesso': direitoAcesso_
        }
        usuarios.append(listUsuarios)
        salvarListJson(usuarios, USUARIOS)
        return


def cadastrar_cliente(clientes):
    print('\n--- Cadastro de cliente ---')
    nome = input('Nome completo: ').strip()
    telefone = input('Telefone: ').strip()
    email = input('E-mail: ').strip()
    interesse = input('Interesse (compra, venda ou aluguel): ').strip().lower()

    if not nome or not telefone:
        print('Nome e telefone são obrigatórios.')
        return

    if interesse not in ('compra', 'venda', 'aluguel'):
        print('Interesse inválido. Use compra, venda ou aluguel.')
        return

    cliente = {
        'id': proximo_id(clientes),
        'nome': nome,
        'telefone': telefone,
        'email': email,
        'interesse': interesse
    }
    clientes.append(cliente)
    salvarListJson(clientes, CLIENTES)
    print(f'Cliente cadastrado com sucesso! Código: {cliente["id"]}')


def listar_clientes(clientes):
    print('\n--- Clientes cadastrados ---')
    if not clientes:
        print('Nenhum cliente cadastrado.')
        return
    for c in clientes:
        print(f"ID: {c['id']} | Nome: {c['nome']} | Telefone: {c['telefone']} | E-mail: {c.get('email', '')} | Interesse: {c['interesse']}")


def buscar_cliente(clientes):
    termo = input('\nDigite o nome ou telefone para buscar: ').strip().lower()
    encontrados = [c for c in clientes if termo in c['nome'].lower() or termo in c['telefone'].lower()]
    if not encontrados:
        print('Nenhum cliente encontrado.')
        return
    for c in encontrados:
        print(f"ID: {c['id']} | Nome: {c['nome']} | Telefone: {c['telefone']} | E-mail: {c.get('email', '')} | Interesse: {c['interesse']}")


def atualizar_cliente(clientes):
    try:
        codigo = int(input('\nInforme o ID do cliente que deseja atualizar: '))
    except ValueError:
        print('Digite um número válido.')
        return

    cliente = next((c for c in clientes if c['id'] == codigo), None)
    if not cliente:
        print('Cliente não encontrado.')
        return

    print('Pressione Enter para manter o valor atual.')
    nome = input(f"Nome [{cliente['nome']}]: ").strip()
    telefone = input(f"Telefone [{cliente['telefone']}]: ").strip()
    email = input(f"E-mail [{cliente.get('email', '')}]: ").strip()
    interesse = input(f"Interesse [{cliente['interesse']}]: ").strip().lower()

    if nome:
        cliente['nome'] = nome
    if telefone:
        cliente['telefone'] = telefone
    if email:
        cliente['email'] = email
    if interesse:
        if interesse in ('compra', 'venda', 'aluguel'):
            cliente['interesse'] = interesse
        else:
            print('Interesse inválido; mantendo o valor anterior.')

    salvarListJson(clientes, CLIENTES)
    print('Cadastro atualizado.')


def excluirPorID(list, USUARIOS):
    try:
        codigo = int(input('\nInforme o ID que deseja excluir: '))
    except ValueError:
        print('Digite um número válido.')
        return

    listUser = next((c for c in list if c['id'] == codigo), None)
    if not listUser:
        print('Não foi possível encontrar com esse ID.')
        return

    nome = listUser.get('nome', listUser.get('username'))
    confirmacao = input(f'Confirma excluir {nome}? (s/n): ').strip().lower()
    if confirmacao == 's':
        list.remove(listUser)
        salvarListJson(list, USUARIOS)
        print('Exclusão realizada com sucesso!')
    else:
        print('Exclusão cancelada.')


def consultar_usuario(usuario, username, password):
    for user in usuario:
        if user.get('username') == username and user.get('password') == password:
            return user
    return None


def checaDireitoAcesso(usuario, direito):
    return usuario.get('direitoAcesso').lower() == direito.lower()


def login():
    while True:
        usuarios = retornaListaJson(USUARIOS)
        print('\n===================================')
        print(' IMOBILIÁRIA HORIZONTE - LOGIN')
        print('======================================')
        username = input('Digite seu usuário ou Digite "sair" para fechar o programa: ').strip()
        if username == 'sair':
            print('Saindo do sistema...\n...')
            return
        senha = input('Digite sua senha: ').strip()
        usuarioLogado = consultar_usuario(usuarios, username, senha)
        if usuarioLogado is not None:
            print('Logado com sucesso.')
            if checaDireitoAcesso(usuarioLogado, 'corretor'):
                print('Direito de acesso: Corretor.')
                menuCorretor()
            elif checaDireitoAcesso(usuarioLogado, 'adm'):
                print('Direito de acesso: adm')
                menuAdm()
            elif checaDireitoAcesso(usuarioLogado, 'atendente'):
                print('Direito de acesso: Atendente.')
                menuAtendente()
            else:
                print('Direito de acesso: Incorreto.')
        else:
            print('Usuário e/ou senha incorretos.\nPor favor, digite novamente.')


def menuAdm():
    usuarios = retornaListaJson(USUARIOS)
    while True:
        print('\n===================================')
        print(' IMOBILIÁRIA HORIZONTE - Menu Administrador')
        print('1 - Cadastrar usuario\n2 - Consultar usuario\n3 - Excluir usuário\n4 - Fazer Logoff')
        opcao = input('Digite sua opção: ').strip()
        if opcao == '1':
            cadastrarUser(usuarios)
        elif opcao == '2':
            print('Consulta de usuários ainda em andamento...')
        elif opcao == '3':
            excluirPorID(usuarios, USUARIOS)
        elif opcao == '4':
            print('Fazendo Logoff...')
            usuarios = retornaListaJson(USUARIOS)
            return


def cadastrar_imovel(imoveis):
    print('\n--- Cadastro de imóvel ---')
    tipo = input('Tipo (casa, apartamento, terreno, outro): ').strip().lower()
    endereco = input('Endereço: ').strip()
    bairro = input('Bairro: ').strip()
    cidade = input('Cidade: ').strip()
    finalidade = input('Finalidade (venda ou aluguel): ').strip().lower()

    if not tipo or not endereco or not bairro or not cidade:
        print('Todos os campos de localização e tipo são obrigatórios.')
        return

    if finalidade not in ('venda', 'aluguel'):
        print('Finalidade inválida. Informe venda ou aluguel.')
        return

    try:
        valor = float(input('Valor em R$ (ex.: 250000.00): ').strip().replace(',', '.'))
    except ValueError:
        print('Valor inválido. Digite um número.')
        return

    if valor <= 0:
        print('O valor deve ser maior que zero.')
        return

    imovel = {
        'id': proximo_id(imoveis),
        'tipo': tipo,
        'endereco': endereco,
        'bairro': bairro,
        'cidade': cidade,
        'finalidade': finalidade,
        'valor': valor
    }
    imoveis.append(imovel)
    salvarListJson(imoveis, IMOVEIS)
    print(f'Imóvel cadastrado com sucesso! ID: {imovel["id"]}')


def consultar_imovel(imoveis):
    print('\n--- Consulta de imóveis ---')
    if not imoveis:
        print('Nenhum imóvel cadastrado.')
        return

    termo = input('Digite o ID do imóvel ou Enter para listar todos: ').strip()
    if termo:
        try:
            codigo = int(termo)
            encontrados = [imovel for imovel in imoveis if imovel['id'] == codigo]
        except ValueError:
            print('ID inválido. Digite um número inteiro.')
            return
    else:
        encontrados = imoveis

    if not encontrados:
        print('Imóvel não encontrado.')
        return

    for imovel in encontrados:
        print(f"ID: {imovel['id']} | Tipo: {imovel['tipo']} | Endereço: {imovel['endereco']} | Bairro: {imovel['bairro']} | Cidade: {imovel['cidade']} | Finalidade: {imovel['finalidade']} | Valor: R$ {imovel['valor']:.2f}")


def excluir_imovel(imoveis):
    print('\n--- Exclusão de imóvel ---')
    try:
        codigo = int(input('Informe o ID do imóvel: ').strip())
    except ValueError:
        print('ID inválido. Digite um número inteiro.')
        return

    imovel = next((item for item in imoveis if item['id'] == codigo), None)
    if imovel is None:
        print('Imóvel não encontrado.')
        return

    confirmacao = input(f"Confirma excluir o imóvel {imovel['id']} ({imovel['endereco']})? (s/n): ").strip().lower()
    if confirmacao != 's':
        print('Exclusão cancelada.')
        return

    imoveis.remove(imovel)
    salvarListJson(imoveis, IMOVEIS)
    print('Imóvel excluído com sucesso!')


def menuCorretor():
    imoveis = retornaListaJson(IMOVEIS)
    while True:
        print('\n===================================')
        print(' IMOBILIÁRIA HORIZONTE - Menu Corretor de Imóveis')
        print('1 - Cadastrar Imóvel\n2 - Consultar Imóvel\n3 - Excluir Imóvel\n4 - Fazer Logoff')
        opcao = input('Digite sua opção: ').strip()
        if opcao == '1':
            cadastrar_imovel(imoveis)
        elif opcao == '2':
            consultar_imovel(imoveis)
        elif opcao == '3':
            excluir_imovel(imoveis)
        elif opcao == '4':
            return
        else:
            print('Opção inválida, digite novamente.')


def menuAtendente():
    clientes = retornaListaJson(CLIENTES)
    while True:
        print('\n==================================\nIMOBILIÁRIA HORIZONTE - Menu Atendente')
        print('1 - Cadastrar cliente')
        print('2 - Listar clientes')
        print('3 - Buscar cliente')
        print('4 - Atualizar cliente')
        print('5 - Excluir cliente')
        print('0 - Fazer Logoff')
        opcao = input('Escolha uma opção: ').strip()
        if opcao == '1':
            cadastrar_cliente(clientes)
        elif opcao == '2':
            listar_clientes(clientes)
        elif opcao == '3':
            buscar_cliente(clientes)
        elif opcao == '4':
            atualizar_cliente(clientes)
        elif opcao == '5':
            excluirPorID(clientes, CLIENTES)
        elif opcao == '0':
            return
        else:
            print('Opção inválida, digite novamente.')


def menu(clientes):
    while True:
        print('\n===================================')
        print(' IMOBILIÁRIA HORIZONTE - CLIENTES')
        print('===================================')


if __name__ == '__main__':
    login()
