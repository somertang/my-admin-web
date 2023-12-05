// import { useLocation, useNavigate } from "react-router-dom"
import { useGlobalStore } from '@/stores/global';
import { useEffect } from 'react';
import Slide from './slide';
import Header from './header';
import MessageHandle from './message-handle';

import './index.css';
import TabsLayout from './tabs-layout';
import Content from './content';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { antdUtils } from '@/utils/antd.ts';
import { useRequest } from '@/hooks/use-request';
import userService from '@/services/user.ts';
import { useUserStore } from '@/stores/user.ts';
import GlobalLoading from '@/components/global-loading';

const BasicLayout: React.FC = () => {
  const { lang, refreshToken } = useGlobalStore();
  const { setCurrentUser } = useUserStore();
  const navigate = useNavigate();
  const { message, modal, notification } = App.useApp();

  const {
    loading,
    data: currentUserInfo,
    run: getCurrentUserInfo,
  } = useRequest(userService.getCurrentUser, { manual: true });

  useEffect(() => {
    antdUtils.setMessageInstance(message);
    antdUtils.setNotificationInstance(notification);
    antdUtils.setModalInstance(modal);
  }, [message, modal, notification]);

  useEffect(() => {
    if (!refreshToken) {
      navigate('/login');
      return;
    }
    getCurrentUserInfo();
  }, [refreshToken, getCurrentUserInfo, navigate]);

  useEffect(() => {
    setCurrentUser(currentUserInfo || null);
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
