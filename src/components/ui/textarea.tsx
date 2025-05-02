import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  loading,
  ...props
}: React.ComponentProps<"textarea"> & { loading?: boolean }) {
  return (
    <div className="relative">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          {
            "opacity-50": loading,
          }
        )}
        {...(loading ? { disabled: true, placeholder: "" } : props)}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
    </div>
  );
}

export { Textarea };
