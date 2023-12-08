import { lazy } from 'react';
// import { Navigate } from 'react-router-dom';

export interface MenuItem {
  path: string;
  title?: string;
  icon?: any;
  element?: any;
  children?: MenuItem[];
  layout?: boolean;
  Component?: any;
  handle?: any;
}

export const routerConfig: MenuItem[] = [
  {
    path: 'dashbord',
    Component: lazy(() => import('../pages/Dashboard')),
    handle: {
      name: 'Dashbord',
      icon: 'DashboardOutlined',
    },
  },
  {
    path: 'system',
    children: [
      {
        path: 'user',
        Component: lazy(() => import('../pages/User')),
        handle: {
          name: '用户管理',
          icon: 'UserOutlined',
        },
      },
      {
        path: 'menu',
        Component: lazy(() => import('../pages/Menu')),
        handle: {
          name: '菜单管理',
          icon: 'MenuOutlined',
        },
      },
    ],
  },
];
