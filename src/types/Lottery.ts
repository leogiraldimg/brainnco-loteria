import { Contest } from "./Contest";

export interface Lottery {
  id: number;
  name: string;
  contests?: Contest[];
}

export interface LotteryContests {
  loteriaId: number;
  concursoId: string;
}
