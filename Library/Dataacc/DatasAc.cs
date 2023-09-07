    using Dapper;
    using Library.Dataacc;
    using Library.Model;
    using System;
    using System.Data.Common;
    using System.Data.SqlClient;

    namespace Library.Dataacc
    {
        public class DatasAc : Data
        {
            private readonly IConfiguration configuration;
            private readonly string DBConnect;
            public DatasAc(IConfiguration _configuration)
            {
                configuration = _configuration;
                DBConnect = configuration["connectionStrings:DBConnect"] ?? "";
            }


            public int Register(Users user)
            {
                var result = 0;

                using (var connection = new SqlConnection(DBConnect))
                {
                    var parameters = new
                    {
                        fn = user.Firstname,
                        ln = user.Lastname,
                        un = user.UserName,
                        dn = user.Address,
                        wn = user.CreatedOn,
                        en = user.Email,
                        we = user.Mobile,
                        oi = user.Password,
                        type = user.UserType.ToString()
                    };
                    var sql = "insert into Users (Firstname,Lastname,Username,Address,CreatedOn,Email,Mobile,Password,Usertype) values (@fn,@ln,@un,@dn,@wn,@en,@we,@oi,@type)";
                    result = connection.Execute(sql, parameters);
                }
                return result;
            }

            public bool IsemailAvailable(string email)
            {
                var result = false;

                using (var connection = new SqlConnection(DBConnect))
                {


                    result = connection.ExecuteScalar<bool>("select count(*) from Users where Email=@email;", new { email });
                };

                return !result;
            }

            public bool Authenticateuser(string email, string password, out Users? users)
            {
                var result = false;
                using (var connection = new SqlConnection(DBConnect))
                {
                    result = connection.ExecuteScalar<bool>("select count(1) from Users where Email=@email and Password=@password;", new { email, password });
                    if (result)
                    {
                        users = connection.QueryFirst<Users>("select * from Users where Email=@email;", new { email });
                    }
                    else
                    {
                        users = null;
                    }
                }
                return result;
            }


            public int AddBook(Book newBook)
            {
                var result = 0;

                using (var connection = new SqlConnection(DBConnect))
                {
                    var parameters = new
                    {
                        title = newBook.Title,
                        author = newBook.Author,
                        namapenerbit = newBook.namapenerbit,
                        foto = newBook.Foto,
                        isbn = newBook.ISBN,
                        categoryId = newBook.CategoryId,
                        IsAvail = newBook.IsAvailable,

                    };
                    var sql = "INSERT INTO Books (Title, Author, namapenerbit, Foto, ISBN, CategoryId,IsAvailable) " +
                              "VALUES (@title, @author, @namapenerbit, @foto, @isbn, @categoryId,@IsAvail)";
                    result = connection.Execute(sql, parameters);
                }

                return result;
            }

        public List<Book> SearchBooks(string searchTerm)
        {
            using (var connection = new SqlConnection(DBConnect))   
            {
                var sql = "SELECT * FROM Books WHERE Title LIKE @searchTerm";
                return connection.Query<Book>(sql, new { searchTerm = $"%{searchTerm}%" }).ToList();
            }
        }

        public List<Book> GetBooksByCategory(string categoryName)
        {
            using (var connection = new SqlConnection(DBConnect))
            {
                var sql = "SELECT * FROM Books WHERE CategoryId = (SELECT Id FROM BookCategory WHERE Category = @categoryName)";
                return connection.Query<Book>(sql, new { categoryName }).ToList();
            }
        }



        public List<BookCategory> GetBookCategories()
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "SELECT * FROM BookCategory";
                    return connection.Query<BookCategory>(sql).ToList();
                }
            }

            public List<Book> GetBooks()
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "SELECT * FROM Books";
                    return connection.Query<Book>(sql).ToList();
                }
            }

            public Book GetBookById(int id)
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "SELECT * FROM Books WHERE Id = @id";
                    return connection.QueryFirstOrDefault<Book>(sql, new { id });
                }
            }

            public int UpdateBook(Book updatedBook)
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var parameters = new
                    {
                        Id = updatedBook.id,
                        title = updatedBook.Title,
                        author = updatedBook.Author,
                        Namapenerbit = updatedBook.namapenerbit,
                        foto = updatedBook.Foto,
                        isbn = updatedBook.ISBN,
                        categoryId = updatedBook.CategoryId,
                    };
                    var sql = "UPDATE Books " +
                              "SET Title = @title, Author = @author, " +
                              "namapenerbit = @Namapenerbit, Foto = @foto, " +
                              "ISBN = @isbn, CategoryId = @categoryId " +
                              "WHERE id = @Id";
                    return connection.Execute(sql, parameters);
                }
            }

            public int DeleteBook(int bookId)
            {
                var result = 0;

                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "DELETE FROM Books WHERE Id = @bookId";
                    result = connection.Execute(sql, new { bookId });
                }

                return result;
            }

            public Users GetUserById(int id)
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "SELECT * FROM Users WHERE Id = @id";
                    return connection.QueryFirstOrDefault<Users>(sql, new { id });
                }
            }





            public int UpdateUserInfo(Users updatedUser)
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var parameters = new
                    {
                        ss = updatedUser.id,
                        fn = updatedUser.Firstname,
                        ln = updatedUser.Lastname,
                        un = updatedUser.UserName,
                        baswes = updatedUser.Address,
                        wn = updatedUser.CreatedOn,
                        ft = updatedUser.Image,
                        en = updatedUser.Email,
                        we = updatedUser.Mobile,
                        wqew = updatedUser.Password,

                    };

                    var sql = "UPDATE Users " +
               "SET Firstname = @fn, Lastname = @ln, Username = @un, Address = @baswes, " +
               "Email = @en, Mobile = @we,Image = @ft, Password = @wqew " +
               "WHERE id = @ss";


                    return connection.Execute(sql, parameters);
                }
            }
            
            public string GetImage(int userId)
            {
                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "SELECT Image FROM Users WHERE Id = @userId";
                    return connection.QueryFirstOrDefault<string>(sql, new { userId });
                }
            }


            public int BorrowBook(int UserId, int BookId, DateTime? returnDate = null)
            {
                var result = 0;

                using (var connection = new SqlConnection(DBConnect))
                {
                    var parameters = new
                    {
                        userId = UserId,
                        bookId = BookId,    
                        BorrowDate = DateTime.Now,
                        Status = false,
                        Notifs = false,
                        ReturnDate = returnDate,
                    };

                    var sql = "INSERT INTO Peminjaman (Userid, Bookid, Borrowdate, Returndate,Status,Notifs) " +
                              "VALUES (@userId, @bookId, @BorrowDate, @ReturnDate,@Status,@Notifs)";
                    result = connection.Execute(sql, parameters);

                    sql = "UPDATE Books SET IsAvailable = 0 WHERE Id = @bookId";
                    connection.Execute(sql, new { bookId = BookId });
                }

                return result;
            }






            public int ReturnBook(int userId, int bookId)
            {
                var result = 0;

                using (var connection = new SqlConnection(DBConnect))
                {
                    var sql = "UPDATE Peminjaman SET Returndate = @ReturnDate " +
                              "WHERE Userid = @UserId AND Bookid = @BookId AND returndate IS NULL";
                    result = connection.Execute(sql, new { UserId = userId, BookId = bookId, ReturnDate = DateTime.Now });

                    sql = "UPDATE Books SET IsAvailable = 1 WHERE Id = @BookId";
                    connection.Execute(sql, new { BookId = bookId });
                }

                return result;
            }


        public List<BookLoan> GetUserBookLoans(int userId)
        {
            var sql = "SELECT Peminjaman.Id, Books.Title as BookTitle, Books.namapenerbit, Books.ISBN, " +
                      "Books.Author, BookCategory.Category as Category, Peminjaman.Status, Peminjaman.BorrowDate, Peminjaman.ReturnDate " +
                      "FROM Peminjaman " +
                      "INNER JOIN Books ON Peminjaman.Bookid = Books.Id " +
                      "INNER JOIN BookCategory ON Books.CategoryId = BookCategory.Id " +
                      "WHERE Peminjaman.UserId = @userId";

            using (var connection = new SqlConnection(DBConnect))
            {
                var loans = connection.Query<BookLoan>(sql, new { userId }).ToList();

               
                foreach (var loan in loans)
                {
                    if (loan.Status == true)
                    {
                        
                          TimeSpan remainingDays = loan.Returndate.Value.Date - DateTime.Now.Date;
                        loan.RemainingDays = (int)remainingDays.TotalDays;

                        if (remainingDays.TotalDays < 0)
                        {
                            var deleteSql = "DELETE FROM Peminjaman WHERE Id = @loanId";
                            connection.Execute(deleteSql, new { loanId = loan.id });
                        }
                       
                    }
                    
                }

                return loans;
            }
        }


        public List<UserBorrowing> GetUsersAndBorrowedBooks()
        {
            var sql = "SELECT Peminjaman.Id as id, Users.Username as Username, Users.Email as Email, " +
                      "Books.Title as BookTitle, Books.namapenerbit as namapenerbit, " +
                      "Books.ISBN, Books.Author as Author, BookCategory.Category as Category, " +
                      "Peminjaman.Notifs,Peminjaman.Status, CAST(Peminjaman.BorrowDate AS DATETIME) as BorrowDate, CAST(Peminjaman.Returndate AS DATETIME) as Returndate " +
                      "FROM Peminjaman " +
                      "INNER JOIN Users ON Peminjaman.UserId = Users.Id " +
                      "INNER JOIN Books ON Peminjaman.Bookid = Books.Id " +
                      "INNER JOIN BookCategory ON Books.CategoryId = BookCategory.Id";

            using (var connection = new SqlConnection(DBConnect))
            {
                var result = connection.Query<UserBorrowing>(sql).ToList();

                
                foreach (var item in result)
                {
                    item.Borrowdate = item.Borrowdate.Date;
                    

                }

                return result;
            }


        }

        public int ConfirmBorrow(int bookLoanId)
        {
            var result = 0;

            using (var connection = new SqlConnection(DBConnect))
            {

                var loan = connection.QueryFirstOrDefault<BookLoan>("SELECT * FROM Peminjaman WHERE Id = @bookLoanId AND Status = 0 AND Notifs = 0", new { bookLoanId });
                if (loan != null)
                {
                   
                    var sql = "UPDATE Peminjaman SET Status = 1 , Notifs = 1  WHERE Id = @bookLoanId";
                    result = connection.Execute(sql, new { bookLoanId });


                }
            }

            return result;
        }









      


        public int DeleteBookLoan(int bookLoanId)
        {
            using (var connection = new SqlConnection(DBConnect))
            {
                
                var deleteSql = "DELETE FROM Peminjaman WHERE Id = @bookLoanId";
                var result = connection.Execute(deleteSql, new { bookLoanId });
                return result;
            }
        }










































    }
}



