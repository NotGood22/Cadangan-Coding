import { z } from "zod";

export const FormCourseTypeSchema = z.object({
  description: z
    .string({
      required_error: "Description harus diisi",
    })
    .min(1, {
      message: "Description harus diisi",
    }),
  name: z
    .string({
      required_error: "Nama jenis kursus harus diisi",
    })
    .min(1, {
      message: "Nama jenis kursus harus diisi",
    }),
});

export type FormCourseTypeType = z.infer<typeof FormCourseTypeSchema>;
