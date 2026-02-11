using System.Data;

namespace DesafioLynx.Api.Data
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}