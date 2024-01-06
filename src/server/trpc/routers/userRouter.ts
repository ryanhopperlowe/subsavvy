import { z } from "zod";

import { userCreateSchema, userUpdateSchema } from "@/model";
import { unauthorized } from "@/server";

import { authedProcedure, publicProcedure, router } from "../trpc";

import { authorizedProcedure } from "./../trpc";

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => ctx.dbs.users.findMany()),
  getAuthed: authedProcedure.query(async ({ ctx }) =>
    ctx.dbs.users.findByEmail(ctx.user.email),
  ),
  update: authorizedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      verifyAuthorization(input.id, ctx.profile.id);

      return ctx.dbs.users.update(input);
    }),
  create: authedProcedure.input(userCreateSchema).mutation(({ ctx, input }) => {
    return ctx.dbs.users.create(ctx.user.email, input);
  }),
  delete: authorizedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      verifyAuthorization(input, ctx.profile.id);

      return ctx.dbs.users.delete(input);
    }),
});

function verifyAuthorization(input: number, profileId?: number) {
  if (profileId !== input) {
    throw unauthorized();
  }
}
