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
import { useState } from 'react';

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  const formattedTotal = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
  }).format(totalPrice);

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
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Agrega productos de nuestra tienda para comenzar
            </p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/tienda">
                Explorar Productos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const formattedPrice = new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(itemTotal);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-lg border hover:border-primary/50 transition-colors group"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={item.images[0] || '/placeholder-product.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.category} • {item.material}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-sm gradient-text dark:gradient-text-cyan">{formattedPrice}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                ${item.price.toFixed(2)} c/u
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
