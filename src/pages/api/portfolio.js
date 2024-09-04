import { query } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
        case 'GET': {
            const { userId, portfolioSlug, id } = req.query;
            
            console.log('Received GET request with:', { userId, portfolioSlug, id });
    
            if (id) {
              const portfolio = await query('SELECT * FROM Portfolio WHERE Id = ?', [id]);
              if (portfolio.length === 0) {
                console.log('Portfolio not found');
                return res.status(404).json({ error: 'Portfolio not found' });
              }
              console.log('Portfolio data:', portfolio[0]);
              res.status(200).json({ portfolio: portfolio[0] });
            } else if (userId) {
              const projects = await query('SELECT * FROM Portfolio WHERE UserId = ?', [userId]);
              console.log('Projects fetched:', projects);
              res.status(200).json({ projects });
            } else if (portfolioSlug) {
              const portfolio = await query('SELECT * FROM Portfolio WHERE PortfolioSlug = ?', [portfolioSlug]);
              if (portfolio.length === 0) {
                console.log('Portfolio not found by slug');
                return res.status(404).json({ error: 'Portfolio not found' });
              }
              console.log('Portfolio data by slug:', portfolio[0]);
              res.status(200).json({ portfolio: portfolio[0] });
            } else {
              console.log('Invalid request: No userId, portfolioSlug, or id');
              return res.status(400).json({ error: 'User ID, Portfolio Slug, or ID is required' });
            }
            break;
          }

      case 'POST': {
        const { name, content, userId: bodyUserId, resume } = req.body;

        if (!name || !content || !bodyUserId) {
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
        } catch (error) {
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
