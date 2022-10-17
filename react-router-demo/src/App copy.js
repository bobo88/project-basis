import React, {Component} from 'react'
import logo from './logo.svg';
import Son from './components/Son'
import './App.css';

import {useSearchFieldState} from 'react-stately';
import {useSearchField} from 'react-aria';
function SearchField(props) {
  let { label } = props;
  let state = useSearchFieldState(props);
  let ref = React.useRef();
  let { labelProps, inputProps } = useSearchField(props, state, ref);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <label {...labelProps}>{label}</label>
      <input {...inputProps} ref={ref} />
    </div>
  );
}

const Data = [
  {
    id: 1,
    name: 'Bob',
    age: 33
  },
  {
    id: 2,
    name: 'xiaoLi',
    age: 18
  }
]

class Heading extends Component {
  // constructor (props) {
  //   super(props)
  // }
  initialState = {
    title: 'Default 标题',
    type: '组件'
  }
  state = Object.assign(this.initialState, {
    abc: 'ABC'
  })

  handleChange = (val) => {
    this.setState({
      abc: val
    })
  }
  componentDidMount() {
    console.log('----- App-Heading componentDidMount -----')
    const url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=Seona+Dancing&format=json&origin=*'
    fetch(url)
      .then((result) => result.json())
      .then((result) => {
        this.setState({
          data: result,
        })
      })
  }
  
  testClick = () => {
    alert('测试点击事件')
  }
  inputChange = (event) => {
    this.setState({
      abc: event.target.value
    })
  }
  handleSubmit = (event) => {
    console.log('触发提交啊，但是我阻止了默认提交事件')
    event.preventDefault()
  }
  render() {
    const { pData } = this.props
    console.log(588, pData)
    return (
      <div>
        <h1>Hello, React -- { this.state.abc }</h1>
        <button onClick={this.testClick}>测试点击事件</button>
        <ul>
          {
            pData.map(item => {
              return <li key={item.id}>{ item.name }</li>
            })
          }
        </ul>
        <form onSubmit={this.handleSubmit}>
          <label>
            名字： <input value={this.state.abc} onChange={this.inputChange}></input>
          </label>
          <button type='submit'>提交</button>
        </form>
        <Son abc={this.state.abc} pState={this.state} handleChange={this.handleChange} />
      </div>
    )
  }
}

function App() {
  // state = {
  //   pData: Data
  // }
  return (
    <div className="App">
      <SearchField
        label="Search"
        onSubmit={(text) => alert(text)}
      />
      {/* <header className="App-header">
        <Heading pData={Data} />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Change by Bob.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
