// Token do Blynk e pino virtual
const token = "NsFH6Bdhmpr6y4eFIBr2XZeIN8GAcq5z";
const vpin = "v1"; // O pino virtual a ser verificado
const apiBase = "https://fra1.blynk.cloud/external/api";

// Referência ao botão e indicador
const botaoEnrico = document.getElementById("btEnrico");

// Função para obter o estado do LED (ligado/desligado)
function obterEstadoLed() {
  fetch(`${apiBase}/get?token=${token}&${vpin}`)
    .then(res => res.json())
    .then(data => {
      console.log(data); // Depuração para ver o valor retornado pela API

      // Verifique se a resposta é o valor esperado (1 ou 0)
      const estado = parseInt(data); // A resposta é direta, portanto usamos data diretamente

      console.log(`Estado do LED: ${estado}`); // Depuração do valor

      // Se o LED estiver ativo (1), ativa a animação do botão
      if (estado === 1) {
        botaoEnrico.classList.add("ativo");
      } else {
        botaoEnrico.classList.remove("ativo");
      }
    })
    .catch(err => {
      console.error("Erro ao obter estado do LED:", err);
    });
}

// Função para alternar o estado do LED (liga/desliga)
function alternarLed() {
  // Verifica o estado atual do LED
  fetch(`${apiBase}/get?token=${token}&${vpin}`)
    .then(res => res.json())
    .then(data => {
      const estadoAtual = parseInt(data); // 1 ou 0

      // Se o LED estiver ligado (1), desligue-o (0), e vice-versa
      const novoEstado = estadoAtual === 1 ? 0 : 1;

      // Envia o comando para mudar o estado do LED
      fetch(`${apiBase}/update?token=${token}&${vpin}=${novoEstado}`)
        .then(() => {
          console.log(`LED ${novoEstado === 1 ? 'ligado' : 'desligado'}`);
          // Atualiza a animação e o estado do botão após a mudança
          if (novoEstado === 1) {
            botaoEnrico.classList.add("ativo");
          } else {
            botaoEnrico.classList.remove("ativo");
          }
        })
        .catch(err => {
          console.error("Erro ao atualizar o estado do LED:", err);
        });
    })
    .catch(err => {
      console.error("Erro ao verificar o estado do LED:", err);
    });
}

// Evento de clique no botão para alternar o LED
botaoEnrico.addEventListener("click", () => {
  alternarLed(); // Alterna o estado do LED e atualiza o botão
  botaoEnrico.blur(); // Remove o foco visual após o clique
});

// Chama a função para verificar o estado do LED ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  obterEstadoLed(); // Verifica o estado do LED ao carregar a página
});

