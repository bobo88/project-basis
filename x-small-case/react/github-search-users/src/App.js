import React, { Component } from 'react'
import List from './components/List'
import Search from './components/Search'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Search />
          <List />
        </header>
      </div>
    )
  }
}
