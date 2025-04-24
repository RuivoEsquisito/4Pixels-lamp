const botoes = document.querySelectorAll(".btn-indicador");

// Adiciona um evento de clique em cada botão
botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    botao.classList.toggle("ativo");
  });
});

/*document.querySelectorAll('.btn-indicador').forEach(botao => {
  botao.addEventListener('click', () => {
    fetch('https://seuservidor.com/api/lampada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ acender: true }) // ou { status: "on" }
    })
    .then(res => res.json())
    .then(data => {
      console.log('Lâmpada acionada:', data);
      botao.classList.toggle('ativo'); // animação visual no botão
    })
    .catch(err => {
      console.error('Erro ao acionar lâmpada:', err);
    });
  });
});
*/