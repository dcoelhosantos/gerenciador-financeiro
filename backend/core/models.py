# backend/core/models.py
from django.db import models

class Transacao(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    
    categoria = models.ForeignKey(
        'Categoria', 
        on_delete=models.PROTECT, 
        related_name="transacoes"
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.categoria.nome} - {self.descricao} (R$ {self.valor})"


class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome


class Saldo(models.Model):
    valor_atual = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"Saldo Atual: R$ {self.valor_atual}"