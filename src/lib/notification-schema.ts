import { z } from "zod";

export const subscribeEmailSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
});
