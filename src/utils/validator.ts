import { ZodError } from "zod";
import { loginSchema } from "../schema/login.schema";

// Field-level validator for AntD <Form.Item>
export const zodValidator =
  (field: keyof typeof loginSchema.shape) => async (_: any, value: any) => {
    try {
      loginSchema.pick({ [field]: true }).parse({ [field]: value });
      return Promise.resolve();
    } catch (err) {
      if (err instanceof ZodError) {
        return Promise.reject(err.issues[0].message);
      }
      return Promise.reject("Invalid value");
    }
  };
