using DFANDE.Domain.Constants;
using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Persistence;

/// <summary>
/// One-time migration of the real DFANDE project history (previously
/// hard-coded in the frontend's src/data/mock/projects.ts) into the
/// database. Runs only if the table is empty — never overwrites CMS edits
/// made after the first run. IsFeatured is set on the first 4 entries (in
/// their original array order) to preserve the homepage's previous
/// `.slice(0, 4)` behavior exactly.
/// </summary>
public static class ProjectSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger("ProjectSeeder");

        if (await context.Projects.AnyAsync())
        {
            return;
        }

        const string wellheadImage = "/images/project-wellhead.jpg";
        const string controlPanelImage = "/images/project-control-panel.jpg";
        const string chokeValveImage = "/images/project-choke-valve.jpg";

        var projects = new[]
        {
            Project.Create("Chevron Nigeria Ltd",
                "Well Services Contract — Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated MRO materials",
                "Chevron Nigeria JV Assets", "2015 – till date", ProjectCategories.Wellhead, wellheadImage, 0, true, true),

            Project.Create("Seplat Energy",
                "1st & 2nd Line Wellhead Maintenance Services",
                "Offshore, Nigeria", "2025 – till date", ProjectCategories.Wellhead, wellheadImage, 1, true, true),

            Project.Create("Seplat Energy",
                "Supply & Installation of Wellhead Services for Western and Eastern Assets",
                "Western and Eastern Assets, Nigeria", "2024 – till date", ProjectCategories.Wellhead, wellheadImage, 2, true, true),

            Project.Create("First E&P",
                "Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated Spares",
                "First E&P JV Assets", "2004 – 2024", ProjectCategories.Wellhead, wellheadImage, 3, true, true),

            Project.Create("SPDC (Shell)",
                "Supply, Installation & Maintenance of Wellheads, Xmas Trees, Wellhead Control Panels and associated Spares",
                "SPDC Nigeria JV Assets", "2012 – till date", ProjectCategories.Wellhead, wellheadImage, 4, false, true),

            Project.Create("ExxonMobil",
                "Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated Spares",
                "ExxonMobil Nigeria JV Assets", "2004 – 2024", ProjectCategories.Wellhead, wellheadImage, 5, false, true),

            Project.Create("NNPC E&P Ltd (formerly NPDC)",
                "Global Contracts for Provision of Wellhead Equipment and Services",
                "OML 98", "2021", ProjectCategories.Wellhead, wellheadImage, 6, false, true),

            Project.Create("TotalEnergies (TOTAL)",
                "Supply, Installation and Maintenance of Wellheads, Xmas Trees and Accessories",
                "TotalEnergies JV Offshore", "2010 – 2012", ProjectCategories.Wellhead, wellheadImage, 7, false, true),

            Project.Create("Addax Petroleum",
                "Supply, Installation & Maintenance of Surface Wellhead & Tree Equipment",
                "OML 123 & 124", "2006 – 2009", ProjectCategories.Wellhead, wellheadImage, 8, false, true),

            Project.Create("Oriental Energy (formerly Afren)",
                "Supply & Installation of Wellheads, Xmas Trees and associated equipment",
                "Offshore, Nigeria", "2012 – till date", ProjectCategories.Wellhead, wellheadImage, 9, false, true),

            Project.Create("Daewoo Nigeria",
                "Supply, Installation, Hook-up & Commissioning of Wellhead Control Panels",
                "Gbaran", "2022 – till date", ProjectCategories.ControlPanel, controlPanelImage, 10, false, true),

            Project.Create("Seflam",
                "Supply, Installation, Hook-up & Commissioning of Wellhead Control Panels",
                "UZU & EPU fields", "2024 – till date", ProjectCategories.ControlPanel, controlPanelImage, 11, false, true),

            Project.Create("Chevron Nigeria Ltd",
                "Supply, Installation, Inspection, Testing, Maintenance, Strip down, Retrofitting & Re-assembly of Subsea Choke Valves",
                "Chevron Nigeria JV Assets", "2015 – till date", ProjectCategories.ChokeValve, chokeValveImage, 12, false, true),

            Project.Create("Newcross Petroleum Ltd",
                "Supply of Adjustable Choke Valves",
                "Efe Field", "2021", ProjectCategories.ChokeValve, chokeValveImage, 13, false, true),

            Project.Create("SNEPCo",
                "Supply, Refurbishment & Recertification of Subsea Choke Valves",
                "Bonga Main Field", "2005", ProjectCategories.ChokeValve, chokeValveImage, 14, false, true),
        };

        context.Projects.AddRange(projects);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} projects", projects.Length);
    }
}
