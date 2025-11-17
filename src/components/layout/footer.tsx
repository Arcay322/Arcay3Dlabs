import Link from "next/link";
import { Cube, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer id="contacto" className="w-full bg-secondary py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Cube className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground">
              Arcay3Dlabs
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Impresión 3D de precisión para tus ideas más ambiciosas.
          </p>
        </div>
        <div className="grid gap-4">
          <h4 className="font-headline text-lg font-semibold">Navegación</h4>
          <div className="grid grid-cols-2 gap-2">
            <Link href="#inicio" className="text-sm text-muted-foreground hover:text-primary">Inicio</Link>
            <Link href="#tienda" className="text-sm text-muted-foreground hover:text-primary">Tienda</Link>
            <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary">Servicios</Link>
            <Link href="#materiales" className="text-sm text-muted-foreground hover:text-primary">Materiales</Link>
            <Link href="#galeria" className="text-sm text-muted-foreground hover:text-primary">Galería</Link>
          </div>
        </div>
        <div className="grid gap-4">
          <h4 className="font-headline text-lg font-semibold">Contacto y Redes</h4>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" target="_blank"><Instagram className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" target="_blank"><Linkedin className="h-5 w-5" /></Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Email: <a href="mailto:contacto@arcay3dlabs.com" className="underline hover:text-primary">contacto@arcay3dlabs.com</a>
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-8 border-t pt-6 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>&copy; {new Date().getFullYear()} Arcay3Dlabs. Todos los derechos reservados.</p>
            <div className="flex gap-4">
                <Link href="#" className="hover:text-primary">Política de Privacidad</Link>
                <Link href="#" className="hover:text-primary">Términos de Servicio</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
