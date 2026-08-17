using System.Text.Json;
using DFANDE.Domain.Entities;
using DFANDE.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Persistence;

/// <summary>
/// One-time migration of the site's editorial copy — previously hard-coded
/// across src/data/mock/company.ts, certifications.ts, partners.ts, and
/// inline JSX in the homepage sections and About/Certifications/Careers
/// pages — into the database as flexible key/value ContentBlocks. Runs
/// only if the table is empty. Values here are transcribed verbatim from
/// the existing source files, not re-authored.
/// </summary>
public static class ContentBlockSeeder
{
    private record StatItem(int Value, string Suffix, string Label, bool? IsYear = null, string? Prefix = null);
    private record FeatureItem(string Icon, string Title, string Body);
    private record CertItem(string Code, string Label);
    private record CustomerItem(string Name, string Logo);
    private record HeadlineJson(string Plain, string Highlight);

    public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger("ContentBlockSeeder");

        if (await context.ContentBlocks.AnyAsync())
        {
            return;
        }

        // camelCase so the persisted jsonb blobs match the rest of the API's
        // JSON convention (and what the frontend's TS types expect) instead
        // of System.Text.Json's default PascalCase property names.
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var order = 0;
        var blocks = new List<ContentBlock>();

        void Text(string key, string pageGroup, string label, string value, string? help = null) =>
            blocks.Add(ContentBlock.CreateText(key, pageGroup, ContentValueType.PlainText, value, label, help, order++));

        void Rich(string key, string pageGroup, string label, string value, string? help = null) =>
            blocks.Add(ContentBlock.CreateText(key, pageGroup, ContentValueType.RichText, value, label, help, order++));

        void List(string key, string pageGroup, string label, List<string> value, string? help = null) =>
            blocks.Add(ContentBlock.CreateList(key, pageGroup, value, label, help, order++));

        void Json<T>(string key, string pageGroup, string label, T value, string? help = null) =>
            blocks.Add(ContentBlock.CreateJson(key, pageGroup, JsonSerializer.Serialize(value, jsonOptions), label, help, order++));

        // ---- company (shared facts, referenced across many pages) ----
        Text("company.legalName", "company", "Legal name", "Divine Flame and Energy International Limited");
        Text("company.shortName", "company", "Short name", "DF&E");
        Text("company.founded", "company", "Founded (year)", "2003");
        Text("company.headquarters", "company", "Headquarters", "Lagos, Nigeria");
        Text("company.fieldFacility", "company", "Field facility", "Port Harcourt, Nigeria");
        Text("company.personnelCount", "company", "Personnel count", "69");
        Text("company.tagline", "company", "Tagline", "Local Might, Global Reach.");
        Rich("company.about", "company", "About (short)",
            "Divine Flame and Energy Int. Ltd is an ISO 9001:2015 / ISO 14001:2015 certified Nigerian leading oil & gas servicing company with a core specialty in procurement, supply, installation, inspection, testing, repairs & maintenance of wellhead & Xmas trees (surface & subsea), wellhead control panels, chokes (surface & subsea), actuators and associated equipment.");
        Rich("company.aboutExtended", "company", "About (extended)",
            "Established in 2003 with headquarters in Lagos, Nigeria and a fully operational field service & warehousing facility in Port Harcourt, the company has continued to shape the narrative of local players with its unique portfolio of service offering within the Nigerian energy market.");
        Text("company.facility.workshopArea", "company", "Workshop area", "1,500m²");
        Text("company.facility.warehouseArea", "company", "Warehouse area", "1,500m²");
        Text("company.facility.warehouseNote", "company", "Warehouse note", "climate-controlled room for elastomer storage");
        Text("company.facility.hydroTesting", "company", "Hydro testing range", "0–30,000psi");
        List("company.facility.capabilities", "company", "Facility capabilities", [
            "Equipment & Spares Management System",
            "0–30,000psi hydro testing capability",
            "Heavy lifting capacity (overhead crane, forklift, etc.)",
            "Blasting & painting suite",
            "Full field service support",
        ]);
        Json("company.heroStats", "company", "Hero stat callouts", new[]
        {
            new StatItem(69, "+", "Field Personnel"),
            new StatItem(1500, "m²", "Workshop Floor"),
        });
        Json("company.stats", "company", "Stats band", new[]
        {
            new StatItem(2003, "", "Founded", IsYear: true),
            new StatItem(69, "+", "Personnel"),
            new StatItem(1500, "m²", "Workshop Floor"),
            new StatItem(30000, "psi", "Max Hydro Testing", Prefix: "0–"),
        }, "Shown on the homepage (WhyDfande) and About page.");

