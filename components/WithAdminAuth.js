// components/withAdminAuth.js
import { useEffect, useState } from 'react';
import Router from 'next/router';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const user = await res.json();
          if (user.Role === 'admin') {
            setLoading(false);
          } else {
            Router.push('/login');
          }
        } else {
          Router.push('/login');
        }
      };

      checkAdmin();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
