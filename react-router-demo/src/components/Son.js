import {Component} from 'react'
class Son extends Component {
  changeAbc = () => {
    this.props.handleChange('XYZ')
  }
  componentDidMount() {
    console.log('----- Son componentDidMount -----')
  }
  render() {
    const { abc, pState } = this.props
    const pStateData = pState.data || []
    console.log('local son: ', abc, pState)
    return (
      <div className='son-box'>
        <h1>Hi, {abc}</h1>
        <button onClick={this.changeAbc}>点击按钮改动abc的值</button>
        <ul>
          {
            pStateData.map((item,indx) => {
              return <li key={indx}>{ item }</li>
            })
          }
        </ul>
      </div>
    )
  }
}

export default Son