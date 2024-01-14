export type ActionComponentProps<T> = {
  onSubmit: (data: T) => void;
  onComplete: () => void;
  onError: () => void;
};
