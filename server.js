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

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'harshilbuha119@gmail.com', // Your static email (The Destination)
      reply_to: email,               // If you hit "Reply" in Gmail, it goes to the user
      subject: `UPLINK: Message from ${name}`,
      html: `
  <div style="
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    font-family: 'Helvetica Neue', Arial, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 50px 20px;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
          ">
            
            <!-- Header -->
            <tr>
              <td style="
                padding: 30px;
                background: linear-gradient(135deg, #ea580c, #f59e0b);
                color: #ffffff;
                text-align: center;
              ">
                <h1 style="
                  margin: 0;
                  font-size: 22px;
                  font-weight: 600;
                  letter-spacing: 1px;
                ">
                  Portfolio Contact Request
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 35px; color: #1f2937;">

                <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                  You have received a new message through your portfolio website.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px;">
                      <strong style="color: #ea580c;">Full Name:</strong><br/>
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px;">
                      <strong style="color: #ea580c;">Email Address:</strong><br/>
                      ${email}
                    </td>
                  </tr>
                </table>

                <!-- Message Section -->
                <div style="
                  background: #fff7ed;
                  border: 1px solid #fed7aa;
                  border-left: 4px solid #ea580c;
                  padding: 20px;
                  border-radius: 6px;
                  font-size: 14px;
                  line-height: 1.7;
                  color: #374151;
                ">
                  ${message}
                </div>

                <!-- Footer -->
                <p style="
                  margin-top: 30px;
                  font-size: 12px;
                  color: #9ca3af;
                  text-align: right;
                ">
                  Received on ${new Date().toLocaleString()}
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
`

    });

    // Send success back to frontend
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    console.error("Resend System Error:", error);
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SYSTEM] Server active on port ${PORT}`);
});