const botoes = document.querySelectorAll(".btn-indicador");

// Adiciona um evento de clique em cada botão
botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    botao.classList.toggle("ativo");
  });
});