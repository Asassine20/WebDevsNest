import { query } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { userId, portfolioSlug } = req.query;
        
        if (userId) {
          const projects = await query('SELECT * FROM Portfolio WHERE UserId = ?', [userId]);
          res.status(200).json({ projects });
        } else if (portfolioSlug) {
          const portfolio = await query('SELECT * FROM Portfolio WHERE PortfolioSlug = ?', [portfolioSlug]);
          if (portfolio.length === 0) {
            return res.status(404).json({ error: 'Portfolio not found' });
          }
          res.status(200).json({ portfolio: portfolio[0] });
        } else {
          return res.status(400).json({ error: 'User ID or Portfolio Slug is required' });
        }
        break;
      }

      case 'POST': {
        const { name, content, userId: bodyUserId, resume } = req.body;

        console.log('Received POST request with data:', { name, content, bodyUserId, resume });

        if (!name || !content || !bodyUserId) {
          console.error('Missing required fields:', { name, content, bodyUserId });
          return res.status(400).json({ error: 'Name, content, and userId are required' });
        }

        let resumeFilePath = null;
        let images = [];

        if (resume) {
          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const buffer = Buffer.from(resume, 'base64');
            const fileName = `${name}_resume.pdf`.replace(/\s+/g, '_');
            const filePath = path.join(uploadsDir, fileName);

            fs.writeFileSync(filePath, buffer);
            resumeFilePath = `/uploads/${fileName}`;
          } catch (error) {
            console.error("Error saving resume file:", error);
            return res.status(500).json({ error: 'Error saving resume file' });
          }
        }

        // Process sections and handle image uploads
        for (let section of content) {
          if (section.type === 'image' && section.content) {
            try {
              const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const buffer = Buffer.from(section.content, 'base64');
              const fileName = `${name}_${Date.now()}_image.png`;
              const filePath = path.join(uploadsDir, fileName);

              fs.writeFileSync(filePath, buffer);
              section.content = `/uploads/${fileName}`;
              images.push(`/uploads/${fileName}`);
            } catch (error) {
              console.error('Error saving image file:', error);
              return res.status(500).json({ error: 'Error saving image file' });
            }
          }
        }

        const portfolioSlug = `${name}-portfolio`.replace(/\s+/g, '-').toLowerCase();

        try {
          await query(
            'INSERT INTO Portfolio (Name, ResumeFile, Content, UserId, PortfolioSlug, Images) VALUES (?, ?, ?, ?, ?, ?)',
            [name, resumeFilePath || null, JSON.stringify(content), bodyUserId, portfolioSlug, JSON.stringify(images)]
          );
          console.log('Portfolio created successfully');
        } catch (error) {
          console.error('Error inserting portfolio into database:', error);
          return res.status(500).json({ error: 'Error creating portfolio' });
        }

        res.status(201).json({ message: 'Portfolio item created', portfolioSlug });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
