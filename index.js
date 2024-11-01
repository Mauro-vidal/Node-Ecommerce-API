const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Configuração da conexão com PostgreSQL
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vendas_v2',
  password: 'mauro@123',
  port: 5432,
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
    return;
  }
  console.log('Conectado ao PostgreSQL!');
});

// Criar um novo cliente
app.post('/clientes', (req, res) => {
  const { nome, nascimento, endereco, cpf, telefone, email, data_cadastro } = req.body;
  const sql = `INSERT INTO cliente (nome, nascimento, endereco, cpf, telefone, email, data_cadastro) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  db.query(sql, [nome, nascimento, endereco, cpf, telefone, email, data_cadastro], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result.rows[0]);
  });
});

// Ler todos os clientes
app.get('/clientes', (req, res) => {
  const sql = `SELECT * FROM cliente`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.rows);
  });
});

// Ler um cliente específico por ID
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM cliente WHERE id = $1`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(results.rows[0]);
  });
});

// Atualizar um cliente por ID
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, nascimento, endereco, cpf, telefone, email, data_cadastro } = req.body;
  const sql = `UPDATE cliente SET nome = $1, nascimento = $2, endereco = $3, cpf = $4, telefone = $5, email = $6, data_cadastro = $7 WHERE id = $8 RETURNING *`;
  db.query(sql, [nome, nascimento, endereco, cpf, telefone, email, data_cadastro, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(result.rows[0]);
  });
});

// Excluir um cliente por ID
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM cliente WHERE id = $1`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.status(204).end();
  });
});

// Criar um novo produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco, sku, data_cadastro } = req.body;
  const sql = `INSERT INTO produto (nome, descricao, preco, sku, data_cadastro) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  db.query(sql, [nome, descricao, preco, sku, data_cadastro], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result.rows[0]);
  });
});

// Ler todos os produtos
app.get('/produtos', (req, res) => {
  const sql = `SELECT * FROM produto`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.rows);
  });
});

// Ler um produto específico por ID
app.get('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM produto WHERE id = $1`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(results.rows[0]);
  });
});

// Atualizar um produto por ID
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, sku, data_cadastro } = req.body;
  const sql = `UPDATE produto SET nome = $1, descricao = $2, preco = $3, sku = $4, data_cadastro = $5 WHERE id = $6 RETURNING *`;
  db.query(sql, [nome, descricao, preco, sku, data_cadastro, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(result.rows[0]);
  });
});

// Excluir um produto por ID
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM produto WHERE id = $1`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(204).end();
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});






