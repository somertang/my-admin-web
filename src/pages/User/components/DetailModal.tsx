import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, FormInstance, Input, Radio, App } from 'antd';
import { useRequest } from 'ahooks';
import userService from '@/services/user.ts';
import { User } from '@/services/user.ts';

const { useForm, Item } = Form;

export interface Props {
  open: boolean;
  editData?: any;
  onSave: () => void;
  setSaveLoading: (loading: boolean) => void;
}

const Index: React.ForwardRefRenderFunction<FormInstance, Props> = (props, ref) => {
  const { runAsync: addUser } = useRequest(userService.addUser, { manual: true });
  const { runAsync: updateUser } = useRequest(userService.updateUser, { manual: true });
  const [form] = useForm();
  const { message } = App.useApp();
  useImperativeHandle(ref, () => form, [form]);

  const handleSave = async (values: User) => {
    try {
      props.setSaveLoading(true);
      if (props.editData) {
        await updateUser({ ...props.editData, ...values });
        message.success('用户更新成功');
      } else {
        await addUser({ ...values });
        message.success('用户创建成功');
      }
      props.onSave();
    } catch (e: any) {
      message.error(e?.response?.data?.message);
    }
    props.setSaveLoading(false);
  };

  return (
    <Form
      labelCol={{ sm: { span: 24 }, md: { span: 5 } }}
      wrapperCol={{ sm: { span: 24 }, md: { span: 16 } }}
      form={form}
      initialValues={props.editData}
      onFinish={handleSave}
    >
      <Item
        label="用户名"
        name="userName"
        rules={[
          {
            required: true,
            message: '用户名不能为空',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="昵称"
        name="nickName"
        rules={[
          {
            required: true,
            message: '昵称不能为空',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="手机号码"
        name="userMobile"
        rules={[
          {
            required: true,
            message: '手机号码不能为空',
          },
          {
            pattern: /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[89])\d{8}$/,
            message: '手机号码格式不正确',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="邮箱地址"
        name="userEmail"
        rules={[
          {
            required: true,
            message: '邮箱地址不能为空',
          },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '邮箱地址不正确',
          },
        ]}
      >
        <Input />
      </Item>
      <Item label="性别" name="sex" initialValue={1}>
        <Radio.Group
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
        />
      </Item>
    </Form>
  );
};

export default forwardRef(Index);
