import request from '@/utils/request.ts';

export interface User {
  id: number;
  userName: string;
  nickName: string;
  userMobile: string;
  userEmail: string;
  sex: string;
  userLock: number;
  userEnable: number;
  userAvatar?: any;
}

export interface PageData<T> {
  data: T[];
  total: number;
}

export interface Menu {
  id: string;
  parentId?: string;
  name?: string;
  icon?: string;
  type?: number;
  route?: string;
  filePath?: string;
  orderNumber?: number;
  url?: string;
  show?: boolean;
  children?: Menu[];
  path: string;
  Component?: any;
  parentPaths?: string[];
  authCode?: string;
}

const userService = {
  // 分页获取用户列表
  getUserListByPage: async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: any
  ) => {
    const [error, data] = await request.get<PageData<User>>('/api/user/page', {
      params: {
        page: current - 1,
        size: pageSize,
        ...formData,
      },
    });

    if (error) {
      return Promise.reject();
    }

    return {
      list: data.data,
      total: data.total,
    };
  },
  // 添加用户
  addUser: (data: User) => {
    return request.post('/api/user/create', data);
  },
  // 更新用户
  updateUser: (data: User) => {
    return request.put('/api/user/update', data);
  },
  // 删除用户
  deleteUser: (data: User) => {
    return request.delete(`/api/user/delete/${data.id}`);
  },
  getCurrentUser: () => {
    return request.get<User>('/api/auth/current/user');
  },
  sendEmailCaptcha: (email: string) => {
    return request.post('/api/user/send/email/captcha', { email });
  },
};

export default userService;
