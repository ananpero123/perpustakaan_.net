namespace Library.Model
{
    public class BookLoan : Ngambilid
    {
        public DateTime? Returndate;

        public int UserId { get; set; }

        public string BookTitle { get; set; }
        public string namapenerbit   { get; set; } 
        public string ISBN { get; set; }     
        public string Author { get; set; }    
        public string Category { get; set; }  
        public bool Status { get; set; }

        public int RemainingDays { get; set; }
        public bool Notifs { get; set; }

        public string Expired { get; set; }
    }
}
