import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/NewPortfolioItem.module.css';
import fetcher from '../../../lib/fetcher';

export default function NewPortfolioItem() {
  const [name, setName] = useState('');
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Add state for profile image
  const [sections, setSections] = useState([]);
  const router = useRouter();

  // Fetch the user data to get the userId
  const { data: user } = useSWR('/api/auth/user', fetcher);

  const addSection = (type) => {
    setSections((prevSections) => [
      ...prevSections,
      { type, content: '' },
    ]);
  };

  const updateSectionContent = (index, content) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, content } : section
      )
    );
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume(reader.result.split(',')[1]); // Get the base64 content
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result.split(',')[1]); // Get the base64 content
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error('User not found');
      return;
    }

    const userId = user.Id;

    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content: sections, userId, resume, profileImage }), // Send profile image with the request
    });

    if (response.ok) {
      console.log('Portfolio created successfully');
      router.push('/profile/dashboard');
    } else {
      console.error('Failed to create portfolio');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Portfolio Item</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        
        {/* Profile Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className={styles.input}
          placeholder="Profile Image"
        />
        
        {/* Resume Input */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeChange}
          className={styles.input}
        />
        
        {/* Sections */}
        <div className={styles.sections}>
          {sections.map((section, index) => (
            <div key={index} className={styles.section}>
              {section.type === 'title' && (
                <input
                  type="text"
                  placeholder="Title"
                  value={section.content}
                  onChange={(e) =>
                    updateSectionContent(index, e.target.value)
                  }
                  className={styles.input}
                />
              )}
              {section.type === 'text' && (
                <textarea
                  placeholder="Text Caption"
                  value={section.content}
                  onChange={(e) =>
                    updateSectionContent(index, e.target.value)
                  }
                  className={styles.input}
                />
              )}
              {section.type === 'image' && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateSectionContent(index, reader.result.split(',')[1]);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={styles.input}
                />
              )}
              {section.type === 'link' && (
                <input
                  type="url"
                  placeholder="Link"
                  value={section.content}
                  onChange={(e) =>
                    updateSectionContent(index, e.target.value)
                  }
                  className={styles.input}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add Section Buttons */}
        <div className={styles.buttons}>
          <button type="button" onClick={() => addSection('title')}>
            Add Title
          </button>
          <button type="button" onClick={() => addSection('text')}>
            Add Text Caption
          </button>
          <button type="button" onClick={() => addSection('image')}>
            Add Image
          </button>
          <button type="button" onClick={() => addSection('link')}>
            Add Link
          </button>
        </div>

        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
}
