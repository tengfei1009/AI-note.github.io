import React from 'react';
import { List, Empty } from 'antd';
import AssessmentCard from './AssessmentCard';

const AssessmentList = ({ assessments, type, onAssessmentClick }) => {
  if (assessments.length === 0) {
    return <Empty description={`暂无${type === 'completed' ? '已完成' : '可用'}评估`} />;
  }
  
  return (
    <List
      className="assessment-list"
      itemLayout="vertical"
      dataSource={assessments}
      renderItem={assessment => (
        <AssessmentCard 
          assessment={assessment} 
          type={type} 
          onClick={onAssessmentClick} 
        />
      )}
    />
  );
};

export default AssessmentList;