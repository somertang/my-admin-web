import React, {useEffect, useMemo} from "react";
import {ConfigProvider, theme, ThemeConfig, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

import {useGlobalStore} from './stores/global.ts';
import Router from "./config/routers.tsx";


const App: React.FC = () => {

    const {darkMode, lang} = useGlobalStore();

    useEffect(() => {
        if (darkMode) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
    }, [darkMode]);

    const curTheme: ThemeConfig = useMemo(() => {
        if (darkMode) {
            return {
                token: {
                    colorPrimary: 'rgb(124, 77, 255)',
                    colorBgBase: 'rgb(17, 25, 54)',
                    colorBgContainer: 'rgb(26, 34, 63)',
                    colorBorder: 'rgba(189, 200, 240, 0.157)',
                    colorBgTextHover: 'rgba(124, 77, 255, 0.082)',
                    colorTextHover: 'rgba(124, 77, 255, 0.082)',
                    controlItemBgActive: 'rgba(33, 150, 243, 0.16)',
                    colorBgElevated: 'rgb(33, 41, 70)'
                },
                algorithm: theme.darkAlgorithm,
            }
        } else {
            return {
                token: {
                    colorPrimary: 'rgb(124, 77, 255)',
                },
            }
        }
    }, [darkMode]);

    return (
        <ConfigProvider
            componentSize='large'
            locale={lang === 'zh' ? zhCN : enUS}
            theme={curTheme}
            pagination={{ showSizeChanger: true }}
        >
            <AntApp>
                <Router />
            </AntApp>
        </ConfigProvider>
    );
}

export default App
