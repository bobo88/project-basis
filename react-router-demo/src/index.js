import React from 'react';
import ReactDOM from 'react-dom'; // react 17
// import { createRoot } from "react-dom/client"; // react 18 用这种方式

import { Provider } from 'react-redux'
import store from './store'
// 持久化：本质还是把store存到 local Storage 里面
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

// React-router
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './index.css';
// import App from './demo';
import routes from './routes'
// 布局 & 路由页面
import Layout from './layout/Layout'
import ErrorBoundary from './pages/ErrorBoundary'

// 持久化
let persistor = persistStore(store);
// const root = createRoot(document.getElementById("root"));    // react 18 用这种方式
// 路由表配置
const renderRoutes = (routes) => {
  return routes.map(item => {
      if (item && item.children) {
          return (
              <Route path={item.path} element={item.element} key={item.key}>
                { renderRoutes(item.children) }
              </Route>
          );
      } else {
          return (
              <Route path={item.path} element={item.element} key={item.key} errorElement={<ErrorBoundary />}></Route>
          );
      }
  });
};

// react 17
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              { renderRoutes(routes) }
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// react 18 用这种方式
// createRoot.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <React.StrictMode>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               { renderRoutes(routes) }
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </React.StrictMode>
//     </PersistGate>
//   </Provider>
// );
