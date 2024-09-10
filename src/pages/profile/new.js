import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../lib/fetcher';
import { FaTrash, FaPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

export default function NewPortfolioItem() {
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [githubLink, setGithubLink] = useState('');  // New state for GitHub link
  const [linkedinLink, setLinkedinLink] = useState('');  // New state for LinkedIn link

  const [workExperience, setWorkExperience] = useState([
    { company: '', role: '', startDate: null, endDate: null, description: '' }
  ]);

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

    if (!user) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('university', university);
    formData.append('userId', user.Id);

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    if (resume) {
      formData.append('resume', resume);
    }

    formData.append('githubLink', githubLink);  // Append GitHub link
    formData.append('linkedinLink', linkedinLink);  // Append LinkedIn link
    formData.append('workExperience', JSON.stringify(workExperience));
    formData.append('projects', JSON.stringify(projects));

    const response = await fetch('/api/portfolio', {
      method: 'POST',
      body: formData,
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
        <input
          type="url"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className={styles.input}
        />
        <input
          type="url"
          placeholder="LinkedIn Link"
          value={linkedinLink}
          onChange={(e) => setLinkedinLink(e.target.value)}
          className={styles.input}
        />

        <h4>Profile Image</h4>
        <input type="file" accept="image/*" onChange={handleProfileImageChange} className={styles.input} />
        {profileImage && <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" className={styles.imagePreview} />}

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
