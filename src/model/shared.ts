import { ZodDate, ZodNumber, ZodObject } from "zod";

export const getCreateSchema = <
  T extends { id: ZodNumber; updatedAt: ZodDate; createdAt: ZodDate },
>(
  model: ZodObject<T>,
) => {
  return model.omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  });
};

export const getUpdateSchema = <
  T extends { id: ZodNumber; updatedAt: ZodDate; createdAt: ZodDate },
>(
  model: ZodObject<T>,
) => {
  return model
    .omit({
      createdAt: true,
      updatedAt: true,
    })
    .partial()
    .required({ id: true });
};
