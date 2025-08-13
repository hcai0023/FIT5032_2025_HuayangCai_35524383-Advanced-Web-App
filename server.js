import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import cors from 'cors';

dotenv.config();

console.log('Environment variables:');
console.log('SENDGRID_USER:', process.env.SENDGRID_USER);
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '***' + process.env.SENDGRID_API_KEY.slice(-4) : 'Not set');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:5173', // 确保与前端地址匹配
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/api/send-email', upload.single('attachment'), async (req, res) => {
  console.log('Received email request');
  
  try {
    const { to, subject, text } = req.body;
    const attachment = req.file;
    
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Attachment:', attachment ? attachment.originalname : 'None');

    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_API_KEY
      }
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      attachments: attachment ? [{
        filename: attachment.originalname,
        content: attachment.buffer
      }] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    
    res.status(200).json({ 
      message: 'Email sent successfully',
      info: info.response
    });
  } catch (error) {
    console.error('Email error:', error);
    
    // 详细错误信息
    if (error.response) {
      console.error('SendGrid response body:', error.response.body);
    }
    
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});