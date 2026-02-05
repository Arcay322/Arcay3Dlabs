'use client';

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  const formattedTotal = formatPrice(totalPrice);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 gradient-primary animate-pulse"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Carrito de Compras
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems} {totalItems === 1 ? 'item' : 'items'}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 bg-secondary/20">
              <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-code font-bold mb-2 uppercase tracking-widest text-muted-foreground">ESTADO: INACTIVO</h3>
            <p className="text-xs font-code text-muted-foreground text-center mb-8 uppercase">
              [No se detectan componentes en el área]
            </p>
            <Button asChild onClick={() => setOpen(false)} className="font-code uppercase tracking-wider" size="lg">
              <Link href="/tienda">
                {'>'} Explorar Catálogo
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const formattedPrice = formatPrice(itemTotal);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border border-border bg-background hover:border-primary/50 transition-colors group relative border-layered"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 border border-border overflow-hidden flex-shrink-0 bg-secondary/50">
                        <Image
                          src={item.images[0] || '/placeholder-product.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-headline font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors uppercase">
                              {item.name}
                            </h4>
                          </div>

                          <p className="text-[10px] font-code text-muted-foreground mb-2 flex gap-2">
                            <span className="opacity-75">CAT: {item.category}</span>
                            <span>|</span>
                            <span className="opacity-75">MAT: {item.material}</span>
                          </p>
                        </div>

                        <div className="flex items-end justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-border bg-secondary/20">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-code font-medium w-8 text-center bg-background border-x border-border h-6 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none hover:bg-primary hover:text-primary-foreground"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-code font-bold text-sm text-primary">{formattedPrice}</p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-muted-foreground font-code">
                                {formatPrice(item.price)} / UNIDAD
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive rounded-none shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              {/* Subtotal */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-sm text-muted-foreground">Calculado en checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="gradient-text dark:gradient-text-cyan">{formattedTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  asChild
                  className="w-full gradient-primary shadow-glow dark:bg-none dark:gradient-cyan dark:text-black"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout" className="flex items-center gap-2">
                    Proceder al Pago
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/tienda">
                    Continuar Comprando
                  </Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
