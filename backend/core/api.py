# backend/core/api.py
from typing import List

from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Router, Schema

from .models import Categoria, Saldo, Transacao
from .schema import (CategoriaSchema, ClearCategorySchema, SaldoSchema,
                     SaldoUpdateSchema, TransacaoCreateSchema, TransacaoSchema)

api = NinjaAPI()

# --- Endpoint de Saldo (Substitui atualizarSaldo, adicionarSaldo, verSaldo) ---
def get_saldo_obj():
    saldo_obj, _created = Saldo.objects.get_or_create(id=1)
    return saldo_obj

@api.get("/saldo", response=SaldoSchema)
def get_saldo(request):
    return get_saldo_obj()

@api.post("/saldo/atualizar", response=SaldoSchema)
def atualizar_saldo(request, payload: SaldoUpdateSchema):
    saldo = get_saldo_obj()
    saldo.valor_atual = payload.valor
    saldo.save()
    return saldo

@api.post("/saldo/adicionar", response=SaldoSchema)
def adicionar_saldo(request, payload: SaldoUpdateSchema):
    saldo = get_saldo_obj()
    saldo.valor_atual += payload.valor
    saldo.save()
    return saldo


# --- Endpoints de Categoria ---
@api.get("/categorias", response=List[CategoriaSchema])
def listar_categorias(request):
    return Categoria.objects.all()

@api.post("/categorias", response=CategoriaSchema)
def criar_categoria(request, payload: CategoriaSchema):
    return Categoria.objects.create(nome=payload.nome)


# --- Endpoints de Transação (Substitui adicionarFatura, quitarDivida, etc) ---
@api.post("/transacoes", response=TransacaoSchema)
def criar_transacao(request, payload: TransacaoCreateSchema):
    return Transacao.objects.create(**payload.dict())

@api.post("/transacoes/batch", response=List[TransacaoSchema])
def criar_transacoes_em_lote(request, payload: List[TransacaoCreateSchema]):
    transacoes_criadas = []
    for item in payload:
        transacao = Transacao.objects.create(**item.dict())
        transacoes_criadas.append(transacao)
    return transacoes_criadas

@api.get("/transacoes", response=List[TransacaoSchema])
def listar_transacoes(request, categoria_id: int = None, exclude_categoria_id: int = None):
    transacoes = Transacao.objects.all()

    if categoria_id:
        transacoes = transacoes.filter(categoria_id=categoria_id)
        return transacoes
    
    if exclude_categoria_id:
        transacoes = transacoes.exclude(categoria_id=exclude_categoria_id)
       
    return transacoes

@api.delete("/transacoes/{int:transacao_id}", response={204: None})
def apagar_transacao(request, transacao_id: int):
    # Apaga uma transação específica. (Substitui quitarDivida/quitarGasto)
    transacao = get_object_or_404(Transacao, id=transacao_id)
    transacao.delete()
    return 204

# Apaga TODAS as transações de uma categoria específica. (Substitui quitarDividaTotal)
@api.post("/transacoes/clear-by-category", response={204: None})
def limpar_categoria(request, payload: ClearCategorySchema):
    transacoes = Transacao.objects.filter(categoria_id=payload.categoria_id)
    transacoes.delete()
    return 204