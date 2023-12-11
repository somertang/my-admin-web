import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Form, FormInstance, Input, Radio, App, Select } from 'antd';
import { useRequest } from '@/hooks/use-request';
import userService from '@/services/user.ts';
import { User } from '@/services/user.ts';
import Avatar from '@/pages/User/components/Avatar.tsx';
import EmailInput from '@/pages/User/components/EmailInput.tsx';

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
  const { data: roles, loading: getRolesLoading } = useRequest(userService.getRoles);
  const [form] = useForm();
  const { message } = App.useApp();
  useImperativeHandle(ref, () => form, [form]);

  const handleSave = async (values: User) => {
    console.log(values?.userAvatar, 'ss');

    if (values?.userAvatar?.[0]?.response?.id) {
      values.userAvatar = values?.userAvatar?.[0]?.response?.id;
    } else {
      values.userAvatar = null;
    }

    if (props.editData) {
      props.setSaveLoading(true);
      const [error] = await updateUser({ ...props.editData, ...values });
      props.setSaveLoading(false);
      if (error) {
        return false;
      }
      message.success('用户更新成功');
    } else {
      props.setSaveLoading(true);
      const [error] = await addUser({ ...values });
      props.setSaveLoading(false);
      if (error) {
        return false;
      }
      message.success('用户创建成功');
    }
    props.onSave();
  };

  const initialValues = useMemo(() => {
    if (props.editData) {
      return {
        ...props.editData,
        userAvatar: props.editData.avatarEntity
          ? [
              {
                uid: '-1',
                name: props.editData.avatarEntity.fileName,
                states: 'done',
                url: props.editData.avatarEntity.filePath,
                response: {
                  id: props.editData.avatarEntity.id,
                },
              },
            ]
          : [],
      };
    }
  }, [props.editData]);

  return (
    <Form
      labelCol={{ sm: { span: 24 }, md: { span: 5 } }}
      wrapperCol={{ sm: { span: 24 }, md: { span: 16 } }}
      form={form}
      initialValues={initialValues}
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
        <EmailInput disabled={!!props.editData} />
      </Item>
      {!props.editData && (
        <Item name="emailCaptcha" label="邮箱验证码">
          <Input />
        </Item>
      )}
      <Form.Item label="角色" name="roleIds">
        <Select
          options={(roles || []).map((role) => ({
            label: role.name,
            value: role.id,
          }))}
          mode="multiple"
          loading={getRolesLoading}
        />
      </Form.Item>
      <Item label="性别" name="sex" initialValue={1}>
        <Radio.Group
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
        />
      </Item>
      <Item label="头像" name="userAvatar">
        <Avatar />
      </Item>
    </Form>
  );
};

export default forwardRef(Index);
