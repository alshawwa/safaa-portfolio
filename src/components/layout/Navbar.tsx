import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/data/designer";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { cn } from "@/lib/cn";

export function Navbar() {
  const { t } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 pt-4 sm:pt-6">
      <Container>
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-3 rounded-pill border border-white/70 bg-white/70 px-4 py-2.5 shadow-soft backdrop-blur-md sm:px-6"
        >
          <a
            href="#home"
            className="shrink-0 text-[15px] font-semibold tracking-tight text-ink transition-colors duration-300 hover:text-purple"
          >
            {t("brand")}
          </a>

          <ul className="hidden items-center gap-1 text-[13px] font-medium text-muted md:flex">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.id} className="flex items-center">
                {index > 0 ? (
                  <span className="mx-2 h-1 w-1 rounded-full bg-pink/80" aria-hidden />
                ) : null}
                <a
                  href={item.href}
                  className="rounded-pill px-2 py-1 text-ink/80 transition-colors duration-300 ease-smooth hover:text-purple"
                >
                  {t(`nav.${item.id}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitch className="hidden sm:inline-flex" />
            <Button href="#contact" className="hidden sm:inline-flex">
              {t("nav.contact")}
            </Button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <Container className="pt-2">
              <div className="rounded-3xl border border-border bg-white/95 p-4 shadow-soft">
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "block rounded-2xl px-3 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-cream hover:text-purple",
                        )}
                      >
                        {t(`nav.${item.id}`)}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <LanguageSwitch />
                  <Button href="#contact" onClick={close}>
                    {t("nav.contact")}
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
