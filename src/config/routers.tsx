import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import React, { useEffect } from 'react';
import BasicLayout from '@/layouts';
import RouterErrorElement from '@/exception/router-error-element.tsx';
import { routerConfig } from '@/config/router-config.tsx';
import { App } from 'antd';
import { antdUtils } from '@/utils/antd.ts';
import RestPassword from '@/pages/Login/RestPassword';
// import Result404 from '@/exception/404.tsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/reset-password',
    Component: RestPassword,
  },
  // {
  //   path: '*',
  //   Component: Result404,
  // },
  {
    path: '/',
    element: <Navigate to="/dashbord" />,
  },
  {
    path: '*',
    Component: BasicLayout,
    children: routerConfig,
    errorElement: <RouterErrorElement />,
  },
]);

export const toLoginPage = () => {
  router.navigate('/login');
};

function findNodeByPath(routes: RouteObject[], path: string) {
  for (let i = 0; i < routes.length; i += 1) {
    const element = routes[i];

    if (element.path === path) return element;

    findNodeByPath(element.children || [], path);
  }
}

export const replaceRoutes = (parentPath: string, routes: RouteObject[]) => {
  if (!parentPath) {
    router.routes.push(...(routes as any));
    return;
  }

  const curNode = findNodeByPath(router.routes, parentPath);

  if (curNode) {
    curNode.children = routes;
  }
};

const Router: React.FC = () => {
  const { notification, message, modal } = App.useApp();

  useEffect(() => {
    antdUtils.setMessageInstance(message);
    antdUtils.setNotificationInstance(notification);
    antdUtils.setModalInstance(modal);
  }, [notification, message, modal]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
