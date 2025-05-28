// MQTT Setup
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const host = "wss://test.mosquitto.org:8081"; // servidor MQTT WebSocket
const topicBase = "luz/";
const client = mqtt.connect(host, { clientId });

client.on("connect", () => {
  console.log("Conectado ao broker MQTT");
  client.subscribe(topicBase + "#", (err) => {
    if (err) console.error("Erro ao assinar tópico:", err);
  });
});

client.on("error", (error) => {
  console.error("Erro MQTT:", error);
});

client.on("message", (topic, message) => {
  // Recebe mensagens para atualizar estado dos botões/indicadores
  const parte = topic.replace(topicBase, "");
  const payload = message.toString();

  // Atualiza status dos botões conforme mensagem recebida
  if (["daniel", "enrico", "henrique", "jose"].includes(parte.toLowerCase())) {
    const btn = document.getElementById("bt" + capitalize(parte));
    if (!btn) return;
    if (payload === "1") {
      ativarBotao(btn, true);
    } else {
      ativarBotao(btn, false);
    }
  }
});

// Função auxiliar para deixar primeira letra maiúscula
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Controla a ativação visual do botão
function ativarBotao(botao, ativo) {
  if (ativo) {
    botao.classList.add("ativo");
    botao.setAttribute("aria-pressed", "true");
    piscarIndicador(botao.querySelector(".indicador"));
  } else {
    botao.classList.remove("ativo");
    botao.setAttribute("aria-pressed", "false");
    pararPiscar(botao.querySelector(".indicador"));
  }
}

// Piscar indicador em verde
let intervalosPiscar = new Map();

function piscarIndicador(el) {
  if (!el) return;
  if (intervalosPiscar.has(el)) return; // já piscando

  let ligado = true;
  el.style.backgroundColor = "#0f0";
  el.style.boxShadow = "0 0 10px #00ff00";

  const id = setInterval(() => {
    if (ligado) {
      el.style.backgroundColor = "#111";
      el.style.boxShadow = "none";
      ligado = false;
    } else {
      el.style.backgroundColor = "#0f0";
      el.style.boxShadow = "0 0 10px #00ff00";
      ligado = true;
    }
  }, 700);

  intervalosPiscar.set(el, id);
}

function pararPiscar(el) {
  if (!el) return;
  if (intervalosPiscar.has(el)) {
    clearInterval(intervalosPiscar.get(el));
    intervalosPiscar.delete(el);
  }
  el.style.backgroundColor = "#111";
  el.style.boxShadow = "none";
}

// Botões para enviar mensagem MQTT
document.querySelectorAll(".btn-indicador").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.id.slice(2).toLowerCase(); // ex: "btDaniel" -> "daniel"
    const estadoAtual = btn.classList.contains("ativo");
    const novoEstado = estadoAtual ? "0" : "1";
    client.publish(topicBase + id, novoEstado);
    // O feedback visual será via mensagem MQTT recebida (mesmo sistema)
  });
});

// Modal Avaliação

function abrirModal() {
  const modal = document.getElementById("modalAvaliacao");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("btnAbrirAvaliacao").setAttribute("aria-expanded", "true");
}

function fecharModal() {
  const modal = document.getElementById("modalAvaliacao");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("btnAbrirAvaliacao").setAttribute("aria-expanded", "false");
}

document.getElementById("btnAbrirAvaliacao").addEventListener("click", abrirModal);
document.querySelector(".modal .close").addEventListener("click", fecharModal);
document.getElementById("modalAvaliacao").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    fecharModal();
  }
});

document.getElementById("formAvaliacao").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = e.target.nome.value.trim();
  const rating = e.target.rating.value;
  const comentarios = e.target.comentarios.value.trim();

  if (!nome) {
    alert("Por favor, preencha seu nome.");
    return;
  }
  if (!rating) {
    alert("Por favor, selecione uma avaliação.");
    return;
  }

  alert(`Obrigado pela avaliação, ${nome}!\nNota: ${rating}\nComentário: ${comentarios}`);

  e.target.reset();
  fecharModal();
});
