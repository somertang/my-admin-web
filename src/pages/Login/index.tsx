import React from 'react';
import { App, Button, Form, Input, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { IconBuguang } from '@/assets/icons/buguang.tsx';
import { IconYanzhengma } from '@/assets/icons/yanzhengma.tsx';
import './index.css';
import { useRequest } from '@/hooks/use-request';
import loginService, { LoginDTO } from '@/services/login.ts';
import { useGlobalStore } from '@/stores/global';
import { useNavigate } from 'react-router-dom';
import { JSEncrypt } from 'jsencrypt';
import { useSetState } from 'ahooks';
import { antdUtils } from '@/utils/antd.ts';
import IconPassword1 from '../../../public/images/password-1.svg';
import IconPassword2 from '../../../public/images/password-2.svg';

const { useForm } = Form;

interface StateType {
  resetPasswordOpen: boolean;
  emailInputFours: boolean;
  checkEmail: string | null;
}

const Login: React.FC = () => {
  const [form] = useForm();
  const { message } = App.useApp();
  const { setRefreshToken, setToken } = useGlobalStore();
  const navigate = useNavigate();
  const [state, setState] = useSetState<StateType>({
    resetPasswordOpen: false,
    emailInputFours: false,
    checkEmail: null,
  });
  const { data: captchaData, runAsync: refreshAsyncCaptcha } = useRequest(loginService.getCaptcha, {
    manual: false,
  });
  const { runAsync: login, loading } = useRequest(loginService.login, { manual: true });
  const { runAsync: sendResetPasswordEmail, loading: resetLoading } = useRequest(
    loginService.sendResetPasswordEmail,
    { manual: true }
  );

  const handleFinish = async (values: LoginDTO) => {
    if (!captchaData) {
      return;
    }

    values.captchaId = captchaData?.id;

    console.log('====================================');
    console.log(values);
    console.log('====================================');

    try {
      // 获取公钥
      const [error, publicKey] = await loginService.getPublicKey();

      if (error) {
        return;
      }

      console.log('====================================');
      console.log(publicKey);
      console.log('====================================');

      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const password = encrypt.encrypt(values.password);

      console.log('====================================');
      console.log(encrypt);
      console.log('====================================');

      values.password = password || '';
      values.publicKey = publicKey;

      const [loginError, data] = await login(values);
      if (loginError) {
        return;
      }
      setToken(data?.token);
      setRefreshToken(data?.refreshToken);

      navigate('/');
    } catch (e: any) {
      await refreshAsyncCaptcha();
      message.error(e?.response?.data?.message);
    }
  };

  const sendCheckEmail = async () => {
    if (!state.checkEmail) {
      antdUtils.message?.error('无效的邮箱格式！');
      return;
    }

    const [error] = await sendResetPasswordEmail(state.checkEmail);

    if (!error) {
      antdUtils.message?.success('邮件已发送，请到邮箱查看。');
      setState({ resetPasswordOpen: false });
    }
  };

  return (
    <div className="bg-primary light:bg-[rgb(238,242,246)] bg-[rgb(238,242,246)] flex justify-center items-center h-[100vh]">
      <div className="flex-[2.5] flex justify-center">
        <div className="dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg <lg:(w-[94%] mx-auto)">
          <div className="text-center">
            <div className="flex justify-center gap-2">
              <IconBuguang className="text-[20px] text-blue-500" />
              <h1 className="dark:(text-white) " style={{ marginBottom: '0.2em' }}>
                my-admin
              </h1>
            </div>
            <h3 className="dark:(text-white) text-[rgba(0,0,0,.45)] mb-[1em] text-[14px] font-normal">
              一个高颜值后台管理系统
            </h3>
          </div>
          <div>
            <Form form={form} className="login-form" size="large" onFinish={handleFinish}>
              <Form.Item name="accountNumber" rules={[{ required: true, message: '请输入账号' }]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="账号"
                  size="large"
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                <Input
                  prefix={<IconYanzhengma className="site-form-item-icon" />}
                  placeholder="验证码"
                  suffix={
                    <img
                      alt="验证码"
                      onClick={refreshAsyncCaptcha}
                      className="cursor-pointer h-[28px]"
                      src={captchaData?.imageBase64}
                    />
                  }
                />
              </Form.Item>
              <Form.Item noStyle style={{ marginBottom: 0 }}>
                <div className="text-right mb-[18px]">
                  <a
                    className="text-[16px] !text-[rgb(124,77,255)] select-none"
                    type="link"
                    onClick={() => setState({ resetPasswordOpen: true })}
                  >
                    忘记密码？
                  </a>
                </div>
              </Form.Item>
              <Form.Item style={{ marginBottom: 18 }}>
                <Button type="primary" block htmlType="submit" loading={loading}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div
        className="flex-[1.7] dark:bg-[rgb(33,41,70)] bg-white h-[100vh] relative <lg:hidden"
        style={{
          backgroundImage: 'url(/images/login-right-bg.svg)',
        }}
      >
        <div
          className="img1 w-[243px] h-[210px] bg-center absolute top-[23%] left-[37%]"
          style={{
            backgroundSize: 380,
            backgroundImage: 'url(/images/login-right-before.svg)',
          }}
        />
        <div
          className="img2 w-[313px] h-[280px] bg-center absolute top-[32%] left-[40%]"
          style={{
            backgroundSize: 380,
            backgroundImage: 'url(/images/login-right-after.svg)',
          }}
        />
      </div>
      <Modal
        title="重置密码"
        open={state.resetPasswordOpen}
        footer={null}
        width={400}
        maskClosable={false}
        bodyStyle={{ padding: '20px 0', position: 'relative' }}
        style={{ top: 240 }}
        onCancel={() => {
          setState({ resetPasswordOpen: false });
        }}
      >
        {!state.emailInputFours && (
          <img
            alt="重置密码 1"
            className="absolute top-[-139px] left-[calc(50%-67px)]"
            src={IconPassword1}
          />
        )}
        {state.emailInputFours && (
          <img
            alt="重置密码 2"
            className="absolute top-[-139px] left-[calc(50%-67px)]"
            src={IconPassword2}
          />
        )}
        <Input
          size="large"
          placeholder="请输入邮箱地址"
          onBlur={() => {
            setState({ emailInputFours: false });
          }}
          onFocus={() => {
            setState({ emailInputFours: true });
          }}
          onChange={(e) => {
            setState({ checkEmail: e.target.value });
          }}
        />
        <Button
          className="mt-[16px]"
          type="primary"
          block
          onClick={sendCheckEmail}
          loading={resetLoading}
        >
          发送验证邮件
        </Button>
      </Modal>
    </div>
  );
};

export default Login;
