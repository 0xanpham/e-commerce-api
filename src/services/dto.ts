import { AnyObject, ObjectSchema, ValidationError } from "yup";
import { HttpException } from "../exceptions/exception";

async function validateDto(schema: ObjectSchema<AnyObject>, dto: any) {
  try {
    await schema.validate(dto);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new HttpException(400, error.message);
    } else {
      throw error;
    }
  }
}

export { validateDto };
