// summarize.js
const axios = require('axios');
const client = require('./db');

async function getTodosFromDB() {
  const result = await client.query('SELECT * FROM "Todos"');
  return result.rows;
}

const summarizeTodos = async (req, res) => {
  try {
    const todos = await getTodosFromDB();
    const pending = todos.filter(todo => !todo.completed);

    if (pending.length === 0) {
      return res.json({ success: true, summary: "No pending todos!" });
    }

    const prompt = `Summarize the following pending to-dos:\n\n${pending.map(
      (t, i) => `${i + 1}. ${t.title} - ${t.description}`
    ).join('\n')}`;

    const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = groqResponse.data.choices[0].message.content;

    // Send to Slack
    await axios.post(process.env.SLACK_WEBHOOK_URL, { text: summary });

    res.json({ success: true, summary });
  } catch (err) {
    console.error("Error in summarize:", err.message);
    res.status(500).json({ success: false, error: "Failed to summarize todos" });
  }
};

module.exports = summarizeTodos;
