import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/todos');
      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        console.error('Unexpected response:', res.data);
        setTodos([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/todos', { title, description });
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  // Save edited todo
  const saveEdit = async (id) => {
    try {
      await axios.put(`/todos/${id}`, {
        title: editTitle,
        description: editDescription,
        completed: false, // or get current completed status if you track it
      });
      setEditingId(null);
      fetchTodos();
    } catch (err) {
      alert('Failed to update todo');
    }
  };

  const summarizeTodos = async () => {
    try {
      const res = await axios.post('/summarize');
      setMessage(res.data.summary);
    } catch (err) {
      setMessage('Failed to summarize todos');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Todo Summary Assistant</h1>

      <form onSubmit={addTodo}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '8px' }}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <b>{todo.title}</b>: {todo.description || 'No description'}
                <button onClick={() => {
                  setEditingId(todo.id);
                  setEditTitle(todo.title);
                  setEditDescription(todo.description || '');
                }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={summarizeTodos}>Summarize & Send to Slack</button>

      {message && (
        <p><b>Summary:</b> {message}</p>
      )}
    </div>
  );
}

export default App;
