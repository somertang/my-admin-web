import React, { useRef } from 'react';
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  App,
} from 'antd';
import { useAntdTable, useRequest, useSetState } from 'ahooks';
import userService, { User } from '@/services/user.ts';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DetailModal from '@/pages/User/components/DetailModal.tsx';
import * as dayjs from 'dayjs';

const Index: React.FC = () => {
  const [form] = Form.useForm();
  const [state, setState] = useSetState<{
    open: boolean;
    editData?: User | null;
    saveLoading: boolean;
    formOpen: boolean;
  }>({ open: false, saveLoading: false, formOpen: false });
  const { tableProps, search } = useAntdTable(userService.getUserListByPage, {
    defaultPageSize: 10,
    form,
  });
  const { submit, reset } = search;
  const { message } = App.useApp();
  const { runAsync: deleteUser } = useRequest(userService.deleteUser, { manual: true });
  const formRef = useRef<FormInstance>(null);

  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      render: (text) => (text ? '男' : '女'),
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'userMobile',
      align: 'center',
    },
    {
      title: '邮箱地址',
      dataIndex: 'userEmail',
      align: 'center',
    },
    {
      title: '锁定',
      dataIndex: 'userLock',
      align: 'center',
      render: (text) => <Tag color={text ? 'red' : 'green'}>{text ? '是' : '否'}</Tag>,
    },
    {
      title: '启用',
      dataIndex: 'userEnable',
      align: 'center',
      render: (text) => <Tag color={text ? 'green' : 'red'}>{text ? '是' : '否'}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      align: 'center',
      render: (text) => text && dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <Space size="middle">
            <a onClick={() => setState({ formOpen: true, editData: record })}>编辑</a>
            <Popconfirm
              title="警告"
              description="确认删除这条数据吗？"
              onConfirm={async () => {
                await deleteUser(record);
                submit();
                message.success('删除成功');
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleSave = () => {
    submit();
    setState({ formOpen: false, editData: null });
  };

  return (
    <div>
      <Form
        form={form}
        size="large"
        className="dark:bg-[rgb(33,41,70)] bg-white p-[24px] rounded-lg"
      >
        <Row gutter={24}>
          <Col className="w-[100%]" lg={24} xl={8}>
            <Form.Item label="用户名" name="userName">
              <Input placeholder="用户名" />
            </Form.Item>
          </Col>
          <Col className="w-[100%]" lg={24} xl={8}>
            <Form.Item label="邮箱地址" name="userMail">
              <Input placeholder="邮箱地址" />
            </Form.Item>
          </Col>
          <Col className="w-[100%]" lg={24} xl={8}>
            <Form.Item label="手机号码" name="userMobile">
              <Input placeholder="手机号码" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={submit}>
            查询
          </Button>
          <Button onClick={reset} style={{ marginLeft: 16 }}>
            重置
          </Button>
        </Row>
      </Form>
      <div className="mt-[16px] dark:bg-[rgb(33,41,70)] bg-white rounded-lg px-[12px]">
        <div className="py-[16px] ">
          <Button
            onClick={() => setState({ formOpen: true })}
            type="primary"
            size="large"
            icon={<PlusOutlined />}
          >
            新增
          </Button>
        </div>
        <Table key="user-table" columns={columns} {...tableProps} />
      </div>
      <Modal
        destroyOnClose
        width={640}
        zIndex={1001}
        title={state.editData ? '编辑' : '新建'}
        open={state.formOpen}
        onOk={() => formRef.current?.submit()}
        onCancel={() => setState({ formOpen: false, editData: null })}
        confirmLoading={state.saveLoading}
      >
        <DetailModal
          ref={formRef}
          editData={state.editData}
          onSave={handleSave}
          open={state.formOpen}
          setSaveLoading={(value) => setState({ saveLoading: value })}
        />
      </Modal>
    </div>
  );
};

export default Index;
