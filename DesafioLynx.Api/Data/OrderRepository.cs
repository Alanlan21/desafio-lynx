using Dapper;
using DesafioLynx.Api.DTOs;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Data
{
    public class OrderRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public OrderRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<OrderSummaryResponse>> GetAllSummariesAsync()
        {
            using var connection = _connectionFactory.CreateConnection();

            var sql = @"
                SELECT 
                    o.id,
                    o.customer_id as CustomerId,
                    c.name as CustomerName,
                    o.status,
                    o.created_at as CreatedAt,
                    COALESCE(SUM(oi.quantity * oi.unit_price_cents), 0) as TotalCents
                FROM orders o
                INNER JOIN customers c ON o.customer_id = c.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                GROUP BY o.id, o.customer_id, c.name, o.status, o.created_at
                ORDER BY o.created_at DESC";

            return await connection.QueryAsync<OrderSummaryResponse>(sql);
        }

        public async Task<OrderDetailResponse?> GetByIdWithDetailsAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();

            // First, get the order summary
            var orderSql = @"
                SELECT 
                    o.id,
                    o.customer_id as CustomerId,
                    c.name as CustomerName,
                    o.status,
                    o.created_at as CreatedAt,
                    COALESCE(SUM(oi.quantity * oi.unit_price_cents), 0) as TotalCents
                FROM orders o
                INNER JOIN customers c ON o.customer_id = c.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.id = @Id
                GROUP BY o.id, o.customer_id, c.name, o.status, o.created_at";

            var order = await connection.QuerySingleOrDefaultAsync<OrderDetailResponse>(orderSql, new { Id = id });

            if (order == null) return null;

            // Then, get the order items
            var itemsSql = @"
                SELECT 
                    oi.id,
                    oi.product_id as ProductId,
                    p.name as ProductName,
                    oi.quantity,
                    oi.unit_price_cents as UnitPriceCents
                FROM order_items oi
                INNER JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = @OrderId
                ORDER BY oi.id";

            var items = await connection.QueryAsync<OrderItemResponse>(itemsSql, new { OrderId = id });
            order.Items = items.ToList();

            return order;
        }

        public async Task<int> CreateAsync(Order order)
        {
            using var connection = _connectionFactory.CreateConnection();

            var sql = @"
                INSERT INTO orders (customer_id, status, created_at) 
                VALUES (@CustomerId, @Status, @CreatedAt);
                SELECT last_insert_rowid();";

            return await connection.QuerySingleAsync<int>(sql, order);
        }

        public async Task CreateItemsAsync(int orderId, IEnumerable<OrderItem> items)
        {
            using var connection = _connectionFactory.CreateConnection();

            var sql = @"
                INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) 
                VALUES (@OrderId, @ProductId, @Quantity, @UnitPriceCents)";

            foreach (var item in items)
            {
                item.OrderId = orderId;
                await connection.ExecuteAsync(sql, item);
            }
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = "SELECT * FROM orders WHERE id = @Id";
            return await connection.QuerySingleOrDefaultAsync<Order>(sql, new { Id = id });
        }

        public async Task<int> GetOrderTotalAsync(int orderId)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            var sql = @"
                SELECT COALESCE(SUM(quantity * unit_price_cents), 0) 
                FROM order_items 
                WHERE order_id = @OrderId";
            
            return await connection.QuerySingleAsync<int>(sql, new { OrderId = orderId });
        }
    }
}
