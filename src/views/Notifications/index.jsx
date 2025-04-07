import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Badge, Tabs, Empty, Spin, Typography, Card, Space, Tag } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, UserOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import './index.scss';


const { Text } = Typography;

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    all: [],
    unread: [],
    system: [],
    learning: [],
    social: []
  });

  // 模拟获取通知数据
  useEffect(() => {
    // 模拟API调用延迟
    const timer = setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          title: '系统更新',
          content: '知识图谱系统已更新到最新版本，新增多项功能。',
          time: '2023-04-01 10:30',
          read: false,
          type: 'system'
        },
        {
          id: 2,
          title: '学习提醒',
          content: '您已经3天没有学习"数据结构"了，继续保持学习进度吧！',
          time: '2023-04-02 09:15',
          read: true,
          type: 'learning'
        },
        {
          id: 3,
          title: '好友请求',
          content: '用户"知识探索者"请求添加您为好友。',
          time: '2023-04-03 14:20',
          read: false,
          type: 'social'
        },
        {
          id: 4,
          title: '成就解锁',
          content: '恭喜您解锁"知识探索者"成就！',
          time: '2023-04-04 16:45',
          read: false,
          type: 'system'
        },
        {
          id: 5,
          title: '学习建议',
          content: '基于您的学习历史，我们推荐您学习"机器学习基础"。',
          time: '2023-04-05 11:10',
          read: true,
          type: 'learning'
        }
      ];

      // 分类通知
      const all = [...mockNotifications];
      const unread = mockNotifications.filter(item => !item.read);
      const system = mockNotifications.filter(item => item.type === 'system');
      const learning = mockNotifications.filter(item => item.type === 'learning');
      const social = mockNotifications.filter(item => item.type === 'social');

      setNotifications({ all, unread, system, learning, social });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 标记通知为已读
  const markAsRead = (id) => {
    const updateNotifications = (list) => 
      list.map(item => item.id === id ? { ...item, read: true } : item);

    setNotifications({
      all: updateNotifications(notifications.all),
      unread: notifications.unread.filter(item => item.id !== id),
      system: updateNotifications(notifications.system),
      learning: updateNotifications(notifications.learning),
      social: updateNotifications(notifications.social)
    });
  };

  // 删除通知
  const deleteNotification = (id) => {
    const filterNotifications = (list) => 
      list.filter(item => item.id !== id);

    setNotifications({
      all: filterNotifications(notifications.all),
      unread: filterNotifications(notifications.unread),
      system: filterNotifications(notifications.system),
      learning: filterNotifications(notifications.learning),
      social: filterNotifications(notifications.social)
    });
  };

  // 全部标记为已读
  const markAllAsRead = () => {
    const markAllRead = (list) => 
      list.map(item => ({ ...item, read: true }));

    setNotifications({
      all: markAllRead(notifications.all),
      unread: [],
      system: markAllRead(notifications.system),
      learning: markAllRead(notifications.learning),
      social: markAllRead(notifications.social)
    });
  };

  // 渲染通知图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'learning':
        return <BookOutlined style={{ color: '#52c41a' }} />;
      case 'social':
        return <TeamOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <BellOutlined />;
    }
  };

  // 渲染通知类型标签
  const getNotificationTag = (type) => {
    switch (type) {
      case 'system':
        return <Tag color="blue">系统</Tag>;
      case 'learning':
        return <Tag color="green">学习</Tag>;
      case 'social':
        return <Tag color="orange">社交</Tag>;
      default:
        return null;
    }
  };

  // 渲染通知列表
  const renderNotificationList = (notificationList) => {
    if (notificationList.length === 0) {
      return <Empty description="暂无通知" />;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={notificationList}
        renderItem={item => (
          <List.Item
            className={item.read ? 'notification-read' : 'notification-unread'}
            actions={[
              !item.read && (
                <Button 
                  type="text" 
                  icon={<CheckOutlined />} 
                  onClick={() => markAsRead(item.id)}
                  title="标记为已读"
                />
              ),
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => deleteNotification(item.id)}
                title="删除"
              />
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={!item.read}>
                  <Avatar icon={getNotificationIcon(item.type)} />
                </Badge>
              }
              title={
                <Space>
                  {item.title}
                  {getNotificationTag(item.type)}
                </Space>
              }
              description={
                <>
                  <div>{item.content}</div>
                  <Text type="secondary">{item.time}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="notifications-container">
      <Card
        title={
          <Space>
            <BellOutlined />
            <span>通知中心</span>
          </Space>
        }
        extra={
          <Button type="primary" onClick={markAllAsRead} disabled={notifications.unread.length === 0}>
            全部标为已读
          </Button>
        }
      >
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>加载通知中...</p>
          </div>
        ) : (
          <Tabs 
            defaultActiveKey="all"
            items={[
              {
                key: 'all',
                label: (
                  <Badge count={notifications.all.length} overflowCount={99}>
                    全部
                  </Badge>
                ),
                children: renderNotificationList(notifications.all)
              },
              {
                key: 'unread',
                label: (
                  <Badge count={notifications.unread.length} overflowCount={99}>
                    未读
                  </Badge>
                ),
                children: renderNotificationList(notifications.unread)
              },
              {
                key: 'system',
                label: (
                  <Badge count={notifications.system.filter(item => !item.read).length} overflowCount={99}>
                    系统
                  </Badge>
                ),
                children: renderNotificationList(notifications.system)
              },
              {
                key: 'learning',
                label: (
                  <Badge count={notifications.learning.filter(item => !item.read).length} overflowCount={99}>
                    学习
                  </Badge>
                ),
                children: renderNotificationList(notifications.learning)
              },
              {
                key: 'social',
                label: (
                  <Badge count={notifications.social.filter(item => !item.read).length} overflowCount={99}>
                    社交
                  </Badge>
                ),
                children: renderNotificationList(notifications.social)
              }
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default Notifications;