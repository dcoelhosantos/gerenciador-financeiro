# backend/core/api.py
from ninja import NinjaAPI, Router
from typing import List
from .models import Transacao, Categoria, Saldo
from .schema import (
    TransacaoSchema, TransacaoCreateSchema, 
    CategoriaSchema, 
    SaldoSchema, SaldoUpdateSchema
)
from django.shortcuts import get_object_or_404

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

@api.get("/transacoes", response=List[TransacaoSchema])
def listar_transacoes(request, categoria_id: int = None):
    if categoria_id:
        # (Substitui verFatura de uma pessoa, ou verGastosPrevistos)
        return Transacao.objects.filter(categoria_id=categoria_id)
    return Transacao.objects.all() # (Para ver tudo)

@api.delete("/transacoes/{int:transacao_id}", response={204: None})
def apagar_transacao(request, transacao_id: int):
    # Apaga uma transação específica. (Substitui quitarDivida/quitarGasto)
    transacao = get_object_or_404(Transacao, id=transacao_id)
    transacao.delete()
    return 204