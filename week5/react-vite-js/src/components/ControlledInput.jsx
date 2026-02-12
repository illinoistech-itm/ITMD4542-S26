import { useState } from 'react';

export default function ControlledInput() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    setInputValue('');
  };

  return (
    <div>
      <h2>Controlled Input Example</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
        style={{ padding: '8px', fontSize: '16px', width: '300px' }}
      />
      <button onClick={handleReset} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Reset
      </button>
      <p>Current value: <strong>{inputValue || '(empty)'}</strong></p>
    </div>
  );
}
