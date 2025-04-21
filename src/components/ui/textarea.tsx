import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            placeholder=" "
            className={cn(
                "peer text-white/80 max-h-[300px] foreground placeholder:text-muted-foreground focus-visible:border focus-visible:border-accent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-4 text-base shadow-inset transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm styled-scrollbar",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
