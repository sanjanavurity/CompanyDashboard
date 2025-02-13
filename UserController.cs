using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mime;
using System.Text;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{




    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;

        public UserController(IConfiguration configuration, IWebHostEnvironment env, IEmailService emailService)
        {
            _configuration = configuration; 
            _env = env;
            _emailService = emailService;
        }



        
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                            select UserId, UserFullName,
                            convert(varchar(10), DateOfBirth, 120) as DateOfBirth, UserAddress, Email, PhoneNumber, UserName, UserPassword
                            from
                            dbo.Users";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(User user)
        {
            string RandomString(int size, bool lowerCase)
            {
                StringBuilder builder = new StringBuilder();
                Random random = new Random();
                char ch;
                for (int i = 0; i < size; i++)
                {
                    ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                    builder.Append(ch);
                }
                if (lowerCase)
                    return builder.ToString().ToLower();
                return builder.ToString();
            }

            int RandomNumber(int min, int max)
            {
                Random random = new Random();
                return random.Next(min, max);
            }


            string RandomPassword(int size = 0)
            {
                StringBuilder builder = new StringBuilder();
                builder.Append(RandomString(4, true));
                builder.Append(RandomNumber(1000, 9999));
                builder.Append(RandomString(2, false));
                return builder.ToString();
            }
            string query = @"
                            insert into dbo.Users
                            values(@UserName, @UserFullName, @DateOfBirth, @UserAddress, @Email, @UserPassword, @PhoneNumber)
                            ";
            string query2 = @"
                             insert into dbo.UserCredentials
                             values(@UserName, @UserPassword)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");
            SqlDataReader myReader;
            string temp = RandomPassword(15);
            Console.WriteLine(temp);
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                string userFullName = user.UserFullName.Replace(" ", "");
                string dateOfBirth = user.DateOfBirth.Replace("-", "");
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserName",userFullName + dateOfBirth);
                    myCommand.Parameters.AddWithValue("@UserFullName", user.UserFullName);
                    myCommand.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
                    myCommand.Parameters.AddWithValue("@UserAddress", user.UserAddress);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@UserPassword", temp);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }

                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query2, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserName", userFullName + dateOfBirth);
                    myCommand.Parameters.AddWithValue("@UserPassword", temp);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }

                EmailDto req = new EmailDto();
                req.To = user.Email;
                req.Subject = "Succesfully Registered";
                req.Body = "Username: " + userFullName + dateOfBirth + '\n' + "Password: " + temp;
                _emailService.SendEmail(req);
            }

            

            return new JsonResult("User Added Successfully");
        }

        [Route("UserLogin")]
        [HttpPost]

        public JsonResult UserLogin(UserCredential userCredential)
        {
            try
            {
                string query = @"
                            select UserName, UserPassword
                            from
                            dbo.UserCredentials
                            where UserName=@UserName and UserPassword=@UserPassword";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("UserAppCon");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@UserName", userCredential.UserName);
                        myCommand.Parameters.AddWithValue("@UserPassword", userCredential.UserPassword);
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }

                if(table.Rows.Count > 0)
                {
                    return new JsonResult("User Login Successful");
                }
                else
                {
                    Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return new JsonResult("User Login Failed");
                }
                
            }
            catch (Exception)
            {
                Response.StatusCode = StatusCodes.Status401Unauthorized;
                return new JsonResult("User Login Failed");
            }

        }
    }
}
