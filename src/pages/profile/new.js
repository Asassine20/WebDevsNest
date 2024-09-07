import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../lib/fetcher';
import { FaTrash, FaPlus } from 'react-icons/fa'; // Import icons

export default function NewPortfolioItem() {
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  const [workExperience, setWorkExperience] = useState([{ company: '', role: '', duration: '', description: '' }]);
  const [projects, setProjects] = useState([{ name: '', techStack: '', demoLink: '', description: '' }]);

  const router = useRouter();
  const { data: user } = useSWR('/api/auth/user', fetcher);

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
    setResume(file);
  };

  const handleAddWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', role: '', duration: '', description: '' }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', techStack: '', demoLink: '', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        university,
        profileImage,
        resume,
        workExperience,
        projects,
        userId: user.Id,
      }),
    });

    if (response.ok) {
      router.push('/profile/dashboard');
    } else {
      console.error('Failed to create portfolio');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Portfolio</h1>
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
          Create Portfolio
        </button>
      </form>
    </div>
  );
}
