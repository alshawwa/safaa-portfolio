import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";

export function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("language.switchTo")}
      className={cn(
        "inline-flex items-center rounded-pill border border-border bg-white/80 p-0.5 text-[11px] font-semibold tracking-[0.08em]",
        className,
      )}
    >
      {(["en", "ar"] as const).map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={cn(
              "rounded-pill px-2.5 py-1 transition-colors duration-300 ease-smooth",
              active ? "bg-purple text-white" : "text-muted hover:text-ink",
            )}
          >
            {t(`language.${code}`)}
          </button>
        );
      })}
    </div>
  );
}
