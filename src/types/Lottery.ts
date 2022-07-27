import { Conquest } from "./Conquest";

export interface Lottery {
  id: number;
  name: string;
  conquests?: Conquest[];
}
