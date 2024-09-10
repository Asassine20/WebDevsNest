import formidable from 'formidable';
import { query } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { id, portfolioSlug, userId } = req.query;

        if (!id && !portfolioSlug && !userId) {
          return res.status(400).json({ error: 'ID, portfolioSlug, or userId is required' });
        }

        if (id) {
          const portfolio = await query('SELECT * FROM Portfolio WHERE Id = ?', [id]);
          if (portfolio.length === 0) {
            return res.status(200).json({ portfolio: null });
          }
          res.status(200).json({ portfolio: portfolio[0] });
        } else if (portfolioSlug) {
          const portfolio = await query('SELECT * FROM Portfolio WHERE PortfolioSlug = ?', [portfolioSlug]);
          if (portfolio.length === 0) {
            return res.status(200).json({ portfolio: null });
          }
          res.status(200).json({ portfolio: portfolio[0] });
        } else if (userId) {
          const portfolios = await query('SELECT * FROM Portfolio WHERE UserId = ?', [userId]);
          res.status(200).json({ projects: portfolios });
        }
        break;
      }
      case 'POST': {
        const form = formidable({
          multiples: false,
          keepExtensions: true,
          maxFileSize: 2 * 1024 * 1024, // 2MB file size limit
        });

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        form.uploadDir = uploadDir;

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Form parse error' });
          }

          const name = fields.name ? String(fields.name) : '';
          const university = fields.university ? String(fields.university) : '';
          const githubLink = fields.githubLink ? String(fields.githubLink) : '';  // Handle GitHub link
          const linkedinLink = fields.linkedinLink ? String(fields.linkedinLink) : '';  // Handle LinkedIn link
          const userId = fields.userId ? String(fields.userId) : '';
          const workExperience = fields.workExperience || '[]';
          const projects = fields.projects || '[]';

          let profileImagePath = null;
          let resumeFilePath = null;

          if (files.profileImage && files.profileImage[0] && files.profileImage[0].filepath) {
            profileImagePath = `/uploads/${path.basename(files.profileImage[0].filepath)}`;
          }

          if (files.resume && files.resume[0] && files.resume[0].filepath) {
            const originalFilename = files.resume[0].originalFilename;
            const newFilePath = path.join(uploadDir, originalFilename);
            fs.renameSync(files.resume[0].filepath, newFilePath);
            resumeFilePath = `/uploads/${originalFilename}`;
          }

          const portfolioSlug = name
            ? name.replace(/\s+/g, '-').toLowerCase() + '-portfolio'
            : `portfolio-${Date.now()}`;

          const result = await query(
            'INSERT INTO Portfolio (Name, University, ProfileImage, ResumeFile, GithubLink, LinkedinLink, WorkExperience, Projects, UserId, PortfolioSlug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              name || null,
              university || null,
              profileImagePath || null,
              resumeFilePath || null,
              githubLink || null,
              linkedinLink || null,
              workExperience,
              projects,
              userId,
              portfolioSlug,
            ]
          );

          if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Portfolio created', portfolioSlug });
          } else {
            res.status(500).json({ message: 'Failed to create portfolio' });
          }
        });

        break;
      }
      case 'PUT': {
        const { id } = req.query;
      
        if (!id) {
          return res.status(400).json({ error: 'Portfolio ID is required' });
        }
      
        const form = formidable({
          multiples: false, 
          keepExtensions: true,
          maxFileSize: 2 * 1024 * 1024, // 2MB file size limit
        });
      
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      
        form.uploadDir = uploadDir;
      
        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Form parse error' });
          }
      
          const name = fields.name || '';
          const university = fields.university || '';
          const githubLink = fields.githubLink || '';
          const linkedinLink = fields.linkedinLink || '';
          const workExperience = fields.workExperience || '[]';
          const projects = fields.projects || '[]';
      
          let profileImagePath = fields.profileImage || fields.existingProfileImage || null;
          let resumeFilePath = fields.resume || fields.existingResume || null;
      
          // Handle profile image file
          if (files.profileImage && files.profileImage[0] && files.profileImage[0].filepath) {
            profileImagePath = `/uploads/${path.basename(files.profileImage[0].filepath)}`;
          }
      
          // Handle resume file
          if (files.resume && files.resume[0] && files.resume[0].filepath) {
            const originalFilename = files.resume[0].originalFilename;
            const newFilePath = path.join(uploadDir, originalFilename);
            fs.renameSync(files.resume[0].filepath, newFilePath);
            resumeFilePath = `/uploads/${originalFilename}`;
          }
      
          // Update portfolio data in the database
          await query(
            'UPDATE Portfolio SET Name = ?, University = ?, ProfileImage = ?, ResumeFile = ?, GithubLink = ?, LinkedinLink = ?, WorkExperience = ?, Projects = ? WHERE Id = ?',
            [
              name,
              university,
              profileImagePath,
              resumeFilePath,
              githubLink,
              linkedinLink,
              workExperience,
              projects,
              id
            ]
          );
      
          res.status(200).json({ message: 'Portfolio updated' });
        });
      
        break;
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: 'Portfolio ID is required' });
        }

        await query('DELETE FROM Portfolio WHERE Id = ?', [id]);
        res.status(200).json({ message: 'Portfolio deleted successfully' });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}