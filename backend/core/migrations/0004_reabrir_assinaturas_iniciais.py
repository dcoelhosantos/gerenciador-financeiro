from django.db import migrations


def reabrir_assinaturas(apps, schema_editor):
    AssinaturaLancamento = apps.get_model("core", "AssinaturaLancamento")
    # Remove apenas os vínculos de pré-carga. As transações de fatura ficam intactas.
    AssinaturaLancamento.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_marcar_assinaturas_ja_lancadas"),
    ]

    operations = [
        migrations.RunPython(reabrir_assinaturas, migrations.RunPython.noop),
    ]
