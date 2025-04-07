import React from 'react';
import { Modal, Form, Input, Select, Radio, Button, Rate } from 'antd';

const { Option } = Select;

const NodeModal = ({ 
  isEditing, 
  nodeModalVisible, 
  setNodeModalVisible, 
  nodeForm, 
  handleNodeFormSubmit,
  graphData
}) => {
  return (
    <Modal 
      title={isEditing ? '编辑节点' : '添加节点'} 
      open={nodeModalVisible} 
      onCancel={() => setNodeModalVisible(false)} 
      footer={null}
    >
      <Form form={nodeForm} layout="vertical" onFinish={handleNodeFormSubmit}>
        <Form.Item name="id" label="节点ID" rules={[{ required: true, message: '请输入节点ID' }]}>
          <Input placeholder="请输入唯一的节点ID" disabled={isEditing} />
        </Form.Item>
        <Form.Item name="label" label="节点标签" rules={[{ required: true, message: '请输入节点标签' }]}>
          <Input placeholder="请输入节点显示的标签" />
        </Form.Item>
        
        {/* 根据选择的来源显示不同的输入控件 */}
        <Form.Item 
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.source !== currentValues.source}
        >
          {({ getFieldValue }) => {
            const source = getFieldValue('source');
            if (source === 'note') {
              return (
                <Form.Item name="noteContent" label="笔记内容">
                  <Input.TextArea rows={6} placeholder="粘贴笔记内容，系统将自动分析构建知识点" />
                </Form.Item>
              );
            }
            if (source === 'audio') {
              return (
                <Form.Item name="audioFile" label="录音文件">
                  <Input type="file" accept="audio/*" />
                </Form.Item>
              );
            }
            if (source === 'image') {
              return (
                <Form.Item name="imageFile" label="图片文件">
                  <Input type="file" accept="image/*" />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>
        
        {/* 树选择 - 决定是创建新树还是添加到现有树 */}
        <Form.Item name="treeType" label="树结构选择">
          <Radio.Group defaultValue="new">
            <Radio value="new">创建新知识树</Radio>
            <Radio value="sub">添加到现有知识树</Radio>
          </Radio.Group>
        </Form.Item>
        
        {/* 如果选择添加到现有树，显示父节点选择 */}
        <Form.Item 
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.treeType !== currentValues.treeType}
        >
          {({ getFieldValue }) => {
            const treeType = getFieldValue('treeType');
            if (treeType === 'sub') {
              return (
                <Form.Item name="parentNode" label="选择父节点">
                  <Select placeholder="选择要添加到的父节点">
                    {graphData?.nodes.map(node => (
                      <Option key={node.id} value={node.id}>{node.data.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>
        
        {/* 新增输入源选择 */}
        <Form.Item name="source" label="内容来源">
          <Select defaultValue="manual">
            <Option value="manual">手动输入</Option>
            <Option value="note">从笔记导入</Option>
            <Option value="audio">从录音导入</Option>
            <Option value="image">从图片导入</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="importance"
          label="重要程度"
        >
          <Rate />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? '更新' : '添加'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setNodeModalVisible(false)}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NodeModal;