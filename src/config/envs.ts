import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
  })
  .passthrough();

type EnvsVars = z.infer<typeof envSchema>;

const { error, data } = envSchema.safeParse(process.env);

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const envs: EnvsVars = data;
