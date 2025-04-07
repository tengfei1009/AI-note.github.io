import { useState } from 'react';
import { message, Modal, Form } from 'antd';

export default function useNodeEdgeOperations(graph, setGraphData) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [nodeModalVisible, setNodeModalVisible] = useState(false);
  const [edgeModalVisible, setEdgeModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nodeForm] = Form.useForm();
  const [edgeForm] = Form.useForm();
  
  // 节点操作函数
  const handleAddNode = () => {
    setIsEditing(false);
    nodeForm.resetFields();
    setNodeModalVisible(true);
  };

  const handleEditNode = () => {
    if (!selectedNode) {
      message.warning('请先选择一个节点');
      return;
    }
    setIsEditing(true);
    nodeForm.setFieldsValue({
      id: selectedNode.id,
      label: selectedNode.data?.label || '',
      description: selectedNode.data?.description || ''
    });
    setNodeModalVisible(true);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) {
      message.warning('请先选择一个节点');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除节点 "${selectedNode.data?.label || selectedNode.id}" 吗？`,
      onOk: () => {
        if (graph) {
          graph.removeData('node', selectedNode.id);
          message.success('节点删除成功');
          setSelectedNode(null);
          const newData = graph.save();
          setGraphData(newData);
        }
      }
    });
  };

  // 边操作函数
  const handleAddEdge = () => {
    if (!selectedNode) {
      message.warning('请先选择一个源节点');
      return;
    }
    setIsEditing(false);
    edgeForm.resetFields();
    edgeForm.setFieldsValue({
      source: selectedNode.id
    });
    setEdgeModalVisible(true);
  };

  const handleEditEdge = () => {
    if (!selectedEdge) {
      message.warning('请先选择一条边');
      return;
    }
    setIsEditing(true);
    edgeForm.setFieldsValue({
      id: selectedEdge.id,
      source: selectedEdge.source,
      target: selectedEdge.target,
      label: selectedEdge.data?.label || ''
    });
    setEdgeModalVisible(true);
  };

  const handleDeleteEdge = () => {
    if (!selectedEdge) {
      message.warning('请先选择一条边');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这条边吗？`,
      onOk: () => {
        if (graph) {
          graph.removeData('edge', selectedEdge.id);
          message.success('边删除成功');
          setSelectedEdge(null);
          const newData = graph.save();
          setGraphData(newData);
        }
      }
    });
  };
  
  // 表单提交处理
  // 处理节点表单提交
  const handleNodeFormSubmit = (values, setLoading) => {
    if (setLoading) setLoading(true);
    
    // 处理资源字段，将文本转换为数组
    const resources = values.resources ? 
      values.resources.split('\n').filter(r => r.trim()) : 
      [];
    
    const nodeData = {
      ...values,
      resources,
      createTime: isEditing ? nodeForm.createTime : Date.now(),
      masteryLevel: values.masteryLevel || 0
    };
    
    if (isEditing) {
      // 更新节点
      if (graph) {
        graph.updateNodeData(nodeForm.id, {
          data: {
            ...nodeData
          }
        });
        message.success('节点更新成功');
      }
    } else {
      // 添加新节点
      const newNodeId = `node-${Date.now()}`;
      if (graph) {
        graph.addNode({
          id: newNodeId,
          data: nodeData
        });
        
        // 如果有选中的节点，则添加边
        if (selectedNode) {
          const edgeId = `edge-${Date.now()}`;
          graph.addEdge({
            id: edgeId,
            source: selectedNode.id,
            target: newNodeId,
            data: {
              label: '关联',
              type: 'related'
            }
          });
        }
        
        message.success('节点添加成功');
      }
    }
    
    setNodeModalVisible(false);
    setIsEditing(false);
    if (setLoading) setLoading(false);
  };
  
  const analyzeNoteContent = async (content) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          mainConcept: content.substring(0, 20),
          subNodes: []
        });
      }, 1000);
    });
  };

  const handleEdgeFormSubmit = values => {
    if (isEditing) {
      if (graph) {
        graph.updateData('edge', {
          id: selectedEdge.id,
          data: {
            label: values.label
          }
        });
        message.success('边更新成功');
      }
    } else {
      if (graph) {
        const edgeId = `edge-${Date.now()}`;
        graph.addData('edge', {
          id: edgeId,
          source: values.source,
          target: values.target,
          data: {
            label: values.label
          }
        });
        message.success('边添加成功');
      }
    }
    setEdgeModalVisible(false);
    const newData = graph.save();
    setGraphData(newData);
  };
  
  return {
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
  };
}