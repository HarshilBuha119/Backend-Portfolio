import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("hello from this side")
})
// 1. Setup the "Mailman"
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // This helps bypass some network restrictions on cloud hosts
    rejectUnauthorized: false 
  }
});

// 2. The Inquiry Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const timestamp = new Date().toLocaleString();

    // Replace the mailOptions in your server.js
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `DATALINK_ESTABLISHED: ${name.toUpperCase()}`,
        html: `
    <div style="background-color: #120a05; color: #ffffff; padding: 40px; font-family: 'Arial Black', sans-serif; border: 4px solid #ff4d00; max-width: 650px; margin: auto; box-shadow: 0 0 30px rgba(255, 77, 0, 0.4);">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #ff4d00; font-style: italic; text-transform: uppercase; font-size: 32px; letter-spacing: -2px; margin: 0;">
          Incoming <span style="color: #ffaa00;">Transmission</span>
        </h1>
        <div style="font-size: 10px; color: #ff9d6e; letter-spacing: 3px; margin-top: 5px;">PROTOCOL: SECURE_INQUIRY_v1.0</div>
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 30px;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 77, 0, 0.3); padding: 15px; flex: 1;">
          <div style="font-size: 9px; color: #ff9d6e; text-transform: uppercase; letter-spacing: 2px;">Origin_Operator</div>
          <div style="font-size: 18px; color: #fff;">${name}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 77, 0, 0.3); padding: 15px; flex: 1;">
          <div style="font-size: 9px; color: #ff9d6e; text-transform: uppercase; letter-spacing: 2px;">Uplink_Signal</div>
          <div style="font-size: 18px; color: #ffaa00;">${email}</div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.02); border-left: 4px solid #ff4d00; padding: 20px; margin-bottom: 30px;">
        <div style="font-size: 10px; color: #666; margin-bottom: 15px;">// DECODING_MESSAGE_CONTENT...</div>
        <p style="font-family: 'Courier New', monospace; font-size: 15px; line-height: 1.6; color: #ff9d6e; white-space: pre-wrap; margin: 0;">
"${message}"
        </p>
      </div>

      <div style="text-align: right;">
        <span style="font-size: 10px; color: #444; text-transform: uppercase;">End of Signal | Ahmedabad_Base_India</span>
      </div>
    </div>
  `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'SUCCESS', message: 'Transmission Sent' });
    } catch (error) {
        console.error("Mail Error:", error);
        res.status(500).json({ status: 'ERROR', message: 'Uplink Failed' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Backend Terminal Active on Port ${process.env.PORT}`);
});
