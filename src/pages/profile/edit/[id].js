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

  useEffect(() => {
    if (portfolioItem) {
      setName(portfolioItem.Name);
      setContent(JSON.parse(portfolioItem.Content));
      setResume(portfolioItem.ResumeFile);
    }
  }, [portfolioItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/portfolio?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, content, resume }),
    });

    if (response.ok) {
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

  const handleContentChange = useCallback((result) => {
    const newItems = Array.from(content);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setContent(newItems);
  }, [content]);

  const handleAddSection = (type) => {
    setContent([...content, { type, content: '' }]);
  };

  const handleSectionChange = (index, newContent) => {
    const updatedContent = [...content];
    updatedContent[index].content = newContent;
    setContent(updatedContent);
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
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeChange}
          className={styles.input}
        />
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
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={styles.sectionsContainer}>
                {content.map((section, index) => (
                  <Draggable key={index} draggableId={String(index)} index={index}>
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSectionChange(index, e.target.files[0])}
                            className={styles.input}
                          />
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
    </div>
  );
}
