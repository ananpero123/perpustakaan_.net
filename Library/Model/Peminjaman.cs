namespace Library.Model
{
    public class Peminjaman : Ngambilid
    {
        public int UserId { get; set; }

        public int bookId { get; set; }


        public Boolean Status { get; set; }

        public DateTime Borrowdate { get; set; }

        public string ReturnDate { get; set; }



    }
}
