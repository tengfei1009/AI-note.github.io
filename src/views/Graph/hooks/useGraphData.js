import { useState } from 'react';
import { Rect, register, Graph, ExtensionCategory } from '@antv/g6';

export default function useGraphData() {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState(null);
  const [graph, setGraph] = useState(null);
  
  // 生成初始数据
  const generateInitialData = () => {
    return {
      nodes: [
        {
          id: 'node1',
          style: { x: 100, y: 100 },
          data: { label: '计算机科学概论', count: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈", type: 'root', createTime: Date.now() },
        },
        {
          id: 'node2',
          style: { x: 300, y: 100 },
          data: { label: '数据结构与算法' },
        },
        {
          id: 'node3',
          style: { x: 500, y: 100 },
          data: { label: '操作系统' },
        },
        {
          id: 'node4',
          style: { x: 700, y: 100 },
          data: { label: '计算机网络' },
        },
        {
          id: 'node5',
          style: { x: 900, y: 100 },
          data: { label: '数据库系统' },
        },
        {
          id: 'node6',
          style: { x: 1100, y: 100 },
          data: { label: '人工智能' },
        },
        {
          id: 'node7',
          style: { x: 1300, y: 100 },
          data: { label: '机器学习' },
        },
        {
          id: 'node8',
          style: { x: 1500, y: 100 },
          data: { label: '深度学习' },
        },
        // 其他节点...
      ],
      edges: [
        { source: 'node1', target: 'node2', label: '子节点' },
        { source: 'node1', target: 'node3', label: '子节点' },
        { source: 'node1', target: 'node4', label: '子节点' },
        { source: 'node1', target: 'node5', label: '子节点' },
        { source: 'node1', target: 'node6', label: '子节点' },
        { source: 'node6', target: 'node7', label: '子节点' },
        { source: 'node7', target: 'node8', label: '子节点' },
        { source: 'node4', target: 'node3', label: '子节点' },
        { source: 'node3', target: 'node5', label: '子节点' },
        // 其他边...
      ],
    }
  };
  
  // 创建自定义节点，继承自 Rect
  class MyFirstNode extends Rect {
    get data() {
      return this.context.graph.getNodeData(this.id).data;
    }

    getCustomLabelStyle(attributes) {
      return {
        x: 0,
        y: 0,
        text: this.data.label, // 使用节点数据中的label字段
        fontSize: 14,
        fill: '#000',
        textAlign: 'center',
        textBaseline: 'middle',
      };
    }

    drawCustomLabelShape(attributes, container) {
      const customLabelStyle = this.getCustomLabelStyle(attributes);
      this.upsert('custom-label', 'text', customLabelStyle, container);
    }

    // 渲染方法是自定义节点的核心
    render(attributes = this.parsedAttributes, container) {
      // 1. 先调用父类渲染方法，绘制基础矩形
      super.render(attributes, container);

      // 2. 插入一个自定义的标签
      this.drawCustomLabelShape(attributes, container);
    }
  }

  register(ExtensionCategory.NODE, 'my-first-node', MyFirstNode);


  // 初始化图实例
  const initGraph = (data, setSelectedNode, setSelectedEdge) => {
    const container = document.getElementById('graph-container');
    if (!container) {
      console.error('Graph container not found');
      return null;
    }

    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    const g = new Graph({
      container: 'graph-container',
      width,
      height,
      data: data,
      node: {
        type: 'my-first-node', // 指定使用我们的自定义节点
        style: {
          fill: '#e8f7ff', // 矩形背景色
          lineWidth: 2, // 矩形边宽
          stroke: '#1890ff', // 矩形边框色
          radius: 5, // 圆角半径
          width: 120,
          height: 50,
        },
      },
      layout: {
        type: 'dagre', // 使用 dagre 布局
        rankdir: 'TB', // 从上到下排列
        nodesep: 50, // 节点之间的水平间距
        ranksep: 100, // 节点之间的垂直间距
      },
    });
    // 事件监听
    g.on('node:click', evt => {
      const itemId = evt.itemId || (evt.item && evt.item.getID()) || (evt.target && evt.target.get('id'));
      if (itemId) {
        let node = g.getNodeData(itemId);
        setSelectedNode({ id: itemId, ...node });
        setSelectedEdge(null);
      }
    });

    g.on('edge:click', evt => {
      const { itemId } = evt;
      if (itemId) {
        const edge = g.getEdgeData(itemId);
        setSelectedEdge({ id: itemId, ...edge });
        setSelectedNode(null);
      }
    });

    g.on('canvas:click', () => {
      setSelectedNode(null);
      setSelectedEdge(null);
    });
    
    g.render();
    setGraph(g);
    return g;
  };
  
  // 导出图数据
  const exportGraphData = () => {
    if (graph) {
      const data = graph.save();
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = '知识图谱数据.json';
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    }
  };
  
  return {
    loading,
    setLoading,
    graph,
    setGraph,
    graphData,
    setGraphData,
    generateInitialData,
    initGraph,
    exportGraphData
  };
}