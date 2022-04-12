import React, { Component } from 'react'
import List from './components/List'
import Search from './components/Search'
import './App.css';

export default class App extends Component {
  state = {
    users: [],
    isLoading: false,
    isFirst: true,
    err: ''
  }

  updataAppState = (stateObj) => {
    this.setState({
      ...this.state,
      ...stateObj
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Search updataAppState={this.updataAppState} />
          <List {...this.state} />
        </header>
      </div>
    )
  }
}
