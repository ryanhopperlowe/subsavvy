import { useEffect } from "react";

export function useOnMount(callback: () => void | (() => void)) {
  return useEffect(callback, []);
}

export function useOnUnmount(callback: () => void) {
  return useEffect(() => callback, []);
}
