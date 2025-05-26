const mqttUrl = 'wss://4pixels.duckdns.org:9001';
const mqttUsername = 'enrico';
const mqttPassword = 'Nxzero123';
const topic = 'esp32/led';

const client = mqtt.connect(mqttUrl, {
  username: mqttUsername,
  password: mqttPassword,
  clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
  clean: true,
  reconnectPeriod: 1000,
});

const btEnrico = document.getElementById('btEnrico');
const indicador = btEnrico.querySelector('.indicador');

let estadoAtual = null;

function atualizarBotao(estado) {
  estadoAtual = estado;
  if (estado === 'ON') {
    btEnrico.classList.add('ativo');
  } else {
    btEnrico.classList.remove('ativo');
  }
}

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Erro ao assinar tópico:', err);
    } else {
      console.log(`Assinado tópico ${topic}`);
      client.publish('teste/hello', 'Olá MQTT!');
    }
  });
});

client.on('message', (topicRecebido, message) => {
  if (topicRecebido === topic) {
    const estado = message.toString(); // ON ou OFF
    if (estado !== estadoAtual) {
      atualizarBotao(estado);
    }
  }
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
});

btEnrico.addEventListener('click', () => {
  const novoEstado = btEnrico.classList.contains('ativo') ? 'OFF' : 'ON';
  if (novoEstado !== estadoAtual) {
    client.publish(topic, novoEstado, { qos: 1, retain: true });
    atualizarBotao(novoEstado);
  }
});
