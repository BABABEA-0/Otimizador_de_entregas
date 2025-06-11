// =======================================================
// 1. DADOS MOCK
// =======================================================
const mockApiData = {
  "nodes": [
    { "id": "D1", "type": "deposito", "name": "Depósito Principal - Maceió", "lat": -9.665, "lon": -35.735 },
    { "id": "H1", "type": "hub", "name": "Hub Logístico - Paripueira", "lat": -9.465, "lon": -35.555 },
    { "id": "Z1", "type": "zonaEntrega", "name": "Zona de Entrega - Barra de Santo Antônio", "lat": -9.404, "lon": -35.507 },
    { "id": "Z2", "type": "zonaEntrega", "name": "Zona de Entrega - Praia da Sereia", "lat": -9.563, "lon": -35.660 },
    { "id": "Z3", "type": "zonaEntrega", "name": "Zona de Entrega - Cidade Universitária", "lat": -9.549, "lon": -35.777 },
    { "id": "H2", "type": "hub", "name": "Hub logístico - Pontal da Barra", "lat": -9.693, "lon": -35.775 },
    { "id": "Z4", "type": "zonaEntrega", "name": "Zona de Entrega - Ilha de Santa Rita", "lat": -9.713, "lon": -35.820 },
    { "id": "Z5", "type": "zonaEntrega", "name": "Zona de Entrega - Ilha do Lisboa", "lat": -9.673, "lon": -35.780 },
  ],
  "routes": [
    // Rota Saudável (25% de uso)
    { "from_id": "D1", "to_id": "H1", "capacity": 1000, "current_flow": 250 },
    // Rota em Alerta/Gargalo (96% de uso)
    { "from_id": "H1", "to_id": "Z1", "capacity": 500, "current_flow": 480 },
    // Rota em Atenção (70% de uso)
    { "from_id": "D1", "to_id": "Z2", "capacity": 300, "current_flow": 210 },
    { "from_id": "D1", "to_id": "Z3", "capacity": 400, "current_flow": 310 },
    { "from_id": "D1", "to_id": "H2", "capacity": 200, "current_flow": 50 },
    { "from_id": "H2", "to_id": "Z4", "capacity": 150, "current_flow": 50 },
    { "from_id": "H2", "to_id": "Z5", "capacity": 80, "current_flow": 0 },
  ]
};

// =======================================================
// 2. INICIALIZAÇÃO DO MAPA
// =======================================================
const map = L.map('mapa').setView([-9.665, -35.735], 12); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// =======================================================
// 3. FUNÇÕES DE ESTILO E DESENHO
// =======================================================

/**
 
 * Calcula o estilo de uma rota (cor e espessura) baseado na sua utilização.
 */
function getEstiloDaRota(route) {
    // Evita divisão por zero se a capacidade for 0
    if (route.capacity === 0) {
        return { color: '#888', weight: 2 }; 
    }

    const utilizacao = route.current_flow / route.capacity;
    let cor;

    if (utilizacao > 0.9) {
        cor = 'red'; // Acima de 90% -> Vermelho
    } else if (utilizacao > 0.7) {
        cor = 'orange'; // Entre 70% e 90% -> Laranja
    } else if (utilizacao > 0) {
        cor = '#008000'; // Verde escuro para rotas com fluxo
    } else {
        cor = '#aaa'; // Cinza para rotas sem fluxo
    }

    // A espessura varia de 3 (para 0% de uso) a 10 (para 100% de uso)
    const espessura = 3 + (utilizacao * 7);

    return { color: cor, weight: espessura };
}

function desenharRede(dados) {
    dados.nodes.forEach(node => {
        L.marker([node.lat, node.lon])
         .addTo(map)
         .bindPopup(`<b>${node.name}</b><br>Tipo: ${node.type}`);
    });

    dados.routes.forEach(route => {
        const fromNode = dados.nodes.find(node => node.id === route.from_id);
        const toNode = dados.nodes.find(node => node.id === route.to_id);

        if (fromNode && toNode) {
            const latlngs = [
                [fromNode.lat, fromNode.lon],
                [toNode.lat, toNode.lon]
            ];

            
            const estiloDaRota = getEstiloDaRota(route);

            L.polyline(latlngs, estiloDaRota)
             .addTo(map)
             .bindPopup(`Rota: ${fromNode.name} -> ${toNode.name}<br>Fluxo: ${route.current_flow} / ${route.capacity}`);
        }
    });
}

// =======================================================
// 4. INÍCIO DA EXECUÇÃO
// =======================================================
desenharRede(mockApiData);