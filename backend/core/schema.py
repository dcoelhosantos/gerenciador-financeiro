# backend/core/schema.py
from ninja import ModelSchema, Schema
from .models import Transacao, Categoria, Saldo
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