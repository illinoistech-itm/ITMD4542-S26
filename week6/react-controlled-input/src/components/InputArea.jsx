import './InputArea.css';

export function InputArea(props) {
    return (
        <div className="inputWrapper">
            <input type="text" value={props.text} onChange={(e) => {
                props.handleTextChange(e.target.value);
            }} />
            <select value={props.color} onChange={(e) => {
                props.handleColorChange(e.target.value);
            }}>
                <option value="#ff0000">Red</option>
                <option value="#00ff00">Green</option>
                <option value="#0000ff">Blue</option>
            </select>
        </div>
    );
}