using System.Collections.Generic;

namespace JWT_Demo.Models
{
    public class Presenter
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual IEnumerable<Demo> Demos { get; set; }
    }
}