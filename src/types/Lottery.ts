import { Contest } from "./Contest";

export interface Lottery {
  id: number;
  nome: string;
  loading: boolean;
  error: boolean;
  contests?: {
    list: Contest[];
    loading: boolean;
  };
}

export interface LotteryContests {
  loteriaId: number;
  concursoId: string;
}
