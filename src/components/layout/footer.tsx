import Link from "next/link";
import { Instagram, Facebook, Mail, Clock, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// TikTok Icon Component
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

export function Footer() {
  return (
    <footer id="contacto" className="w-full bg-gradient-to-b from-secondary to-background dark:bg-none dark:bg-black border-t border-border/50 dark:border-white/10">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col items-start gap-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
              <div className="relative">
                <Logo className="h-20 w-20 text-primary dark:text-neon-cyan transition-transform group-hover:rotate-12 duration-300" />
                <div className="absolute inset-0 blur-md bg-primary/20 dark:bg-neon-cyan/20 group-hover:bg-primary/40 dark:group-hover:bg-neon-cyan/40 transition-all duration-300" />
              </div>
              <span className="font-headline text-2xl font-bold text-foreground">
                Arcay<span className="gradient-text dark:gradient-text-cyan-purple">3D</span>Labs
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Transformamos tus ideas en objetos reales con impresión 3D de alta precisión.
              Innovación, calidad y dedicación en cada proyecto.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {/* TikTok */}
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-110"
              >
                <Link href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer">
                  <TikTokIcon className="h-5 w-5" />
                </Link>
              </Button>

              {/* Instagram */}
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110"
              >
                <Link href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 hover:scale-110"
              >
                <Link href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Navegación</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#inicio" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-neon-cyan transition-colors relative inline-block w-fit group">
                Inicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="#tienda" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-neon-cyan transition-colors relative inline-block w-fit group">
                Tienda
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-neon-cyan transition-colors relative inline-block w-fit group">
                Servicios
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="#materiales" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-neon-cyan transition-colors relative inline-block w-fit group">
                Materiales
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="#galeria" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-neon-cyan transition-colors relative inline-block w-fit group">
                Galería
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Contacto</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary dark:text-neon-cyan mt-1" />
                <a
                  href="mailto:contacto@arcay3dlabs.com"
                  className="hover:text-primary dark:hover:text-neon-cyan transition-colors underline-offset-4 hover:underline"
                >
                  contacto@arcay3dlabs.com
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary dark:text-neon-cyan mt-1" />
                <span>Lun - Vie: 9:00 AM - 6:00 PM</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary dark:text-neon-cyan mt-1" />
                <span>Disponible en todo Perú</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Arcay<span className="gradient-text dark:gradient-text-cyan-purple">3D</span>Labs</span>.
              Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary dark:hover:text-neon-cyan transition-colors relative group">
                Política de Privacidad
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="#" className="hover:text-primary dark:hover:text-neon-cyan transition-colors relative group">
                Términos de Servicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
              <Link href="/admin" className="hover:text-primary dark:hover:text-neon-cyan transition-colors relative group">
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-neon-cyan transition-all group-hover:w-full" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
