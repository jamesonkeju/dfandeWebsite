using System.Text.Json;
using DFANDE.Domain.Entities;
using DFANDE.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Persistence;

/// <summary>
/// Comprehensive database seeding for all editorial content, key milestones,
/// ISO certifications, signed policies, preservation case studies, and FAQs.
/// </summary>
public static class ContentBlockSeeder
{
    private record StatItem(int Value, string Suffix, string Label, bool? IsYear = null, string? Prefix = null);
    private record FeatureItem(string Icon, string Title, string Body);
    private record MilestoneItem(string Year, string Title, string Description, string Badge);
    private record CertItem(string Code, string Label, string Description, string DocumentSlug);
    private record CaseStudyItem(string Client, string Title, string BeforeImage, string AfterImage, string Scope);
    private record FaqItem(string Question, string Answer, string Category);
    private record CustomerItem(string Name, string Logo);
    private record HeadlineJson(string Plain, string Highlight);

    public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger("ContentBlockSeeder");

        var existingKeys = (await context.ContentBlocks.Select(b => b.Key).ToListAsync()).ToHashSet();

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var order = existingKeys.Count;
        var blocks = new List<ContentBlock>();

        void Text(string key, string pageGroup, string label, string value, string? help = null)
        {
            if (!existingKeys.Contains(key))
                blocks.Add(ContentBlock.CreateText(key, pageGroup, ContentValueType.PlainText, value, label, help, order++));
        }

        void Rich(string key, string pageGroup, string label, string value, string? help = null)
        {
            if (!existingKeys.Contains(key))
                blocks.Add(ContentBlock.CreateText(key, pageGroup, ContentValueType.RichText, value, label, help, order++));
        }

        void List(string key, string pageGroup, string label, List<string> value, string? help = null)
        {
            if (!existingKeys.Contains(key))
                blocks.Add(ContentBlock.CreateList(key, pageGroup, value, label, help, order++));
        }

        void Json<T>(string key, string pageGroup, string label, T value, string? help = null)
        {
            if (!existingKeys.Contains(key))
                blocks.Add(ContentBlock.CreateJson(key, pageGroup, JsonSerializer.Serialize(value, jsonOptions), label, help, order++));
        }

        // ==========================================
        // COMPANY GLOBAL FACTS & CONTACTS
        // ==========================================
        Text("company.legalName", "company", "Legal name", "Divine Flame and Energy International Limited");
        Text("company.shortName", "company", "Short name", "DF&E");
        Text("company.founded", "company", "Founded (year)", "2003");
        Text("company.headquarters", "company", "Headquarters", "Lagos, Nigeria");
        Text("company.fieldFacility", "company", "Field facility", "Port Harcourt, Nigeria");
        Text("company.headquartersAddress", "company", "Headquarters Address", "Plot 12, Commercial Block, Victoria Island, Lagos, Nigeria");
        Text("company.facilityAddress", "company", "Field Service & Workshop Address", "KM 20, Aba Port-Harcourt Express Way, By Timber Bus Stop, Oyigbo, Port-Harcourt, Nigeria");
        List("company.contactPhones", "company", "Contact Phone Numbers", ["+234 810 500 0092 / 93", "+234 812 904 3200", "+234 803 301 9612"]);
        Text("company.personnelCount", "company", "Personnel count", "69");
        Text("company.tagline", "company", "Tagline", "Local Might with Global Reach.");
        Rich("company.about", "company", "About (short)",
            "Divine Flame and Energy International Limited is an ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified Nigerian oil & gas servicing company specializing in wellhead & Xmas trees (surface & subsea), wellhead control panels, choke valves, actuators, and equipment preservation.");
        Rich("company.aboutExtended", "company", "About (extended)",
            "Established in 2003 with corporate headquarters in Lagos and a world-class 1,500m² field service and warehousing facility in Port Harcourt, DF&E is proud to lead the Nigerian local content narrative through high-precision engineering, OEM partnerships, and reliable field deployment.");
        Text("company.facility.workshopArea", "company", "Workshop area", "1,500m²");
        Text("company.facility.warehouseArea", "company", "Warehouse area", "1,500m²");
        Text("company.facility.warehouseNote", "company", "Warehouse note", "climate-controlled room for elastomer storage with over $10M inventory capacity");
        Text("company.facility.hydroTesting", "company", "Hydro testing range", "0–30,000psi");
        List("company.facility.capabilities", "company", "Facility capabilities", [
            "Equipment & Spares Management System",
            "0–30,000psi Hydrostatic and Gas testing capabilities",
            "Overhead crane & heavy lifting facilities",
            "Climate-controlled storage for seals and elastomers",
            "Complete Blasting, Buffing & Painting suite",
            "24/7 Field Service Support & Rapid Mobilization",
        ]);
        Json("company.heroStats", "company", "Hero stat callouts", new[]
        {
            new StatItem(69, "+", "Field Personnel"),
            new StatItem(1500, "m²", "Workshop Floor"),
            new StatItem(30000, "psi", "Hydro Testing"),
        });
        Json("company.stats", "company", "Stats band", new[]
        {
            new StatItem(2003, "", "Founded", IsYear: true),
            new StatItem(69, "+", "Personnel"),
            new StatItem(1500, "m²", "Workshop Floor"),
            new StatItem(30000, "psi", "Max Hydro Testing", Prefix: "0–"),
        });

