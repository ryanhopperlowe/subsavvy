import { ZodDate, ZodNumber, ZodObject, ZodString, z } from "zod";

export const getCreateSchema = <
  T extends { id: ZodString; updatedAt: ZodDate; createdAt: ZodDate },
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
  T extends { id: ZodString; updatedAt: ZodDate; createdAt: ZodDate },
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

type ReplaceNestedType<Type, TFind, TReplace> = {
  [Key in keyof Type]: Type[Key] extends TFind
    ? TReplace
    : Type[Key] extends object
    ? ReplaceNestedType<Type[Key], TFind, TReplace>
    : Type[Key];
};

export type Serialized<T> = ReplaceNestedType<T, Date, string>;

export type Identifier = string;
export const Identifier = z.string().cuid();