        // ---- home (homepage-section-only editorial copy) ----
        Text("home.hero.eyebrow", "home", "Hero eyebrow", "Nigerian Wellhead & Xmas Tree Specialists");
        Rich("home.hero.subhead", "home", "Hero subhead",
            "ISO-certified engineering, procurement and technical solutions for wellhead, Xmas tree and choke valve equipment across Nigeria's oil & gas sector.");
        Text("home.hero.ctaPrimaryLabel", "home", "Hero primary button label", "Explore Our Services");
        Text("home.hero.ctaSecondaryLabel", "home", "Hero secondary button label", "Contact Us");
        Text("home.hero.statCardTitle", "home", "Hero blurb card title", "Engineering Discipline");
        Rich("home.hero.statCardBody", "home", "Hero blurb card body",
            "Procurement, installation, inspection, testing, repairs and maintenance — delivered to ISO 9001, ISO 14001 and ISO 45001 standards.");
        Text("home.about.eyebrow", "home", "About section eyebrow", "Who We Are");
        Json("home.about.headline", "home", "About section headline",
            new HeadlineJson("Engineering Discipline, ", "Local Delivery"),
            "plain is the unhighlighted lead-in, highlight is the gold-accented clause.");
        List("home.about.points", "home", "About section checklist", [
            "ISO 9001:2015 & ISO 14001:2015 certified",
            "Local assemblage of wellhead & Xmas tree equipment",
            "24/7 field-ready technical support",
            "Port Harcourt field service & warehousing facility",
        ]);
        Text("home.about.ctaLabel", "home", "About section button label", "Discover Our Services");
        Text("home.whyDfande.eyebrow", "home", "Why DF&E eyebrow", "Why DF&E");
        Json("home.whyDfande.headline", "home", "Why DF&E headline",
            new HeadlineJson("Reliable Engineering. ", "Proven Delivery."),
            "plain is the unhighlighted lead-in, highlight is the gold-accented clause.");
        Json("home.whyDfande.features", "home", "Why DF&E feature cards", new[]
        {
            new FeatureItem("wrench", "Local Assemblage Capability",
                "100% local assemblage of wellhead and Xmas tree equipment at our Port Harcourt facility."),
            new FeatureItem("clock", "24/7 Field-Ready Support",
                "Dedicated aftermarket support services, available around the clock for onshore and offshore deployment."),
            new FeatureItem("shield", "ISO-Certified Discipline",
                "Operations run on ISO 9001, ISO 14001 and ISO 45001 management systems, aligned to API-6A and API-6D."),
        }, "icon is a lucide-react name: wrench, clock, or shield.");
        Text("home.facility.eyebrow", "home", "Facility section eyebrow", "Port Harcourt Facility");
        Text("home.facility.headline", "home", "Facility section headline", "Field Service Facility");
        Rich("home.facility.intro", "home", "Facility section intro",
            "A fully operational field service & warehousing facility, equipped for local assemblage, testing and repair.");
        Text("home.certificationsStrip.eyebrow", "home", "Certifications strip eyebrow", "HSE & Quality");
        Text("home.certificationsStrip.headline", "home", "Certifications strip headline", "Certified Discipline");
        Rich("home.certificationsStrip.intro", "home", "Certifications strip intro",
            "Operations run on proven industry practice, aligned to ISO management systems and API engineering standards.");
        Text("home.ctaBand.headline", "home", "CTA band headline",
            "Engineering challenge? Talk to DF&E about your next wellhead project.");
        Text("home.ctaBand.ctaLabel", "home", "CTA band button label", "Contact Us");
        Text("home.partners.eyebrow", "home", "Partners strip eyebrow", "Trusted By Nigeria's Leading Operators");

        // ---- about (AboutPage-only copy) ----
        Text("about.pageHeader.eyebrow", "about", "Page header eyebrow", "About Us");
        Text("about.pageHeader.title", "about", "Page header title", "Engineering Discipline, Local Delivery");
        Rich("about.pageHeader.description", "about", "Page header description",
            "Divine Flame and Energy International Limited — a Nigerian-owned, ISO-certified oil & gas servicing company built around wellhead, Xmas tree and choke valve equipment.");
        Text("about.headline", "about", "Who We Are headline", "Local Might, Global Reach");
        Rich("about.facility.intro", "about", "Facility section intro",
            "A fully operational field service & warehousing facility, equipped for local assemblage, testing and repair — {{company.facility.warehouseArea}} of warehouse space including a {{company.facility.warehouseNote}}.",
            "{{key}} placeholders are resolved client-side against other content blocks at render time.");

