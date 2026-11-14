import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "center" | "start";
}

export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-start", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium text-purple">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
    </div>
  );
}
