import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import './KnowledgeGraph3D.css';

const KnowledgeGraph3D = ({ data, onNodeClick }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const controlsRef = useRef(null);
  const nodesRef = useRef({});
  const edgesRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // 初始化场景
    const initScene = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // 创建场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 150;
      cameraRef.current = camera;

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 创建标签渲染器
      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(width, height);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0';
      containerRef.current.appendChild(labelRenderer.domElement);
      labelRendererRef.current = labelRenderer;

      // 创建控制器
      const controls = new OrbitControls(camera, labelRenderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 20, 10);
      scene.add(directionalLight);
    };

    // 创建节点
    const createNodes = () => {
      data.nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(
          node.level === 'basic' ? 5 : node.level === 'intermediate' ? 7 : 9
        );
        
        const material = new THREE.MeshLambertMaterial({
          color: node.level === 'basic' ? 0x6495ED : 
                 node.level === 'intermediate' ? 0xFFA500 : 0xFF4500
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(node.x, node.y, node.z);
        mesh.userData = { id: node.id, type: 'node', data: node };
        
        // 添加标签
        const div = document.createElement('div');
        div.className = 'node-label';
        div.textContent = node.name;
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        div.style.padding = '2px 5px';
        div.style.borderRadius = '3px';
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => onNodeClick(node));
        
        const label = new CSS2DObject(div);
        label.position.set(0, 10, 0);
        mesh.add(label);
        
        sceneRef.current.add(mesh);
        nodesRef.current[node.id] = mesh;
      });
    };

    // 创建边
    const createEdges = () => {
      data.links.forEach(link => {
        const sourceNode = nodesRef.current[link.source];
        const targetNode = nodesRef.current[link.target];
        
        if (sourceNode && targetNode) {
          const material = new THREE.LineBasicMaterial({
            color: 0x999999,
            transparent: true,
            opacity: 0.6
          });
          
          const points = [
            sourceNode.position,
            targetNode.position
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, material);
          line.userData = { id: `${link.source}-${link.target}`, type: 'edge', data: link };
          
          sceneRef.current.add(line);
          edgesRef.current.push(line);
        }
      });
    };

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      if (labelRendererRef.current && sceneRef.current && cameraRef.current) {
        labelRendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // 窗口大小调整
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current || !labelRendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      labelRendererRef.current.setSize(width, height);
    };

    // 初始化
    initScene();
    createNodes();
    createEdges();
    animate();
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (labelRendererRef.current && labelRendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(labelRendererRef.current.domElement);
      }
      
      // 清理场景中的对象
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const object = sceneRef.current.children[0];
          sceneRef.current.remove(object);
        }
      }
    };
  }, [data, onNodeClick]);

  return (
    <div className="knowledge-graph-container" ref={containerRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default KnowledgeGraph3D;