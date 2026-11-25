# backend/core/schema.py
from ninja import ModelSchema, Schema

from .models import Assinatura, Categoria, GastoPadrao, Saldo, Transacao

# from typing import Optional

# --- Categoria ---
class CategoriaSchema(ModelSchema):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

# --- Saldo ---
class SaldoSchema(ModelSchema):
    class Meta:
        model = Saldo
        fields = ['id', 'valor_atual']

# Schema para ATUALIZAR ou ADICIONAR saldo
class SaldoUpdateSchema(Schema):
    valor: float

# --- Transação ---
class TransacaoSchema(ModelSchema):
    categoria: CategoriaSchema 

    class Meta:
        model = Transacao
        fields = ['id', 'descricao', 'valor', 'categoria', 'criado_em']

# Schema para CRIAR uma transação
class TransacaoCreateSchema(Schema):
    descricao: str
    valor: float
    categoria_id: int

class ClearCategorySchema(Schema):
    categoria_id: int


class GastoPadraoSchema(ModelSchema):
    class Meta:
        model = GastoPadrao
        fields = ["id", "descricao", "valor", "ordem"]


class AssinaturaSchema(ModelSchema):
    class Meta:
        model = Assinatura
        fields = ["id", "nome", "valor", "ordem"]


class ModeloFinanceiroInput(Schema):
    nome: str
    valor: float


class GastoPadraoInput(Schema):
    descricao: str
    valor: float


class AssinaturaComStatusSchema(AssinaturaSchema):
    lancada_no_mes: bool
    transacao_id: int = None


class TransferenciaSpotifySchema(Schema):
    criadas: int
