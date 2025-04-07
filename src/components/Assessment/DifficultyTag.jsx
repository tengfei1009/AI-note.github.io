import React from 'react';
import { Tag } from 'antd';

const DifficultyTag = ({ difficulty }) => {
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

export default DifficultyTag;