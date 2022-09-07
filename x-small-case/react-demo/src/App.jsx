import React from 'react';

const msg = '我是msg信息'

// 类组件
class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello, React!</h1>
                <p>{ msg }</p>
                <input type="text" />
            </div>
        );
    }
}

export default App;