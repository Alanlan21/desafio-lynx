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

## 5. Organização do repositório

Mantive o backend em uma pasta chamada "DesafioLynx.Api".

O sufixo .Api deixa claro que se trata do backend HTTP e permite adicionar um frontend no mesmo repositório no futuro, sem misturar responsabilidades.

---

## 6. Acesso ao banco de dados

Decidi utilizar Dapper como micro-ORM para acesso ao SQLite em vez de EF core.

Dapper oferece controle total sobre as queries SQL e mantém o código explícito e fácil de entender. Pra um projeto pequeno de pequeno porte é mais que suficiente sem depender de abstrações automáticas do EF Core.

---

## 7. Inicialização do banco de dados

Optei por criar um script SQL manual (database-setup.sql) executado via classe estática DatabaseConfig.

A inicialização é explícita passo a passo: parsing manual da connection string, verificação de arquivo com File.Exists(), criação de SqliteConnection, leitura do script com File.ReadAllText() e execução direta via SqliteCommand.

---

## 8. Preços dos produtos em pedidos

Implementei snapshot de preços: ao criar um pedido, o sistema sempre captura o preço atual do produto e ignora qualquer valor enviado no request.

Isso garante integridade (cliente não manipula preços) e mantém a lógica simples. O preço fica registrado em order_items como histórico do momento da compra.

---

## 9. Dados iniciais (seeding)

Coloquei os INSERTs de produtos e clientes diretamente no script database-setup.sql, executado manualmente.

Para o escopo do desafio, não faz sentido criar migrations automáticas ou endpoints de seed. O script é simples de executar e deixa os dados iniciais visíveis e modificáveis.

---

## 10. Filtros em listagem de produtos

Implementei três filtros opcionais via query params: categoria (string), ativo (bool) e nome (busca parcial).

Esses filtros cobrem as necessidades do frontend mencionadas nos requisitos e permitem testar a montagem de SQL dinâmico com Dapper.

---

## 11. Listagem resumida de pedidos

O endpoint GET /orders retorna: id, customer_id, nome do cliente (via JOIN), status, created_at e total calculado (via SUM dos itens).

Incluir total e nome do cliente facilita a exibição no frontend sem necessidade de requests adicionais, mantendo o "resumo" útil e completo.

---

## 12. Validação de pagamentos

Implementei validação para impedir novo pagamento em pedidos que já estão com status PAID.

Além da regra básica (soma dos pagamentos >= total do pedido → status PAID), essa validação extra evita inconsistências e torna o comportamento da API mais previsível.

---

## 13. Status CANCELLED

O campo status no banco permite valores "NEW", "PAID" e "CANCELLED", mas não implementei endpoint de cancelamento.

Deixei o valor preparado no schema para facilitar evolução futura, mas por enquanto a API trabalha apenas com NEW e PAID conforme as regras de negócio especificadas.

---

## 14. Estrutura dos services

Implementei três services com separação clara de responsabilidades: ProductService (CRUD e filtros), OrderService (criação com validações complexas) e PaymentService (processamento e mudança de status).

Cada service encapsula toda a lógica de negócio relacionada ao seu domínio, mantendo os controllers como simples adaptadores HTTP. Os services chamam múltiplos repositories quando necessário e aplicam validações antes de persistir dados.

---

## 15. Validações de produtos ativos

Implementei validação rigorosa para impedir que produtos inativos sejam incluídos em pedidos.

O OrderService chama `GetActiveByIdAsync` para cada item, lançando exceção se encontrar produto inexistente ou inativo. Essa validação acontece antes de qualquer persistência, evitando estados inconsistentes.

---

## 16. Gestão de status de pedidos por pagamento

O PaymentService controla automaticamente a mudança de status de NEW para PAID baseado no total de pagamentos recebidos.

Após cada pagamento, o service soma todos os payments do pedido e compara com o total dos order_items. Se totalPago >= totalPedido, o status é atualizado para PAID automaticamente.

---

## 20. Prevenção de pagamentos duplicados

Implementei validação para impedir novos pagamentos em pedidos que já estão com status PAID.

Isso evita inconsistências e torna o comportamento da API mais previsível. O PaymentService verifica o status atual do pedido antes de aceitar qualquer novo pagamento.

---

## 21. Estrutura dos controllers

Implementei três controllers seguindo padrões REST: ProductsController (GET /api/products), OrdersController (GET e POST /api/orders), PaymentsController (POST /api/payments).

Cada controller atua apenas como adaptador HTTP, recebendo requests, delegando para services, e transformando responses/exceções em status HTTP apropriados. Uso CreatedAtAction para POST bem-sucedidos e diferentes catch blocks para tipos específicos de exceção.

---

## 22. Tratamento de erros nos controllers

Implementei tratamento específico para diferentes tipos de exceção: ArgumentException e InvalidOperationException retornam 400 BadRequest, enquanto Exception genérica também retorna 400 com mensagem detalhada.

Para recursos não encontrados (como GET /orders/{id} inexistente), retorno 404 NotFound. Esse approach unified de error handling mantém a API consistente e previsível.

---

## 23. Documentação automática com Swagger

Os controllers incluem comentários XML que geram documentação automática no Swagger UI, facilitando testes manuais e compreensão dos endpoints.

Cada action tem summary comentado explicando sua finalidade, e o Swagger UI em /swagger permite testar todos endpoints diretamente no browser durante desenvolvimento.

---

## 24. Decisões ainda em aberto

Algumas decisões foram intencionalmente deixadas para depois:

- Modelagem final das entidades de domínio (strings vs enums para Status e Method).
- Estrutura e stack do frontend.
- Investigação do mapeamento de preços (todos retornando 0 nos testes).

Essas escolhas serão registradas aqui conforme forem sendo definidas.
