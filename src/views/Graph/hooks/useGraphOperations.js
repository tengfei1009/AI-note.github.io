import { useState } from 'react';
import { message } from 'antd';

export default function useGraphOperations(graph) { // 直接接收graph对象
  const [searchValue, setSearchValue] = useState('');
  const [domain, setDomain] = useState('all');
  
  // 搜索节点
  const handleSearch = () => {
    if (!searchValue.trim() || !graph) return;

    const nodes = graph.getAllNodesData();
    let found = false;

    nodes.forEach(node => {
      const label = node.data?.label || '';

      if (label.toLowerCase().includes(searchValue.toLowerCase())) {
        graph.setItemState(node.id, 'selected', true);
        graph.focusItem(node.id);
        found = true;
      } else {
        graph.setItemState(node.id, 'selected', false);
      }
    });

    if (!found) {
      message.info('未找到匹配的知识点');
    }
  };

  // 缩放操作
  const handleZoomIn = () => {
    if (graph) {
      const zoom = graph.getZoom();
      graph.zoomTo(zoom * 1.2);
    } else {
      console.error('Graph对象不存在，无法执行缩放操作');
    }
  };
  
  const handleZoomOut = () => {
    if (graph) {
      const zoom = graph.getZoom();
      graph.zoomTo(zoom / 1.2);
    } else {
      console.error('Graph对象不存在，无法执行缩放操作');
    }
  };
  
  const handleFitView = () => {
    if (graph) {
      graph.fitView();
    } else {
      console.error('Graph对象不存在，无法执行适应屏幕操作');
    }
  };
  
  return {
    searchValue,
    setSearchValue,
    domain,
    setDomain,
    handleSearch,
    handleZoomIn,
    handleZoomOut,
    handleFitView
  };
}