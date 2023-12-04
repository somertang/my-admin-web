import axios from 'axios';

export interface User {
  id: number;
  userName: string;
  nickName: string;
  userMobile: string;
  userEmail: string;
  sex: string;
  userLock: number;
  userEnable: number;
}

export interface PageData {
  data: User[];
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
  getUserListByPage: (
    { current, pageSize }: { current: number; pageSize: number },
    formData: any
  ) => {
    return axios
      .get<PageData>('/api/user/page', {
        params: {
          page: current - 1,
          size: pageSize,
          ...formData,
        },
      })
      .then(({ data }) => {
        return {
          list: data.data,
          total: data.total,
        };
      });
  },
  // 添加用户
  addUser: (data: User) => {
    return axios.post('/api/user/create', data);
  },
  // 更新用户
  updateUser: (data: User) => {
    return axios.put('/api/user/update', data);
  },
  // 删除用户
  deleteUser: (data: User) => {
    return axios.delete(`/api/user/delete/${data.id}`);
  },
};

export default userService;
