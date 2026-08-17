using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Persistence;

/// <summary>
/// One-time migration of the real DFANDE services (previously hard-coded in
/// the frontend's src/data/mock/services.ts) into the database, so the
/// homepage's frozen Services section can be switched to read from the API
/// without changing a single word of real content. Runs only if the table
/// is empty — never overwrites CMS edits made after the first run.
/// </summary>
public static class ServiceSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger("ServiceSeeder");

        if (await context.Services.AnyAsync())
        {
            return;
        }

        var services = new[]
        {
            Service.Create(
                "Wellhead & Xmas Tree Services",
                "wellhead-xmas-tree",
                "Field installation, workover, maintenance and local assemblage of wellhead and Xmas tree equipment.",
                [
                    "Field installation (drilling & completions) — greenfield wells",
                    "Workover & intervention works — brownfield wells",
                    "Local assemblage of wellhead equipment",
                    "Inspection & testing inclusive of SIT (full stack-up)",
                    "Spares management",
                    "Warehousing & logistics",
                ],
                "flame", "/images/service-wellhead.png", 0, true, true),

            Service.Create(
                "Surface & Subsea Choke Valve Services",
                "choke-valve",
                "Installation, health-check recertification and complete strip-down, repair and rebuild of choke valves.",
                [
                    "Field installation, hook-up & commissioning",
                    "Local assemblage of valves",
                    "Health check & recertification",
                    "Complete strip-down, inspection, repairs, testing & rebuild",
                    "Procurement & sale of actuators",
                    "Actuation & controls",
                ],
                "gauge", "/images/service-valve.png", 1, true, true),

            Service.Create(
                "Wellhead Control Panel Services",
                "wellhead-control-panel",
                "Full installation, hook-up, commissioning and OEM-backed maintenance of wellhead control panels.",
                ["Full installation activities", "Inspection & testing", "Hook-up & commissioning", "Spares management"],
                "settings", "/images/service-control-panel.jpg", 2, true, true),

            Service.Create(
                "Fishing & Re-entry Services",
                "fishing-re-entry",
                "Fishing, milling, cutting and specialty-tool intervention across cased hole, open hole and thru-tubing operations.",
                [
                    "Fishing operations",
                    "Re-entry services",
                    "Milling & cutting",
                    "Cased hole, open hole & thru-tubing intervention",
                    "OEM support & technical advisory",
                ],
                "anchor", "/images/service-fishing.jpg", 3, false, true),

            Service.Create(
                "Sealant Injection Services",
                "sealant-injection",
                "Bubble-tight barrier provision and control-line leak treatment for wellhead and tree valves.",
                [
                    "Bubble tight barriers for wellhead & tree valves",
                    "SCSSV control line leak treatment",
                    "Technical advisory",
                ],
                "droplet", "/images/service-sealant.jpg", 4, false, true),

            Service.Create(
                "Oilfield Equipment Preservation Services",
                "equipment-preservation",
                "Preservation of outdoor, indoor and sheltered equipment to protect long-term asset value.",
                ["Visual inspection", "Cleaning / buffing", "Greasing / oiling", "Application of protective solution"],
                "shield", "/images/service-preservation.jpg", 5, false, true),

            Service.Create(
                "Anti-Tamper Nut Services",
                "anti-tamper-nut",
                "Installation of anti-theft systems across wellheads, choke valves and control panels.",
                ["Anti-theft system installation", "Spares management", "OEM support & technical advisory"],
                "lock", "/images/service-anti-tamper.jpg", 6, false, true),

            Service.Create(
                "Supply & Procurement Services",
                "supply-procurement",
                "End-to-end procurement and smart supply chain networks for onshore & offshore production facilities.",
                [
                    "OPEX/CAPEX-aligned procurement",
                    "Smart supply chain networks",
                    "Long lead & short lead item procurement",
                    "Timely fulfilment of equipment orders",
                ],
                "package", "/images/service-procurement.jpg", 7, false, true),
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} services", services.Length);
    }
}
