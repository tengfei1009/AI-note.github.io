import React from 'react';
import { Modal, List, Card, Button, Tag, Tooltip, Badge, Space, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';

const TreeListModal = ({ 
  visible, 
  setVisible, 
  trees, 
  currentTreeId,
  onViewTree, 
  onEditTree, 
  onDeleteTree 
}) => {
  return (
    <Modal
      title="知识树列表"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      {trees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <BookOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: '#8c8c8c' }}>暂无知识树，请先创建</p>
        </div>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={trees}
          renderItem={tree => (
            <List.Item>
              <Card 
                hoverable
                style={{ 
                  borderLeft: currentTreeId === tree.id ? '4px solid #1890ff' : 'none',
                  backgroundColor: currentTreeId === tree.id ? '#e6f7ff' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Avatar 
                        icon={<BookOutlined />} 
                        style={{ 
                          backgroundColor: currentTreeId === tree.id ? '#1890ff' : '#f56a00',
                          marginRight: 12
                        }} 
                      />
                      <span style={{ fontSize: 16, fontWeight: 'bold' }}>{tree.label}</span>
                      {currentTreeId === tree.id && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>当前</Tag>
                      )}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: 13 }}>
                      <Space>
                        <span>节点数量: {tree.nodeCount}</span>
                        <span>|</span>
                        <span>创建时间: {new Date(tree.createTime).toLocaleString()}</span>
                      </Space>
                    </div>
                  </div>
                  <Space>
                    <Tooltip title="查看">
                      <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<EyeOutlined />} 
                        onClick={() => onViewTree(tree.id)}
                        ghost={currentTreeId !== tree.id}
                      />
                    </Tooltip>
                    <Tooltip title="编辑">
                      <Button 
                        type="default" 
                        shape="circle" 
                        icon={<EditOutlined />} 
                        onClick={() => onEditTree(tree.id)}
                      />
                    </Tooltip>
                    <Tooltip title="删除">
                      <Button 
                        type="default" 
                        shape="circle" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => onDeleteTree(tree.id)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default TreeListModal;