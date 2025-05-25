# 🧠 ToDo Summary Assistant – Backend

This is the backend for the **ToDo Summary Assistant** — a full-stack productivity tool that allows users to manage their to-do items, summarize pending tasks using an LLM (via **Groq API**), and post those summaries to a **Slack channel**.

Built with **Node.js (Express)** and designed to integrate easily with a frontend React application and a PostgreSQL database (e.g., Supabase).

## 🚀 Features

- 📝 Create, read, and delete to-do items via REST API
- 🤖 Summarize all pending tasks using **LLaMA 3** model from **Groq**
- 💬 Send summarized todos to a Slack channel via Incoming Webhook
- 🛡 Clean, modular code structure with `.env` support

## 🏗 Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL (local or via Supabase)
- **LLM Provider**: Groq API (OpenAI-compatible format)
- **Messaging**: Slack Incoming Webhook

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

| Method | Endpoint         | Description                              |
|--------|------------------|------------------------------------------|
| GET    | `/todos`         | Fetch all to-do items                    |
| POST   | `/todos`         | Add a new to-do                          |
| DELETE | `/todos/:id`     | Delete a to-do by ID                     |
| POST   | `/summarize`     | Summarize pending tasks and post to Slack |

## 🔐 Environment Variables

Create a `.env` file in the project root with the following structure:

```env
PORT=3000
DATABASE_URL=your_postgres_connection_string
GROQ_API_KEY=your_groq_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/actual/webhook
```

> ⚠️ Do not commit your `.env` file. Use `.env.example` to share variable names safely.

## 🤖 LLM Integration (Groq API)

This project uses [Groq](https://console.groq.com) to access **LLaMA 3**, a powerful open-source language model.

### Steps to set up:

1. Go to [https://console.groq.com](https://console.groq.com)
2. Create an account and log in
3. Generate your API key
4. Add it to your `.env` as `GROQ_API_KEY`

The app sends a prompt to:

```
https://api.groq.com/openai/v1/chat/completions
```

Using model:

```
llama3-8b-8192
```

## 💬 Slack Integration (Incoming Webhooks)

1. Go to [https://api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)
2. Create a new **Incoming Webhook**
3. Choose the Slack channel where you want summaries to be posted
4. Copy the webhook URL and store it in your `.env` as:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/todo-summary-backend.git
cd todo-summary-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Your `.env`

```bash
cp .env.example .env
```

Fill in the variables using your actual credentials and API keys.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npx nodemon index.js
```

## 🧪 Example API Calls

### ➕ Add a Todo

```http
POST /todos
Content-Type: application/json

{
  "title": "Prepare for deployment",
  "description": "Finalize Docker config and CI/CD setup",
  "completed": false
}
```

### 🧾 Summarize and Send to Slack

```http
POST /summarize
```

> 💬 Response:

```json
{
  "message": "Summary sent to Slack",
  "summary": "• Prepare for deployment\n• Review API docs\n• Finalize the team handoff"
}
```

## 🗃 Database Schema (PostgreSQL)

```sql
CREATE TABLE "Todos" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false
);
```

## 🧰 Developer Tips

- Use [Postman](https://www.postman.com/) or [Hoppscotch](https://hoppscotch.io) to test APIs
- Monitor request volume if you're using free-tier Groq
- All requests to `/summarize` are logged to the console for debugging


## 👤 Author

**Abhishek Kumar Pandey**  
