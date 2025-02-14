using WebApplication18.Models;

namespace WebApplication18.Services.EmailService
{
    public interface IEmailService
    {
        void SendEmail(EmailDto request);
    }
}