        // ==========================================
        // HOMEPAGE EDITORIAL COPY
        // ==========================================
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
            new HeadlineJson("Engineering Discipline, ", "Local Delivery"));
        List("home.about.points", "home", "About section checklist", [
            "ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018 Certified",
            "100% Local Assemblage of Wellhead & Xmas Tree Equipment",
            "24/7 Field-Ready Technical Support & Mobilization",
            "Port Harcourt 1,500m² Field Service & Warehousing Facility",
        ]);
        Text("home.about.ctaLabel", "home", "About section button label", "Discover Our Services");
        Text("home.whyDfande.eyebrow", "home", "Why DF&E eyebrow", "Why DF&E");
        Json("home.whyDfande.headline", "home", "Why DF&E headline",
            new HeadlineJson("Reliable Engineering. ", "Proven Delivery."));
        Json("home.whyDfande.features", "home", "Why DF&E feature cards", new[]
        {
            new FeatureItem("wrench", "Local Assemblage Capability",
                "100% local assemblage and pressure testing of wellhead and Xmas tree equipment at our Port Harcourt facility."),
            new FeatureItem("clock", "24/7 Field-Ready Support",
                "Dedicated aftermarket support services, available around the clock for onshore, offshore and swamp deployments."),
            new FeatureItem("shield", "ISO-Certified Discipline",
                "Operations run on ISO 9001, ISO 14001 and ISO 45001 management systems, aligned to API-6A, API-6D and API SPEC Q2."),
        });
        Text("home.facility.eyebrow", "home", "Facility section eyebrow", "Port Harcourt Facility");
        Text("home.facility.headline", "home", "Facility section headline", "Field Service & Warehousing Facility");
        Rich("home.facility.intro", "home", "Facility section intro",
            "A fully operational 1,500m² field service & warehousing facility equipped for local assemblage, testing, valve overhaul and rapid dispatch.");
        Text("home.certificationsStrip.eyebrow", "home", "Certifications strip eyebrow", "HSE & Quality");
        Text("home.certificationsStrip.headline", "home", "Certifications strip headline", "Certified Discipline");
        Rich("home.certificationsStrip.intro", "home", "Certifications strip intro",
            "Operations run on proven industry practice, aligned to international ISO management systems and API engineering standards.");
        Text("home.ctaBand.headline", "home", "CTA band headline",
            "Engineering challenge? Talk to DF&E about your next wellhead, valve or preservation project.");
        Text("home.ctaBand.ctaLabel", "home", "CTA band button label", "Contact Us");
        Text("home.partners.eyebrow", "home", "Partners strip eyebrow", "Trusted By Nigeria's Leading Operators");

        // ==========================================
        // ABOUT PAGE & KEY MILESTONES / NCECS
        // ==========================================
        Text("about.pageHeader.eyebrow", "about", "Page header eyebrow", "About Us");
        Text("about.pageHeader.title", "about", "Page header title", "Engineering Discipline, Local Delivery");
        Rich("about.pageHeader.description", "about", "Page header description",
            "Divine Flame and Energy International Limited — a Nigerian-owned, ISO-certified oil & gas servicing company built around wellhead, Xmas tree and choke valve equipment.");
        Text("about.headline", "about", "Who We Are headline", "Local Might, Global Reach");
        Rich("about.facility.intro", "about", "Facility section intro",
            "A fully operational field service & warehousing facility, equipped for local assemblage, testing and repair — {{company.facility.warehouseArea}} of warehouse space including a {{company.facility.warehouseNote}}.");

        Json("about.milestones", "about", "Key Milestones & NCEC Accreditations", new[]
        {
            new MilestoneItem("2015", "Agbami Subsea Choke Refurbishment",
                "Successfully executed the inspection, strip-down, retrofitting, and high-pressure testing of Chevron Agbami field subsea choke valves in-country.",
                "Subsea Milestone"),
            new MilestoneItem("2018", "Surface Choke Assemblage & Refurbishment",
                "Pioneered full in-country assemblage, seat replacement, actuator recalibration, and recertification for major Nigerian JV assets.",
                "Valves Milestone"),
            new MilestoneItem("2020", "Local Wellhead Equipment Assemblage & Testing",
                "Achieved 100% in-country assemblage and Factory Acceptance Testing (FAT/SIT) for wellhead & Xmas tree equipment up to 15,000psi in Port Harcourt.",
                "Local Content"),
            new MilestoneItem("2022", "NCEC for Fabrication and Construction (Category 1)",
                "Awarded Nigerian Content Equipment Certificate (NCEC) for fabrication, structural assemblage, and mechanical integration.",
                "NCDMB Accredited"),
            new MilestoneItem("2023", "NCEC for Services and Support (Category 1)",
                "Certified for provision of well services, maintenance, valve recertification, and intervention engineering.",
                "NCDMB Accredited"),
            new MilestoneItem("2024", "NCEC for Procurement and Supply (Category 1)",
                "Certified by NCDMB as a premier Nigerian supplier of wellhead equipment, choke valves, actuators, and critical oilfield materials.",
                "NCDMB Accredited"),
        });

        // ==========================================
        // CERTIFICATIONS & POLICY DOCUMENTS
        // ==========================================
        Text("certifications.pageHeader.eyebrow", "certifications", "Page header eyebrow", "HSE & Quality");
        Text("certifications.pageHeader.title", "certifications", "Page header title", "Certified Discipline");
        Rich("certifications.pageHeader.description", "certifications", "Page header description",
            "Operations run on proven industry practice, certified under ISO 9001, ISO 14001, and ISO 45001 management systems, and aligned to API-6A, API-6D and API SPEC Q2 standards.");

        Json("certifications.items", "certifications", "ISO Certifications List", new[]
        {
            new CertItem("ISO 9001:2015", "Quality Management System",
                "Certified standard for quality management systems ensuring consistent high-precision engineering and customer satisfaction.",
                "iso-9001-certificate"),
            new CertItem("ISO 14001:2015", "Environmental Management System",
                "Certified framework for reducing environmental footprint and maintaining sustainable operations across all workshops and sites.",
                "iso-14001-certificate"),
            new CertItem("ISO 45001:2018", "Occupational Health & Safety",
                "Certified occupational health and safety management system ensuring zero-harm operations and personnel wellbeing.",
                "iso-45001-certificate"),
        });

        List("certifications.standards", "certifications", "Aligned API Standards",
            ["API SPEC Q2 (Quality Management for Service Supply)", "API-6A (Wellhead & Tree Equipment)", "API-6D (Pipeline & Piping Valves)", "API-17D (Subsea Wellhead & Tree Equipment)"]);

        Text("certifications.hsePolicy.headline", "certifications", "HSE Policy Headline", "Health, Safety & Environment Policy");
        Rich("certifications.hsePolicy.body", "certifications", "HSE Policy Statement",
            "Divine Flame and Energy International Limited is committed to conducting all business operations with utmost respect for human health, safety, and environmental conservation. Our Goal is Zero Accidents, Zero Harm to People, and Zero Damage to the Environment.");
        Text("certifications.hsePolicy.documentSlug", "certifications", "HSE Policy Document Slug", "hse-policy-statement");

        Text("certifications.qualityPolicy.headline", "certifications", "Quality Policy Headline", "Corporate Quality Policy");
        Rich("certifications.qualityPolicy.body", "certifications", "Quality Policy Statement",
            "DF&E delivers engineering excellence and procurement precision that consistently meet or exceed international regulatory standards and client specifications through continual improvement of our ISO 9001:2015 quality management system.");
        Text("certifications.qualityPolicy.documentSlug", "certifications", "Quality Policy Document Slug", "quality-policy-statement");

        // ==========================================
        // PRESERVATION SERVICES CASE STUDIES (PPTX)
        // ==========================================
        Json("services.preservation.caseStudies", "services", "Preservation Field Case Studies", new[]
        {
            new CaseStudyItem("ExxonMobil Nigeria",
                "Preservation of Outdoor & Sheltered Equipment (Onne Shorebase & USAN)",
                "/images/preservation-exxon-before.jpg",
                "/images/preservation-exxon-after.jpg",
                "Visual inspection, cleaning, de-rusting, buffing, greasing, and application of Guardian protective barrier solution for prolonged subsea and surface assets."),
            new CaseStudyItem("ExxonMobil Malaysia",
                "Preservation of Xmas Tree Equipment & Halliburton Screens",
                "/images/preservation-xmas-before.jpg",
                "/images/preservation-xmas-after.jpg",
                "Full strip-down buffing and climate barrier preservation of complex completion screens and tree valves."),
            new CaseStudyItem("EOG Resources",
                "Preservation of Wellhead Running Tools & High-Pressure Assemblies",
                "/images/preservation-tools-before.jpg",
                "/images/preservation-tools-after.jpg",
                "Application of durable custom grommet, strap, and 10-year life jacket solutions preventing atmospheric corrosion."),
        });

        // ==========================================
        // FAQS KNOWLEDGE BASE
        // ==========================================
        Json("faq.items", "faq", "Frequently Asked Questions", new[]
        {
            new FaqItem("What are DF&E's primary service capabilities?",
                "DF&E specializes in procurement, supply, installation, testing, repairs and maintenance of wellheads & Xmas trees, surface & subsea choke valves, wellhead control panels, fishing & re-entry tools, sealant injection, and oilfield equipment preservation.",
                "Capabilities"),
            new FaqItem("Where is DF&E's field workshop facility located?",
                "Our 1,500m² field facility is located at Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, equipped with high-pressure hydro testing bays up to 30,000psi and climate-controlled elastomer storage.",
                "Facilities"),
            new FaqItem("Is DF&E fully certified and Nigerian Content compliant?",
                "Yes. DF&E is ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified, and holds Category 1 NCEC certificates for Fabrication, Services, and Procurement issued by the NCDMB.",
                "Compliance"),
            new FaqItem("Can DF&E mobilize on short notice for emergency valve or wellhead repairs?",
                "Yes. We operate a 24/7 technical support team and maintain rapid mobilization protocols for onshore, swamp, and offshore facilities across the Niger Delta.",
                "Field Support"),
            new FaqItem("How does the Equipment Preservation solution work?",
                "We utilize Guardian protective solutions and custom heavy-duty barrier wraps that purge moisture, resist UV exposure, and extend equipment shelf-life up to 10+ years without permanent modification.",
                "Preservation"),
        });

        // ==========================================
        // CAREERS
        // ==========================================
        Text("careers.pageHeader.eyebrow", "careers", "Page header eyebrow", "Careers");
        Text("careers.pageHeader.title", "careers", "Page header title", "Build Your Career With DF&E");
        Rich("careers.pageHeader.description", "careers", "Page header description",
            "We are a Nigerian-owned oil & gas servicing company built on local engineering capability — and we are always interested in hearing from talented professionals.");
        Json("careers.values", "careers", "Values cards", new[]
        {
            new FeatureItem("wrench", "Hands-On Engineering",
                "Field service personnel work directly on wellhead, Xmas tree and choke valve equipment — local assemblage, not just installation."),
            new FeatureItem("shield", "Safety-First Culture",
                "Every role operates under ISO 9001, ISO 14001 and ISO 45001 management systems — safety is a core discipline."),
            new FeatureItem("users", "24/7 Field Readiness",
                "A team of 69+ highly competent personnel, ready for onshore and offshore deployment."),
        });
        Text("careers.openings.eyebrow", "careers", "Openings eyebrow", "Current Openings");
        Text("careers.openings.headline", "careers", "Openings headline", "Join Our Talent Network");
        Rich("careers.openings.body", "careers", "Openings body",
            "We are always interested in hearing from qualified wellhead engineers, valve technicians, and procurement specialists. Submit your CV to our talent database for consideration as new projects commence.");
        Text("careers.openings.ctaLabel", "careers", "Openings button label", "Email Your CV");
        Text("careers.openings.contactEmail", "careers", "Openings contact email", "careers@dfande.com");

        // ==========================================
        // PARTNERS & CLIENTS
        // ==========================================
        Json("partners.majorPartners", "partners", "OEM partner logos", new[]
        {
            new CustomerItem("Ameriforge", "/images/partner-ameriforge.png"),
            new CustomerItem("FMC Technologies", "/images/partner-fmc-technologies.png"),
            new CustomerItem("GE Oil & Gas", "/images/partner-ge-oil-gas.png"),
            new CustomerItem("Master Flo", "/images/partner-masterflo.png"),
            new CustomerItem("National Oilwell Varco", "/images/partner-nov.png"),
            new CustomerItem("Southern California Valve", "/images/partner-scv.png"),
            new CustomerItem("Weatherford", "/images/partner-weatherford.png"),
        });
        Json("partners.keyCustomers", "partners", "Key customer logos", new[]
        {
            new CustomerItem("Chevron", "/images/partner-chevron.png"),
            new CustomerItem("Shell", "/images/partner-shell.png"),
            new CustomerItem("ExxonMobil", "/images/partner-exxonmobil.png"),
            new CustomerItem("TotalEnergies", "/images/partner-total.png"),
            new CustomerItem("Seplat Energy", "/images/partner-seplat.png"),
            new CustomerItem("Addax Petroleum", "/images/partner-addax.png"),
            new CustomerItem("Agip", "/images/partner-agip.png"),
            new CustomerItem("Daewoo Nigeria", "/images/partner-daewoo.png"),
            new CustomerItem("NNPC E&P", "/images/partner-nnpc.png"),
        });

        context.ContentBlocks.AddRange(blocks);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} content blocks", blocks.Count);
    }
}
