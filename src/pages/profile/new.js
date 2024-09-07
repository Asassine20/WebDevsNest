import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../lib/fetcher';

export default function NewPortfolioItem() {
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  const [workExperience, setWorkExperience] = useState([{ company: '', role: '', duration: '', description: '' }]);
  const [projects, setProjects] = useState([{ name: '', techStack: '', demoLink: '', description: '' }]);

  const router = useRouter();
  const { data: user } = useSWR('/api/auth/user', fetcher);

  const handleAddWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', role: '', duration: '', description: '' }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', techStack: '', demoLink: '', description: '' }]);
  };

  const handleDeleteWorkExperience = (index) => {
    const updatedWorkExperience = workExperience.filter((_, i) => i !== index);
    setWorkExperience(updatedWorkExperience);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result.split(',')[1]); // Base64 content for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    const userId = user.Id;

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
        userId,
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
      <form onSubmit={handleSubmit} className={styles.form}>
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

        <input type="file" accept="image/*" onChange={handleProfileImageChange} className={styles.input} />
        {profileImage && <img src={`data:image/png;base64,${profileImage}`} alt="Profile Preview" className={styles.imagePreview} />}

        <input type="file" accept=".pdf" onChange={handleResumeChange} className={styles.input} />

        <h2>Work Experience</h2>
        {workExperience.map((experience, index) => (
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
              onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
              className={styles.input}
            />
            <button type="button" onClick={() => handleDeleteWorkExperience(index)} className={styles.deleteButton}>
              Delete Work Experience
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddWorkExperience}>
          Add Work Experience
        </button>

        <h2>Projects</h2>
        {projects.map((project, index) => (
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
              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
              className={styles.input}
            />
            <button type="button" onClick={() => handleDeleteProject(index)} className={styles.deleteButton}>
              Delete Project
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddProject}>
          Add Project
        </button>

        <button type="submit" className={styles.button}>
          Create Portfolio
        </button>
      </form>
    </div>
  );
}
