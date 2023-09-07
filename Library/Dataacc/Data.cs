using Library.Model;
using System;

namespace Library.Dataacc
{
    public interface Data
    {
        int Register(Users users);

        bool IsemailAvailable(string email);

        bool Authenticateuser(string email, string password, out Users? users);

        int AddBook(Book newBook);

        List<BookCategory> GetBookCategories();

        List<Book> GetBooks();

        Book GetBookById(int id);

        int UpdateBook(Book updatedBook);

        int DeleteBook(int bookId);

        int UpdateUserInfo(Users updatedUser);

        Users GetUserById(int id);


        string GetImage(int userId);

        int BorrowBook(int UserId, int BookId, DateTime? returnDate = null);


        int ReturnBook(int userId, int bookId);

        List<BookLoan> GetUserBookLoans(int UserId);

        List<UserBorrowing> GetUsersAndBorrowedBooks();

        int ConfirmBorrow(int bookLoanId);

        int DeleteBookLoan(int bookLoanId);

        List<Book> SearchBooks(string searchTerm);

        List<Book> GetBooksByCategory(string categoryName);












    }
}
