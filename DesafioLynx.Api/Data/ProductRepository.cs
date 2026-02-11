using Dapper;
using DesafioLynx.Api.DTOs;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Data
{
    public class ProductRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public ProductRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<Product>> GetAllAsync(ProductFilterRequest filter)
        {
            using var connection = _connectionFactory.CreateConnection();

            var sql = "SELECT * FROM products WHERE 1=1";
            var parameters = new DynamicParameters();

            // Build dynamic WHERE clause based on non-null filters
            if (!string.IsNullOrEmpty(filter.Category))
            {
                sql += " AND category = @Category";
                parameters.Add("Category", filter.Category);
            }

            if (filter.Active.HasValue)
            {
                sql += " AND active = @Active";
                parameters.Add("Active", filter.Active.Value);
            }

            if (!string.IsNullOrEmpty(filter.Name))
            {
                sql += " AND name LIKE @Name";
                parameters.Add("Name", $"%{filter.Name}%");
            }

            sql += " ORDER BY name";

            return await connection.QueryAsync<Product>(sql, parameters);
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = "SELECT * FROM products WHERE id = @Id";
            return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
        }

        public async Task<Product?> GetActiveByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = "SELECT * FROM products WHERE id = @Id AND active = 1";
            return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
        }
    }
}
