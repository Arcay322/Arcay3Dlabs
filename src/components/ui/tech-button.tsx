import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"

const techButtonVariants = cva(
    "relative overflow-hidden transition-all duration-300 group font-bold tracking-wide [&>*]:relative [&>*]:z-10",
    {
        variants: {
            techVariant: {
                "neon-cyan":
                    "bg-neon-cyan text-black border-none hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:-translate-y-0.5",
                "neon-purple":
                    "bg-neon-purple text-white border-none hover:bg-purple-600 shadow-[0_0_15px_rgba(189,0,255,0.3)] hover:shadow-[0_0_25px_rgba(189,0,255,0.6)] hover:-translate-y-0.5",
                "glass":
                    "bg-black/40 text-white border border-white/20 backdrop-blur-md hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                "outline-cyan":
                    "bg-transparent text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]",
                "outline-purple":
                    "bg-transparent text-neon-purple border border-neon-purple/50 hover:bg-neon-purple/10 hover:border-neon-purple hover:shadow-[0_0_10px_rgba(189,0,255,0.2)]",
                "ghost-tech":
                    "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
            },
            glow: {
                true: "after:absolute after:inset-0 after:rounded-md after:shadow-[0_0_15px_inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:z-0",
                false: ""
            },
            printing: {
                true: "before:absolute before:inset-0 before:bg-white/20 before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-out before:z-0",
                false: ""
            }
        },
        defaultVariants: {
            techVariant: "neon-cyan",
            glow: false,
            printing: false
        }
    }
)

export interface TechButtonProps extends ButtonProps, VariantProps<typeof techButtonVariants> {
    withGlitch?: boolean;
}

export const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
    ({ className, techVariant, glow, printing, withGlitch, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn(techButtonVariants({ techVariant, glow, printing }), className)}
                {...props}
            >
                {children}
            </Button>
        )
    }
)
TechButton.displayName = "TechButton"
