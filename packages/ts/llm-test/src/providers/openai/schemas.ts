import { z } from 'zod';
import { FunctionSchema } from '../../core/types';

const functionParameterSchema = z.object({
  type: z.literal('object'),
  properties: z.record(z.any()),
  required: z.array(z.string()).optional(),
});

const functionSchemaValidator = z.object({
  name: z.string(),
  description: z.string().optional(),
  parameters: functionParameterSchema,
});

export function validateFunctionSchema(schema: FunctionSchema): { valid: boolean; errors?: string[] } {
  const result = functionSchemaValidator.safeParse(schema);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
    };
  }

  return { valid: true };
}