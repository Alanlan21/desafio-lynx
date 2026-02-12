# Technical and Architectural Decisions

Este documento registra as principais decisões arquiteturais e técnicas do projeto.

---

## 1. Stack do Backend

C# com ASP.NET Core Web API + SQLite + Dapper.

C# é a linguagem utilizada pela empresa. SQLite mantém o projeto portável e auto-contido. Dapper oferece controle total sobre as queries SQL mantendo o código explícito e performático, sem abstrações pesadas do EF Core.

---

## 2. Arquitetura em Camadas

Controllers apenas como adaptadores HTTP, Services com toda a lógica de negócio, Repositories com acesso a dados usando SQL explícito, e DTOs separados dos Models.

Essa separação mantém responsabilidades claras, facilita testes e permite evolução da API sem impactar a estrutura interna do banco.

---

## 3. Snapshot Pricing

Ao criar um pedido, o sistema sempre captura o preço atual do produto e armazena em order_items.

Isso garante integridade (cliente não manipula preços), mantém histórico do momento da compra e elimina dependência de mudanças futuras nos preços dos produtos.

---

## 4. Gestão Automática de Status

O PaymentService muda automaticamente o status do pedido de NEW para PAID quando a soma dos pagamentos atinge ou supera o total do pedido.

Essa automação reduz complexidade no frontend e garante consistência na regra de negócio.

---

## 5. Validações de Produtos

OrderService valida rigidamente que todos os produtos estão ativos antes de permitir criação do pedido.

Isso previne inconsistências e mantém a lógica de negócio centralizada no backend, onde deve estar.

---

## 6. Mapeamento Dapper Case-Sensitive

Dapper mapeia colunas SQL para propriedades C# de forma case-sensitive. As colunas do banco usam snake_case (price_cents), então ajustei as propriedades para Price_Cents.

Isso mantém o mapeamento direto sem configuração adicional ou overhead.

---

## 7. Stack do Frontend

React 18 + TypeScript + Vite + TailwindCSS + Axios.

React facilita componentização, TypeScript adiciona type-safety, Vite oferece dev server rápido, TailwindCSS permite estilização eficiente, e Axios centraliza todas as chamadas à API com tipagem completa.
