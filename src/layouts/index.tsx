// import { useLocation, useNavigate } from "react-router-dom"
import { useGlobalStore } from '@/stores/global';
import { lazy, useEffect } from 'react';
import Slide from './slide';
import Header from './header';
import MessageHandle from './message-handle';

import './index.css';
import TabsLayout from './tabs-layout';
import Content from './content';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@/hooks/use-request';
import userService from '@/services/user.ts';
import { useUserStore } from '@/stores/user.ts';
import GlobalLoading from '@/components/global-loading';
import { replaceRoutes, router } from '@/config/routers.tsx';
import Result404 from '@/exception/404.tsx';
import { components } from '@/config/routes.ts';
import { MenuType } from '@/pages/Menu/components/DetailModal.tsx';
import { Menu } from '@/services/user.ts';

const BasicLayout: React.FC = () => {
  const { lang, refreshToken } = useGlobalStore();
  const { setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  const {
    loading,
    data: currentUserInfo,
    run: getCurrentUserInfo,
  } = useRequest(userService.getCurrentUser, { manual: true });

  const formatMenus = (
    menus: Menu[],
    menuGroup: Record<string, Menu[]>,
    routes: Menu[],
    parentMenu?: Menu
  ): Menu[] => {
    return menus.map((menu) => {
      const children = menuGroup[menu.id];

      const parentPaths = parentMenu?.parentPaths || [];
      const path = (parentMenu ? `${parentPaths.at(-1)}${menu.route}` : menu.route) || '';

      routes.push({ ...menu, path, parentPaths });

      return {
        ...menu,
        path,
        parentPaths,
        children: children?.length
          ? formatMenus(children, menuGroup, routes, {
              ...menu,
              parentPaths: [...parentPaths, path || ''].filter((o) => o),
            })
          : undefined,
      };
    });
  };

  useEffect(() => {
    if (!refreshToken) {
      navigate('/login');
      return;
    }
    getCurrentUserInfo();
  }, [refreshToken, getCurrentUserInfo, navigate]);

  useEffect(() => {
    setCurrentUser(currentUserInfo || null);
  }, [currentUserInfo]);

  useEffect(() => {
    if (!currentUserInfo) return;

    const { menus = [] } = currentUserInfo;

    const menuGroup = menus.reduce<Record<string, Menu[]>>((prev, menu) => {
      if (!menu.parentId) {
        return prev;
      }

      if (!prev[menu.parentId]) {
        prev[menu.parentId] = [];
      }

      prev[menu.parentId].push(menu);
      return prev;
    }, {});

    const routes: Menu[] = [];

    currentUserInfo.menus = formatMenus(
      menus.filter((o) => !o.parentId),
      menuGroup,
      routes
    );

    currentUserInfo.authList = menus
      .filter((menu) => menu.type === MenuType.BUTTON && menu.authCode)
      .map((menu) => menu.authCode!);

    console.log(components, 'components');

    replaceRoutes('*', [
      ...routes.map((menu) => ({
        path: `/*${menu.path}`,
        Component: menu.filePath ? lazy(components[menu.filePath]) : null,
        id: `/*${menu.path}`,
        handle: {
          parentPaths: menu.parentPaths,
          path: menu.path,
          name: menu.name,
          icon: menu.icon,
        },
      })),
      {
        id: '*',
        path: '*',
        Component: Result404,
        handle: {
          path: '404',
          name: '404',
        },
      },
    ]);

    setCurrentUser(currentUserInfo);
    // setLoading(false);

    // replace一下当前路由，为了触发路由匹配
    router.navigate(`${location.pathname}${location.search}`, { replace: true });
  }, [currentUserInfo, setCurrentUser]);

  useEffect(() => {
    function storageChange(e: StorageEvent) {
      if (e.key === useGlobalStore.persist.getOptions().name) {
        useGlobalStore.persist.rehydrate();
      }
    }

    window.addEventListener<'storage'>('storage', storageChange);

    return () => {
      window.removeEventListener<'storage'>('storage', storageChange);
    };
  }, []);

  if (loading || !currentUserInfo) {
    return <GlobalLoading />;
  }

  return (
    <div>
      <div key={lang} className="bg-primary overflow-hidden">
        <MessageHandle />
        <Header />
        <Slide />
        <Content>
          <TabsLayout />
        </Content>
      </div>
    </div>
  );
};

export default BasicLayout;
