// Configuração do MQTT
const mqttUrl = 'wss://5a0bc93b43b447a9a9708d19abfce039.s1.eu.hivemq.cloud:8884/mqtt';
const mqttUsername = 'Enrico';
const mqttPassword = 'Lari2209-';
const topic = 'esp32/led';

// Conectar ao broker MQTT
const client = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
    reconnectPeriod: 1000,
    rejectUnauthorized: false,
});


// Elementos
const btEnrico = document.getElementById('btEnrico');
const indicador = btEnrico.querySelector('.indicador');

let estadoAtual = null; // Guarda o estado atual do LED

// Atualiza visualmente o botão
function atualizarBotao(estado) {
    estadoAtual = estado;
    if (estado === 'ON') {
        btEnrico.classList.add('ativo');
    } else {
        btEnrico.classList.remove('ativo');
    }
}

// Conexão estabelecida
client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Erro ao assinar tópico:', err);
        }
    });
});

// Recebe mensagem do ESP32
client.on('message', (topic, message) => {
    const estado = message.toString(); // ON ou OFF
    if (estado !== estadoAtual) {
        atualizarBotao(estado);
    }
});

// Clique no botão
btEnrico.addEventListener('click', () => {
    const novoEstado = btEnrico.classList.contains('ativo') ? 'OFF' : 'ON';

    // Só envia se o estado for diferente do atual
    if (novoEstado !== estadoAtual) {
        client.publish(topic, novoEstado, { qos: 1, retain: true });
        atualizarBotao(novoEstado); // Atualiza visualmente antes da resposta
    }
});
