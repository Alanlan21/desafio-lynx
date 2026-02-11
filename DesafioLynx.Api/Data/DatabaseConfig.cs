using Microsoft.Data.Sqlite;

namespace DesafioLynx.Api.Data
{
    public static class DatabaseConfig
    {
        public static void InitializeDatabase(string connectionString, ILogger logger)
        {
            var builder = new SqliteConnectionStringBuilder(connectionString);
            var dbPath = builder.DataSource;

            logger.LogInformation("Database path: {DbPath}", dbPath);

            if (File.Exists(dbPath))
            {
                logger.LogInformation("Database already exists. Skipping initialization.");
                return;
            }

            logger.LogInformation("Creating database and executing setup script.");

            using var connection = new SqliteConnection(connectionString);
            connection.Open();

            ExecuteSqlScript(connection, logger);

            logger.LogInformation("Database initialized successfully.");
        }

        private static void ExecuteSqlScript(SqliteConnection connection, ILogger logger)
        {
            var scriptPath = Path.Combine(AppContext.BaseDirectory, "database-setup.sql");

            if (!File.Exists(scriptPath))
                throw new FileNotFoundException($"Setup script not found at: {scriptPath}");

            var sqlScript = File.ReadAllText(scriptPath);

            // Observação: split simplificado suficiente para este desafio
            var statements = sqlScript
                .Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => !string.IsNullOrWhiteSpace(s) && !s.StartsWith("--"))
                .ToList();

            foreach (var statement in statements)
            {
                using var command = new SqliteCommand(statement, connection);
                command.ExecuteNonQuery();
            }

            logger.LogInformation("Executed {Count} SQL statements.", statements.Count);
        }
    }
}
