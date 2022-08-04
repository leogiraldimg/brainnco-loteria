export interface Contest {
  id: string;
  loading?: boolean;
  error?: boolean;
  loteria?: number;
  numeros?: string[];
  data?: string;
}
