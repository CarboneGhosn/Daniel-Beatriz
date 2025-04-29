const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração do Oracle
const dbConfig = {
  user: 'RM554867',
  password: 'fiap24',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.fiap.com.br)(PORT=1521))(CONNECT_DATA=(SID=orcl)))'
};

// Rota para salvar confirmação
app.post('/confirmar', async (req, res) => {
  const { nome, familiares } = req.body;

  if (!nome || !familiares) {
    return res.status(400).json({ error: 'Nome e Família são obrigatórios.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO confirmacoes_presenca (nome, familiares) VALUES (:nome, :familiares)`,
      { nome, familiares },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Confirmação registrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar confirmação:', err);
    res.status(500).json({ error: 'Erro ao registrar confirmação.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Endpoint para listar todas as confirmações (para admin)
app.get('/confirmacoes', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT id, nome, familiares FROM confirmacoes_presenca`);
    const confirmacoes = result.rows.map(row => ({
      id: row[0],
      nome: row[1],
      familia: row[2]
    }));
    res.status(200).json(confirmacoes);
  } catch (err) {
    console.error('Erro ao carregar confirmações:', err);
    res.status(500).json({ error: 'Erro ao carregar confirmações.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Endpoint para editar a confirmação
app.put('/confirmacao/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, familiares } = req.body;

  if (!nome || !familiares) {
    return res.status(400).json({ error: 'Nome e Família são obrigatórios.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE confirmacoes_presenca SET nome = :nome, familiares = :familiares WHERE id = :id`,
      { nome, familiares, id },
      { autoCommit: true }
    );

    res.status(200).json({ message: 'Confirmação atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar confirmação:', err);
    res.status(500).json({ error: 'Erro ao atualizar confirmação.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Endpoint para deletar a confirmação
app.delete('/confirmacao/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM confirmacoes_presenca WHERE id = :id`,
      { id },
      { autoCommit: true }
    );

    res.status(200).json({ message: 'Confirmação deletada com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar confirmação:', err);
    res.status(500).json({ error: 'Erro ao deletar confirmação.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
