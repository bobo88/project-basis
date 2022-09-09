import React from 'react';
import './assets/scss/index.css'

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
        console.log(this);
        const { isHot } = this.state;
        return (
            <div>
                <h1>Hello, React!</h1>
                <p className={ isHot ? 'red' : 'green' }>{ msg }</p>
                <p className='desc'>今天的天气真 <span className={ isHot ? 'red' : 'green' }>{ isHot ? '炎热' : '凉爽'}</span></p>
                <button onClick={ this.changeState.bind(this) } style={{ margin: '0 20px 0 0' }}>changeState</button>
                <input type="text" />
            </div>
        );
    }

    changeState() {
        console.log(this.state)
        this.setState({
            isHot: !this.state.isHot
        })
        // this.state = { isHot: false}
    }
}

export default App;