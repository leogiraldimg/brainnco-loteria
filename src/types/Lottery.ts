import { Contest } from "./Contest";

export interface Lottery {
  id: number;
  nome: string;
  contests?: Contest[];
}

export interface LotteryContests {
  loteriaId: number;
  concursoId: string;
}
