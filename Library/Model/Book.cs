using Library.Dataacc;
using System.Text;

namespace Library.Model
{
    public class Book : Ngambilid
    {
        public string Title { get; set; }

        public bool IsAvailable { get; set; }

        public string Foto { get; set; }

        public string namapenerbit { get; set; }

        public string Author { get; set; }
        public string ISBN { get; set; }

        public int CategoryId { get; set; } 

     

    }
}
