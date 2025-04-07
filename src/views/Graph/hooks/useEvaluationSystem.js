import { useState } from 'react';
import { message } from 'antd';

export default function useEvaluationSystem(graph, graphData, setGraphData) {
  const [showNodeDetail, setShowNodeDetail] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationQuestions, setEvaluationQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluationStatus, setEvaluationStatus] = useState('idle'); // idle, loading, testing, result
  
  // 显示节点详情
  const handleShowNodeDetail = (selectedNode) => {
    if (!selectedNode) {
      message.warning('请先选择一个节点');
      return;
    }
    setShowNodeDetail(true);
  };

  // 开始知识测评
  const handleStartEvaluation = (selectedNode) => {
    if (!selectedNode) {
      message.warning('请先选择一个节点');
      return;
    }
    setShowEvaluation(true);
  };
  
  // 测评系统函数
  const startEvaluation = async (selectedNode) => {
    if (!selectedNode) return;
    
    setEvaluationStatus('loading');
    
    try {
      const questions = await fetchEvaluationQuestions(selectedNode.id);
      
      setEvaluationQuestions(questions);
      setCurrentQuestion(0);
      setUserAnswers({});
      setEvaluationResult(null);
      setEvaluationStatus('testing');
    } catch (error) {
      console.error('获取测评题目失败:', error);
      message.error('获取测评题目失败，请重试');
      setEvaluationStatus('idle');
    }
  };
  
  // 模拟获取测评题目
  const fetchEvaluationQuestions = async (nodeId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            type: 'single',
            question: '这是关于该知识点的第一个测试问题?',
            options: ['选项A', '选项B', '选项C', '选项D'],
            answer: 0
          },
          {
            id: 2,
            type: 'multiple',
            question: '这是一个多选题，请选择所有正确的选项:',
            options: ['选项A', '选项B', '选项C', '选项D'],
            answer: [0, 2]
          },
          {
            id: 3,
            type: 'text',
            question: '请简述该知识点的主要内容:',
            answer: ''
          }
        ]);
      }, 1500);
    });
  };
  
  // 提交答案
  const submitAnswer = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };
  
  // 提交测评
  const submitEvaluation = async (selectedNode) => {
    setEvaluationStatus('loading');
    
    try {
      // 这里应该调用后端API评估答案
      // 模拟异步评估
      const result = await evaluateAnswers(evaluationQuestions, userAnswers);
      
      setEvaluationResult(result);
      setEvaluationStatus('result');
      
      // 更新节点的掌握程度
      if (graph && selectedNode) {
        graph.updateData('node', {
          id: selectedNode.id,
          data: {
            ...selectedNode.data,
            masteryLevel: result.score
          }
        });
        
        // 更新图数据
        const newData = graph.save();
        setGraphData(newData);
      }
    } catch (error) {
      console.error('评估答案失败:', error);
      message.error('评估答案失败，请重试');
      setEvaluationStatus('testing');
    }
  };
  
  // 模拟评估答案
  const evaluateAnswers = async (questions, answers) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 简单计算得分
        let correctCount = 0;
        
        questions.forEach(q => {
          const userAnswer = answers[q.id];
          if (q.type === 'single' && userAnswer === q.answer) {
            correctCount++;
          } else if (q.type === 'multiple' && 
                    Array.isArray(userAnswer) && 
                    userAnswer.length === q.answer.length && 
                    userAnswer.every(a => q.answer.includes(a))) {
            correctCount++;
          }
          // 文本题需要AI评估，这里简化处理
        });
        
        const score = Math.round((correctCount / questions.length) * 100);
        
        resolve({
          score,
          correctCount,
          totalCount: questions.length,
          analysis: '这是对您答题情况的分析...',
          recommendations: [
            '推荐学习资料1',
            '推荐学习资料2'
          ]
        });
      }, 2000);
    });
  };
  
  // 生成节点测评题
  const handleGenerateNodeEvaluation = (selectedNode, getTreeNodeIds) => {
    if (!selectedNode) {
      message.warning('请先选择一个节点');
      return;
    }
    
    // 获取当前节点及其子节点
    const nodeIds = getTreeNodeIds(selectedNode.id, graphData);
    
    // 生成测评题
    generateEvaluationQuestions(nodeIds, '节点');
  };

  // 生成知识树测评题
  const handleGenerateTreeEvaluation = (currentTree, getTreeNodeIds) => {
    if (!currentTree) {
      message.warning('请先选择一个知识树');
      return;
    }
    
    // 获取当前知识树的所有节点
    const treeNodeIds = getTreeNodeIds(currentTree.id, graphData);
    
    // 生成测评题
    generateEvaluationQuestions(treeNodeIds, '知识树');
  };

  // 生成测评题并与能力评估模块联动
  const generateEvaluationQuestions = async (nodeIds, type) => {
    try {
      // 从节点中提取知识点
      const nodes = nodeIds.map(id => {
        const node = graphData.nodes.find(n => n.id === id);
        return {
          id: node.id,
          label: node.data.label,
          content: node.data.content || '',
          description: node.data.description || ''
        };
      });
      
      // 调用API生成测评题
      const questions = await fetchGeneratedQuestions(nodes);
      
      // 将测评题发送到能力评估模块
      // 这里需要根据您的能力评估模块的接口进行调整
      sendToEvaluationModule(questions, type);
      
      message.success(`已生成${type}测评题并发送到能力评估模块`);
    } catch (error) {
      console.error('生成测评题失败:', error);
      message.error('生成测评题失败，请重试');
    }
  };

  // 模拟获取生成的测评题
  const fetchGeneratedQuestions = async (nodes) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 这里模拟根据节点内容生成测评题
        const questions = nodes.map((node, index) => ({
          id: `q-${Date.now()}-${index}`,
          nodeId: node.id,
          type: index % 3 === 0 ? 'single' : (index % 3 === 1 ? 'multiple' : 'text'),
          question: `关于"${node.label}"的测试问题 ${index + 1}?`,
          options: index % 3 !== 2 ? ['选项A', '选项B', '选项C', '选项D'] : null,
          answer: index % 3 === 0 ? 0 : (index % 3 === 1 ? [0, 2] : ''),
          difficulty: Math.floor(Math.random() * 3) + 1 // 1-3的难度
        }));
        
        resolve(questions);
      }, 1500);
    });
  };

  // 发送到能力评估模块
  const sendToEvaluationModule = (questions, type) => {
    // 这里需要根据您的能力评估模块的接口进行调整
    // 例如，可以通过全局事件总线、Redux、Context API等方式与其他模块通信
    
    // 示例：通过localStorage临时存储，供能力评估模块获取
    localStorage.setItem('evaluationQuestions', JSON.stringify({
      questions,
      type,
      timestamp: Date.now()
    }));
    
    // 示例：通过自定义事件通知能力评估模块
    const event = new CustomEvent('evaluationQuestionsGenerated', {
      detail: { questions, type }
    });
    window.dispatchEvent(event);
  };
  
  return {
    showNodeDetail,
    setShowNodeDetail,
    showEvaluation,
    setShowEvaluation,
    evaluationQuestions,
    setEvaluationQuestions,
    currentQuestion,
    setCurrentQuestion,
    userAnswers,
    setUserAnswers,
    evaluationResult,
    setEvaluationResult,
    evaluationStatus,
    setEvaluationStatus,
    handleShowNodeDetail,
    handleStartEvaluation,
    startEvaluation,
    submitAnswer,
    submitEvaluation,
    handleGenerateNodeEvaluation,
    handleGenerateTreeEvaluation
  };
}