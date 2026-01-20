import { useState, useEffect } from 'react'
import tailwindcss from 'tailwindcss';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => setMessage(data.message))
        .catch(error => console.error(error));
  }, [])

  console.log('Message from server:', message);

  return (
    <p className="font-bold p-4 text-4xl">{message}</p>
  )
}

export default App
