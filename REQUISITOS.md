Lynx SPA - Avaliação técnica – Estágio/Analista Junior
1- Introdução
Esta avaliação técnica busca analisar, de forma abrangente, tanto os conhecimentos do
candidato quanto seu raciocínio e sua capacidade de comunicação ao propor soluções
para os desafios apresentados.
A resposta 100% correta é desejável, mas representa apenas uma parte da avaliação.
Valorizamos também clareza, organização, simplicidade da solução e o esforço aplicado.
É bem-vindo ir além do mínimo: criar novos endpoints, utilizar outros frameworks de
frontend (como Angular ou Vue) e evoluir o esquema do banco (DDL) com
funcionalidades adicionais. Entretanto, é imprescindível atender aos requisitos mínimos
obrigatórios.
Desejamos uma ótima avaliação a todos!
2 - Entregáveis
• Todo o código fonte deverá estar no GIT e o link compartilhado conosco nos
threads de e-mail.
• Todos os scripts, DDLs, logs, ou demais artefatos gerados deverão estar
versionados no GIT;
• Os tempos para execução da atividade é de 2 dias úteis a partir da data de envio
da avaliação.
• Correção, clareza, organização do repo, simplicidade e legibilidade, serão os
critérios avaliativos.
4 - Visão geral do problema
Você é responsável por uma mini aplicação de Gestão de Pedidos. Há clientes, produtos,
pedidos, itens do pedido e pagamentos.
5 - Esquema de Banco de Dados (SQL relacional)
• Para essa solução sugerimos uso do SQLite;
• As DDL de referência estão na sessão “8 – Anexos”.
6 - Projeto Backend (Java, C# ou C++):
Endpoints REST:
• GET - lista produtos com filtros opcionais;
• GET - lista pedidos resumidos;
• GET /orders/{id} - detalhes do pedido (itens + total calculado);
• POST /orders - cria pedido com itens (valida produtos ativos e preços);
• POST /payments - registra pagamento para um pedido (atualiza status para
PAID se cobrir o total);
Regras avaliativas:
• Total do pedido = soma de quantity * unit_price_cents dos itens;
• Pedido só vai para PAID se a soma dos pagamentos for >= total;
• Impedir item de produto inativo.
• Tratamento de erros com mensagens claras.
7 - Projeto Frontend (HTML, CSS e Javascript)
• Listagem de produtos com busca;
• Filtro por categoria
• Toogle para “somente ativos”
• Carrinho local (JS) com itens (quantidade, subtotal) e totalizador
• Botão “Finalizar Pedido” que chama POST /orders e exibe número do pedido
• Página/Seção de Pedidos: lista últimos pedidos e detalhe ao clicar (chama
GET /orders/{id})
• Validações básicas (ex.: quantidade > 0, e-mail em formulários, etc.).
• UI simples, responsiva.
8 - Anexo
-- Tabelas
CREATE TABLE customers (
id INTEGER PRIMARY KEY,
name VARCHAR(120) NOT NULL,
email VARCHAR(160) UNIQUE NOT NULL,
created_at TIMESTAMP NOT NULL
);
CREATE TABLE products (
id INTEGER PRIMARY KEY,
name VARCHAR(120) NOT NULL,
category VARCHAR(60) NOT NULL,
price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE orders (
id INTEGER PRIMARY KEY,
customer_id INTEGER NOT NULL,
status VARCHAR(20) NOT NULL, -- e.g., 'NEW', 'PAID', 'CANCELLED'
created_at TIMESTAMP NOT NULL,
FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE order_items (
id INTEGER PRIMARY KEY,
order_id INTEGER NOT NULL,
product_id INTEGER NOT NULL,
quantity INTEGER NOT NULL CHECK (quantity > 0),
unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
FOREIGN KEY (order_id) REFERENCES orders(id),
FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE payments (
id INTEGER PRIMARY KEY,
order_id INTEGER NOT NULL,
method VARCHAR(20) NOT NULL, -- e.g., 'PIX', 'CARD', 'BOLETO'
amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
paid_at TIMESTAMP,
FOREIGN KEY (order_id) REFERENCES orders(id)
);
