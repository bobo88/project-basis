import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const basicTech: AppRouteModule = {
  path: '/basic-tech',
  name: 'BasicTech',
  component: LAYOUT,
  redirect: '/basic-tech/index',
  meta: {
    // hideChildrenInMenu: true,
    icon: 'simple-icons:bmw',
    title: t('routes.basicTech.basicTech'),
    orderNo: 5888,
  },
  children: [
    {
      path: 'lifecycle',
      name: 'Lifecycle',
      component: () => import('/@/views/basic-tech/lifecycle/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.basicTech.lifecycle'),
      },
    },
    {
      path: 'composite-api',
      name: 'CompositeAPI',
      component: () => import('/@/views/basic-tech/composite-api/index.vue'),
      meta: {
        title: t('routes.basicTech.compositeAPI'),
      },
    },
    {
      path: 'components-communication',
      name: 'ComponentsCommunication',
      component: () => import('/@/views/basic-tech/components-communication/index.vue'),
      meta: {
        title: t('routes.basicTech.componentsCommunication'),
      },
    },
  ],
};

export default basicTech;
