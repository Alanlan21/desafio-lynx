using Dapper;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Data
{
    public class PaymentRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public PaymentRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> CreateAsync(Payment payment)
        {
            using var connection = _connectionFactory.CreateConnection();

            var sql = @"
                INSERT INTO payments (order_id, method, amount_cents, paid_at) 
                VALUES (@OrderId, @Method, @AmountCents, @PaidAt);
                SELECT last_insert_rowid();";

            return await connection.QuerySingleAsync<int>(sql, payment);
        }

        public async Task<int> GetTotalPaidByOrderAsync(int orderId)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = @"
                SELECT COALESCE(SUM(amount_cents), 0) 
                FROM payments 
                WHERE order_id = @OrderId";
            
            return await connection.QuerySingleAsync<int>(sql, new { OrderId = orderId });
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = "UPDATE orders SET status = @Status WHERE id = @OrderId";
            await connection.ExecuteAsync(sql, new { OrderId = orderId, Status = status });
        }
    }
}
