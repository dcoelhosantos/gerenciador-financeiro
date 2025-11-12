from django.contrib import admin
from .models import Transacao, Categoria, Saldo

admin.site.register(Categoria)
admin.site.register(Transacao)
admin.site.register(Saldo)