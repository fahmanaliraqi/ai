// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

// مفتاح Gemini API
const API_KEY = "AIzaSyDYaqnt0hL8iNKzAhVzvZq5yZcyosj3QP0";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // يخلي يفتح HTML / CSS / JS

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "لا يوجد رسالة" });

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 300 },
      }),
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد رد من Gemini";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ reply: "حدث خطأ بالاتصال بالـ API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
