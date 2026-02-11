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

            if (File.Exists(dbPath) && DatabaseHasValidData(connectionString, logger))
            {
                logger.LogInformation("Database already exists with valid data. Skipping initialization.");
                return;
            }

            // Se arquivo existe mas não tem dados válidos, vamos recriar as tabelas
            if (File.Exists(dbPath))
            {
                logger.LogInformation("Database file exists but has no valid data. Recreating tables.");
            }

            logger.LogInformation("Creating database and executing setup script.");

            using var connection = new SqliteConnection(connectionString);
            connection.Open();

            ExecuteSqlScript(connection, logger);

            logger.LogInformation("Database initialized successfully.");
        }

        private static bool DatabaseHasValidData(string connectionString, ILogger logger)
        {
            try
            {
                using var connection = new SqliteConnection(connectionString);
                connection.Open();
                
                // Verifica se existe pelo menos um produto
                using var command = new SqliteCommand("SELECT COUNT(*) FROM products", connection);
                var count = command.ExecuteScalar();
                
                var hasData = Convert.ToInt32(count) > 0;
                logger.LogInformation("Database has {Count} products.", count);
                
                return hasData;
            }
            catch (Exception ex)
            {
                logger.LogWarning("Error checking database data: {Error}. Will recreate database.", ex.Message);
                return false;
            }
        }

        private static void ExecuteSqlScript(SqliteConnection connection, ILogger logger)
        {
            // Script está na raiz do workspace - vai um nível acima do projeto DesafioLynx.Api
            var currentDir = Directory.GetCurrentDirectory();
            var scriptPath = Path.Combine(currentDir, "..", "database-setup.sql");
            var resolvedPath = Path.GetFullPath(scriptPath);

            if (!File.Exists(resolvedPath))
                throw new FileNotFoundException($"Setup script not found at: {resolvedPath}");

            var sqlScript = File.ReadAllText(resolvedPath);

            // Remove comment lines but execute the script as a whole
            var lines = sqlScript.Split('\n', StringSplitOptions.None);
            var cleanedLines = new List<string>();
            
            foreach (var line in lines)
            {
                var cleanLine = line.Trim();
                
                // Skip pure comment lines (but keep SQL with inline comments for now)
                if (string.IsNullOrWhiteSpace(cleanLine) || (cleanLine.StartsWith("--") && !cleanLine.Contains("INSERT") && !cleanLine.Contains("CREATE")))
                    continue;
                    
                cleanedLines.Add(line); // Keep original line to preserve SQL structure
            }
            
            // Execute the entire script as one batch - SQLite supports this
            var cleanedScript = string.Join("\n", cleanedLines);

            using var command = new SqliteCommand(cleanedScript, connection);
            command.ExecuteNonQuery();

            logger.LogInformation("SQL script executed successfully.");
        }
    }
}
