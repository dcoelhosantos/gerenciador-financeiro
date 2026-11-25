from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_assinatura_gastopadrao_assinaturalancamento"),
    ]

    # Mantém o número de migração aplicado, mas não associa dados existentes:
    # todas as assinaturas começam disponíveis para lançamento.
    operations = []
