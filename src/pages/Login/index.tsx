import React from "react";
import { App, Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { IconBuguang } from '@/assets/icons/buguang.tsx';
import { IconYanzhengma } from '@/assets/icons/yanzhengma.tsx';
import './index.css';
import { useRequest } from "ahooks";
import loginService, { LoginDTO } from "@/services/login.ts";
import { useGlobalStore } from "@/stores/global";
import { useNavigate } from "react-router-dom";
import { JSEncrypt } from 'jsencrypt';

const { useForm } = Form;

const Login: React.FC = () => {
    const [ form ] = useForm();
    const { message } = App.useApp();
    const { setRefreshToken, setToken } = useGlobalStore();
    const navigate = useNavigate();
    const { data: captchaData, refreshAsync } = useRequest(loginService.getCaptcha, { manual: false });
    const { runAsync: login, loading } = useRequest(loginService.login, { manual: true });

    const handleFinish = async (values: LoginDTO) => {
        if (!captchaData?.data) {
            return;
        }

        values.captchaId = captchaData?.data?.id;

        console.log('====================================');
        console.log(values);
        console.log('====================================');

        try {
            // 获取公钥
            const { data: publicKey } = await loginService.getPublicKey();

            console.log('====================================');
            console.log(publicKey);
            console.log('====================================');

            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            const password = encrypt.encrypt(values.password);

            console.log('====================================');
            console.log(encrypt);
            console.log('====================================');

            values.password = password;
            values.publicKey = publicKey;

            const { data } = await login(values);
            setToken(data?.token);
            setRefreshToken(data?.refreshToken);

            navigate('/');
        } catch (e: any) {
            message.error(e?.response?.data?.message);
        }
    }

    return (
        <div className='bg-primary light:bg-[rgb(238,242,246)] bg-[rgb(238,242,246)] flex justify-center items-center h-[100vh]'>
            <div className='flex-[2.5] flex justify-center'>
                <div className='dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg <lg:(w-[94%] mx-auto)'>
                    <div className='text-center'>
                        <div className='flex justify-center gap-2'>
                            <IconBuguang className='text-[20px] text-blue-500' />
                            <h1 className='dark:(text-white) ' style={{ marginBottom: '0.2em' }}>my-admin</h1>
                        </div>
                        <h3
                            className='dark:(text-white) text-[rgba(0,0,0,.45)] mb-[1em] text-[14px] font-normal'
                        >
                            一个高颜值后台管理系统
                        </h3>
                    </div>
                    <div>
                        <Form
                            form={form}
                            className="login-form"
                            size="large"
                            onFinish={handleFinish}
                        >
                            <Form.Item
                                name="accountNumber"
                                rules={[{ required: true, message: '请输入账号' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder='账号'
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入密码' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder='密码'
                                />
                            </Form.Item>
                            <Form.Item
                                name="captcha"
                                rules={[{ required: true, message: '请输入验证码' }]}
                            >
                                <Input
                                    prefix={<IconYanzhengma className="site-form-item-icon" />}
                                    placeholder="验证码"
                                    suffix={
                                        <img
                                            onClick={refreshAsync}
                                            className='cursor-pointer'
                                            src={captchaData?.data?.imageBase64}
                                        />
                                    }
                                />
                            </Form.Item>
                            <Form.Item noStyle style={{ marginBottom: 0 }} >
                                <div
                                    className='text-right mb-[18px]'
                                >
                                    <a
                                        className='text-[16px] !text-[rgb(124,77,255)] select-none'
                                        type='link'
                                    >
                                        忘记密码？
                                    </a>
                                </div>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 18 }}>
                                <Button
                                    type="primary"
                                    block
                                    htmlType='submit'
                                    loading={loading}
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <div
                className='flex-[1.7] dark:bg-[rgb(33,41,70)] bg-white h-[100vh] relative <lg:hidden'
                style={{
                    backgroundImage: 'url(/images/login-right-bg.svg)'
                }}
            >
                <div
                    className='img1 w-[243px] h-[210px] bg-center absolute top-[23%] left-[37%]'
                    style={{
                        backgroundSize: 380,
                        backgroundImage: 'url(/images/login-right-before.svg)'
                    }}
                />
                <div
                    className='img2 w-[313px] h-[280px] bg-center absolute top-[32%] left-[40%]'
                    style={{
                        backgroundSize: 380,
                        backgroundImage: 'url(/images/login-right-after.svg)'
                    }}
                />
            </div>
        </div>
    );
};

export default Login;