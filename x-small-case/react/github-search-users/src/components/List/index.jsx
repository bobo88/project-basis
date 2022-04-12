import React, { Component } from 'react'
import './index.css'

export default class List extends Component {
  render() {
    const { users, isLoading, isFirst, err } = this.props
    console.log(1234545, this.props)
    // {users} - {isLoading ? 'yy' : 'xx'} - {isFirst ? '34' : '23'} - {err}
    return (
      <div className='user-box'>
        { 
          isFirst ? <h2>请输入关键词，点击搜索按钮</h2> :
          isLoading ? <h2>Loading......</h2> : 
          err ? <h2 style={{color: 'red'}}>{ err }</h2> :
          users.map(item => {
            return (
              <div key={item.id} className="users-item">
                <a href={item.html_url} target="_blank" rel="noreferrer">
                  <p className='avatar'><img src={item.avatar_url} alt={item.avatar_url} /></p>
                  <p className='name'>{ item.login }</p>
                </a>
              </div>
            )
          })
        }
      </div>
    )
  }
}
