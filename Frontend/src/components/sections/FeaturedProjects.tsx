import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetPublishedProjectsQuery } from "@/features/projects/api/projectsApi";

export function FeaturedProjects() {
  const { data: projects } = useGetPublishedProjectsQuery();
  const featured = projects?.filter((p) => p.isFeatured);

  return (
    <section className="bg-paper-raised py-20 md:py-28">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <Reveal className="max-w-[60ch]">
            <p className="eyebrow text-gold-dark">Field Record</p>
            <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">Featured Projects</h2>
          </Reveal>
          <a href="/projects" className="hidden text-xs font-bold uppercase tracking-wide text-gold-dark md:block">
            View all projects →
          </a>
        </div>

        {/* Guarded on `featured` — see ProjectsPage.tsx for why StaggerGroup
            must not mount before its data has arrived. */}
        {featured && (
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
            {featured.map((project) => (
              <StaggerItem
                key={project.id}
                className="group rounded-2xl border border-line p-7 transition-colors hover:border-gold-dark"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-gold-dark">{project.year}</p>
                <h3 className="mt-2 text-lg font-bold text-ink">{project.client}</h3>
                <p className="mt-2 text-sm text-ink-soft">{project.scope}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-steel">{project.location}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </Container>
    </section>
  );
}
