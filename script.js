// Configuração do MQTT
const mqttUrl = 'wss://4pixels.duckdns.org:9001';
const mqttUsername = 'enrico';
const mqttPassword = 'Nxzero123';
const topic = 'esp32/led';

// Conectar ao broker MQTT
const client = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
    clean: true,
    reconnectPeriod: 1000,
    rejectUnauthorized: false,
});

client.on('connect', () => {
  console.log('Conectado ao MQTT!');
  client.subscribe('#', (err) => {
    if (err) {
      console.error('Erro ao assinar tópico:', err);
    } else {
      console.log('Assinatura realizada com sucesso no tópico #');
      client.publish('teste/hello', 'Olá MQTT!');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
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
