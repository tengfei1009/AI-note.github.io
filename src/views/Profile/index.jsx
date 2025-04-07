import React, { useState } from 'react';
import { Card, Avatar, Typography, Tabs, Form, Input, Button, Upload, message, Divider, List, Tag } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import './index.scss';

const { Title, Text } = Typography;
// 删除 TabPane 导入
// const { TabPane } = Tabs;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [avatarFileList, setAvatarFileList] = useState([]);  // 添加文件列表状态

  // 模拟用户数据
  const userData = {
    username: '知识探索者',
    email: 'explorer@example.com',
    avatar: null,
    bio: '热爱学习和探索知识的连接',
    learningHistory: [
      { id: 1, title: '计算机科学基础', date: '2023-03-15', progress: 85 },
      { id: 2, title: '数据结构与算法', date: '2023-04-20', progress: 70 },
      { id: 3, title: '人工智能入门', date: '2023-05-10', progress: 60 }
    ],
    achievements: [
      { id: 1, name: '知识探索者', description: '完成第一个知识图谱浏览', date: '2023-03-10' },
      { id: 2, name: '学习达人', description: '连续学习30天', date: '2023-04-15' },
      { id: 3, name: '知识建设者', description: '贡献10个知识点', date: '2023-05-05' }
    ]
  };

  const handleUpdateProfile = (values) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      console.log('更新个人资料:', values);
      message.success('个人资料更新成功！');
      setLoading(false);
    }, 1000);
  };

  const handleAvatarChange = (info) => {
    setAvatarFileList(info.fileList);  // 更新文件列表状态
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 添加一个规范化文件列表的函数
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  // 定义 Tabs 的 items 配置
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <UserOutlined />
          基本信息
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: userData.username,
            email: userData.email,
            bio: userData.bio
          }}
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="个人简介"
          >
            <Input.TextArea rows={4} placeholder="介绍一下自己..." />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="头像"
            valuePropName="fileList"  // 指定值属性名为 fileList
            getValueFromEvent={normFile}  // 使用规范化函数处理值
          >
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={handleAvatarChange}
              fileList={avatarFileList}  // 使用状态中的文件列表
            >
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'history',
      label: (
        <span>
          <BookOutlined />
          学习历史
        </span>
      ),
      children: (
        <List
          itemLayout="horizontal"
          dataSource={userData.learningHistory}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={`学习日期: ${item.date} | 进度: ${item.progress}%`}
              />
              <div className="progress-tag">
                <Tag color={item.progress > 80 ? 'green' : item.progress > 50 ? 'blue' : 'orange'}>
                  {item.progress}%
                </Tag>
              </div>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'achievements',
      label: (
        <span>
          <TrophyOutlined />
          成就
        </span>
      ),
      children: (
        <List
          itemLayout="horizontal"
          dataSource={userData.achievements}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`${item.description} | 获得日期: ${item.date}`}
              />
              <TrophyOutlined style={{ color: 'gold', fontSize: '24px' }} />
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined />
          安全设置
        </span>
      ),
      children: (
        <Form layout="vertical">
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary">
              更新密码
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            src={userData.avatar}
          />
          <div className="profile-info">
            <Title level={3}>{userData.username}</Title>
            <Text type="secondary">{userData.email}</Text>
            <Text>{userData.bio}</Text>
          </div>
        </div>

        <Divider />

        <Tabs 
          defaultActiveKey="basic"
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default Profile;