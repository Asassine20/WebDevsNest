// pages/admin/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import withAdminAuth from '../../../components/WithAdminAuth';

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
          <li key={post.Id}> {/* Use the unique Id field as the key */}
            <Link href={`/admin/edit/${post.Id}`}>{post.Title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAdminAuth(Admin);
