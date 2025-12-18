import { cn } from "@/lib/utils";

interface TechLoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function TechLoader({ className, size = "sm" }: TechLoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />

            {/* Inner pulsing core (cube-like) */}
            <div className="w-1/2 h-1/2 bg-neon-purple rounded-sm animate-pulse shadow-[0_0_10px_rgba(189,0,255,0.5)]" />

            {/* Scanning line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-scan opacity-50" />

            <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
      `}</style>
        </div>
    );
}
