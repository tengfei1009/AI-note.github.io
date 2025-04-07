import React, { useState } from 'react';
import { Slider, Select, Card, Button, Tooltip } from 'antd';
import { FullscreenOutlined, NodeIndexOutlined, HistoryOutlined, BookOutlined } from '@ant-design/icons';
import './DimensionController.css';

const { Option } = Select;

const DimensionController = ({ onDimensionChange, onViewChange }) => {
  const [currentDimension, setCurrentDimension] = useState('concept');
  const [sliderValues, setSliderValues] = useState({
    x: 50,
    y: 50,
    z: 50,
  });

  const dimensions = [
    { key: 'concept', name: '概念网络', icon: <NodeIndexOutlined /> },
    { key: 'history', name: '历史错误分布', icon: <HistoryOutlined /> },
    { key: 'hierarchy', name: '知识层级', icon: <BookOutlined /> },
  ];

  const handleDimensionChange = (value) => {
    setCurrentDimension(value);
    onDimensionChange(value);
  };

  const handleSliderChange = (axis, value) => {
    const newValues = { ...sliderValues, [axis]: value };
    setSliderValues(newValues);
    onViewChange(newValues);
  };

  return (
    <Card className="dimension-controller" title="维知控制器">
      <div className="dimension-selector">
        <span className="label">当前维知:</span>
        <Select 
          value={currentDimension} 
          onChange={handleDimensionChange}
          style={{ width: 180 }}
        >
          {dimensions.map(dim => (
            <Option key={dim.key} value={dim.key}>
              {dim.icon} {dim.name}
            </Option>
          ))}
        </Select>
      </div>
      
      <div className="dimension-sliders">
        <div className="slider-item">
          <span className="label">X轴投影:</span>
          <Slider 
            value={sliderValues.x} 
            onChange={(value) => handleSliderChange('x', value)} 
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        
        <div className="slider-item">
          <span className="label">Y轴投影:</span>
          <Slider 
            value={sliderValues.y} 
            onChange={(value) => handleSliderChange('y', value)}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        
        <div className="slider-item">
          <span className="label">Z轴投影:</span>
          <Slider 
            value={sliderValues.z} 
            onChange={(value) => handleSliderChange('z', value)}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
      </div>
      
      <div className="view-presets">
        <Tooltip title="顶视图">
          <Button onClick={() => handleSliderChange('y', 100)}>顶视图</Button>
        </Tooltip>
        <Tooltip title="侧视图">
          <Button onClick={() => handleSliderChange('x', 100)}>侧视图</Button>
        </Tooltip>
        <Tooltip title="正视图">
          <Button onClick={() => handleSliderChange('z', 100)}>正视图</Button>
        </Tooltip>
        <Tooltip title="重置视图">
          <Button 
            type="primary" 
            icon={<FullscreenOutlined />}
            onClick={() => {
              const resetValues = { x: 50, y: 50, z: 50 };
              setSliderValues(resetValues);
              onViewChange(resetValues);
            }}
          >
            重置视图
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default DimensionController;