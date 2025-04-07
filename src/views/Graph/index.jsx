import React, { useEffect, useRef, useState } from 'react'
import { Card, Spin, Tag, Button } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import './index.scss'

// 导入自定义 Hooks
import useGraphData from './hooks/useGraphData'
import useGraphOperations from './hooks/useGraphOperations'
import useNodeEdgeOperations from './hooks/useNodeEdgeOperations'
import useTreeManagement from './hooks/useTreeManagement'
import useEvaluationSystem from './hooks/useEvaluationSystem'

// 导入子组件
import GraphToolbar from './components/GraphToolbar'
import NodeModal from './components/NodeModal'
import EdgeModal from './components/EdgeModal'
import EvaluationSystem from './components/EvaluationSystem'
import TreeListModal from './components/TreeListModal'
import NodeDetail from './components/NodeDetail'

const Graph = () => {
  // 使用自定义 Hooks
  const {
    loading, 
    setLoading,
    graph, 
    setGraph,
    graphData, 
    setGraphData,
    generateInitialData,
    initGraph,
    exportGraphData
  } = useGraphData();

  const {
    searchValue,
    setSearchValue,
    domain,
    setDomain,
    handleSearch,
    handleZoomIn,
    handleZoomOut,
    handleFitView
  } = useGraphOperations(graph);

  const {
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    nodeModalVisible,
    setNodeModalVisible,
    edgeModalVisible,
    setEdgeModalVisible,
    isEditing,
    setIsEditing,
    nodeForm,
    edgeForm,
    handleAddNode,
    handleEditNode,
    handleDeleteNode,
    handleAddEdge,
    handleEditEdge,
    handleDeleteEdge,
    handleNodeFormSubmit,
    handleEdgeFormSubmit
  } = useNodeEdgeOperations(graph, setGraphData);

  const {
    currentTree,
    setCurrentTree,
    knowledgeTrees,
    treeListVisible,
    setTreeListVisible,
    initKnowledgeTrees,
    handleShowTreeList,
    handleViewTree,
    handleEditTree,
    handleDeleteTree,
    getTreeNodeIds
  } = useTreeManagement(graph, graphData, setGraphData);

  const {
    showEvaluation,
    setShowEvaluation,
    evaluationQuestions,
    currentQuestion,
    setCurrentQuestion,
    userAnswers,
    evaluationResult,
    evaluationStatus,
    handleStartEvaluation,
    startEvaluation,
    submitAnswer,
    submitEvaluation,
    handleGenerateNodeEvaluation,
    handleGenerateTreeEvaluation
  } = useEvaluationSystem(graph, graphData, setGraphData);

  // 添加节点详情状态
  const [nodeDetailVisible, setNodeDetailVisible] = useState(false);

  const containerRef = useRef(null);

  // 初始化图表
  useEffect(() => {
    setTimeout(() => {
      const initialData = generateInitialData();
      
      setGraphData(initialData);
      
      // 初始化图实例，并传入节点和边的选择状态更新函数
      initGraph(initialData, setSelectedNode, setSelectedEdge);
      
      // 初始化知识树列表
      initKnowledgeTrees(initialData);
      
      // 设置默认知识树
      if (initialData.nodes.length > 0) {
        const rootNode = initialData.nodes.find(node => node.data.type === 'root');
        if (rootNode) {
          setCurrentTree({
            id: rootNode.id,
            label: rootNode.data.label
          });
        }
      }
      
      setLoading(false);
    }, 1000);
  }, []);
  
  // 清理图表
  useEffect(() => {
    return () => {
      if (graph) {
        graph.destroy();
      }
    };
  }, [graph]);

  // 节点表单提交的包装函数
  const handleNodeFormSubmitWrapper = (values) => {
    handleNodeFormSubmit(values, setLoading);
  };

  // 编辑知识树的包装函数
  const handleEditTreeWrapper = (treeId) => {
    handleEditTree(treeId, setSelectedNode, setSelectedEdge, handleEditNode);
  };

  // 生成节点测评题的包装函数
  const handleGenerateNodeEvaluationWrapper = () => {
    handleGenerateNodeEvaluation(selectedNode, getTreeNodeIds);
  };

  // 生成知识树测评题的包装函数
  const handleGenerateTreeEvaluationWrapper = () => {
    handleGenerateTreeEvaluation(currentTree, getTreeNodeIds);
  };
  
  // 修改节点详情显示函数
  const handleShowNodeDetailWrapper = () => {
    if (selectedNode) {
      setNodeDetailVisible(true);
    }
  };
  
  return (
    <div className="graph-page">
      <Card className="graph-card">
        {/* 工具栏 */}
        <GraphToolbar 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          domain={domain}
          setDomain={setDomain}
          handleSearch={handleSearch}
          exportGraphData={exportGraphData}
          handleAddNode={handleAddNode}
          handleEditNode={handleEditNode}
          handleDeleteNode={handleDeleteNode}
          handleAddEdge={handleAddEdge}
          handleEditEdge={handleEditEdge}
          handleDeleteEdge={handleDeleteEdge}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleFitView={handleFitView}
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          handleShowNodeDetail={handleShowNodeDetailWrapper}
          handleStartEvaluation={handleStartEvaluation}
          handleGenerateNodeEvaluation={handleGenerateNodeEvaluationWrapper}
          handleGenerateTreeEvaluation={handleGenerateTreeEvaluationWrapper}
        />
        
        {/* 树信息栏 */}
        <div className="tree-info-bar">
          {/* 当前知识树标签 */}
          <div className="tree-selector">
            {currentTree && (
              <Tag 
                color="blue" 
                className="tree-tag"
              >
                当前知识树: {currentTree.label}
              </Tag>
            )}
          </div>
          
          {/* 知识树列表按钮 */}
          <Button 
            type="primary" 
            icon={<UnorderedListOutlined />} 
            onClick={handleShowTreeList}  // 确保此函数正确调用
            className="tree-list-btn"
          >
            知识树列表
          </Button>
        </div>

        <div className="graph-content">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p>加载知识图谱中...</p>
            </div>
          ) : (
            <div id="graph-container" className="graph-container" ref={containerRef}></div>
          )}
        </div>

        {/* 节点编辑模态框 */}
        <NodeModal 
          isEditing={isEditing}
          nodeModalVisible={nodeModalVisible}
          setNodeModalVisible={setNodeModalVisible}
          nodeForm={nodeForm}
          handleNodeFormSubmit={handleNodeFormSubmitWrapper}
          graphData={graphData}
        />

        {/* 边编辑模态框 */}
        <EdgeModal 
          isEditing={isEditing}
          edgeModalVisible={edgeModalVisible}
          setEdgeModalVisible={setEdgeModalVisible}
          edgeForm={edgeForm}
          handleEdgeFormSubmit={handleEdgeFormSubmit}
        />

        {/* 测评系统 */}
        <EvaluationSystem 
          showEvaluation={showEvaluation}
          setShowEvaluation={setShowEvaluation}
          selectedNode={selectedNode}
          evaluationStatus={evaluationStatus}
          evaluationQuestions={evaluationQuestions}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          userAnswers={userAnswers}
          submitAnswer={submitAnswer}
          submitEvaluation={() => submitEvaluation(selectedNode)}
          evaluationResult={evaluationResult}
          startEvaluation={() => startEvaluation(selectedNode)}
        />
        
        {/* 知识树列表模态框 */}
        <TreeListModal 
          visible={treeListVisible}
          setVisible={setTreeListVisible}
          trees={knowledgeTrees}
          currentTreeId={currentTree?.id}
          onViewTree={handleViewTree}
          onEditTree={handleEditTreeWrapper}
          onDeleteTree={handleDeleteTree}
        />
        
        {/* 节点详情模态框 */}
        <NodeDetail 
          visible={nodeDetailVisible}
          setVisible={setNodeDetailVisible}
          node={selectedNode}
        />
      </Card>
    </div>
  );
};

export default Graph;