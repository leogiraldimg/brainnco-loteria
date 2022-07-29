import { Contest } from "./Contest";

export interface Lottery {
  id: number;
  nome: string;
  loading: boolean;
  contests?: Contest[];
}

export interface LotteryContests {
  loteriaId: number;
  concursoId: string;
}
