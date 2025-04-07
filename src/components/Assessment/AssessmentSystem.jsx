import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Radio, Input, Progress, Spin, Result, Collapse, Tag, List, Typography } from 'antd';
import { 
  QuestionCircleOutlined, 
  CheckCircleOutlined, 
  BarChartOutlined, 
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './AssessmentSystem.css';

const { Step } = Steps;
const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const AssessmentSystem = ({ knowledgeNode, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState(null);

  // 模拟从后端获取题目
  useEffect(() => {
    if (knowledgeNode && currentStep === 0) {
      setLoading(true);
      // 模拟API请求延迟
      setTimeout(() => {
        // 根据知识点生成模拟题目
        const mockQuestions = generateMockQuestions(knowledgeNode);
        setQuestions(mockQuestions);
        setLoading(false);
        
        // 开始计时
        const timerInstance = setInterval(() => {
          setTimeSpent(prev => prev + 1);
        }, 1000);
        setTimer(timerInstance);
      }, 1500);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [knowledgeNode, currentStep, timer]); // 添加 timer 到依赖数组中

  // 生成模拟题目
  const generateMockQuestions = (node) => {
    // 这里根据知识点生成相关题目
    // 实际应用中应该从后端API获取
    return [
      {
        id: 1,
        type: 'single',
        difficulty: 'basic',
        content: `关于${node.name}的基本概念，下列说法正确的是：`,
        options: [
          { label: 'A', value: 'A', content: `${node.name}是一种数据结构` },
          { label: 'B', value: 'B', content: `${node.name}是一种算法` },
          { label: 'C', value: 'C', content: `${node.name}是一种设计模式` },
          { label: 'D', value: 'D', content: `${node.name}是一种编程语言` }
        ],
        answer: 'A',
        explanation: `${node.name}是一种重要的数据结构，它的特点是...`
      },
      {
        id: 2,
        type: 'multiple',
        difficulty: 'intermediate',
        content: `${node.name}的应用场景包括：`,
        options: [
          { label: 'A', value: 'A', content: '数据库索引' },
          { label: 'B', value: 'B', content: '缓存系统' },
          { label: 'C', value: 'C', content: '文件系统' },
          { label: 'D', value: 'D', content: '网络路由' }
        ],
        answer: ['A', 'B', 'D'],
        explanation: `${node.name}在数据库索引、缓存系统和网络路由中有广泛应用，因为...`
      },
      {
        id: 3,
        type: 'text',
        difficulty: 'advanced',
        content: `请简述${node.name}的工作原理及其优缺点。`,
        answer: `${node.name}的工作原理是...，其优点包括...，缺点包括...`,
        explanation: `一个完整的回答应该包含${node.name}的基本工作流程、时间复杂度分析、空间使用情况，以及在不同场景下的优缺点对比。`
      }
    ];
  };

  // 处理答案变更
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 提交答案
  const handleSubmit = () => {
    setLoading(true);
    
    // 停止计时
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // 模拟评分过程
    setTimeout(() => {
      const assessmentResults = {
        score: 85,
        correctCount: 2,
        totalCount: questions.length,
        timeSpent: timeSpent,
        questionResults: questions.map(q => {
          const userAnswer = answers[q.id];
          let isCorrect = false;
          
          if (q.type === 'single') {
            isCorrect = userAnswer === q.answer;
          } else if (q.type === 'multiple') {
            isCorrect = 
              userAnswer && 
              Array.isArray(userAnswer) && 
              userAnswer.length === q.answer.length && 
              userAnswer.every(a => q.answer.includes(a));
          } else if (q.type === 'text') {
            // 文本题假设部分正确
            isCorrect = userAnswer && userAnswer.length > 20;
          }
          
          return {
            question: q,
            userAnswer: userAnswer || '未作答',
            isCorrect,
            explanation: q.explanation
          };
        }),
        analysis: {
          conceptUnderstanding: 90,
          applicationProficiency: 80,
          principlesMastery: 85,
          knowledgeConnection: 75
        },
        recommendations: [
          {
            type: 'video',
            title: `${knowledgeNode.name}基础概念详解`,
            url: '#',
            duration: '15分钟'
          },
          {
            type: 'article',
            title: `${knowledgeNode.name}实战应用案例`,
            url: '#',
            readTime: '10分钟'
          },
          {
            type: 'project',
            title: `基于${knowledgeNode.name}的实践项目`,
            url: '#',
            difficulty: '中级'
          }
        ]
      };
      
      setResults(assessmentResults);
      setCurrentStep(1);
      setLoading(false);
    }, 2000);
  };

  // 完成测评
  const handleComplete = () => {
    onComplete(results);
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 渲染题目
  const renderQuestion = (question, index) => {
    return (
      <div key={question.id} className="question-item">
        <Card 
          title={
            <div className="question-header">
              <span className="question-number">问题 {index + 1}</span>
              <Tag color={
                question.difficulty === 'basic' ? 'green' : 
                question.difficulty === 'intermediate' ? 'blue' : 'red'
              }>
                {
                  question.difficulty === 'basic' ? '基础' : 
                  question.difficulty === 'intermediate' ? '中级' : '高级'
                }
              </Tag>
              <Tag color={
                question.type === 'single' ? 'purple' : 
                question.type === 'multiple' ? 'orange' : 'cyan'
              }>
                {
                  question.type === 'single' ? '单选题' : 
                  question.type === 'multiple' ? '多选题' : '问答题'
                }
              </Tag>
            </div>
          } 
          className="question-card"
        >
          <div className="question-content">{question.content}</div>
          
          {question.type === 'single' && (
            <Radio.Group 
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={answers[question.id]}
              className="options-group"
            >
              {question.options.map(option => (
                <Radio key={option.value} value={option.value} className="option-item">
                  <span className="option-label">{option.label}.</span> {option.content}
                </Radio>
              ))}
            </Radio.Group>
          )}
          
          {question.type === 'multiple' && (
            <Radio.Group 
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={answers[question.id]}
              className="options-group"
              mode="multiple"
            >
              {question.options.map(option => (
                <Radio key={option.value} value={option.value} className="option-item">
                  <span className="option-label">{option.label}.</span> {option.content}
                </Radio>
              ))}
            </Radio.Group>
          )}
          
          {question.type === 'text' && (
            <Input.TextArea 
              rows={4} 
              placeholder="请在此输入您的答案..."
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={answers[question.id] || ''}
              className="text-answer"
            />
          )}
        </Card>
      </div>
    );
  };

  // 渲染结果分析
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="assessment-results">
        <Result
          status="success"
          title={`测评完成！得分: ${results.score}分`}
          subTitle={`正确率: ${results.correctCount}/${results.totalCount} | 用时: ${formatTime(results.timeSpent)}`}
        />
        
        <div className="results-details">
          <Title level={4}>能力分析</Title>
          <div className="ability-analysis">
            <div className="ability-item">
              <Text>概念理解</Text>
              <Progress percent={results.analysis.conceptUnderstanding} status="active" />
            </div>
            <div className="ability-item">
              <Text>应用能力</Text>
              <Progress percent={results.analysis.applicationProficiency} status="active" />
            </div>
            <div className="ability-item">
              <Text>原理掌握</Text>
              <Progress percent={results.analysis.principlesMastery} status="active" />
            </div>
            <div className="ability-item">
              <Text>知识关联</Text>
              <Progress percent={results.analysis.knowledgeConnection} status="active" />
            </div>
          </div>
          
          <Title level={4} className="section-title">题目详解</Title>
          <Collapse className="questions-review">
            {results.questionResults.map((result, index) => (
              <Panel 
                header={
                  <div className="review-header">
                    <span>问题 {index + 1}</span>
                    {result.isCorrect ? 
                      <Tag color="success" icon={<CheckCircleOutlined />}>正确</Tag> : 
                      <Tag color="error" icon={<QuestionCircleOutlined />}>错误</Tag>
                    }
                  </div>
                } 
                key={index}
              >
                <div className="review-content">
                  <Paragraph><strong>题目：</strong>{result.question.content}</Paragraph>
                  
                  {result.question.type !== 'text' && (
                    <Paragraph>
                      <strong>选项：</strong>
                      <ul className="options-list">
                        {result.question.options.map(option => (
                          <li key={option.value}>
                            {option.label}. {option.content}
                          </li>
                        ))}
                      </ul>
                    </Paragraph>
                  )}
                  
                  <Paragraph>
                    <strong>您的答案：</strong> 
                    <Text type={result.isCorrect ? "success" : "danger"}>
                      {result.userAnswer}
                    </Text>
                  </Paragraph>
                  
                  <Paragraph>
                    <strong>正确答案：</strong> 
                    <Text type="success">
                      {Array.isArray(result.question.answer) 
                        ? result.question.answer.join(', ') 
                        : result.question.answer}
                    </Text>
                  </Paragraph>
                  
                  <Paragraph>
                    <strong>解析：</strong> {result.explanation}
                  </Paragraph>
                </div>
              </Panel>
            ))}
          </Collapse>
          
          <Title level={4} className="section-title">学习建议</Title>
          <List
            className="recommendations-list"
            itemLayout="horizontal"
            dataSource={results.recommendations}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    item.type === 'video' ? <BookOutlined /> : 
                    item.type === 'article' ? <BarChartOutlined /> : 
                    <ClockCircleOutlined />
                  }
                  title={<a href={item.url}>{item.title}</a>}
                  description={
                    item.type === 'video' ? `视频 | ${item.duration}` : 
                    item.type === 'article' ? `文章 | 阅读时间: ${item.readTime}` : 
                    `项目 | 难度: ${item.difficulty}`
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="assessment-system">
      <Card title={`知识点测评: ${knowledgeNode?.name || '未知知识点'}`} className="assessment-card">
        <Steps current={currentStep} className="assessment-steps">
          <Step title="答题" icon={<QuestionCircleOutlined />} />
          <Step title="分析" icon={<BarChartOutlined />} />
          <Step title="完成" icon={<CheckCircleOutlined />} />
        </Steps>
        
        <div className="assessment-content">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p className="loading-text">正在{currentStep === 0 ? '加载题目' : '分析结果'}...</p>
            </div>
          ) : (
            <>
              {currentStep === 0 && (
                <div className="questions-container">
                  <div className="timer-display">
                    <ClockCircleOutlined /> 用时: {formatTime(timeSpent)}
                  </div>
                  
                  {questions.map((question, index) => renderQuestion(question, index))}
                  
                  <div className="actions-container">
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < questions.length}
                    >
                      提交答案
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="results-container">
                  {renderResults()}
                  
                  <div className="actions-container">
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={handleComplete}
                    >
                      完成测评
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssessmentSystem;