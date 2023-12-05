import request from '@/utils/request.ts';

export interface CaptchaDTO {
  id: string;
  imageBase64: string;
}

export interface TokenDTO {
  expire: number;
  token: string;
  refreshExpire: number;
  refreshToken: string;
}

export interface LoginDTO {
  accountNumber: string;
  password: string;
  captchaId: string;
  captcha: string;
  publicKey: string;
}

const loginService = {
  // 获取验证码
  getCaptcha: () => {
    return request.get<CaptchaDTO>('/api/auth/captcha');
  },
  // 登录
  login: (loginDTO: LoginDTO) => {
    return request.post<TokenDTO>('/api/auth/login', loginDTO);
  },
  // 刷新token
  refreshToken(refreshToken: string) {
    return request.post<TokenDTO>('/api/auth/refresh/token', { refreshToken });
  },
  getPublicKey() {
    return request.get<string>('/api/auth/public-key');
  },
  // 退出登录
  logout() {
    return request.post<boolean>('/api/auth/logout');
  },
};

export default loginService;
