import React from 'react';
import {
    Link,
    useSearchParams,
    useParams,
    Outlet,     
} from "react-router-dom";

const LinkStyle = {
    marginRight: '20px',
    padding: '20px'
  }

const Detail = () => {
    const { id } = useParams();
    console.log('useParams --> id: ', id)

    const [searchParams] = useSearchParams();
    console.log('useSearchParams --> name: ', searchParams.getAll('name'))

    return (
        <div className='main-wrap'>
           Detail
            <Link style={LinkStyle} to="/detail/345">id - 345</Link>
            <Link style={LinkStyle} to="/detail/678?name=bob">id - 678 & name - bob</Link>
            <div style={{padding: '30px'}}>
                <div style={{minHeight: '150px', border: '1px solid #f60', borderRadius: '10px'}}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Detail;
