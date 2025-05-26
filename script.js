const brokerUrl = 'wss://4pixels.duckdns.org:9001';
  const options = {
    username: 'enrico',
    password: 'Nxzero12-',
    clientId: 'web-client-' + Math.random().toString(16).substr(2, 8), // Gera um ID de cliente único
    // Reconectar automaticamente em caso de queda da conexão
    reconnectPeriod: 5000,       // Tenta reconectar a cada 5 segundos
  };
  // Conecta ao broker MQTT usando o protocolo WSS (WebSockets seguro)
  const client = mqtt.connect(brokerUrl, options);

  // Evento disparado quando a conexão ao broker é estabelecida
  client.on('connect', function () {
    console.log('Conectado ao broker MQTT');
    // Inscreve-se nos tópicos correspondentes aos botões
    client.subscribe('esp32/led/enrico');
    client.subscribe('esp32/led/daniel');
    client.subscribe('esp32/led/henrique');
    client.subscribe('esp32/led/jose');
    client.subscribe('esp32/led/matheus');
    client.subscribe('esp32/led/trovao');
  });

  // Evento disparado quando o cliente MQTT tenta reconectar
  client.on('reconnect', function () {
    console.log('Tentando reconectar ao broker MQTT...');
  });

  // Evento disparado em caso de erro na conexão
  client.on('error', function (err) {
    console.error('Erro na conexão MQTT:', err.message);
    // Não é necessário chamar client.end() para reconexão automática
  });

  // Evento disparado quando a conexão é fechada (client.disconnect() ou erro fatal)
  client.on('close', function () {
    console.log('Conexão MQTT fechada');
  });

  // Evento disparado quando o cliente fica offline
  client.on('offline', function () {
    console.log('Cliente MQTT está offline');
  });

  // Referência aos botões no HTML (IDs devem existir na página)
  const btnEnrico    = document.getElementById('btEnrico');
  const btnDaniel    = document.getElementById('btDaniel');
  const btnHenrique  = document.getElementById('btHenrique');
  const btnJose      = document.getElementById('btJose');
  const btnMatheus   = document.getElementById('btMatheus');
  const btnTrovao    = document.getElementById('btTrovao');

  // Função genérica para alternar o estado do botão (ON/OFF)
  function publicarToggle(botao, topico) {
    // Define o novo estado baseando-se na classe 'ativo'
    const novoEstado = botao.classList.contains('ativo') ? 'OFF' : 'ON';
    client.publish(topico, novoEstado);
  }

  // Adiciona event listeners nos botões para publicar mensagens MQTT ao serem clicados
  btnEnrico.addEventListener('click', function () {
    publicarToggle(btnEnrico, 'esp32/led/enrico');
  });
  btnDaniel.addEventListener('click', function () {
    publicarToggle(btnDaniel, 'esp32/led/daniel');
  });
  btnHenrique.addEventListener('click', function () {
    publicarToggle(btnHenrique, 'esp32/led/henrique');
  });
   btnJose.addEventListener('click', function () {
    publicarToggle(btnJose, 'esp32/led/jose');
  });
   btnMatheus.addEventListener('click', function () {
    publicarToggle(btnMatheus, 'esp32/led/matheus');
  });
  btnTrovao.addEventListener('click', function () {
    publicarToggle(btnTrovao, 'esp32/led/trovao');
  });

  // Manipula mensagens recebidas nos tópicos assinados
  client.on('message', function (topic, message) {
    const payload = message.toString(); // Converte o Buffer para string
    console.log('Mensagem recebida', topic, payload);

    // Atualiza a aparência do botão correspondente de acordo com a mensagem
    if (topic === 'esp32/led/enrico') {
      if (payload === 'ON') {
        btnEnrico.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnEnrico.classList.remove('ativo');
      }
    } else if (topic === 'esp32/led/daniel') {
      if (payload === 'ON') {
        btnDaniel.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnDaniel.classList.remove('ativo');
      }
    } else if (topic === 'esp32/led/henrique') {
      if (payload === 'ON') {
        btnHenrique.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnHenrique.classList.remove('ativo');
      }
    } else if (topic === 'esp32/led/jose') {
      if (payload === 'ON') {
        btnJose.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnJose.classList.remove('ativo');
      }
    } else if (topic === 'esp32/led/matheus') {
      if (payload === 'ON') {
        btnMatheus.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnMatheus.classList.remove('ativo');
      }
    } else if (topic === 'esp32/led/trovao') {
      if (payload === 'ON') {
        btnTrovao.classList.add('ativo');
      } else if (payload === 'OFF') {
        btnTrovao.classList.remove('ativo');
      }
    }
  });