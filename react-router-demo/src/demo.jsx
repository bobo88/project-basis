import React, { useState } from 'react'

// 子组件
function Son(props) {
    return (
        <>
            <h3>子组件 - { props.num }</h3>
            <button onClick={() => props.setNum(2)}>修改num</button>
        </>
    )
}
// 父组件
function Father(props) {
    return <Son num={props.num} setNum={props.setNum} />
}
function App() {
    const [num, setNum] = useState(1);
    return (
        <Father num={num} setNum={setNum} />
    )
};
export default App; 
