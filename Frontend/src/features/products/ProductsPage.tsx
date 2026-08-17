import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { useGetPublishedProductsQuery } from "./api/productsApi";
import { CheckCircle2, Package, Layers, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetPublishedProductsQuery();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = !products
    ? []
    : activeCategory === "all"
    ? products
    : products.filter((p) => p.slug === activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="Equipment & Material Supply"
        title="Wellhead, Choke Valves &amp; Oilfield Products"
        description="Competitive procurement solutions and smart supply chain networks tailored to OPEX and CAPEX requirements for onshore and offshore energy production facilities."
      />

      <Container className="py-16 md:py-20">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-dark border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-sm text-danger">
            Couldn't load products catalog from the database. Please try again shortly.
          </div>
        )}

        {products && (
          <>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    activeCategory === "all"
                      ? "bg-gold text-gold-ink shadow-sm"
                      : "border border-line bg-white text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                  }`}
                >
                  All Product Families ({products.length})
                </button>
                {products.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setActiveCategory(p.slug)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                      activeCategory === p.slug
                        ? "bg-gold text-gold-ink shadow-sm"
                        : "border border-line bg-white text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-gold-dark">
                <Shield size={14} />
                <span>NCDMB Category 1 Sourced</span>
              </div>
            </div>

            {/* Product Families Cards List */}
            <div className="mt-10 space-y-12">
              {filteredProducts.map((family) => (
                <div
                  key={family.slug}
                  id={family.slug}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all hover:border-gold-dark"
                >
                  <div className="grid lg:grid-cols-12">
                    {/* Left/Top Media */}
                    <div className="relative bg-paper lg:col-span-5 min-h-[260px] overflow-hidden">
                      {family.imageUrl ? (
                        <img
                          src={family.imageUrl}
                          alt={family.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-8 text-steel">
                          <Package size={48} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 rounded-full bg-void/80 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                        Engineered Equipment
                      </div>
                    </div>

                    {/* Right/Bottom Content */}
                    <div className="flex flex-col justify-between p-8 lg:col-span-7">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark">
                          <Layers size={14} />
                          <span>Product Line</span>
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-ink">{family.title}</h2>
                        
                        <div className="mt-6">
                          <div className="text-xs font-bold uppercase tracking-wider text-steel mb-3">
                            Configurations &amp; Scope of Supply:
                          </div>
                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {family.items.map((item) => (
                              <div key={item} className="flex items-start gap-2 text-xs text-ink-soft">
                                <CheckCircle2 size={15} className="text-gold-dark flex-none mt-0.5" />
                                <span className="font-medium leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {family.application && (
                          <div className="mt-6 rounded-xl bg-paper-raised p-4 border border-line/80">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-steel block">Target Applications:</span>
                            <p className="mt-1 text-xs font-semibold text-ink">{family.application}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-steel">
                          Available for immediate dispatch &amp; long-lead campaign scheduling.
                        </div>
                        <Button href="/contact" variant="primary" className="text-xs">
                          Inquire for RFQ / Pricing
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
