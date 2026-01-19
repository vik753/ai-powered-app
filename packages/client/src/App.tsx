import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('api/hello')
        .then(response => response.json())
        .then(data => setMessage(data.message));
  }, [])

  return (
    <>
      <p>{message}</p>
    </>
  )
}

export default App
