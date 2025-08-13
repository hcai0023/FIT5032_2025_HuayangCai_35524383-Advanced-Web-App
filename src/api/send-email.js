import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
    return res.status(200).end();
    }
    // 设置响应头确保返回 JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['POST']
      });
    }

    // 确保请求体是 JSON
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid request body',
        expected: 'JSON object'
      });
    }

    const { to, subject, text, attachment } = req.body;
    
    // 验证输入
    if (!to || !subject || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['to', 'subject', 'text']
      });
    }

    // 确保环境变量已设置
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable is not set');
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });

    // 邮件选项
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@example.com',
      to,
      subject,
      text,
      attachments: attachment ? [{
        filename: attachment.filename,
        content: Buffer.from(attachment.content, 'base64'),
        contentType: attachment.contentType
      }] : []
    };
    console.log('请求头:', req.headers);
    console.log('请求体:', JSON.stringify(req.body, null, 2));
    console.log('环境变量:', {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '已设置' : '未设置',
    FROM_EMAIL: process.env.FROM_EMAIL || '未设置'
    });
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true,
      message: `Email sent to ${to}`,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('Email error:', error);
    // 确保返回有效的 JSON 错误响应
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}