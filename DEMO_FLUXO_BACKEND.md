# Demonstração Arquitetural do Backend - Gestão de Pedidos Lynx

## 🏗️ Fluxo de Criação de Pedido

### 1. CAMADA DE ENTRADA - Controller
**Endpoint:**
```
POST /api/orders
```
**Decisão:** Controllers apenas como HTTP Adapters
- Separação entre protocolo HTTP e lógica de negócio
- Facilita testes e manutenção

**Fluxo:**
```
HTTP Request → OrdersController.CreateOrder()
├── Recebe CreateOrderRequest (DTO)
├── Valida estrutura HTTP
└── Delega para OrderService
```

---

### 2. CAMADA DE CONTRATOS - DTOs
**Decisão:** DTOs separados dos Models
- Contratos de API independentes da estrutura interna
- Permite evolução da API sem quebrar o banco

**Exemplo:**
```
CreateOrderRequest:
├── CustomerId: int
└── Items: OrderItemRequest[]
    ├── ProductId: int  
    └── Quantity: int

↓ Transformação ↓

OrderCreatedResponse:
├── OrderId: int
├── TotalCents: int
└── Status: string
```

---

### 3. CAMADA DE NEGÓCIO - Service
**Decisão:** Services concentram TODA a lógica de negócio
- Single Responsibility + testabilidade
- Regras centralizadas e reutilizáveis

**Fluxo OrderService.CreateOrderAsync():**
```
1. Validação de Produtos
   ├── Para cada item: GetActiveByIdAsync()
   ├── Verifica se produto existe E está ativo
   └── [REGRA] Rejeita produtos inativos

2. Snapshot Pricing
   ├── Captura preço ATUAL do produto
   ├── Armazena no OrderItem.UnitPriceCents
   └── [REGRA] Preço do pedido é fixo

3. Cálculo de Total
   ├── totalCents += quantidade × preço_atual
   └── [REGRA] Cálculo no servidor

4. Criação Transacional
   ├── Criar Order (NEW status)
   ├── Criar OrderItems
   └── [REGRA] Falha = rollback
```

---

### 4. CAMADA DE DADOS - Repository
**Decisão:** Repository Pattern + Dapper
- Controle total sobre SQL
- SQL explícito, sem "magia" de ORM

**Fluxo OrderRepository:**
```
CreateAsync(Order):
├── SQL: "INSERT INTO orders (...) RETURNING id"
├── [DECISÃO] RETURNING id para pegar ID gerado
└── Retorna orderId

CreateItemsAsync(orderId, orderItems):
├── SQL: "INSERT INTO order_items (...)"
├── [DECISÃO] Loop explícito
└── Cada item inserido individualmente
```

---

### 5. CAMADA DE CONEXÃO - Data Access
**Decisão:** Factory Pattern para conexões
- Flexibilidade para trocar banco
- Testabilidade e configuração centralizada

**Estrutura:**
```
IDbConnectionFactory (Interface)
└── SqliteConnectionFactory (Implementação)
    └── Cria SqliteConnection
```

---

### 6. CAMADA DE MODELO - Models
**Decisão:** POCOs simples que espelham tabelas
- Mapeamento direto Dapper
- Zero overhead

**Exemplo Order:**
```
Order (C# Model) ↔ orders (Tabela)
├── Id ↔ id
├── CustomerId ↔ customer_id  
├── Status ↔ status
└── CreatedAt ↔ created_at
```

---

### 7. INICIALIZAÇÃO - Program.cs
**Decisão:** Dependency Injection + Auto-inicialização
- Componentes desacoplados
- Banco criado automaticamente em dev

**Configuração:**
```
Services:
├── Repositories (Scoped)
├── Services (Scoped)  
├── ConnectionFactory (Singleton)
└── DatabaseConfig (Estático)
```

---

## 🔗 FLUXO COMPLETO
```
HTTP POST /api/orders
    ↓
OrdersController.CreateOrder()
    ↓ [Recebe DTO]
OrderService.CreateOrderAsync()
    ↓ [Validações + regras de negócio]
ProductRepository.GetActiveByIdAsync()
OrderRepository.CreateAsync()
OrderRepository.CreateItemsAsync()
    ↓ [Retorna modelo interno]
Controller converte para DTO de resposta
    ↓
HTTP 200 OK + OrderCreatedResponse
```

---

## 🏆 PRINCIPAIS DECISÕES
- Snapshot Pricing: preço do produto no momento do pedido
- Repository + Dapper: SQL explícito
- Service Layer: lógica de negócio centralizada
- DTOs separados: contratos de API independentes
- Factory Pattern: flexibilidade de conexão
- Auto-Initialize: banco criado automaticamente em dev

---

**Essa arquitetura garante separação de responsabilidades, testabilidade e manutenibilidade seguindo as melhores práticas de .NET Core!**
