using Microsoft.AspNetCore.Mvc;
using DesafioLynx.Api.Services;
using DesafioLynx.Api.DTOs;

namespace DesafioLynx.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentsController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// Registra novo pagamento para um pedido
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> RegisterPayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                await _paymentService.RegisterPaymentAsync(request);
                return Ok(new { message = "Pagamento registrado com sucesso" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao processar pagamento: {ex.Message}");
            }
        }
    }
}
