import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.tsx';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error(error));
  }, []);

  console.log('Message from server:', message);

  return (
    <div className={'p-4'}>
      <p className="font-bold text-4xl">{message}</p>
      <Button onClick={() => console.log('Button clicked')}>Click me</Button>
    </div>
  );
}

export default App;
