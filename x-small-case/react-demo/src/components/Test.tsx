import React, { useState } from 'react'

interface IProps {
  name: string
}

interface User {
  name: string,
  age: number,
  addr: string,
}

export default function Test() {
  const xiaoming = useState<User>({ name: 'xiaoming', age: 19, addr:' sz'});
  const obj: IProps = {
    name: '123'
  };
  console.log(obj, 66666)
  console.log(xiaoming, 88888)

  return (
    <div>
      
    </div>
  )
}
