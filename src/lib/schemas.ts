import { z } from "zod";

export const quoteFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }).max(500, { message: "La descripción no puede exceder los 500 caracteres." }),
  file: z
    .any()
    .refine((file) => file?.name, "El archivo es requerido.")
    .refine((file) => file?.size <= 5000000, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (file) => ["stl", "obj"].includes(file?.name.split(".").pop().toLowerCase()),
      "Solo se admiten formatos .stl y .obj."
    ).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
