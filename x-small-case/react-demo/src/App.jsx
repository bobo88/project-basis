import React from 'react';

const msg = '我是msg信息'

// 类组件
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHot: true
        };
    }

    render() {
        const { isHot } = this.state;
        return (
            <div>
                <h1>Hello, React!</h1>
                <p>{ msg }</p>
                <p>今天的天气真 { isHot ? '炎热' : '凉爽'}</p>
                <button onClick={ this.changeState.bind(this) }>changeState</button>
                <input type="text" />
            </div>
        );
    }

    changeState() {
        console.log(this.state)
        this.setState({
            isHot: false
        })
        // this.state = { isHot: false}
    }
}

export default App;