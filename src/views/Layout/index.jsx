import React, { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Tooltip } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, BellOutlined, NodeIndexOutlined, RocketOutlined, SettingOutlined, LogoutOutlined, QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './index.scss'

const { Header, Sider, Content } = Layout

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    if (path.includes('/graph')) return ['1']
    if (path.includes('/learning-path')) return ['2']
    if (path.includes('/assessment')) return ['3']
    if (path.includes('/community')) return ['4']
    if (path.includes('/settings')) return ['5']
    return ['1'] // 默认选中知识图谱
  }

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人中心</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 这里处理登出逻辑
        navigate('/login')
      },
    },
  ]

  // 通知菜单项
  const notificationMenuItems = [
    {
      key: 'notification1',
      label: (
        <div className="notification-item">
          <div className="notification-title">学习提醒</div>
          <div className="notification-content">您的"数据结构"学习路径已经3天没有更新了</div>
          <div className="notification-time">2小时前</div>
        </div>
      ),
    },
    {
      key: 'notification2',
      label: (
        <div className="notification-item">
          <div className="notification-title">测评完成</div>
          <div className="notification-content">您的"算法分析"知识点测评已完成，得分85分</div>
          <div className="notification-time">昨天</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'all',
      label: <Link to="/notifications">查看全部通知</Link>,
    },
  ]

  return (
    <Layout className="app-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="app-sider">
        <div className="logo-container">
          <img src={logo} alt="Dimen Graph Logo" className="logo" />
          {!collapsed && <span className="logo-text">维知图谱</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={[
            {
              key: '1',
              icon: <NodeIndexOutlined />,
              label: <Link to="/graph">知识图谱</Link>
            },
            {
              key: '2',
              icon: <RocketOutlined />,
              label: <Link to="/learning-path">学习路径</Link>
            },
            {
              key: '3',
              icon: <QuestionCircleOutlined />,
              label: <Link to="/assessment">能力评估</Link>
            },
            {
              key: '4',
              icon: <TeamOutlined />,
              label: <Link to="/community">学习社区</Link>
            },
            {
              key: '5',
              icon: <SettingOutlined />,
              label: <Link to="/settings">系统设置</Link>
            }
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="app-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed)
            })}
            <div className="breadcrumb">
              {location.pathname.includes('/graph') && '知识图谱'}
              {location.pathname.includes('/learning-path') && '学习路径'}
              {location.pathname.includes('/assessment') && '能力评估'}
              {location.pathname.includes('/community') && '学习社区'}
              {location.pathname.includes('/settings') && '系统设置'}
            </div>
          </div>
          <div className="header-right">
            <Tooltip title="帮助中心">
              <Button type="text" icon={<QuestionCircleOutlined />} />
            </Tooltip>
            <Dropdown
              menu={{ items: notificationMenuItems }}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}>
              <Badge
                count={2}
                className="notification-badge"
                offset={[-5, 5]}
              >
                <Button type="text" icon={<BellOutlined />} aria-label="通知" />
              </Badge>
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="user-info">
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <span className="username">张三</span>}
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
