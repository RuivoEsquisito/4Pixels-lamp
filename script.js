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

client.on('message', function (topic, message) {
  const estado = message.toString().trim().toUpperCase();
  const botao = botoes[topic];

  if (botao) {
    if (estado === 'ON') {
      botao.classList.add('ativo');
    } else if (estado === 'OFF') {
      botao.classList.remove('ativo');
    }
  }
});

// Associa eventos aos botões dinamicamente
Object.entries(botoes).forEach(([topico, botao]) => {
  botao.addEventListener('click', () => publicarToggle(botao, topico));
});

// Abrir e fechar o formulário
document.addEventListener("DOMContentLoaded", function () {
  const abrirBtn = document.getElementById("abrirAvaliacao");
  const fecharBtn = document.getElementById("fecharAvaliacao");
  const formAvaliacao = document.getElementById("formAvaliacao");
  const fundoModal = document.getElementById("fundoModal");

  abrirBtn.addEventListener("click", () => {
    formAvaliacao.style.display = "block";
    fundoModal.style.display = "block";
  });

  fecharBtn.addEventListener("click", () => {
    formAvaliacao.style.display = "none";
    fundoModal.style.display = "none";
  });

  // Fechar clicando no fundo
  fundoModal.addEventListener("click", () => {
    formAvaliacao.style.display = "none";
    fundoModal.style.display = "none";
  });

  // Envio do formulário
  const form = document.querySelector("#formAvaliacao form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const comentario = document.getElementById("comentario").value;
    const nota = document.querySelector('input[name="nota"]:checked')?.value;

    console.log("Nome:", nome);
    console.log("Comentário:", comentario);
    console.log("Nota:", nota);

    // Aqui você pode adicionar o envio para backend ou API

    // Resetar e fechar
    form.reset();
    formAvaliacao.style.display = "none";
    fundoModal.style.display = "none";
  });
});
