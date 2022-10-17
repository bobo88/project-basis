import React, {Component} from 'react'
import Button from '@mui/material/Button';

import { useSelector, useDispatch } from 'react-redux'
import { increment, addItem } from './store/counterSlice'

function App() {
  const counter = useSelector(state => state.counter.value);
  const { value, list} = useSelector(state => state.counter);
  console.log(123, value, list)
  const dispatch = useDispatch()
  return (
    <div className="App">
      <Button variant="contained" onClick={() => dispatch(increment())}>点我累加 - {counter} - （刷新页面也会保存累加值）</Button>
      <br/>
      <br/>
      <br/>


      <Button variant="contained" onClick={() => dispatch(addItem(4))}>点我push - {list.join(',')}</Button>
    </div>
  );
}

export default App;
