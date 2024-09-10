import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../../lib/fetcher';
import { FaTrash, FaPlus } from 'react-icons/fa'; // Import icons
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

export default function EditPortfolioItem() {
  const router = useRouter();
  const { id } = router.query;
  const { data: portfolioItem, error } = useSWR(id ? `/api/portfolio?id=${id}` : null, fetcher);

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (portfolioItem && portfolioItem.portfolio) {
      console.log('Portfolio Item:', portfolioItem); // Log portfolioItem for debugging
  
      setName(portfolioItem.portfolio.Name || '');
      setUniversity(portfolioItem.portfolio.University || '');
      setProfileImage(portfolioItem.portfolio.ProfileImage || null);
      setResume(portfolioItem.portfolio.ResumeFile || null);
      setGithubLink(portfolioItem.portfolio.GithubLink || '');
      setLinkedinLink(portfolioItem.portfolio.LinkedinLink || '');
  
      // Parse work experience and projects
      try {
        const parsedWorkExperience = portfolioItem.portfolio.WorkExperience
          ? JSON.parse(JSON.parse(portfolioItem.portfolio.WorkExperience)) // Double parse to handle the nested string
          : [];
        console.log('Parsed Work Experience:', parsedWorkExperience); // Log parsed work experience
        setWorkExperience(parsedWorkExperience);
  
        const parsedProjects = portfolioItem.portfolio.Projects
          ? JSON.parse(JSON.parse(portfolioItem.portfolio.Projects)) // Double parse to handle the nested string
          : [];
        console.log('Parsed Projects:', parsedProjects); // Log parsed projects
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Error parsing work experience or projects:', error);
      }
    }
  }, [portfolioItem]);
  

  const handleWorkExperienceChange = (index, field, value) => {
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience[index][field] = value;
    setWorkExperience(updatedWorkExperience);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleDeleteWorkExperience = (index) => {
    const updatedWorkExperience = workExperience.filter((_, i) => i !== index);
    setWorkExperience(updatedWorkExperience);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAddWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', role: '', startDate: null, endDate: null, description: '' }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', techStack: '', demoLink: '', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name || '');
    formData.append('university', university || '');
    formData.append('githubLink', githubLink || '');
    formData.append('linkedinLink', linkedinLink || '');
  
    // Include profile image only if changed
    if (profileImage && typeof profileImage === 'object') {
      formData.append('profileImage', profileImage);
    } else {
      formData.append('existingProfileImage', profileImage || '');
    }
  
    // Include resume only if changed
    if (resume && typeof resume === 'object') {
      formData.append('resume', resume);
    } else {
      formData.append('existingResume', resume || '');
    }
  
    // Append work experience and projects
    formData.append('workExperience', JSON.stringify(workExperience));
    formData.append('projects', JSON.stringify(projects));
  
    const response = await fetch(`/api/portfolio?id=${id}`, {
      method: 'PUT',
      body: formData,
    });
  
    if (response.ok) {
      router.push('/profile/dashboard');
    } else {
      console.error('Failed to update portfolio');
    }
  };  

  if (error) {
    return <div>Error loading portfolio data</div>;
  }

  if (!portfolioItem) {
    return <div>Loading...</div>;
  }

  const isFile = profileImage instanceof File;

  return (
    <div className={styles.container}>
      <h1>Edit Portfolio</h1>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Full Name"
          value={name || ''}
          onChange={(e) => setName(e.target.value || '')}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="University"
          value={university || ''}
          onChange={(e) => setUniversity(e.target.value || '')}
          className={styles.input}
        />
        <input
          type="url"
          placeholder="GitHub Link"
          value={githubLink || ''}
          onChange={(e) => setGithubLink(e.target.value)}
          className={styles.input}
        />
        <input
          type="url"
          placeholder="LinkedIn Link"
          value={linkedinLink || ''}
          onChange={(e) => setLinkedinLink(e.target.value)}
          className={styles.input}
        />

        <h4>Profile Image</h4>
        <input type="file" accept="image/*" onChange={handleProfileImageChange} className={styles.input} />
        {profileImage && (
          <img
            src={isFile ? URL.createObjectURL(profileImage) : profileImage}
            alt="Profile Preview"
            className={styles.imagePreview}
          />
        )}

        {resume && (
          <a href={resume} download className={styles.resumeLink}>
            Download Current Resume
          </a>
        )}
        <h4>Resume</h4>
        <input type="file" accept=".pdf" onChange={handleResumeChange} className={styles.input} />

        <h2>Work Experience</h2>
        {workExperience.length === 0 ? (
          <div>
            <p>No work experience added yet. Click the button below to add.</p>
            <button type="button" onClick={handleAddWorkExperience} className={styles.addButton}>
              <FaPlus />
            </button>
          </div>
        ) : (
          workExperience.map((experience, index) => (
            <div key={index} className={styles.workExperience}>
              <input
                type="text"
                placeholder="Company"
                value={experience.company || ''}
                onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Role"
                value={experience.role || ''}
                onChange={(e) => handleWorkExperienceChange(index, 'role', e.target.value)}
                className={styles.input}
              />
              <div className={styles.datePickerContainer}>
                <label>Start Date</label>
                <DatePicker
                  selected={experience.startDate ? new Date(experience.startDate) : null}
                  onChange={(date) => handleWorkExperienceChange(index, 'startDate', moment(date).format('YYYY-MM'))}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className={styles.input}
                  placeholderText="Select Start Date"
                />
              </div>
              <div className={styles.datePickerContainer}>
                <label>End Date</label>
                <DatePicker
                  selected={experience.endDate ? new Date(experience.endDate) : null}
                  onChange={(date) => handleWorkExperienceChange(index, 'endDate', moment(date).format('YYYY-MM'))}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className={styles.input}
                  placeholderText="Select End Date"
                />
              </div>
              <textarea
                placeholder="Description"
                value={experience.description || ''}
                maxLength="1000"
                onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                className={styles.input}
              />
              <div>{1000 - (experience.description ? experience.description.length : 0)} characters remaining</div>
              <div className={styles.buttons}>
                <button type="button" onClick={() => handleDeleteWorkExperience(index)} className={styles.deleteButton}>
                  <FaTrash />
                </button>
                {index === workExperience.length - 1 && (
                  <button type="button" onClick={handleAddWorkExperience} className={styles.addButton}>
                    <FaPlus />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <h2>Projects</h2>
        {projects.length === 0 ? (
          <div>
            <p>No projects added yet. Click the button below to add.</p>
            <button type="button" onClick={handleAddProject} className={styles.addButton}>
              <FaPlus />
            </button>
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={index} className={styles.project}>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name || ''}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Tech Stack"
                value={project.techStack || ''}
                onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)}
                className={styles.input}
              />
              <input
                type="url"
                placeholder="Demo Link"
                value={project.demoLink || ''}
                onChange={(e) => handleProjectChange(index, 'demoLink', e.target.value)}
                className={styles.input}
              />
              <textarea
                placeholder="Description"
                value={project.description || ''}
                maxLength="1000"
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                className={styles.input}
              />
              <div>{1000 - (project.description ? project.description.length : 0)} characters remaining</div>
              <div className={styles.buttons}>
                <button type="button" onClick={() => handleDeleteProject(index)} className={styles.deleteButton}>
                  <FaTrash />
                </button>
                {index === projects.length - 1 && (
                  <button type="button" onClick={handleAddProject} className={styles.addButton}>
                    <FaPlus />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <button type="submit" className={styles.button}>
          Update Portfolio
        </button>
      </form>
    </div>
  );
}
