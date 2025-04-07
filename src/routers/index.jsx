import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../views/Layout';

// 导入页面组件
import Login from '../views/Login';
import Graph from '../views/Graph';
import LearningPath from '../views/LearningPath';
import Assessment from '../views/Assessment';
import Community from '../views/Community';
import Settings from '../views/Settings';
import Profile from '../views/Profile';
import Notifications from '../views/Notifications';
import NotFound from '../views/NotFound';

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/graph" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'graph',
        element: <Graph />,
      },
      {
        path: 'learning-path',
        element: <LearningPath />,
      },
      {
        path: 'assessment',
        element: <Assessment />,
      },
      {
        path: 'community',
        element: <Community />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
    ],
  },
  // 当前路径不存在时，重定向到404页面
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;