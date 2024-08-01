import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EditPost = () => {
  const [post, setPost] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPost({
              title: data[0].Title || '',
              content: data[0].Content || '',
              category: data[0].Category || ''
            });
          } else {
            setError('Post not found');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load post data.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...post, id }),
    });
    router.push('/admin');
  };

  const handleDelete = async () => {
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    router.push('/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={post.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={post.category}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={post.content}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Delete</button>
      </form>
    </div>
  );
};

export default EditPost;
