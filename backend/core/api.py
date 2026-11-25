# backend/core/api.py
from decimal import Decimal
from typing import List

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja import NinjaAPI, Router, Schema

from .models import (Assinatura, AssinaturaLancamento, Categoria, GastoPadrao,
                     Saldo, Transacao)
from .schema import (CategoriaSchema, ClearCategorySchema, SaldoSchema,
                     SaldoUpdateSchema, TransacaoCreateSchema, TransacaoSchema,
                     AssinaturaComStatusSchema, AssinaturaSchema,
                     GastoPadraoInput, GastoPadraoSchema,
                     ModeloFinanceiroInput, TransferenciaSpotifySchema)

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
def listar_categorias(request, exclude_id: int = None):
    categorias = Categoria.objects.all()
    
    if exclude_id:
        categorias = categorias.exclude(id=exclude_id)
    
    return categorias

@api.get("/categorias/{int:categoria_id}", response=CategoriaSchema)
def obter_categoria(request, categoria_id: int):
    return get_object_or_404(Categoria, id=categoria_id)

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


@api.get("/gastos-padroes", response=List[GastoPadraoSchema])
def listar_gastos_padroes(request):
    return GastoPadrao.objects.all()


@api.post("/gastos-padroes", response=GastoPadraoSchema)
def criar_gasto_padrao(request, payload: GastoPadraoInput):
    if not payload.descricao.strip() or payload.valor <= 0:
        return api.create_response(request, {"detail": "Descrição e valor positivo são obrigatórios."}, status=400)
    return GastoPadrao.objects.create(
        descricao=payload.descricao.strip(),
        valor=Decimal(str(payload.valor)),
        ordem=GastoPadrao.objects.count(),
    )


@api.patch("/gastos-padroes/{int:item_id}", response=GastoPadraoSchema)
def atualizar_gasto_padrao(request, item_id: int, payload: GastoPadraoInput):
    item = get_object_or_404(GastoPadrao, id=item_id)
    if not payload.descricao.strip() or payload.valor <= 0:
        return api.create_response(request, {"detail": "Descrição e valor positivo são obrigatórios."}, status=400)
    item.descricao = payload.descricao.strip()
    item.valor = Decimal(str(payload.valor))
    item.save(update_fields=["descricao", "valor"])
    return item


@api.delete("/gastos-padroes/{int:item_id}", response={204: None})
def apagar_gasto_padrao(request, item_id: int):
    get_object_or_404(GastoPadrao, id=item_id).delete()
    return 204


def assinatura_serializada(assinatura, periodo):
    lancamento = AssinaturaLancamento.objects.filter(
        assinatura=assinatura, periodo=periodo
    ).first()
    return {
        "id": assinatura.id,
        "nome": assinatura.nome,
        "valor": assinatura.valor,
        "ordem": assinatura.ordem,
        "lancada_no_mes": lancamento is not None,
        "transacao_id": lancamento.transacao_id if lancamento else None,
    }


@api.get("/assinaturas", response=List[AssinaturaComStatusSchema])
def listar_assinaturas(request):
    periodo = timezone.localdate().strftime("%Y-%m")
    return [assinatura_serializada(item, periodo) for item in Assinatura.objects.all()]


@api.get("/assinaturas/total-pendente")
def total_assinaturas_pendentes(request):
    periodo = timezone.localdate().strftime("%Y-%m")
    total = Decimal("0.00")
    for item in Assinatura.objects.all():
        if not AssinaturaLancamento.objects.filter(assinatura=item, periodo=periodo).exists():
            total += item.valor
    return {"total": total}


@api.post("/assinaturas", response=AssinaturaSchema)
def criar_assinatura(request, payload: ModeloFinanceiroInput):
    if not payload.nome.strip() or payload.valor <= 0:
        return api.create_response(request, {"detail": "Nome e valor positivo são obrigatórios."}, status=400)
    return Assinatura.objects.create(
        nome=payload.nome.strip(),
        valor=Decimal(str(payload.valor)),
        ordem=Assinatura.objects.count(),
    )


@api.patch("/assinaturas/{int:assinatura_id}", response=AssinaturaSchema)
def atualizar_assinatura(request, assinatura_id: int, payload: ModeloFinanceiroInput):
    item = get_object_or_404(Assinatura, id=assinatura_id)
    if not payload.nome.strip() or payload.valor <= 0:
        return api.create_response(request, {"detail": "Nome e valor positivo são obrigatórios."}, status=400)
    item.nome = payload.nome.strip()
    item.valor = Decimal(str(payload.valor))
    item.save(update_fields=["nome", "valor"])
    return item


@api.delete("/assinaturas/{int:assinatura_id}", response={204: None})
def apagar_assinatura(request, assinatura_id: int):
    get_object_or_404(Assinatura, id=assinatura_id).delete()
    return 204


@api.post("/assinaturas/{int:assinatura_id}/transferir", response=TransacaoSchema)
def transferir_assinatura(request, assinatura_id: int):
    assinatura = get_object_or_404(Assinatura, id=assinatura_id)
    daniel = get_object_or_404(Categoria, nome__iexact="Daniel")
    periodo = timezone.localdate().strftime("%Y-%m")

    existente = AssinaturaLancamento.objects.filter(
        assinatura=assinatura, periodo=periodo
    ).select_related("transacao").first()
    if existente:
        return api.create_response(
            request,
            {"detail": "Esta assinatura já foi lançada neste mês.", "transacao_id": existente.transacao_id},
            status=409,
        )

    try:
        with transaction.atomic():
            transacao = Transacao.objects.create(
                descricao=assinatura.nome,
                valor=assinatura.valor,
                categoria=daniel,
            )
            AssinaturaLancamento.objects.create(
                assinatura=assinatura,
                transacao=transacao,
                periodo=periodo,
            )
            return transacao
    except IntegrityError:
        return api.create_response(
            request,
            {"detail": "Esta assinatura já foi lançada neste mês."},
            status=409,
        )


@api.post("/acoes/adicionar-spotify", response=TransferenciaSpotifySchema)
def adicionar_contas_spotify(request):
    outros = get_object_or_404(Categoria, nome__iexact="Outros")
    jakla = get_object_or_404(Categoria, nome__iexact="Jakla")
    contas_outros = [
        "Spotify (Paulo)",
        "Spotify (Isa)",
        "Spotify (Yas)",
        "Spotify (Amg de Yas)",
    ]
    with transaction.atomic():
        Transacao.objects.bulk_create([
            Transacao(descricao=nome, valor=Decimal("6.82"), categoria=outros)
            for nome in contas_outros
        ] + [
            Transacao(descricao="Spotify", valor=Decimal("6.81"), categoria=jakla)
        ])
    return {"criadas": 5}
