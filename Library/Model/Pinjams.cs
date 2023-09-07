namespace Library.Model
{
    public class Pinjams : Ngambilid
    {
        internal DateTime Returndate;

        public int UserId { get; set; }

        public string BookTitle { get; set; }
        public string namapenerbit { get; set; }
        public string ISBN { get; set; }
        public string Author { get; set; }
        public string Category { get; set; }
        public string Status { get; set; }
    }
}
