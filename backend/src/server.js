const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/treino', async (req, res) => {
  const { nome, nascimento, altura, peso, diasTreino, divisao, objetivo } = req.body;

  if (!nome || !nascimento || !altura || !peso || !diasTreino || !divisao || !objetivo) {
    return res.status(400).json({ treino: 'Dados incompletos. Preencha todos os campos.' });
  }

  const prompt = `Monte um plano de treino personalizado para o seguinte perfil:
  Nome: ${nome}
  Data de nascimento: ${nascimento}
  Altura: ${altura} m
  Peso: ${peso} kg
  Dias de treino por semana: ${diasTreino}
  Divisão muscular: ${divisao === 'separado' ? 'grupos musculares separados' : 'grupos musculares em conjunto'}
  Objetivo: ${objetivo}

  Forneça um treino completo para cada dia da semana de treino, levando em consideração o objetivo descrito. Seja claro, use listas e organize o treino com títulos de cada dia, exercícios, repetições e observações gerais.`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const treino = completion.data.choices[0].message.content;
    res.json({ treino });
  } catch (error) {
    console.error('Erro ao gerar treino:', error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        treino: 'Limite de uso da API da OpenAI atingido. Tente novamente mais tarde.',
      });
    }

    res.status(500).json({ treino: 'Erro ao gerar treino. Verifique o backend.' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando na porta ' + (process.env.PORT || 3000));
});

const PDFDocument = require('pdfkit');

// Novo endpoint para exportar o treino como PDF
app.post('/api/exportar-pdf', (req, res) => {
  const { treino } = req.body;

  if (!treino) {
    return res.status(400).send('Treino não fornecido.');
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=treino.pdf');
  doc.pipe(res);

  doc.fontSize(14).text('Treino Gerado:', { underline: true, align: 'left' });
  doc.moveDown();
  doc.fontSize(12).text(treino);

  doc.end();
});
