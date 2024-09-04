import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/NewPortfolioItem.module.css'; // Adjust path as needed
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import fetcher from '../../../../lib/fetcher';
import useSWR from 'swr';

// Dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

export default function EditPortfolioItem() {
  const router = useRouter();
  const { id } = router.query;

  const { data: portfolioItem, error } = useSWR(id ? `/api/portfolio?id=${id}` : null, fetcher);

  const [name, setName] = useState('');
  const [content, setContent] = useState([]);
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  // Populate form with pre-existing portfolio data
  useEffect(() => {
    if (portfolioItem && portfolioItem.portfolio) {
      console.log('Portfolio item data:', portfolioItem);

      try {
        if (portfolioItem.portfolio.Content && portfolioItem.portfolio.Content !== 'undefined') {
          const parsedContent = JSON.parse(portfolioItem.portfolio.Content);
          console.log('Parsed content:', parsedContent);
          setContent(parsedContent);
        } else {
          console.error('Content is either undefined or empty');
        }

        setName(portfolioItem.portfolio.Name);
        setResume(portfolioItem.portfolio.ResumeFile);
        setProfileImage(portfolioItem.portfolio.ProfileImage); // Set profile image
      } catch (error) {
        console.error('Error parsing portfolio content:', error);
      }
    } else if (error) {
      console.error('Error loading portfolio item:', error);
    }
  }, [portfolioItem, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form with:', { name, content, resume, profileImage });

    const response = await fetch(`/api/portfolio?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, content, resume, profileImage }), // Send updated profile image
    });

    if (response.ok) {
      console.log('Portfolio updated successfully');
      router.push('/profile/dashboard');
    } else {
      console.error('Failed to update portfolio');
    }
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
        setProfileImage(reader.result.split(',')[1]); // Get the base64 content for profile image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = useCallback((result) => {
    if (!result.destination) return; // Ensure valid drop

    const newItems = Array.from(content);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setContent(newItems);
    console.log('Rearranged content:', newItems);
  }, [content]);

  const handleAddSection = (type) => {
    const updatedContent = [...content, { type, content: '' }];
    setContent(updatedContent);
    console.log('Added section:', updatedContent);
  };

  const handleSectionChange = (index, newContent) => {
    const updatedContent = [...content];
    updatedContent[index].content = newContent;
    setContent(updatedContent);
    console.log('Updated section content:', updatedContent);
  };

  const renderPreview = () => {
    return content.map((section, index) => {
      switch (section.type) {
        case 'title':
          return <h2 key={index}>{section.content}</h2>;
        case 'text':
          return <p key={index} className={styles.previewText}>{section.content}</p>;
        case 'image':
          return (
            <div key={index} className={styles.imagePreview}>
              <img src={section.content} alt="Portfolio image" />
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (error) return <div>Error loading portfolio item</div>;
  if (!portfolioItem) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Edit Portfolio Item</h1>
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
        />
        {profileImage && (
          <p>Current Profile Image: <a href={profileImage} target="_blank" rel="noopener noreferrer">View Profile Image</a></p>
        )}

        {/* Resume Input */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeChange}
          className={styles.input}
        />
        {resume && (
          <p>Current Resume: <a href={resume} download>Download Resume</a></p>
        )}

        <button type="button" onClick={() => handleAddSection('title')} className={styles.addSectionButton}>
          Add Title
        </button>
        <button type="button" onClick={() => handleAddSection('text')} className={styles.addSectionButton}>
          Add Text
        </button>
        <button type="button" onClick={() => handleAddSection('image')} className={styles.addSectionButton}>
          Add Image
        </button>

        <DragDropContext onDragEnd={handleContentChange}>
          <Droppable droppableId="droppable-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={styles.sectionsContainer}>
                {content.map((section, index) => (
                  <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.section}
                      >
                        {section.type === 'title' && (
                          <input
                            type="text"
                            placeholder="Title"
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, e.target.value)}
                            className={styles.input}
                          />
                        )}
                        {section.type === 'text' && (
                          <SimpleMDE
                            value={section.content}
                            onChange={(value) => handleSectionChange(index, value)}
                          />
                        )}
                        {section.type === 'image' && (
                          <div className={styles.imagePreview}>
                            <p>Current Image: <a href={section.content} target="_blank" rel="noopener noreferrer">View Image</a></p>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button type="submit" className={styles.button}>Update Portfolio</button>
      </form>

      <div className={styles.previewContainer}>
        <h2>Portfolio Preview</h2>
        <div className={styles.previewContent}>
          {renderPreview()} {/* This renders a single combined preview for all content */}
        </div>
      </div>
    </div>
  );
}
