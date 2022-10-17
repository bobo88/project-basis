import React from 'react';
import { redirect, Navigate } from "react-router-dom";

const App = () => {

    // goHome = () => {
    //     console.log(123)
    //     // redirect("/login");
    // }

    return (
        <div className='main-wrap'>
           404

            {/* 重定向 */}
            {/* <Navigate to="/detail" replace={false}>返回首页</Navigate> */}

            <div style={{marginTop: '20px'}}>
                <button onClick={() => {
                    console.log(1234)
                    return redirect("/list")
                }}>返回首页</button>
            </div>
        </div>
    )
}
export default App;
