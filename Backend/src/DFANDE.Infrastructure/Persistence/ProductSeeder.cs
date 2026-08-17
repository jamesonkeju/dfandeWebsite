using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Persistence;

/// <summary>
/// One-time migration of the real DFANDE product families (previously
/// hard-coded in the frontend's src/data/mock/products.ts) into the
/// database. Runs only if the table is empty — never overwrites CMS edits
/// made after the first run.
/// </summary>
public static class ProductSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger("ProductSeeder");

        if (await context.Products.AnyAsync())
        {
            return;
        }

        var products = new[]
        {
            Product.Create(
                "Wellhead Equipment & Accessories",
                "wellhead-equipment",
                [
                    "Surface Wellheads — unitized, splitter, conventional & compact designs",
                    "Subsea Wellheads",
                    "Xmas Trees — block & standard designs, single or dual strings",
                    "Running Tools",
                    "Hangers, Suspension Caps, Adapters, Dry Hole Trees",
                    "Full range of spare parts & accessories",
                ],
                "Producer wells, injectors, exploratory wells", "/images/product-wellhead-equipment.jpg", 0, true),

            Product.Create(
                "Mudline Suspension Systems",
                "mudline-suspension",
                ["Tersus Mudline Suspension", "SD-1 Mudline Suspension", "SD-1 Mudline Casing Support", "PCT Tieback"],
                null, "/images/product-mudline.jpg", 1, true),

            Product.Create(
                "Chokes & Gate Valves",
                "chokes-gate-valves",
                ["Subsea Choke Valves / Inserts", "Surface Choke Valves", "Gate Valves", "Actuators", "Positioners", "Spares"],
                "Oil, gas & water injection wells", "/images/product-chokes-valves.jpg", 2, true),

            Product.Create(
                "Wellhead Control Panels",
                "wellhead-control-panels",
                [
                    "Single-Well Wellhead Control Panel",
                    "Multi-Well Wellhead Control Panel",
                    "Installation materials",
                    "Consumables",
                    "Spares",
                ],
                null, "/images/product-control-panel.jpg", 3, true),

            Product.Create(
                "Maintenance, Repairs & Operations (MRO) Spares",
                "mro-spares",
                ["OEM spare parts for oilfield equipment", "Critical spares for oilfield equipment", "Tools"],
                null, "/images/product-mro-spares.jpg", 4, true),
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} products", products.Length);
    }
}
