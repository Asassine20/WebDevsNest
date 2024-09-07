import { query } from '../../../lib/db';

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
        const { name, university, profileImage, resume, workExperience, projects, userId } = req.body;

        if (!userId) {
          return res.status(400).json({ error: 'UserId is required' });
        }

        const portfolioSlug = name ? name.replace(/\s+/g, '-').toLowerCase() + '-portfolio' : null;

        // Ensure undefined values are replaced with valid defaults
        await query(
          'INSERT INTO Portfolio (Name, University, ProfileImage, ResumeFile, WorkExperience, Projects, UserId, PortfolioSlug) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            name || null,
            university || null,
            profileImage || null,
            resume || null,
            JSON.stringify(workExperience || []), // Save empty array as default
            JSON.stringify(projects || []), // Save empty array as default
            userId,
            portfolioSlug
          ]
        );
        res.status(201).json({ message: 'Portfolio created', portfolioSlug });
        break;
      }

      case 'PUT': {
        const { id } = req.query;
        const { name, university, profileImage, resume, workExperience, projects } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Portfolio ID is required' });
        }

        // Ensure undefined values are replaced with valid defaults
        await query(
          'UPDATE Portfolio SET Name = ?, University = ?, ProfileImage = ?, ResumeFile = ?, WorkExperience = ?, Projects = ? WHERE Id = ?',
          [
            name || null,
            university || null,
            profileImage || null,
            resume || null,
            JSON.stringify(workExperience || []), // Save empty array as default
            JSON.stringify(projects || []), // Save empty array as default
            id
          ]
        );
        res.status(200).json({ message: 'Portfolio updated' });
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