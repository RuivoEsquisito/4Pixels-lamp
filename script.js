const brokerUrl = 'wss://4pixels.duckdns.org:9001';
const options = {
  username: 'enrico',
  password: 'Nxzero12-',
  clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
  reconnectPeriod: 5000,
};

const client = mqtt.connect(brokerUrl, options);

client.on('connect', function () {
  console.log('Conectado ao broker MQTT');
  Object.keys(botoes).forEach(topic => client.subscribe(topic));
});

client.on('reconnect', () => console.log('Tentando reconectar...'));
client.on('error', err => console.error('Erro MQTT:', err.message));
client.on('close', () => console.log('Conexão MQTT fechada'));
client.on('offline', () => console.log('Cliente está offline'));

// Referência aos botões
const botoes = {
  'esp32/led/daniel': document.getElementById('btDaniel'),
  'esp32/led/enrico': document.getElementById('btEnrico'),
  'esp32/led/henrique': document.getElementById('btHenrique'),
  'esp32/led/jose': document.getElementById('btJose'),
  'esp32/led/matheus': document.getElementById('btMatheus'),
  'esp32/led/trovao': document.getElementById('btTrovao'),
};

function publicarToggle(botao, topico) {
  const novoEstado = botao.classList.contains('ativo') ? 'OFF' : 'ON';
  client.publish(topico, novoEstado);
}

// Associa eventos aos botões dinamicamente
Object.entries(botoes).forEach(([topico, botao]) => {
  botao.addEventListener('click', () => publicarToggle(botao, topico));
});

// Atualiza visual conforme mensagens recebidas
client.on('message', function (topic, message) {
  const payload = message.toString();
  console.log('Mensagem recebida', topic, payload);

  const botao = botoes[topic];
  if (botao) {
    const ligado = payload === 'ON';
    botao.classList.toggle('ativo', ligado);
    botao.setAttribute('aria-pressed', ligado);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('btnAvaliar');
  const modal = document.getElementById('modalAvaliar');
  const closeX = modal.querySelector('.close');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeX.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

    const btnAbrir = document.getElementById('btnAbrirAvaliacao');
    const formContainer = document.getElementById('formAvaliacao');

    btnAbrir.addEventListener('click', () => {
      if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        btnAbrir.textContent = 'Fechar Avaliação';
      } else {
        formContainer.style.display = 'none';
        btnAbrir.textContent = 'Deixar Avaliação';
      }
    });