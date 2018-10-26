using JWT_Demo.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JWT_Demo.Data
{
    public class DemoDbContext : IdentityDbContext
    {
      private IConfiguration _config;

      public DemoDbContext(IConfiguration config)
      {
        _config = config;
      }

      protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
      {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer(_config.GetValue<string>("DefaultConnection"));
      }

      protected override void OnModelCreating(ModelBuilder builder)
      {
        base.OnModelCreating(builder);
      }

      public DbSet<Presenter> Presenters { get; set; }
      public DbSet<Demo> Demos { get; set; }
  }
}
