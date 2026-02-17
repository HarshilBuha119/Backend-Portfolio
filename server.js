import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// The Inquiry Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'harshilbuha119@gmail.com', 
      subject: `PORTFOLIO TRANSMISSION: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #8b5cf6;">New Message Received</h2>
          <p><strong>Sender:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="white-space: pre-wrap; color: #333;">${message}</p>
        </div>
      `,
    });

    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server active on port ${PORT}`);
});