        // ---- certifications ----
        Text("certifications.pageHeader.eyebrow", "certifications", "Page header eyebrow", "HSE & Quality");
        Text("certifications.pageHeader.title", "certifications", "Page header title", "Certified Discipline");
        Rich("certifications.pageHeader.description", "certifications", "Page header description",
            "Operations run on proven industry practice, aligned to ISO management systems and API engineering standards.");
        Json("certifications.items", "certifications", "ISO certifications", new[]
        {
            new CertItem("ISO 9001:2015", "Quality Management"),
            new CertItem("ISO 14001:2015", "Environmental Management"),
            new CertItem("ISO 45001:2018", "Occupational Health & Safety"),
        });
        List("certifications.standards", "certifications", "Aligned API standards",
            ["API SPEC Q2", "API-6A", "API-6D", "API-17D"]);
        Text("certifications.hsePolicy.headline", "certifications", "HSE Policy headline", "HSE Policy");
        Rich("certifications.hsePolicy.body", "certifications", "HSE Policy body",
            "DF&E's Health, Safety & Environment Policy Statement — signed and in effect across all field service and workshop operations.");
        Text("certifications.qualityPolicy.headline", "certifications", "Quality Policy headline", "Quality Policy");
        Rich("certifications.qualityPolicy.body", "certifications", "Quality Policy body",
            "DF&E's Quality Policy Statement — the basis for our ISO 9001:2015 quality management system.");

        // ---- careers ----
        Text("careers.pageHeader.eyebrow", "careers", "Page header eyebrow", "Careers");
        Text("careers.pageHeader.title", "careers", "Page header title", "Build Your Career With DF&E");
        Rich("careers.pageHeader.description", "careers", "Page header description",
            "We're a Nigerian-owned oil & gas servicing company built on local engineering capability — and we're always interested in hearing from people who share that.");
        Json("careers.values", "careers", "Values cards", new[]
        {
            new FeatureItem("wrench", "Hands-On Engineering",
                "Field service personnel work directly on wellhead, Xmas tree and choke valve equipment — local assemblage, not just installation."),
            new FeatureItem("shield", "Safety-First Culture",
                "Every role operates under ISO 9001, ISO 14001 and ISO 45001 management systems — discipline is part of the job, not an afterthought."),
            new FeatureItem("users", "24/7 Field Readiness",
                "A team of {{company.personnelCount}}+ highly competent personnel, ready for onshore and offshore deployment."),
        }, "icon is a lucide-react name: wrench, shield, or users. The third body's {{company.personnelCount}} placeholder is resolved client-side.");
        Text("careers.openings.eyebrow", "careers", "Openings eyebrow", "Current Openings");
        Text("careers.openings.headline", "careers", "Openings headline", "No open positions listed right now");
        Rich("careers.openings.body", "careers", "Openings body",
            "We don't have active vacancies posted at the moment, but we're always interested in hearing from qualified wellhead engineers, technicians and procurement specialists. Send us your CV and we'll keep it on file for when a relevant role opens up.");
        Text("careers.openings.ctaLabel", "careers", "Openings button label", "Email Your CV");
        Text("careers.openings.contactEmail", "careers", "Openings contact email", "info@dfande.com");

        // ---- partners ----
        Json("partners.majorPartners", "partners", "OEM partner logos", new[]
        {
            new CustomerItem("Ameriforge", "/images/partner-ameriforge.png"),
            new CustomerItem("FMC Technologies", "/images/partner-fmc-technologies.png"),
            new CustomerItem("GE Oil & Gas", "/images/partner-ge-oil-gas.png"),
            new CustomerItem("Master Flo", "/images/partner-masterflo.png"),
            new CustomerItem("National Oilwell Varco", "/images/partner-nov.png"),
            new CustomerItem("Southern California Valve", "/images/partner-scv.png"),
            new CustomerItem("Weatherford", "/images/partner-weatherford.png"),
        }, "Sourced from real OEM partner logos in Img/Our Partners.");
        Json("partners.keyCustomers", "partners", "Key customer logos", new[]
        {
            new CustomerItem("Chevron", "/images/partner-chevron.png"),
            new CustomerItem("Shell", "/images/partner-shell.png"),
            new CustomerItem("ExxonMobil", "/images/partner-exxonmobil.png"),
            new CustomerItem("TotalEnergies", "/images/partner-total.png"),
            new CustomerItem("Addax Petroleum", "/images/partner-addax.png"),
            new CustomerItem("Agip", "/images/partner-agip.png"),
            new CustomerItem("Daewoo Nigeria", "/images/partner-daewoo.png"),
            new CustomerItem("NNPC E&P", "/images/partner-nnpc.png"),
        }, "logo paths are existing static assets, not a media library.");

        context.ContentBlocks.AddRange(blocks);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} content blocks", blocks.Count);
    }
}
