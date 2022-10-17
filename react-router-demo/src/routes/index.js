import Home from '../pages/Home'
import List from '../pages/List'
import Detail from '../pages/Detail'
import DetailId from '../pages/detail/_id'
import Error from '../pages/404'

// 懒加载路由
// const Home = lazy(() => import('../pages/Home'));
// const List = lazy(() => import('../pages/List'));
// const Detail = lazy(() => import('../pages/Detail'));
// const Error = lazy(() => import('../pages/404'));

const routes = [
  {
    key: 'index',
    path: '/',
    element: <Home />
  },
  {
    key: 'home',
    path: '/home',
    element: <Home />
  },
  {
    key: 'list',
    path: '/list',
    element: <List />
  },
  {
    key: 'detail',
    path: '/detail',
    element: <Detail />,
    children: [
      {
        path: ':id',
        key: 'detail-id',
        element: <DetailId />,
      }
    ]
  },
  {
    key: '404',
    path: '/*',
    element: <Error />
  },
];

export default routes;
