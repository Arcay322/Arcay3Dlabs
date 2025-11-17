"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#materiales", label: "Materiales" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "glass border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
          <div className="relative">
            <Box className="h-7 w-7 text-primary transition-transform group-hover:rotate-12 duration-300" />
            <div className="absolute inset-0 blur-md bg-primary/20 group-hover:bg-primary/40 transition-all duration-300" />
          </div>
          <span className="font-headline text-2xl font-bold text-foreground relative">
            Arcay3D<span className="gradient-text">labs</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-all hover:text-primary relative group"
              prefetch={false}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan-400 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <CartSheet />
          <Button asChild className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300">
            <Link href="#servicios">Cotizar Ahora</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <CartSheet />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="mb-4 flex items-center gap-2" prefetch={false}>
                  <Box className="h-7 w-7 text-primary" />
                  <span className="font-headline text-2xl font-bold text-foreground">
                    Arcay3Dlabs
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button asChild className="mt-4">
                  <Link href="#servicios">Cotizar Ahora</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
