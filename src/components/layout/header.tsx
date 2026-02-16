"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
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
          ? "bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm dark:bg-black dark:bg-none dark:border-neon-cyan/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
          <div className="relative">
            <Logo className="h-14 w-14 text-primary dark:text-neon-cyan transition-transform group-hover:rotate-12 duration-300" />
            <div className="absolute inset-0 blur-md bg-primary/20 dark:bg-neon-cyan/20 group-hover:bg-primary/40 dark:group-hover:bg-neon-cyan/40 transition-all duration-300" />
          </div>
          <span className="font-headline text-2xl font-bold text-foreground relative">
            Arcay3D<span className="gradient-text dark:gradient-text-cyan-purple">labs</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-all hover:text-primary dark:hover:text-neon-cyan relative group"
              prefetch={false}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan-400 dark:from-neon-cyan dark:to-neon-cyan transition-all group-hover:w-full dark:shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <CartSheet />
          <ThemeToggle />
          <Button asChild className="gradient-primary dark:bg-none dark:gradient-cyan dark:text-black dark:hover:bg-cyan-400 shadow-glow hover:shadow-glow-lg dark:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300">
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
                  <Logo className="h-14 w-14 text-primary dark:text-neon-cyan" />
                  <span className="font-headline text-2xl font-bold text-foreground">
                    Arcay3Dlabs
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary dark:hover:text-neon-cyan"
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button asChild className="mt-4 dark:bg-neon-cyan dark:text-black">
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
