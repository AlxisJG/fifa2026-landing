"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/useProducts";
import { Reveal } from "@/components/ui/motion";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { createPaidPlan, setStoredPlan } from "@/lib/plan-storage";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export default function PlanesPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const router = useRouter();
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(isSubscriptionFunnelEnabled() ? "/suscribete" : "/");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <MarketingPageMain>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-white/50">Cargando...</p>
        </div>
      </MarketingPageMain>
    );
  }

  if (!user) return null;

  const handlePurchase = async (productId: number, productName: string) => {
    setPurchasing(true);
    setMessage("");
    const token = localStorage.getItem("fifapp_token");
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      const json = await res.json();
      if (json.success) {
        if (json.data.payment_url) {
          window.location.href = json.data.payment_url;
        } else {
          setStoredPlan(createPaidPlan(productName, productId));
          setMessage("Plan premium activado. Disfruta la transmisión sin anuncios.");
          router.push(isSubscriptionFunnelEnabled() ? "/transmision" : "/");
        }
      } else {
        setMessage(json?.data?.message || "Error al procesar la compra");
      }
    } catch {
      setMessage("Error de conexión al procesar la compra");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <MarketingPageMain>
      <section className="section-shell py-16">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-electric">
            Upgrade premium
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Elige tu plan</h1>
          <p className="mt-3 max-w-2xl text-base text-white/60">
            Ya tienes acceso con el plan gratis y anuncios. Mejora a premium para ver el Mundial 2026 sin anuncios.
          </p>
        </Reveal>

        <div className="mt-12">
          {productsLoading ? (
            <div className="mx-auto max-w-sm">
              <div className="h-80 animate-pulse rounded-3xl bg-white/5" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-white/40">No hay planes disponibles por ahora.</p>
          ) : (
            <div className="mx-auto flex max-w-sm flex-col gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="theater-dark glass-heavy relative overflow-hidden rounded-3xl border border-electric/20 p-8 shadow-[0_0_40px_rgba(70,210,255,0.08)]"
                >
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">{product.access.days} días de acceso</p>
                    <h2 className="mt-2 text-2xl font-semibold">{product.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{product.short_description}</p>
                    <div className="my-6 border-t border-white/10" />
                    <p className="text-4xl font-bold">
                      {product.currency === "DOP" ? "RD$" : "$"}
                      {product.price.toLocaleString()}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={purchasing}
                      onClick={() => handlePurchase(product.id, product.name)}
                      className="mt-6 w-full rounded-full bg-electric py-3 text-sm font-semibold text-midnight transition hover:brightness-110 disabled:opacity-50"
                    >
                      {purchasing ? "Procesando..." : "Comprar ahora"}
                    </motion.button>
                    {message && <p className="mt-4 text-center text-xs text-white/50">{message}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketingPageMain>
  );
}
