const express = require("express")
const client  = require("./db")
const summarizeTodos = require('./summarize');

const app = express()

require('dotenv').config()
app.use(express.json())

app.get('/todos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "Todos"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  const { title, description = '', completed = false } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await client.query(
      'INSERT INTO "Todos" (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


// DELETE /todos/:id – Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM "Todos" WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/summarize', summarizeTodos);

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const result = await client.query(
      `UPDATE "Todos" 
       SET title = $1, description = $2, completed = $3 
       WHERE id = $4 RETURNING *`,
      [title, description, completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, todo: result.rows[0] });
  } catch (err) {
    console.error("Edit error:", err.message);
    res.status(500).json({ success: false, error: "Failed to edit todo" });
  }
});

app.listen(3000,()=>{
    console.log(`App is running in the ${process.env.PORT}`)
})