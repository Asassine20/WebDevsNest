import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EditPost = () => {
  const [post, setPost] = useState({ title: '', content: '', category: '' });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts?id=${id}`)
        .then(res => res.json())
        .then(data => setPost(data));
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

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPost;
