import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("relative aspect-square", className)}>
            <Image
                src="/images/a3dl_logo.webp"
                alt="Arcay3Dlabs Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
