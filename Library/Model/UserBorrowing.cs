namespace Library.Model
{
    public class UserBorrowing : Ngambilid
    {


        public string Email { get; set; } 
        public string Username { get; set; } = string.Empty;
        public string BookTitle { get; set; } 
        public string Author { get; set; }
        public string ISBN { get; set; } 
        public string namapenerbit { get; set; } 
        public string Category { get; set; } 
        public bool Status { get; set; }

        public bool Notifs { get; set; }
        public string ReturnDate { get; set; }

        public DateTime Borrowdate { get; set; }
    }
}
