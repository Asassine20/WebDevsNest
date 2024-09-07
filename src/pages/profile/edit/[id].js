import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../../lib/fetcher';
import { FaTrash, FaPlus } from 'react-icons/fa'; // Import icons

export default function EditPortfolioItem() {
  const router = useRouter();
  const { id } = router.query;
  const { data: portfolioItem, error } = useSWR(id ? `/api/portfolio?id=${id}` : null, fetcher);

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (portfolioItem) {
      setName(portfolioItem.portfolio.Name || '');
      setUniversity(portfolioItem.portfolio.University || '');
      setProfileImage(portfolioItem.portfolio.ProfileImage || '');
      setResume(portfolioItem.portfolio.ResumeFile || '');

      const parsedWorkExperience = portfolioItem.portfolio.WorkExperience
        ? JSON.parse(portfolioItem.portfolio.WorkExperience)
        : [];
      setWorkExperience(parsedWorkExperience);

      const parsedProjects = portfolioItem.portfolio.Projects
        ? JSON.parse(portfolioItem.portfolio.Projects)
        : [];
      setProjects(parsedProjects);
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file); // Save the resume file
  };

  const handleAddWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', role: '', duration: '', description: '' }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', techStack: '', demoLink: '', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('university', university);
    formData.append('profileImage', profileImage);
    formData.append('resume', resume); // Append resume file if changed
    formData.append('workExperience', JSON.stringify(workExperience));
    formData.append('projects', JSON.stringify(projects));

    const response = await fetch(`/api/portfolio?id=${id}`, {
      method: 'PUT',
      body: formData, // Use FormData for handling files
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

  return (
    <div className={styles.container}>
      <h1>Edit Portfolio</h1>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="University"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className={styles.input}
        />

        <h4>Profile Image</h4>
        <input type="file" accept="image/*" onChange={handleProfileImageChange} className={styles.input} />
        {profileImage && <img src={`data:image/png;base64,${profileImage}`} alt="Profile Preview" className={styles.imagePreview} />}

        {/* Show current resume file */}
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
                value={experience.company}
                onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Role"
                value={experience.role}
                onChange={(e) => handleWorkExperienceChange(index, 'role', e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Duration"
                value={experience.duration}
                onChange={(e) => handleWorkExperienceChange(index, 'duration', e.target.value)}
                className={styles.input}
              />
              <textarea
                placeholder="Description"
                value={experience.description}
                maxLength="1000"
                onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                className={styles.input}
              />
              <div>{1000 - experience.description.length} characters remaining</div>
              <div className={styles.buttons}>
                <button type="button" onClick={() => handleDeleteWorkExperience(index)} className={styles.deleteButton}>
                  <FaTrash />
                </button>
                {/* Add button next to delete for new work experience entry */}
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
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Tech Stack"
                value={project.techStack}
                onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)}
                className={styles.input}
              />
              <input
                type="url"
                placeholder="Demo Link"
                value={project.demoLink}
                onChange={(e) => handleProjectChange(index, 'demoLink', e.target.value)}
                className={styles.input}
              />
              <textarea
                placeholder="Description"
                value={project.description}
                maxLength="1000"
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                className={styles.input}
              />
              <div>{1000 - project.description.length} characters remaining</div>
              <div className={styles.buttons}>
                <button type="button" onClick={() => handleDeleteProject(index)} className={styles.deleteButton}>
                  <FaTrashAlt />
                </button>
                {/* Add button next to delete for new project entry */}
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
