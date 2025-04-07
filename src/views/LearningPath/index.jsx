import React, { useState } from 'react';
import { Card, List, Tag, Progress, Button, Tabs, Empty } from 'antd';
import { RocketOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const LearningPath = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const navigate = useNavigate();
  
  // 模拟数据
  const recommendedPaths = [
    {
      id: '1',
      title: '前端开发入门到精通',
      description: '从零开始学习前端开发，包括HTML、CSS、JavaScript等基础知识',
      tags: ['前端', '入门', 'Web开发'],
      progress: 0,
      totalSteps: 12,
      completedSteps: 0,
      difficulty: 'beginner',
      estimatedTime: '3个月'
    },
    {
      id: '2',
      title: '数据结构与算法',
      description: '系统学习常见数据结构与算法，提高编程能力',
      tags: ['算法', '数据结构', '编程基础'],
      progress: 30,
      totalSteps: 10,
      completedSteps: 3,
      difficulty: 'intermediate',
      estimatedTime: '2个月'
    },
    {
      id: '3',
      title: '机器学习基础',
      description: '学习机器学习的基本概念、算法和应用',
      tags: ['AI', '机器学习', '数据科学'],
      progress: 0,
      totalSteps: 15,
      completedSteps: 0,
      difficulty: 'advanced',
      estimatedTime: '4个月'
    }
  ];
  
  const myPaths = [
    {
      id: '2',
      title: '数据结构与算法',
      description: '系统学习常见数据结构与算法，提高编程能力',
      tags: ['算法', '数据结构', '编程基础'],
      progress: 30,
      totalSteps: 10,
      completedSteps: 3,
      difficulty: 'intermediate',
      estimatedTime: '2个月',
      lastStudied: '2天前'
    }
  ];
  
  const getDifficultyTag = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return <Tag color="green">初级</Tag>;
      case 'intermediate':
        return <Tag color="blue">中级</Tag>;
      case 'advanced':
        return <Tag color="red">高级</Tag>;
      default:
        return null;
    }
  };
  
  const handlePathClick = (pathId) => {
    navigate(`/learning-path/${pathId}`);
  };
  
  const renderPathList = (paths) => {
    if (paths.length === 0) {
      return <Empty description="暂无学习路径" />;
    }
    
    return (
      <List
        className="path-list"
        itemLayout="vertical"
        dataSource={paths}
        renderItem={path => (
          <List.Item
            key={path.id}
            className="path-item"
            onClick={() => handlePathClick(path.id)}
          >
            <div className="path-content">
              <div className="path-header">
                <h3 className="path-title">{path.title}</h3>
                {getDifficultyTag(path.difficulty)}
              </div>
              <p className="path-description">{path.description}</p>
              <div className="path-tags">
                {path.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="path-progress">
                <div className="progress-info">
                  <span>进度: {path.completedSteps}/{path.totalSteps}</span>
                  <span className="estimated-time">
                    <ClockCircleOutlined /> {path.estimatedTime}
                  </span>
                </div>
                <Progress percent={path.progress} status="active" />
              </div>
              {path.lastStudied && (
                <div className="last-studied">
                  上次学习: {path.lastStudied}
                </div>
              )}
            </div>
            <div className="path-actions">
              <Button type="primary" icon={<RocketOutlined />}>
                {path.progress > 0 ? '继续学习' : '开始学习'}
              </Button>
            </div>
          </List.Item>
        )}
      />
    );
  };
  
  // 定义 Tabs 的 items 配置
  const tabItems = [
    {
      key: 'recommended',
      label: (
        <span>
          <RocketOutlined />
          推荐路径
        </span>
      ),
      children: renderPathList(recommendedPaths)
    },
    {
      key: 'my-paths',
      label: (
        <span>
          <BookOutlined />
          我的路径
        </span>
      ),
      children: renderPathList(myPaths)
    }
  ];
  
  return (
    <div className="learning-path-page">
      <Card className="learning-path-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default LearningPath;