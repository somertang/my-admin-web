import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { JSEncrypt } from 'jsencrypt';

import loginService, { ResetPasswordDTO } from '@/services/login.ts';

import '../index.css';
import { useRequest } from '@/hooks/use-request';
import { useEffect } from 'react';
import { antdUtils } from '@/utils/antd';
import { getParamsBySearchParams } from '@/utils/utils';

const ResetPassword = () => {
  const navigate = useNavigate();

  const { runAsync: getPublicKey } = useRequest(loginService.getPublicKey, { manual: true });
  const { runAsync: resetPassaword, loading } = useRequest(loginService.resetPassaword, {
    manual: true,
  });

  const [query] = useSearchParams();

  useEffect(() => {
    const params = getParamsBySearchParams(query);

    if (!params.email || !params.emailCaptcha) {
      antdUtils.message?.error('重置链接不正确，请检查。');
    }
  }, [query]);

  const onFinish = async (values: ResetPasswordDTO) => {
    if (values.comfirmPassword !== values.password) {
      antdUtils.message?.error('两次密码不一致');
      return;
    }
    // 获取公钥
    const [error, publicKey] = await getPublicKey();

    if (error) {
      return;
    }

    // 使用公钥对密码加密
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const password = encrypt.encrypt(values.password);

    if (!password) {
      return;
    }

    const params = getParamsBySearchParams(query);

    values.password = password;
    values.publicKey = publicKey;
    values.email = params.email;
    values.emailCaptcha = params.emailCaptcha;

    const [resetPassawordError] = await resetPassaword(values);

    if (resetPassawordError) {
      return;
    }

    antdUtils.message?.success('密码重置成功');

    navigate('/login');
  };

  return (
    <div className="bg-primary light:bg-[rgb(238,242,246)] bg-[rgb(238,242,246)] flex justify-center items-center h-[100vh]">
      <div className="flex-[2.5] flex justify-center">
        <div className="dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg <lg:(w-[94%] mx-auto)">
          <div className="mb-[32px]">
            <div className="flex gap-2">
              <h2 className="text-[rgb(124,77,255)]" style={{ marginBottom: '0.6em' }}>
                重置密码
              </h2>
            </div>
            <div className="text-[16px]">设置你的新密码</div>
          </div>
          <Form name="super-admin" className="login-form" onFinish={onFinish} size="large">
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="密码"
                size="large"
                type="password"
              />
            </Form.Item>
            <Form.Item name="comfirmPassword" rules={[{ required: true, message: '请输入密码' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="确认密码"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 18 }}>
              <Button type="primary" loading={loading} block htmlType="submit">
                确认
              </Button>
            </Form.Item>
            <Form.Item noStyle style={{ marginBottom: 0 }}>
              <div className="text-right mb-[18px]">
                <Link
                  to="/login"
                  className="text-[16px] !text-[rgb(124,77,255)] select-none"
                  type="link"
                >
                  返回登录
                </Link>
              </div>
            </Form.Item>
          </Form>
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
    </div>
  );
};

export default ResetPassword;
