using System.Reflection.Metadata;

namespace Library.Model
{
    public class Users : Ngambilid
    {

        public string Lastname { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Image { get; set; } = string.Empty;


        public UserType UserType { get; set; } 

        public string CreatedOn { get; set; } = string.Empty;
    }
}   
