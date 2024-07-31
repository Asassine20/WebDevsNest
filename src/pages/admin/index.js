import { useEffect, useState } from 'react';
import Link from 'next/link';

const Admin = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link href="/admin/new">Create New Post</Link>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/admin/edit/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
