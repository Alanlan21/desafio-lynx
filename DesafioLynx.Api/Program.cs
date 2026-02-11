using DesafioLynx.Api.Data;
using DesafioLynx.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuração da API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injection - Data Access
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<IDbConnectionFactory>(sp => new SqliteConnectionFactory(connectionString!));
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<PaymentRepository>();

// Dependency Injection - Business Logic
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<PaymentService>();

var app = builder.Build();

// Inicializa banco de dados automaticamente em desenvolvimento
if (app.Environment.IsDevelopment())
{
    var dbConnectionString = app.Configuration.GetConnectionString("DefaultConnection");
    if (!string.IsNullOrEmpty(dbConnectionString))
    {
        DatabaseConfig.InitializeDatabase(dbConnectionString, app.Logger);
    }
}

// Pipeline de middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
