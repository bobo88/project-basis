import React from 'react';
import {
    useLocation,
} from "react-router-dom";

const List = () => {
    const xx = useLocation();
    console.log(xx)
    
    return (
        <div className='main-wrap'>
           List
        </div>
    )
}
export default List;
