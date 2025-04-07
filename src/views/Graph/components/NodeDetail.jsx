import React from 'react';
import { Modal, Descriptions, Typography, Divider, Tag, List, Rate } from 'antd';
import { LinkOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const NodeDetail = ({ visible, setVisible, node }) => {
  if (!node) return null;

  // 将资源字符串转换为数组
  const resources = node.data?.resources ? 
    (typeof node.data.resources === 'string' ? 
      node.data.resources.split('\n').filter(r => r.trim()) : 
      node.data.resources) : 
    [];

  return (
    <Modal
      title={`知识点详情: ${node.data?.label || '未命名节点'}`}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <Typography>
        <Title level={4}>
          {node.data?.label}
          {node.data?.type && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {node.data.type === 'root' ? '根节点' : node.data.type}
            </Tag>
          )}
        </Title>
        
        <Divider orientation="left">基本信息</Divider>
        <Descriptions column={2}>
          <Descriptions.Item label="创建时间">
            {node.data?.createTime ? new Date(node.data.createTime).toLocaleString() : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="重要程度">
            <Rate disabled value={node.data?.importance || 0} />
          </Descriptions.Item>
          <Descriptions.Item label="掌握程度" span={2}>
            <div style={{ 
              width: `${(node.data?.masteryLevel || 0) * 20}%`, 
              height: 10, 
              backgroundColor: '#1890ff',
              borderRadius: 5
            }} />
            <Text type="secondary">{(node.data?.masteryLevel || 0) * 20}%</Text>
          </Descriptions.Item>
        </Descriptions>
        
        <Divider orientation="left">详细内容</Divider>
        <Paragraph>
          {node.data?.content || '暂无内容'}
        </Paragraph>
        
        {node.data?.examples && (
          <>
            <Divider orientation="left">示例</Divider>
            <Paragraph>
              {node.data.examples}
            </Paragraph>
          </>
        )}
        
        {resources.length > 0 && (
          <>
            <Divider orientation="left">学习资源</Divider>
            <List
              itemLayout="horizontal"
              dataSource={resources}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<LinkOutlined />}
                    title={
                      item.startsWith('http') ? 
                        <a href={item} target="_blank" rel="noopener noreferrer">{item}</a> : 
                        item
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Typography>
    </Modal>
  );
};

export default NodeDetail;