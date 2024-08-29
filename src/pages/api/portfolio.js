import { query } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { userId, portfolioSlug } = req.query;
        
        // Handle getting portfolio by userId or portfolioSlug
        if (userId) {
          const projects = await query('SELECT * FROM Portfolio WHERE UserId = ?', [userId]);
          console.log("Projects fetched: ", projects);
          res.status(200).json({ projects });
        } else if (portfolioSlug) {
          const portfolio = await query('SELECT * FROM Portfolio WHERE PortfolioSlug = ?', [portfolioSlug]);
          console.log("Portfolio fetched: ", portfolio);
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

        // Ensure all required fields are provided
        if (!name || !content || !bodyUserId) {
          return res.status(400).json({ error: 'Name, content, and userId are required' });
        }

        let resumeFilePath = null;

        // Handle file upload
        if (resume) {
          try {
            console.log("Processing resume file");

            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              console.log("Creating uploads directory");
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const buffer = Buffer.from(resume, 'base64');
            const fileName = `${name}_resume.pdf`.replace(/\s+/g, '_');
            const filePath = path.join(uploadsDir, fileName);

            // Save the file
            fs.writeFileSync(filePath, buffer);
            resumeFilePath = `/uploads/${fileName}`;
          } catch (error) {
            console.error("Error saving resume file:", error);
            return res.status(500).json({ error: 'Error saving resume file' });
          }
        }

        // Create a portfolio slug
        const portfolioSlug = `${name}-portfolio`.replace(/\s+/g, '-').toLowerCase();

        // Insert into database
        await query(
          'INSERT INTO Portfolio (Name, ResumeFile, Content, UserId, PortfolioSlug) VALUES (?, ?, ?, ?, ?)',
          [name, resumeFilePath || null, content, bodyUserId, portfolioSlug]
        );

        res.status(201).json({ message: 'Portfolio item created', portfolioSlug });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
