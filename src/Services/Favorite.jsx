import { createContext, useContext } from "react";

export const FavContext = createContext();

export function useFav() {
  return useContext(FavContext);
}
