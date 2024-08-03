// pages/profile/dashboard.js
import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';

export default function Dashboard() {
  const { data, error } = useSWR('/api/auth/user', fetcher);

  useEffect(() => {
    if (error) {
      Router.push('/login');
    }
  }, [data, error]);

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;

  return (
    <div>
      <h1>Welcome, {data.Name}</h1> {/* Use data.Name here */}
    </div>
  );
}
