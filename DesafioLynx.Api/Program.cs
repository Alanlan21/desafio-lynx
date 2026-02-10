var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte a controllers.
// Decisão: usar controllers em vez de Minimal APIs para facilitar
// organização, leitura e explicação em um desafio técnico.
builder.Services.AddControllers();

// Swagger / OpenAPI com UI.
// Decisão: habilitar Swagger UI para facilitar testes manuais,
// demonstração da API e leitura pelo avaliador.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    // Swagger habilitado apenas em ambiente de desenvolvimento.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Decisão: não forçar HTTPS neste desafio local.
// Evita configuração desnecessária de certificados e ruído técnico.
// app.UseHttpsRedirection();

// Autorização mantida no pipeline por padrão.
// Mesmo sem autenticação agora, deixa o fluxo pronto para evolução.
app.UseAuthorization();

// Mapeia controllers (endpoints REST).
app.MapControllers();

app.Run();
