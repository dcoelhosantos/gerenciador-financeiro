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

export interface CreateTransacaoPayload {
  descricao: string;
  valor: number;
  categoria_id: number;
  data: string;
}

export interface GastoPadrao {
  id: number;
  descricao: string;
  valor: string;
  ordem: number;
}

export interface Assinatura {
  id: number;
  nome: string;
  valor: string;
  ordem: number;
  lancada_no_mes: boolean;
  transacao_id: number | null;
}
