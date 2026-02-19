export function Box({text, color}) {
    const divStyle ={
        width: '400px',
        height: '400px',
        backgroundColor: color,
        fontWeight: 'bold',
        color: 'white',
        fontSize: '20px',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <div style={divStyle}>{text}</div>
    );
}