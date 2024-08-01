import { useState } from 'react';
import { useRouter } from 'next/router';

const Confirm = () => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, confirmationCode }),
    });

    const data = await res.json();

    if (res.status === 200) {
      router.push('/profile'); // Redirect to profile page after confirmation
    } else {
      console.error(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        placeholder="Confirmation Code"
        required
      />
      <button type="submit">Confirm</button>
    </form>
  );
};

export default Confirm;
