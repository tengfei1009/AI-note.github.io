import React from 'react';
import { Modal, Button, Card, Radio, Checkbox, Input, Progress, List } from 'antd';

const EvaluationSystem = ({
  showEvaluation,
  setShowEvaluation,
  selectedNode,
  evaluationStatus,
  evaluationQuestions,
  currentQuestion,
  setCurrentQuestion,
  userAnswers,
  submitAnswer,
  submitEvaluation,
  evaluationResult,
  startEvaluation
}) => {
  // 渲染当前问题
  const renderQuestion = () => {
    if (!evaluationQuestions || evaluationQuestions.length === 0) {
      return <div>没有可用的测评题目</div>;
    }

    const question = evaluationQuestions[currentQuestion];
    
    return (
      <Card className="question-card" title={`问题 ${currentQuestion + 1}/${evaluationQuestions.length}`}>
        <h3>{question.question}</h3>
        
        {question.type === 'single' && (
          <Radio.Group 
            onChange={(e) => submitAnswer(question.id, e.target.value)}
            value={userAnswers[question.id]}
          >
            {question.options.map((option, index) => (
              <Radio key={index} value={index} style={{ display: 'block', marginBottom: '8px' }}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        )}
        
        {question.type === 'multiple' && (
          <Checkbox.Group
            onChange={(values) => submitAnswer(question.id, values)}
            value={userAnswers[question.id] || []}
          >
            {question.options.map((option, index) => (
              <Checkbox key={index} value={index} style={{ display: 'block', marginBottom: '8px' }}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )}
        
        {question.type === 'text' && (
          <Input.TextArea 
            rows={4} 
            placeholder="请输入您的答案"
            value={userAnswers[question.id] || ''}
            onChange={(e) => submitAnswer(question.id, e.target.value)}
          />
        )}
        
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setCurrentQuestion(currentQuestion - 1)} 
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          
          {currentQuestion < evaluationQuestions.length - 1 ? (
            <Button 
              type="primary" 
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              下一题
            </Button>
          ) : (
            <Button 
              type="primary" 
              onClick={submitEvaluation}
            >
              提交测评
            </Button>
          )}
        </div>
      </Card>
    );
  };
  
  // 渲染测评结果
  const renderResult = () => {
    if (!evaluationResult) return null;
    
    return (
      <div className="evaluation-result">
        <div className="score">
          <h2>测评得分: {evaluationResult.score}</h2>
          <Progress 
            percent={evaluationResult.score} 
            status={evaluationResult.score >= 60 ? "success" : "exception"} 
          />
        </div>
        
        <div className="analysis">
          <h3>学习分析</h3>
          <p>{evaluationResult.analysis}</p>
        </div>
        
        <div className="recommendations">
          <h3>学习建议</h3>
          <List
            bordered
            dataSource={evaluationResult.recommendations}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
        
        <Button 
          type="primary" 
          style={{ marginTop: 16 }}
          onClick={() => setShowEvaluation(false)}
        >
          完成
        </Button>
      </div>
    );
  };
  
  return (
    <Modal
      title={`${selectedNode?.data?.label || '知识点'} - 测评`}
      open={showEvaluation}
      onCancel={() => setShowEvaluation(false)}
      footer={null}
      width={700}
    >
      <div className="evaluation-container">
        {evaluationStatus === 'idle' && (
          <>
            <p>系统将根据该知识点生成测评题目，测试您对该知识点的掌握程度。</p>
            <Button type="primary" onClick={startEvaluation}>
              开始测评
            </Button>
          </>
        )}
        
        {evaluationStatus === 'loading' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>正在加载测评题目...</p>
          </div>
        )}
        
        {evaluationStatus === 'testing' && renderQuestion()}
        
        {evaluationStatus === 'result' && renderResult()}
      </div>
    </Modal>
  );
};

export default EvaluationSystem;