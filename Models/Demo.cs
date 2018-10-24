using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JWT_Demo.Models
{
    public class Demo
    {
        public long Id { get; set; }
        public Presenter Speaker { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public int Duration { get; set; }
    }
}
