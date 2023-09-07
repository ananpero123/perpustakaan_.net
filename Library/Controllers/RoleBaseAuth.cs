using Library.Dataacc;
using Library.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleBaseAuth : ControllerBase
    {

        private readonly Data _data;
        private readonly Data Rolebaseauths;
        private readonly IConfiguration configuration;
        public RoleBaseAuth(Data data, Data Rolebaseauths, IConfiguration configuration = null)
        {
            _data = data;
            this.configuration = configuration;
            this.Rolebaseauths = Rolebaseauths;
        }


       


        [HttpPost("Register")]

        public IActionResult Register(Users users)
        {
            if (!Rolebaseauths.IsemailAvailable(users.Email))
            {
                return Ok("Email Error x-x,Please try again later");
            };
            users.CreatedOn = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            users.UserType = UserType.USER;
            Rolebaseauths.Register(users);
            return Ok("Account Created Succesfully ^-^");
        }




        [HttpGet("Logins")]
        public IActionResult Logins(string email, string password)
        {
            if (Rolebaseauths.Authenticateuser(email, password, out Users? users))
            {
                if (users != null)
                {
                    var jwt = new Jwt(configuration["Jwt:Key"], configuration["Jwt:Duration"]);
                    var token = jwt?.Generatetoken(users);

                    var imageUrl = Rolebaseauths.GetImage(users.id);
                    var authResponse = new AuthResponse
                    {
                        Token = token,
                        Image = imageUrl
                    };
                    return Ok(authResponse);
                }
            }

            return Ok("invalid");
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook(Book newBook)
        {


            int result = Rolebaseauths.AddBook(newBook);
            if (result > 0)
            {
                return Ok("Book successfully added");
            }
            else
            {
                return BadRequest("Failed to add book");
            }
        }

        [HttpGet("GetCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = Rolebaseauths.GetBookCategories();
            return Ok(categories);
        }

        [HttpGet("GetBooks")]
        public IActionResult GetBooks()
        {
            var books = Rolebaseauths.GetBooks();
            return Ok(books);
        }

        [HttpGet("GetBookById/{id}")]
        public IActionResult GetBookById(int id)
        {
            var book = Rolebaseauths.GetBookById(id);
            if (book != null)
            {
                return Ok(book);
            }
            else
            {
                return NotFound("Book not found");
            }
        }

        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook(int id, Book updatedBook)
        {
            var existingBook = Rolebaseauths.GetBookById(id);
            if (existingBook != null)
            {
                updatedBook.id = id;
                int result = Rolebaseauths.UpdateBook(updatedBook);
                if (result > 0)
                {
                    return Ok(new { message = "Book successfully updated" });

                }
                else
                {
                    return BadRequest("Failed to update book");
                }
            }
            else
            {
                return NotFound("Book not found");
            }
        }

        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var existingBook = Rolebaseauths.GetBookById(id);
            if (existingBook != null)
            {
                int result = Rolebaseauths.DeleteBook(id);
                if (result > 0)
                {
                    return Ok(new { message = "Book successfully Deleted" });
                }
                else
                {
                    return BadRequest("Failed to delete book");
                }
            }
            else
            {
                return NotFound("Book not found");
            }
        }

       

        [HttpPut("UpdateUserInfo/{id}")]
        public IActionResult UpdateUserInfo(int id, Users updatedUser)
        {
            var existingUser = Rolebaseauths.GetUserById(id);
            if (existingUser != null)
            {
                updatedUser.id = id;
                int result = Rolebaseauths.UpdateUserInfo(updatedUser);
                if (result > 0)
                {
                    return Ok(new { message = "User information successfully updated" });
                }
                else
                {
                    return BadRequest("Failed to update user information");
                }
            }
            else
            {
                return NotFound("User not found");
            }
        }

        [HttpPost("BorrowBook/{userId}/{bookId}")]
        public IActionResult BorrowBook(int userId, int bookId, [FromBody] Peminjaman model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.ReturnDate))
            {
                return BadRequest("Return date is required.");
            }

            if (DateTime.TryParse(model.ReturnDate, out DateTime parsedReturnDate))
            {
                int result = _data.BorrowBook(userId, bookId, parsedReturnDate);
                if (result > 0)
                {
                    return Ok(new { message = "Book Successfully Borrowed" });
                }
                else
                {
                    return BadRequest("Failed to borrow book");
                }
            }
            else
            {
                return BadRequest("Invalid return date format");
            }
        }










     




        [HttpGet("GetUserBookLoan")]
        public IActionResult GetUsersAndBorrowedBooks()
        {

            var loans = Rolebaseauths.GetUsersAndBorrowedBooks();
            return Ok(loans);
        }


        [HttpPost("ConfirmBorrow/{bookLoanId}")]
        public IActionResult ConfirmBorrow(int bookLoanId)
        {
            int result = Rolebaseauths.ConfirmBorrow(bookLoanId);
            if (result > 0)
            {
               return Ok(new { message = "Book successfully updated" });
            }
            else
            {
                return BadRequest("Failed to confirm borrow");
            }
        }




     




        [HttpPost("ReturnBook/{userId}/{bookId}")]
        public IActionResult ReturnBook(int bookId)
        {
            
            var userId = GetUserIdFromToken();

           
            int result = Rolebaseauths.ReturnBook(userId, bookId);
            if (result > 0)
            {
                return Ok("Book successfully returned");
            }
            else
            {
                return BadRequest("Failed to return book");
            }
        }

        [HttpGet("GetUserBookLoans/{userId}")]
        public IActionResult GetUserBookLoans(int userId)
        {
            var loans = Rolebaseauths.GetUserBookLoans(userId);
            return Ok(loans);
        }

        [HttpDelete("DeleteBookLoan/{bookLoanId}")]
        public IActionResult DeleteBookLoan(int bookLoanId)
        {
            int result = Rolebaseauths.DeleteBookLoan(bookLoanId);
            if (result > 0)
            {
                return Ok(new { message = "Book loan successfully deleted" });
            }
            else
            {
                return BadRequest("Failed to delete book loan");
            }
        }

        [HttpGet("SearchBooks")]
        public IActionResult SearchBooks(string searchTerm)
        {
            var results = Rolebaseauths.SearchBooks(searchTerm);
            return Ok(results);
        }

        [HttpGet("GetBooksByCategory/{categoryName}")]
        public IActionResult GetBooksByCategory(string categoryName)
        {
            try
            {
                var books = Rolebaseauths.GetBooksByCategory(categoryName); 

                if (books == null || books.Count == 0)
                {
                    return NotFound();
                }

                return Ok(books);
            }
            catch (Exception ex)
            {
                // Handle exception and return appropriate response
                return StatusCode(500, "Internal server error");
            }
        }

















        private int GetUserIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var userIdClaim = identity.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null)
                {
                    return Convert.ToInt32(userIdClaim.Value);
                }
            }

            throw new ApplicationException("User ID not found in token");
        }















    }

}


