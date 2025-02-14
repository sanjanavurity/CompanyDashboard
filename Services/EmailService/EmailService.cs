using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using WebApplication18.Models;

namespace WebApplication18.Services.EmailService
{
    public class EmailService : IEmailService
    {
        public void SendEmail(EmailDto request)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("mose95@ethereal.email"));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text = request.Body };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("mose95@ethereal.email", "SMSGVGhy7NsR6RUHsB");
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}