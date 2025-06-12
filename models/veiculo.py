from models.enums import TipoVeiculo

class Veiculo:
    def __init__(self, id, tipo: TipoVeiculo, capacidade, disponivel, zonas_permitidas=None):
        if capacidade < 0:
            raise ValueError("Capacidade não pode ser negativa")
        self.id = id
        self.tipo = tipo
        self.capacidade = capacidade
        self.disponivel = disponivel # Mantive disponivel como está no seu exemplo, mas o padrão era True
        self.zonas_permitidas = zonas_permitidas if zonas_permitidas else []

    def __repr__(self):
        return f"Veiculo({self.tipo.name}, capacidade={self.capacidade})"

    def __str__(self):
        return (f"Veículo {self.id} ({self.tipo.name}): Capacidade {self.capacidade}, "
                f"Disponível: {self.disponivel}, Zonas Permitidas: {', '.join(self.zonas_permitidas)}")