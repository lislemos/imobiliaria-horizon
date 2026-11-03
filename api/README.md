# API - Imobiliária Horizonte

Backend em Python (Flask) para gestão de clientes, imóveis e usuários do sistema Imobiliária Horizonte.

## Requisitos

- Python 3.10+
- Dependências listadas em `requirements.txt`

## Instalação

```bash
cd api
pip install -r requirements.txt
```

## Como Executar

### 1. Servidor Web / API REST (Flask)

Para iniciar o servidor HTTP e servir a API (porta 5000):

```bash
python api.py
```

O servidor iniciará em `http://127.0.0.1:5000`.

### 2. Interface Terminal / CLI

Para acessar o sistema via linha de comando:

```bash
python main3.py
```

---

## Usuários Padrão para Acesso

| Usuário | Senha | Perfil |
| :--- | :--- | :--- |
| `ademir` | `aa1234` | Administrador (`adm`) |
| `berlinda` | `aa1234` | Corretor (`corretor`) |
| `jurminia` | `aa1234` | Atendente (`atendente`) |

---

## Endpoints da API REST

### Autenticação
- `POST /api/login` - Autenticação de usuário por `username` e `password`.

### Clientes
- `GET /api/clientes` - Listar todos os clientes cadastrados.
- `POST /api/clientes` - Cadastrar novo cliente.
- `PUT /api/clientes/<id>` - Atualizar dados de um cliente existente.
- `DELETE /api/clientes/<id>` - Excluir um cliente pelo ID.

### Imóveis
- `GET /api/imoveis` - Listar catálogo de imóveis.
- `POST /api/imoveis` - Cadastrar novo imóvel.
- `DELETE /api/imoveis/<id>` - Excluir um imóvel pelo ID.

### Usuários (Administração)
- `GET /api/usuarios` - Listar usuários cadastrados.
- `POST /api/usuarios` - Cadastrar novo usuário (admin, corretor, atendente).
- `DELETE /api/usuarios/<id>` - Excluir usuário pelo ID.

---

## Arquivos de Armazenamento Local
- `clientes.json` - Dados de clientes cadastrados.
- `imoveis.json` - Catálogo de imóveis.
- `usuarios.json` - Cadastro e credenciais de usuários do sistema.
