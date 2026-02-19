import './App.css';
import { Box } from './components/Box';
import { InputArea } from './components/InputArea';
import { useState } from 'react';

function App() {
  const [text, setText] = useState("Hello from App!");
  const [color, setColor] = useState("#ff0000"); 

  return (
    <div id="app" className="empty-app">
      <InputArea text={text} color={color} handleTextChange={setText} handleColorChange={setColor} />
      <Box text={text} color={color} /> 
    </div>
  )
}

export default App
