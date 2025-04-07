import React from 'react';
import { Input, Select, Button, Tooltip, Space, Dropdown, Menu } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  ExportOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  DownOutlined
} from '@ant-design/icons';

const { Option } = Select;

const GraphToolbar = ({ 
  searchValue, 
  setSearchValue, 
  domain, 
  setDomain,
  handleSearch,
  exportGraphData,
  handleAddNode,
  handleEditNode,
  handleDeleteNode,
  handleAddEdge,
  handleEditEdge,
  handleDeleteEdge,
  handleZoomIn,
  handleZoomOut,
  handleFitView,
  selectedNode,
  selectedEdge,
  handleShowNodeDetail,
  handleStartEvaluation,
  handleGenerateNodeEvaluation,
  handleGenerateTreeEvaluation
}) => {
  // 测评下拉菜单
  const evaluationMenu = (
    <Menu>
      <Menu.Item key="nodeEval" onClick={handleGenerateNodeEvaluation} disabled={!selectedNode}>
        生成节点测评题
      </Menu.Item>
      <Menu.Item key="treeEval" onClick={handleGenerateTreeEvaluation}>
        生成知识树测评题
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="graph-toolbar">
      <div className="search-container">
        <Input
          placeholder="搜索知识点..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
        />
        <Select
          style={{ width: 150, marginLeft: 8 }}
          value={domain}
          onChange={setDomain}
          placeholder="选择领域"
        >
          <Option value="all">全部领域</Option>
          <Option value="math">数学</Option>
          <Option value="physics">物理</Option>
          <Option value="chemistry">化学</Option>
          <Option value="biology">生物</Option>
          <Option value="computer">计算机</Option>
        </Select>
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          搜索
        </Button>
      </div>
      
      <div className="action-container">
        <Space>
          <Tooltip title="添加节点">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNode} />
          </Tooltip>
          <Tooltip title="编辑节点">
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEditNode}
              disabled={!selectedNode}
            />
          </Tooltip>
          <Tooltip title="删除节点">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDeleteNode}
              disabled={!selectedNode}
            />
          </Tooltip>
          <Tooltip title="添加关系">
            <Button 
              icon={<PlusCircleOutlined />} 
              onClick={handleAddEdge}
              disabled={!selectedNode}
            />
          </Tooltip>
          <Tooltip title="编辑关系">
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEditEdge}
              disabled={!selectedEdge}
            />
          </Tooltip>
          <Tooltip title="删除关系">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDeleteEdge}
              disabled={!selectedEdge}
            />
          </Tooltip>
        </Space>
      </div>
      
      <div className="view-container">
        <Space>
          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn}>放大</Button>
          </Tooltip>
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut}>缩小</Button>
          </Tooltip>
          <Tooltip title="适应屏幕">
            <Button icon={<FullscreenOutlined />} onClick={handleFitView}>适应屏幕</Button>
          </Tooltip>
          <Tooltip title="导出数据">
            <Button icon={<ExportOutlined />} onClick={exportGraphData} />
          </Tooltip>
        </Space>
      </div>
      
      <div className="node-actions">
        <Space>
          <Tooltip title="查看详情">
            <Button 
              icon={<FileTextOutlined />} 
              onClick={handleShowNodeDetail}
              disabled={!selectedNode}
            >
              查看详情
            </Button>
          </Tooltip>
          
          {/* 替换原来的"开始测评"按钮为下拉菜单 */}
          <Dropdown overlay={evaluationMenu}>
            <Button 
              type="primary" 
              icon={<QuestionCircleOutlined />}
            >
              生成测评 <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default GraphToolbar;