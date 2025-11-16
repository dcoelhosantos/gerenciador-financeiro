export interface Categoria {
  id: number;
  nome: string;
}

export interface Saldo {
  id: number;
  valor_atual: string;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: string;
  categoria: Categoria;
  criado_em: Date;
}

export interface InfoCategoria {
  transacoes: Transacao[];
  total: number;
}

export interface FaturasAgrupadas {
  [nomeCategoria: string]: InfoCategoria;
}
