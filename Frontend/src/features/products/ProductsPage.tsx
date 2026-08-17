import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { CtaBand } from "@/components/sections/CtaBand";
import { useGetPublishedProductsQuery } from "./api/productsApi";

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetPublishedProductsQuery();

  return (
    <>
      <PageHeader
        eyebrow="Equipment Supply"
        title="Wellhead & Oilfield Equipment"
        description="Competitive procurement and smart supply chain networks for onshore & offshore production facilities — supported by DF&E's own OPEX and CAPEX-aligned sourcing."
      />

      <Container className="py-16 md:py-20">
        {isLoading && <p className="text-sm text-ink-soft">Loading products…</p>}
        {isError && <p className="text-sm text-danger">Couldn't load products. Please try again shortly.</p>}

        {products && (
          <>
            <div className="flex items-end justify-between gap-6">
              <p className="text-sm font-bold uppercase tracking-wide text-steel">
                {products.length} Product {products.length === 1 ? "Family" : "Families"}
              </p>
              <p className="hidden text-xs uppercase tracking-wide text-steel md:block">Drag or use the arrows →</p>
            </div>

            <Carousel className="mt-6">
              {products.map((family) => (
                <CarouselItem
                  key={family.slug}
                  className="w-[86%] sm:w-[70%] lg:w-[54%]"
                >
                  <div className="grid h-full overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-2">
                    {family.imageUrl && (
                      <div className="aspect-[4/3] overflow-hidden sm:aspect-auto">
                        <img src={family.imageUrl} alt={family.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col p-7 md:p-8">
                      <h2 className="text-xl font-bold text-ink">{family.title}</h2>
                      <ul className="mt-5 space-y-2.5">
                        {family.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-ink-soft">
                            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-gold-dark" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {family.application && (
                        <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-wide text-steel">
                          Application: {family.application}
                        </p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
