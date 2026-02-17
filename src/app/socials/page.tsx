import Link from "next/link";
import { Facebook, Instagram, Phone, Home, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// TikTok Icon Component since it's not in Lucide
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
    );
}

export default function SocialsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
            <div className="w-full max-w-md space-y-8 text-center animate-fadeIn">
                {/* Brand Header */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <Logo className="h-32 w-32 text-primary dark:text-neon-cyan transition-transform group-hover:rotate-12 duration-500" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 dark:bg-neon-cyan/20 group-hover:bg-primary/40 dark:group-hover:bg-neon-cyan/40 transition-all duration-500" />
                    </div>
                    <h1 className="font-headline text-4xl font-bold text-foreground">
                        Arcay<span className="gradient-text dark:gradient-text-cyan-purple">3D</span>Labs
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xs mx-auto">
                        {siteConfig.description}
                    </p>
                </div>

                {/* Social Links */}
                <div className="grid gap-4 w-full px-4">



                    {/* 1. TikTok (Top) */}
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 w-full text-lg justify-start gap-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group relative overflow-hidden"
                    >
                        <Link
                            href={siteConfig.social.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <TikTokIcon className="h-6 w-6" />
                            <span className="font-semibold">TikTok</span>
                        </Link>
                    </Button>

                    {/* 2. Instagram */}
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 w-full text-lg justify-start gap-4 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white hover:border-transparent transition-all duration-300 group relative overflow-hidden"
                    >
                        <Link
                            href={siteConfig.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Instagram className="h-6 w-6" />
                            <span className="font-semibold">Instagram</span>
                        </Link>
                    </Button>

                    {/* 3. Facebook */}
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 w-full text-lg justify-start gap-4 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 group relative overflow-hidden"
                    >
                        <Link
                            href={siteConfig.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Facebook className="h-6 w-6" />
                            <span className="font-semibold">Facebook</span>
                        </Link>
                    </Button>

                    {/* 4. WhatsApp (Bottom) */}
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 w-full text-lg justify-start gap-4 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 group relative overflow-hidden"
                    >
                        <Link
                            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Phone className="h-6 w-6" />
                            <span className="font-semibold">WhatsApp</span>
                        </Link>
                    </Button>

                </div>

                {/* Spacer */}
                <div className="h-8" />

                {/* Back to Home */}
                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <Button
                        asChild
                        className="h-14 text-lg gradient-primary dark:bg-none dark:gradient-cyan dark:text-black shadow-glow hover:shadow-glow-lg transition-all duration-300 group relative overflow-hidden"
                    >
                        <Link href="/tienda">
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Ver Catálogo
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="secondary"
                        className="h-14 text-lg border-2 border-primary/20 hover:border-primary/50 transition-all duration-300"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Ir al Inicio
                        </Link>
                    </Button>
                </div>

                {/* Footer */}
                <p className="text-sm text-muted-foreground pt-8">
                    &copy; {new Date().getFullYear()} Arcay3DLabs
                </p>
            </div>
        </div>
    );
}
