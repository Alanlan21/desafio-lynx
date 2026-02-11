using DesafioLynx.Api.Data;
using DesafioLynx.Api.DTOs;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Services
{
    public class PaymentService
    {
        private readonly PaymentRepository _paymentRepository;
        private readonly OrderRepository _orderRepository;

        public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository)
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
        }

        public async Task RegisterPaymentAsync(CreatePaymentRequest request)
        {
            // Validate that order exists
            var order = await _orderRepository.GetByIdAsync(request.OrderId);
            if (order == null)
            {
                throw new InvalidOperationException($"Order {request.OrderId} not found");
            }

            // Prevent payment for already paid orders
            if (order.Status == "PAID")
            {
                throw new InvalidOperationException($"Order {request.OrderId} is already paid");
            }

            if (request.AmountCents <= 0)
            {
                throw new ArgumentException("Payment amount must be greater than zero");
            }

            // Create payment record
            var payment = new Payment
            {
                OrderId = request.OrderId,
                Method = request.Method,
                AmountCents = request.AmountCents,
                PaidAt = DateTime.UtcNow
            };

            await _paymentRepository.CreateAsync(payment);

            // Check if order is now fully paid
            var totalPaid = await _paymentRepository.GetTotalPaidByOrderAsync(request.OrderId);
            var orderTotal = await _orderRepository.GetOrderTotalAsync(request.OrderId);

            // Update status to PAID if payment covers the full order amount
            if (totalPaid >= orderTotal)
            {
                await _paymentRepository.UpdateOrderStatusAsync(request.OrderId, "PAID");
            }
        }
    }
}