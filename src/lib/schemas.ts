import { z } from "zod";

export const quoteFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  phone: z.string().min(10, { message: "Por favor, introduce un teléfono válido." }).optional(),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }).max(500, { message: "La descripción no puede exceder los 500 caracteres." }),
  material: z.enum(["PLA", "ABS", "PETG", "Resina", "TPU", "Otro"], {
    required_error: "Por favor, selecciona un material.",
  }),
  quantity: z.number().min(1, { message: "La cantidad debe ser al menos 1." }).max(1000, { message: "La cantidad máxima es 1000." }),
  file: z
    .any()
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= 50000000, `El tamaño máximo del archivo es 50MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ["stl", "obj", "3mf", "gcode"].includes(files?.[0]?.name.split(".").pop()?.toLowerCase()),
      "Solo se admiten formatos .stl, .obj, .3mf, .gcode."
    )
    .optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
