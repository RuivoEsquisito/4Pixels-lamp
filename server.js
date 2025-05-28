const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Salvar feedback
app.post('/feedback', (req, res) => {
  const feedback = req.body;

  fs.readFile('feedback.json', (err, data) => {
    let feedbacks = [];
    if (!err) feedbacks = JSON.parse(data);

    feedbacks.push(feedback);

    fs.writeFile('feedback.json', JSON.stringify(feedbacks, null, 2), err => {
      if (err) return res.status(500).send('Erro ao salvar feedback');
      res.status(200).send('Feedback salvo com sucesso');
    });
  });
});

// Ver feedbacks
app.get('/feedbacks', (req, res) => {
  fs.readFile('feedback.json', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler feedbacks');
    res.send(JSON.parse(data));
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
