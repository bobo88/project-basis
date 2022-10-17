import {
  NavLink,
  Outlet,
  // useOutlet
} from "react-router-dom";

const LinkStyle = {
  marginRight: '20px',
  padding: '20px'
}
const ContentStyle = {
  margin: '10px',
  width: '500px',
  height: '300px',
  padding: '50px',
  border: '1px solid #000',
  borderRadius: '10px'
}

const LayoutCustom = (props) =>{
  // const xx = useOutlet();
  // console.log(6666, props, xx)
  return (
    <>
      <div>
        <h2>公共头部</h2>
        <NavLink style={LinkStyle} to="/" end>home</NavLink>
        <NavLink style={LinkStyle} to="list">list</NavLink>
        <NavLink style={LinkStyle} to="detail">detail</NavLink>
        <NavLink style={LinkStyle} to="abc">abc</NavLink>
      </div>
      {/* 指定路由的位置 */}
      <div style={ContentStyle}>
        <Outlet />
      </div>
      <h3>公共底部</h3>
    </>
  )
}

export default LayoutCustom;
