import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"input"> {
    label?: string;
}

function AnimatedInput({ className, label, ...props }: TextareaProps) {

    const id = React.useId();
    
    return (
        <div className="relative">
            <input
                id={id}
                data-slot="textarea"
                placeholder=" "
                className={cn(
                    "peer text-white/80 foreground placeholder:text-muted-foreground focus-visible:border focus-visible:border-accent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-4 text-base shadow-input transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm styled-scrollbar",
                    className
                )}
                {...props}
            />
            {label && (
                <label
                    htmlFor={id}
                    className="absolute top-[50%] left-[20px] -translate-y-1/2 text-sm font-normal px-2 py-1 rounded-sm transition-all duration-200 ease-in-out cursor-text
                    text-white/50 peer-focus:text-white/70 
                    peer-focus:bg-[#2c2c2c] peer-focus:outline-1 peer-focus:outline-accent
                    peer-focus:top-0
                    peer-[&:not(:placeholder-shown)]:top-0
                    peer-[&:not(:placeholder-shown)]:bg-[#2c2c2c]
                    peer-[&:not(:placeholder-shown)]:outline-1
                    peer-[&:not(:placeholder-shown)]:outline-accent"
                >
                    {label}
                </label>
            )}
        </div>
    );
}

export { AnimatedInput };
