# 🛒 Sistema de Gestão de Pedidos - Desafio Lynx

Sistema completo de gestão de pedidos desenvolvido como desafio técnico, implementando uma API REST em .NET Core e interface web em React.

## 📋 Sobre o Projeto

Sistema para gerenciamento de produtos, pedidos e pagamentos com as seguintes funcionalidades:

- **Produtos**: Listagem com filtros por categoria, status e nome
- **Pedidos**: Criação de pedidos com múltiplos itens e cálculo automático de totais
- **Pagamentos**: Registro de pagamentos parciais ou totais com atualização automática de status
- **Snapshot Pricing**: Preços dos produtos são congelados no momento da criação do pedido

## 🚀 Tecnologias Utilizadas

### Backend

- **.NET 10** - Framework principal
- **ASP.NET Core Web API** - REST API
- **SQLite** - Banco de dados
- **Dapper** - Micro-ORM para acesso a dados
- **Swagger** - Documentação da API

### Frontend

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
├── DesafioLynx.Api/          # Backend .NET Core
│   ├── Controllers/          # Endpoints HTTP
│   ├── Services/             # Lógica de negócio
│   ├── Data/                 # Repositories e acesso a dados
│   ├── Models/               # Entidades do domínio
│   └── DTOs/                 # Contratos de API
├── DesafioLynx.Web/          # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # API clients
│   │   └── types/            # TypeScript types
├── database-setup.sql        # Script de inicialização do banco
├── DECISIONS.md              # Decisões arquiteturais detalhadas
└── DEMO_FLUXO_BACKEND.md     # Demonstração do fluxo de dados
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

- **Controllers**: Adaptadores HTTP, apenas recebem requisições e delegam
- **Services**: Toda lógica de negócio e validações
- **Repositories**: Acesso a dados com SQL explícito via Dapper
- **Models**: POCOs que representam entidades do banco
- **DTOs**: Contratos de entrada/saída da API

**Principais decisões:**

- Repository Pattern para isolamento de dados
- Dependency Injection para inversão de controle
- SQL explícito (sem ORM pesado) para controle total
- Snapshot pricing para preços imutáveis nos pedidos

## 🔧 Como Executar

### Pré-requisitos

- .NET 10 SDK
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd DesafioLynx.Api
dotnet restore
dotnet run
```

A API estará disponível em `http://localhost:5147`

> O banco de dados SQLite será criado automaticamente na primeira execução

### Frontend

```bash
cd DesafioLynx.Web
npm install
npm run dev
```

A interface estará disponível em `http://localhost:5173`

## 📡 Endpoints da API

### Produtos

- `GET /api/products` - Lista produtos com filtros opcionais
  - Query params: `category`, `active`, `name`

### Pedidos

- `GET /api/orders` - Lista todos os pedidos (resumo)
- `GET /api/orders/{id}` - Detalhes completos de um pedido
- `POST /api/orders` - Cria novo pedido

**Exemplo de criação de pedido:**

```json
{
  "customerId": 1,
  "items": [
    { "productId": 2, "quantity": 1 },
    { "productId": 3, "quantity": 2 }
  ]
}
```

### Pagamentos

- `POST /api/payments` - Registra pagamento para um pedido

**Exemplo de pagamento:**

```json
{
  "orderId": 1,
  "amountCents": 50000,
  "paymentMethod": "CREDIT_CARD"
}
```

## 📸 Screenshots

### Tela de Produtos
![Tela de Produtos](https://github.com/user-attachments/assets/cb531341-7fe9-471e-8c74-fc6c9f29306c)

### Tela de Pedidos
![Tela de Pedidos](https://github.com/user-attachments/assets/caf25455-0705-43ad-ab3c-556aa5800dd5)

### Criação de Pedido
![Criar Pedido](https://github.com/user-attachments/assets/c8d3d8d0-1d19-4d38-a9fc-cca475972cdc)

### Documentação Swagger
![Swagger](https://github.com/user-attachments/assets/1d8e3687-5ae6-44b7-ae99-4b1770caec91)


## 🧪 Testando a API

A API possui documentação Swagger integrada. Acesse:

```
http://localhost:5147/swagger
```

Exemplos de teste via curl:

```bash
# Listar produtos ativos
curl http://localhost:5147/api/products?active=true

# Criar pedido
curl -X POST http://localhost:5147/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"items":[{"productId":2,"quantity":1}]}'

# Registrar pagamento
curl -X POST http://localhost:5147/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"amountCents":50000,"paymentMethod":"PIX"}'
```

## 💾 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- **customers** - Clientes do sistema
- **products** - Catálogo de produtos
- **orders** - Pedidos criados
- **order_items** - Itens de cada pedido (com preço snapshot)
- **payments** - Pagamentos realizados

O banco é inicializado automaticamente com dados de exemplo na primeira execução.

## 📚 Documentação Adicional

- [DECISIONS.md](./DECISIONS.md) - Decisões arquiteturais detalhadas com justificativas
