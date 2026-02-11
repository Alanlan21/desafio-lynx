using DesafioLynx.Api.Data;
using DesafioLynx.Api.DTOs;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Services
{
    public class OrderService
    {
        private readonly OrderRepository _orderRepository;
        private readonly ProductRepository _productRepository;

        public OrderService(OrderRepository orderRepository, ProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<OrderSummaryResponse>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllSummariesAsync();
        }

        public async Task<OrderDetailResponse?> GetOrderDetailAsync(int id)
        {
            return await _orderRepository.GetByIdWithDetailsAsync(id);
        }

        public async Task<OrderCreatedResponse> CreateOrderAsync(CreateOrderRequest request)
        {
            // Validate that all products exist and are active
            var orderItems = new List<OrderItem>();
            var totalCents = 0;

            foreach (var itemRequest in request.Items)
            {
                var product = await _productRepository.GetActiveByIdAsync(itemRequest.ProductId);
                if (product == null)
                {
                    throw new InvalidOperationException($"Product {itemRequest.ProductId} not found or is inactive");
                }

                if (itemRequest.Quantity <= 0)
                {
                    throw new ArgumentException($"Quantity must be greater than zero for product {itemRequest.ProductId}");
                }

                // Create order item with current product price (snapshot pricing)
                var orderItem = new OrderItem
                {
                    ProductId = itemRequest.ProductId,
                    Quantity = itemRequest.Quantity,
                    UnitPriceCents = product.Price_Cents // Always use current product price
                };

                orderItems.Add(orderItem);
                totalCents += itemRequest.Quantity * product.Price_Cents;
            }

            if (!orderItems.Any())
            {
                throw new ArgumentException("Order must contain at least one item");
            }

            // Create the order
            var order = new Order
            {
                CustomerId = request.CustomerId,
                Status = "NEW",
                CreatedAt = DateTime.UtcNow
            };

            var orderId = await _orderRepository.CreateAsync(order);

            // Create order items
            await _orderRepository.CreateItemsAsync(orderId, orderItems);

            return new OrderCreatedResponse
            {
                OrderId = orderId,
                TotalCents = totalCents,
                Status = order.Status
            };
        }
    }
}
