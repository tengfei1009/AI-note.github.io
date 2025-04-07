import { useState } from 'react';
import { message, Modal } from 'antd';

export default function useTreeManagement(graph, graphData, setGraphData) {
  const [currentTree, setCurrentTree] = useState(null);
  const [knowledgeTrees, setKnowledgeTrees] = useState([]);
  const [treeListVisible, setTreeListVisible] = useState(false);
  
  // 初始化知识树列表
  function initKnowledgeTrees(data) {
    if (!data || !data.nodes) return; // Ensure data and nodes are defined
  
    const trees = data.nodes
      .filter(node => node.data && node.data.type === 'root') // Check node.data is defined
      .map(node => {
        const nodeCount = countTreeNodes(node.id, data);
        return {
          id: node.id,
          label: node.data.label,
          description: node.data.description || '',
          createTime: node.data.createTime,
          nodeCount
        };
      });
  
    setKnowledgeTrees(trees);
  
    if (!currentTree && trees.length > 0) {
      setCurrentTree(trees[0]);
    }
  }
  
  // 计算树的节点数量
  const countTreeNodes = (rootId, data) => {
    // 找出所有以该根节点为起点的边
    const childEdges = data.edges.filter(edge => edge.source === rootId);
    let count = 1; // 根节点自身
    
    // 递归计算子节点
    for (const edge of childEdges) {
      count += countTreeNodes(edge.target, data);
    }
    
    return count;
  };
  
  // 显示知识树列表
  const handleShowTreeList = () => {
    // 更新知识树列表
    if (graphData) {
      initKnowledgeTrees(graphData);
    }
    setTreeListVisible(true);
  };
  
  
  // 查看指定知识树
  const handleViewTree = (treeId) => {
    if (graph) {
      // 聚焦到指定的树根节点
      graph.focusItem(treeId);
      
      // 设置当前知识树
      const tree = knowledgeTrees.find(t => t.id === treeId);
      if (tree) {
        setCurrentTree(tree);
        message.success(`已切换到知识树: ${tree.label}`);
      }
    }
  };
  
  
  // 获取树的所有节点ID
  const getTreeNodeIds = (rootId, data) => {
    const nodeIds = [rootId];
    
    // 找出所有以该根节点为起点的边
    const childEdges = data.edges.filter(edge => edge.source === rootId);
    
    // 递归获取子节点
    for (const edge of childEdges) {
      nodeIds.push(...getTreeNodeIds(edge.target, data));
    }
    
    return nodeIds;
  };
  
  // 编辑知识树
  const handleEditTree = (treeId, setSelectedNode, setSelectedEdge, handleEditNode) => {
    // 找到对应的节点
    const treeNode = graphData.nodes.find(node => node.id === treeId);
    if (treeNode) {
      setSelectedNode({ id: treeId, ...treeNode });
      setSelectedEdge(null);
      handleEditNode();
      setTreeListVisible(false);
    }
  };
  
  // 删除知识树
  const handleDeleteTree = (treeId) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除知识树将同时删除其所有子节点，确定要继续吗？',
      onOk: () => {
        if (graph) {
          // 获取树的所有节点ID
          const treeNodeIds = getTreeNodeIds(treeId, graphData);
          
          // 删除所有节点
          treeNodeIds.forEach(nodeId => {
            graph.removeData('node', nodeId);
          });
          
          message.success('知识树删除成功');
          
          // 更新图数据
          const newData = graph.save();
          setGraphData(newData);
          
          // 更新知识树列表
          initKnowledgeTrees(newData);
          
          setTreeListVisible(false);
        }
      }
    });
  };
  
  return {
    currentTree,
    setCurrentTree,
    knowledgeTrees,
    setKnowledgeTrees,
    treeListVisible,
    setTreeListVisible,
    initKnowledgeTrees,
    handleShowTreeList,
    handleViewTree,
    handleEditTree,
    handleDeleteTree,
    getTreeNodeIds
  };
}