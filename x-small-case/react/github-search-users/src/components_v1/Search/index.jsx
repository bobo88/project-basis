import React, { Component } from 'react'
import axios from 'axios'
import './index.css'

export default class Search extends Component {
  state = {
    keyword: ''
  }
  searchHandle = () => {
    const { keyword } = this.state
    if (!keyword) {
      alert('请输入关键词')
      return false
    }
    this.props.updateAppState({
      isFirst: false,
      isLoading: true
    })
    axios.get('https://api.github.com/search/users?q=' + keyword).then((res) => {
      this.props.updateAppState({
        users: res.data?.items || [],
        isFirst: false,
        isLoading: false
      })
    }, (err) => {
      this.props.updateAppState({
        isFirst: false,
        isLoading: false,
        err: err.message
      })
    })
  }
  changeKeyword = (event) => {
    let keyword = event.target.value
    this.setState({
      keyword
    })
  }
  render() {
    return (
      <div className='search-box'>
        <input className='search-input' onChange={this.changeKeyword} type="text" />
        <button className='search-btn' onClick={this.searchHandle}>搜索</button>
      </div>
    )
  }
}
