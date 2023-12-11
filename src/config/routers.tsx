import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import React, { useEffect } from 'react';
import BasicLayout from '@/layouts';
import { App } from 'antd';
import { antdUtils } from '@/utils/antd.ts';
import RestPassword from '@/pages/Login/RestPassword';
import RouterErrorElement from '@/exception/router-error-element.tsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/reset-password',
    Component: RestPassword,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '*',
    Component: BasicLayout,
    children: [],
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
