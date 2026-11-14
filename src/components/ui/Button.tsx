import { type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

type AnchorProps = Omit<ButtonProps, "type">;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-purple text-white shadow-[0_8px_20px_rgba(152,120,232,0.28)] hover:bg-[#8868dc] hover:-translate-y-px",
  ghost: "bg-transparent text-ink hover:text-purple",
  outline: "border border-border bg-white text-ink hover:border-purple hover:text-purple",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[13px]",
  md: "h-11 px-6 text-sm",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "sm",
  href,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-pill font-medium tracking-wide transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/40",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    const { disabled, ...anchorProps } = props as AnchorProps;
    return (
      <a
        href={href}
        className={cn(classes, disabled && "pointer-events-none opacity-60")}
        onClick={anchorProps.onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
