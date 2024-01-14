export type RequireOneOf<
  TObj extends object,
  TKeys extends keyof TObj = keyof TObj,
> = {
  [K in TKeys]-?: Required<Pick<TObj, K>> & Partial<Omit<TObj, K>>;
}[TKeys];
