using Library.Model;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Library.Dataacc
{
    public class Jwt
    {
        public string Key { get; set; }

        public string Duration { get; set; }

        public Jwt(string? Key, string? Duration)
        {
            this.Key = Key ?? "";
            this.Duration = Duration ?? "";
        }

        public string Generatetoken(Users user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("id",user.id.ToString()),
                new Claim("Firstname",user.Firstname),
                new Claim("Lastname",user.Lastname),
                new Claim("Username",user.UserName),
                new Claim("Email",user.Email),
                new Claim("Address",user.Address),
                new Claim("createdAt",user.CreatedOn),
                new Claim("userType",user.UserType.ToString()),
                new Claim("Mobile",user.Mobile),
                new Claim("Password",user.Password),
             
            };

            var jwtTokens = new JwtSecurityToken(
                issuer: "localhost",
                audience: "localhost",
                claims: claims,
                expires: DateTime.Now.AddDays(int.Parse(Duration)),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtTokens);

        }
    }
}


