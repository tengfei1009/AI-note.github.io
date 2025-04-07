import React, { useState } from 'react';
import { Card, List, Avatar, Button, Input, Tag, Tabs, Space, Badge } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, TeamOutlined, FireOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.scss';


const { Search } = Input;

const Community = () => {
  const [activeTab, setActiveTab] = useState('hot');
  const navigate = useNavigate();
  
  // 模拟数据
  const posts = [
    {
      id: '1',
      title: '如何高效学习数据结构?',
      content: '最近开始学习数据结构，想知道有什么好的学习方法和资源推荐...',
      author: {
        id: 'user1',
        name: '学习者小王',
        avatar: 'https://joeschmoe.io/api/v1/random'
      },
      tags: ['数据结构', '学习方法'],
      createTime: '2023-04-20 10:30',
      viewCount: 256,
      likeCount: 32,
      commentCount: 18
    },
    {
      id: '2',
      title: '分享一个算法可视化工具',
      content: '发现了一个很棒的算法可视化工具，对理解排序算法特别有帮助...',
      author: {
        id: 'user2',
        name: '算法爱好者',
        avatar: 'https://joeschmoe.io/api/v1/random'
      },
      tags: ['算法', '可视化', '工具分享'],
      createTime: '2023-04-19 15:45',
      viewCount: 189,
      likeCount: 45,
      commentCount: 12
    },
    {
      id: '3',
      title: '学习路径规划：从前端到全栈',
      content: '想从前端开发转向全栈，求一个合理的学习路径规划...',
      author: {
        id: 'user3',
        name: '前端小李',
        avatar: 'https://joeschmoe.io/api/v1/random'
      },
      tags: ['学习路径', '全栈', '前端'],
      createTime: '2023-04-18 09:15',
      viewCount: 320,
      likeCount: 28,
      commentCount: 24
    }
  ];
  
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  
  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`);
  };
  
  const handleSearch = (value) => {
    console.log('搜索:', value);
    // 实现搜索逻辑
  };
  
  const handleCreatePost = () => {
    // 实现创建帖子逻辑
    console.log('创建新帖子');
  };
  
  // 定义 Tabs 的 items 配置
  const tabItems = [
    {
      key: 'hot',
      label: (
        <span>
          <FireOutlined />
          热门讨论
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={posts}
          renderItem={post => (
            <List.Item
              key={post.id}
              actions={[
                <IconText icon={MessageOutlined} text={post.commentCount} key="comments" />,
                <IconText icon={LikeOutlined} text={post.likeCount} key="likes" />,
                <IconText icon={StarOutlined} text={post.viewCount} key="views" />,
              ]}
              className="post-item"
              onClick={() => handlePostClick(post.id)}
            >
              <List.Item.Meta
                avatar={<Avatar src={post.author.avatar} />}
                title={<a href={`/community/post/${post.id}`}>{post.title}</a>}
                description={
                  <div className="post-meta">
                    <span className="author-name">{post.author.name}</span>
                    <span className="post-time">{post.createTime}</span>
                  </div>
                }
              />
              <div className="post-content">{post.content}</div>
              <div className="post-tags">
                {post.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'groups',
      label: (
        <span>
          <TeamOutlined />
          学习小组
        </span>
      ),
      children: (
        <div className="coming-soon">
          <p>学习小组功能即将上线，敬请期待！</p>
        </div>
      )
    }
  ];
  
  return (
    <div className="community-page">
      <Card className="community-card">
        <div className="community-header">
          <div className="search-area">
            <Search
              placeholder="搜索帖子"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreatePost}
          >
            发布帖子
          </Button>
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default Community;