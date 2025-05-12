// Configuração do MQTT
const mqttUrl = 'wss://5a0bc93b43b447a9a9708d19abfce039.s1.eu.hivemq.cloud:8884/mqtt'; // Porta WebSocket segura
const mqttUsername = 'Enrico';  // Nome de usuário para autenticação no HiveMQ
const mqttPassword = 'Lari2209-';  // Senha para autenticação no HiveMQ
const topic = 'esp32/led';  // Tópico em que o ESP32 envia o status do LED

// Conectar ao broker MQTT
const client = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: 'web-client',
    clean: true,
});

// Elementos do botão
const btEnrico = document.getElementById('btEnrico');
const indicador = btEnrico.querySelector('.indicador');

// Função para atualizar o botão com base no estado do LED
function atualizarBotao(estado) {
    if (estado === 'ON') {
        btEnrico.classList.add('ativo');  // Ativa o estilo
        indicador.style.backgroundColor = '#00ff00';  // LED ligado (verde)
    } else {
        btEnrico.classList.remove('ativo');  // Desativa o estilo
        indicador.style.backgroundColor = '#ff0000';  // LED desligado (vermelho)
    }
}

// Quando o cliente MQTT estiver conectado
client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    
    // Assina o tópico para receber mensagens do ESP32
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Assinado no tópico ${topic}`);
        } else {
            console.error('Erro ao assinar tópico:', err);
        }
    });
});

// Quando uma nova mensagem for recebida no tópico
client.on('message', (topic, message) => {
    console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
    const estado = message.toString();  // "ON" ou "OFF"
    atualizarBotao(estado);  // Atualiza o estado do botão
});

// Função para alternar o estado do LED ao clicar no botão
btEnrico.addEventListener('click', () => {
    const novoEstado = btEnrico.classList.contains('ativo') ? 'OFF' : 'ON';
    
    // Publica no MQTT para mudar o estado do LED
    client.publish('esp32/led', novoEstado, { qos: 1, retain: true });
    
    // Atualiza visualmente o botão
    atualizarBotao(novoEstado);
});
