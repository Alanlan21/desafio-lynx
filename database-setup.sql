-- ====================================
-- SCHEMA DEFINITION
-- ====================================

-- Tabela de clientes
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Tabela de produtos
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela de pedidos
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'NEW', 'PAID', 'CANCELLED'
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
);

-- Tabela de itens do pedido
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Tabela de pagamentos
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    method VARCHAR(20) NOT NULL, -- 'PIX', 'CARD', 'BOLETO'
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    paid_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- ====================================
-- INITIAL DATA (SEEDING)
-- ====================================

-- Clientes
INSERT INTO
    customers (name, email, created_at)
VALUES (
        'João Silva',
        'joao.silva@email.com',
        '2026-01-15 10:30:00'
    ),
    (
        'Maria Santos',
        'maria.santos@email.com',
        '2026-01-20 14:15:00'
    ),
    (
        'Pedro Oliveira',
        'pedro.oliveira@email.com',
        '2026-02-01 09:00:00'
    );

-- Produtos - Categoria: Eletrônicos
INSERT INTO
    products (
        name,
        category,
        price_cents,
        active
    )
VALUES (
        'Notebook Dell Inspiron 15',
        'Eletrônicos',
        349990,
        TRUE
    ),
    (
        'Mouse Logitech MX Master 3',
        'Eletrônicos',
        45990,
        TRUE
    ),
    (
        'Teclado Mecânico Keychron K2',
        'Eletrônicos',
        89900,
        TRUE
    ),
    (
        'Webcam Logitech C920',
        'Eletrônicos',
        52990,
        TRUE
    ),
    (
        'Fone de Ouvido Sony WH-1000XM4',
        'Eletrônicos',
        149990,
        FALSE
    );
-- Produto inativo para testes

-- Produtos - Categoria: Livros
INSERT INTO
    products (
        name,
        category,
        price_cents,
        active
    )
VALUES (
        'Clean Code - Robert Martin',
        'Livros',
        8990,
        TRUE
    ),
    (
        'Domain-Driven Design - Eric Evans',
        'Livros',
        12990,
        TRUE
    ),
    (
        'The Pragmatic Programmer',
        'Livros',
        9990,
        TRUE
    );

-- Produtos - Categoria: Instrumentos
INSERT INTO
    products (
        name,
        category,
        price_cents,
        active
    )
VALUES (
        'Trompete Yamaha',
        'Instrumentos',
        9900,
        TRUE
    ),
    (
        'Trombone de Pisto Curto',
        'Instrumentos',
        3900,
        TRUE
    ),
    (
        'Bateria Completa DW Drums ',
        'Instrumentos',
        8960,
        TRUE
    ),
    (
        'Piano Digital Roland FP-30X',
        'Instrumentos',
        45900,
        FALSE
    );
-- Produto descontinuado

-- Produtos inativos adicionais para testes
INSERT INTO
    products (
        name,
        category,
        price_cents,
        active
    )
VALUES (
        'Smartphone Samsung Galaxy S20',
        'Eletrônicos',
        89990,
        FALSE
    ), -- Produto descontinuado
    (
        'Refactoring - Martin Fowler',
        'Livros',
        11500,
        FALSE
    );
-- Produto fora de estoque

-- Pedido de exemplo 1 - Status NEW (aguardando pagamento)
INSERT INTO
    orders (
        customer_id,
        status,
        created_at
    )
VALUES (
        1,
        'NEW',
        '2026-02-08 15:30:00'
    );

INSERT INTO
    order_items (
        order_id,
        product_id,
        quantity,
        unit_price_cents
    )
VALUES (1, 2, 1, 45990), -- Mouse Logitech
    (1, 3, 1, 89900);
-- Teclado Keychron
-- Total do pedido 1: 135.890 centavos (R$ 1.358,90)

-- Pedido de exemplo 2 - Status PAID (já pago completamente)
INSERT INTO
    orders (
        customer_id,
        status,
        created_at
    )
VALUES (
        2,
        'PAID',
        '2026-02-07 10:00:00'
    );

INSERT INTO
    order_items (
        order_id,
        product_id,
        quantity,
        unit_price_cents
    )
VALUES (2, 6, 2, 8990), -- Clean Code (2 unidades)
    (2, 7, 1, 12990);
-- Domain-Driven Design
-- Total do pedido 2: 30.970 centavos (R$ 309,70)

-- Pagamento do pedido 2 (completado)
INSERT INTO
    payments (
        order_id,
        method,
        amount_cents,
        paid_at
    )
VALUES (
        2,
        'PIX',
        30970,
        '2026-02-07 10:15:00'
    );
