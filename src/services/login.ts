import axios from "axios";

export interface CaptchaDTO {
    id: string;
    imageBase64: string;
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
        return axios.get<CaptchaDTO>('/api/auth/captcha');
    },
    // 登录
    login: (loginDTO: LoginDTO) => {
        return axios.post<TokenDTO>('/api/auth/login', loginDTO);
    },
    // 刷新token
    rerefshToken(refreshToken: string) {
        return axios.post<TokenDTO>('/api/auth/refresh/token', { refreshToken });
    },
    getPublicKey(){
        return axios.get<string>('/api/auth/public-key');
    }
}

export default loginService;
