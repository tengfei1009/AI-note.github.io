import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { QuestionCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AssessmentList from '../../components/Assessment/AssessmentList';
import './index.scss';

const Assessment = () => {
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();
  
  // 模拟数据
  const availableAssessments = [
    {
      id: '1',
      title: '数据结构基础评估',
      description: '测试您对基本数据结构的理解和应用能力',
      tags: ['数据结构', '基础', '编程'],
      questionCount: 20,
      estimatedTime: '30分钟',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: '算法分析能力评估',
      description: '评估您分析和优化算法的能力',
      tags: ['算法', '分析', '复杂度'],
      questionCount: 15,
      estimatedTime: '45分钟',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: '高级系统设计评估',
      description: '测试您设计复杂系统架构的能力',
      tags: ['系统设计', '架构', '高级'],
      questionCount: 10,
      estimatedTime: '60分钟',
      difficulty: 'advanced'
    }
  ];
  
  const completedAssessments = [
    {
      id: '4',
      title: 'JavaScript基础评估',
      description: '测试您对JavaScript基础知识的掌握程度',
      tags: ['JavaScript', '前端', '编程'],
      completedDate: '2023-04-15',
      score: 85,
      maxScore: 100,
      strengths: ['变量和数据类型', '函数'],
      weaknesses: ['异步编程', '原型和继承']
    }
  ];
  
  const handleAssessmentClick = (assessmentId) => {
    navigate(`/assessment/${assessmentId}`);
  };
  
  // Tab切换项
  const tabItems = [
    {
      key: 'available',
      label: (
        <span>
          <QuestionCircleOutlined />
          可用评估
        </span>
      ),
      children: (
        <AssessmentList 
          assessments={availableAssessments} 
          type="available" 
          onAssessmentClick={handleAssessmentClick} 
        />
      )
    },
    {
      key: 'completed',
      label: (
        <span>
          <TrophyOutlined />
          已完成评估
        </span>
      ),
      children: (
        <AssessmentList 
          assessments={completedAssessments} 
          type="completed" 
          onAssessmentClick={handleAssessmentClick} 
        />
      )
    }
  ];
  
  return (
    <div className="assessment-page">
      <Card className="assessment-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default Assessment;
  
 