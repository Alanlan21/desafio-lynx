# Technical and Architectural Decisions

Este documento registra as principais decisões que fui tomando ao longo do desenvolvimento do desafio.
A ideia não é justificar tudo em excesso, mas deixar claro o raciocínio por trás das escolhas feitas até aqui.

---

## 1. Linguagem e stack do backend

Decidi utilizar C# com ASP.NET Core Web API.

C# é a linguagem utilizada pela empresa, acho que isso é motivo suficiente pra escolher C#.

---

## 2. Estrutura do projeto

Optei por manter um projeto único de API, organizado por pastas (Controllers, Services, Models, DTOs, Data).

Para o escopo do desafio, uma separação por responsabilidades já resolve bem o problema e mantém o código fácil de navegar.

---

## 3. Controllers vs Minimal APIs

Escolhi utilizar controllers em vez de Minimal APIs.

Apesar das Minimal APIs serem mais concisas, os controllers deixam as responsabilidades mais explícitas e facilitam a leitura e a explicação do fluxo HTTP.

---

## 4. Swagger UI

Adicionei Swagger UI utilizando o Swashbuckle.

O template do .NET 8 vem apenas com OpenAPI sem interface gráfica. ter uma UI facilita testes manuais, demonstração da API e entendimento rápido dos endpoints, tanto para mim quanto para quem for avaliar.

---

## 5. HTTPS em ambiente local

Decidi não forçar o redirecionamento para HTTPS no ambiente local.

---

## 6. Versionamento e higiene do repositório

Adicionei manualmente um .gitignore usando o template oficial do .NET.

---

## 7. Organização do repositório

Mantive o backend em uma pasta chamada "DesafioLynx.Api".

O sufixo .Api deixa claro que se trata do backend HTTP e permite adicionar um frontend no mesmo repositório no futuro, sem misturar responsabilidades.

---

## 8. Estratégia de acesso a dados

Decidi utilizar Dapper como micro-ORM para acesso ao SQLite.

Dapper oferece controle total sobre as queries SQL mantendo o código explícito e fácil de entender. Para um projeto de avaliação técnica, é importante que eu consiga explicar exatamente o que cada query faz, sem depender de abstrações automáticas do Entity Framework Core.

---

## 9. Inicialização do banco de dados

Optei por criar um script SQL manual (database-setup.sql) executado via classe estática DatabaseConfig.

A inicialização é explícita passo a passo: parsing manual da connection string, verificação de arquivo com File.Exists(), criação de SqliteConnection, leitura do script com File.ReadAllText() e execução direta via SqliteCommand. Sem helpers ou abstrações - tudo imperativo e rastreável.

---

## 10. Preços dos produtos em pedidos

Implementei snapshot de preços: ao criar um pedido, o sistema sempre captura o preço atual do produto e ignora qualquer valor enviado no request.

Isso garante integridade (cliente não manipula preços) e mantém a lógica simples. O preço fica registrado em order_items como histórico do momento da compra.

---

## 11. Dados iniciais (seeding)

Coloquei os INSERTs de produtos e clientes diretamente no script database-setup.sql, executado manualmente.

Para o escopo do desafio, não faz sentido criar migrations automáticas ou endpoints de seed. O script é simples de executar e deixa os dados iniciais visíveis e modificáveis.

---

## 12. Filtros em listagem de produtos

Implementei três filtros opcionais via query params: categoria (string), ativo (bool) e nome (busca parcial).

Esses filtros cobrem as necessidades do frontend mencionadas nos requisitos e permitem testar a montagem de SQL dinâmico com Dapper.

---

## 13. Listagem resumida de pedidos

O endpoint GET /orders retorna: id, customer_id, nome do cliente (via JOIN), status, created_at e total calculado (via SUM dos itens).

Incluir total e nome do cliente facilita a exibição no frontend sem necessidade de requests adicionais, mantendo o "resumo" útil e completo.

---

## 14. Validação de pagamentos

Implementei validação para impedir novo pagamento em pedidos que já estão com status PAID.

Além da regra básica (soma dos pagamentos >= total do pedido → status PAID), essa validação extra evita inconsistências e torna o comportamento da API mais previsível.

---

## 15. Status CANCELLED

O campo status no banco permite valores "NEW", "PAID" e "CANCELLED", mas não implementei endpoint de cancelamento.

Deixei o valor preparado no schema para facilitar evolução futura, mas por enquanto a API trabalha apenas com NEW e PAID conforme as regras de negócio especificadas.

---

## 16. Decisões ainda em aberto

Algumas decisões foram intencionalmente deixadas para depois:

- Modelagem final das entidades de domínio (strings vs enums para Status e Method).
- Estrutura e stack do frontend.

Essas escolhas serão registradas aqui conforme forem sendo definidas.
