import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EdgeModal = ({ 
  isEditing, 
  edgeModalVisible, 
  setEdgeModalVisible, 
  edgeForm, 
  handleEdgeFormSubmit 
}) => {
  return (
    <Modal 
      title={isEditing ? '编辑边' : '添加边'} 
      open={edgeModalVisible} 
      onCancel={() => setEdgeModalVisible(false)} 
      footer={null}
    >
      <Form form={edgeForm} layout="vertical" onFinish={handleEdgeFormSubmit}>
        <Form.Item name="source" label="源节点ID" rules={[{ required: true, message: '请输入源节点ID' }]}>
          <Input placeholder="请输入源节点ID" disabled={true} />
        </Form.Item>
        <Form.Item name="target" label="目标节点ID" rules={[{ required: true, message: '请输入目标节点ID' }]}>
          <Input placeholder="请输入目标节点ID" disabled={isEditing} />
        </Form.Item>
        <Form.Item name="label" label="边标签">
          <Input placeholder="请输入边的标签" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? '更新' : '添加'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setEdgeModalVisible(false)}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EdgeModal;