import React from 'react';
import { List, Tag, Button, Progress } from 'antd';
import { QuestionCircleOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import DifficultyTag from './DifficultyTag';

const AssessmentCard = ({ assessment, type, onClick }) => {
  const isCompleted = type === 'completed';

  return (
    <List.Item
      key={assessment.id}
      className="assessment-item"
      onClick={() => onClick(assessment.id)}
    >
      <div className="assessment-content">
        <div className="assessment-header">
          <h3 className="assessment-title">{assessment.title}</h3>
          {isCompleted ? (
            <Tag color="green">已完成</Tag>
          ) : (
            <DifficultyTag difficulty={assessment.difficulty} />
          )}
        </div>
        <p className="assessment-description">{assessment.description}</p>
        <div className="assessment-tags">
          {assessment.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        
        {isCompleted ? (
          <>
            <div className="assessment-result">
              <div className="score-info">
                <span className="score-label">得分:</span>
                <span className="score-value">{assessment.score}/{assessment.maxScore}</span>
              </div>
              <Progress percent={(assessment.score / assessment.maxScore) * 100} status="active" />
            </div>
            <div className="assessment-analysis">
              <div className="strengths">
                <span className="analysis-label">优势:</span>
                {assessment.strengths.map(item => (
                  <Tag key={item} color="green">{item}</Tag>
                ))}
              </div>
              <div className="weaknesses">
                <span className="analysis-label">待提高:</span>
                {assessment.weaknesses.map(item => (
                  <Tag key={item} color="orange">{item}</Tag>
                ))}
              </div>
            </div>
            <div className="completed-date">
              完成时间: {assessment.completedDate}
            </div>
          </>
        ) : (
          <div className="assessment-info">
            <span>
              <QuestionCircleOutlined /> {assessment.questionCount}题
            </span>
            <span>
              <ClockCircleOutlined /> {assessment.estimatedTime}
            </span>
          </div>
        )}
      </div>
      <div className="assessment-actions">
        <Button 
          type={isCompleted ? "default" : "primary"} 
          icon={isCompleted ? <BarChartOutlined /> : <QuestionCircleOutlined />}
        >
          {isCompleted ? "查看详情" : "开始评估"}
        </Button>
      </div>
    </List.Item>
  );
};

export default AssessmentCard;