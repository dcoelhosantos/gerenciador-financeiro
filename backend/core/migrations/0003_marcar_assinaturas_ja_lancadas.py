from decimal import Decimal

from django.db import migrations
from django.utils import timezone


def marcar_lancamentos_existentes(apps, schema_editor):
    Assinatura = apps.get_model("core", "Assinatura")
    AssinaturaLancamento = apps.get_model("core", "AssinaturaLancamento")
    Categoria = apps.get_model("core", "Categoria")
    Transacao = apps.get_model("core", "Transacao")

    daniel = Categoria.objects.filter(nome__iexact="Daniel").first()
    if daniel is None:
        return

    correspondencias = [
        ("Vivo Easy", {"vivo easy"}, Decimal("35.00")),
        ("Gemini Pro", {"gemini", "gemini pro"}, Decimal("23.99")),
        ("Crunchyroll", {"crunchyroll"}, Decimal("19.90")),
    ]
    transacoes_daniel = list(Transacao.objects.filter(categoria_id=daniel.id))
    periodo = timezone.localdate().strftime("%Y-%m")

    for nome_assinatura, descricoes, valor in correspondencias:
        assinatura = Assinatura.objects.filter(nome=nome_assinatura).first()
        if assinatura is None or assinatura.valor != valor:
            continue

        candidatas = [
            item
            for item in transacoes_daniel
            if item.valor == valor and item.descricao.strip().casefold() in descricoes
        ]
        # Só associa quando há uma correspondência inequívoca; nunca altera uma
        # transação existente nem escolhe entre registros ambíguos.
        if len(candidatas) == 1:
            AssinaturaLancamento.objects.get_or_create(
                assinatura_id=assinatura.id,
                periodo=periodo,
                defaults={"transacao_id": candidatas[0].id},
            )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_assinatura_gastopadrao_assinaturalancamento"),
    ]

    operations = [
        migrations.RunPython(marcar_lancamentos_existentes, migrations.RunPython.noop),
    ]
