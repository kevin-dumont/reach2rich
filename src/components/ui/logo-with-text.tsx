import { cn } from "@/lib/utils";
import Logo from "./logo";

export default function LogoWithText({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div
      className={cn("flex items-center justify-center mb-6", {
        "gap-2": size === "md",
        "gap-3": size === "lg",
      })}
    >
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
          {
            "size-9 p-2": size === "md",
            "size-10 p-2": size === "lg",
          }
        )}
      >
        <Logo />
      </div>
      <div
        className={cn("grid flex-1 text-left leading-tight", {
          "text-xl": size === "md",
          "text-2xl": size === "lg",
        })}
      >
        <span className="truncate font-semibold">Reach2Rich</span>
      </div>
    </div>
  );
}
