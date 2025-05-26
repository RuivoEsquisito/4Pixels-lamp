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
  rejectUnauthorized: false, // só use false se o certificado for autoassinado, se for LetsEncrypt pode remover
});

client.on('connect', () => {
  console.log('Conectado ao broker MQTT!');
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (err) console.error('Erro ao assinar tópico:', err);
    else console.log('Assinatura realizada no tópico:', topic);

    // Envia uma mensagem de teste
    client.publish('teste/hello', 'Olá MQTT!', { qos: 1, retain: false });
  });
});

client.on('message', (topic, message) => {
  console.log(`Mensagem recebida em ${topic}: ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
});

// Exemplo de botão para publicar ON/OFF
const btEnrico = document.getElementById('btEnrico');
let estadoAtual = null;

function atualizarBotao(estado) {
  estadoAtual = estado;
  if (estado === 'ON') btEnrico.classList.add('ativo');
  else btEnrico.classList.remove('ativo');
}

btEnrico.addEventListener('click', () => {
  const novoEstado = estadoAtual === 'ON' ? 'OFF' : 'ON';
  client.publish(topic, novoEstado, { qos: 1, retain: true });
  atualizarBotao(novoEstado);
});
