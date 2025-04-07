import React, { useState } from 'react';
import { Upload, Button, Radio, Card, message, Progress, Modal } from 'antd';
import { 
  UploadOutlined, 
  AudioOutlined, 
  CameraOutlined, 
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';
import './InputProcessor.css';

const InputProcessor = ({ onProcessComplete }) => {
  const [inputType, setInputType] = useState('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [treeType, setTreeType] = useState('new');
  const [parentTree, setParentTree] = useState(null);

  // 模拟处理进度
  const simulateProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onProcessComplete({
            type: inputType,
            treeType: treeType,
            parentTree: parentTree,
            data: inputType === 'text' ? textInput : fileList
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleInputTypeChange = e => {
    setInputType(e.target.value);
    setFileList([]);
  };

  const handleTreeTypeChange = e => {
    setTreeType(e.target.value);
  };

  // 修改 handleUploadChange 函数，正确处理文件列表
  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleProcess = () => {
    if (inputType === 'text' && !textInput.trim()) {
      message.error('请输入文本内容');
      return;
    }

    if ((inputType === 'audio' || inputType === 'image') && fileList.length === 0) {
      message.error('请上传文件');
      return;
    }

    if (treeType === 'sub' && !parentTree) {
      message.error('请选择父知识树');
      return;
    }

    simulateProcessing();
  };

  // 修改 uploadProps，确保正确使用 fileList 而不是 value
  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    onChange: handleUploadChange,  // 添加 onChange 处理器
    listType: inputType === 'image' ? 'picture-card' : 'text',
    onPreview: inputType === 'image' ? handlePreview : undefined,
  };

  // 模拟的知识树列表
  const mockKnowledgeTrees = [
    { id: 1, name: '计算机网络' },
    { id: 2, name: '数据结构' },
    { id: 3, name: '操作系统' },
    { id: 4, name: '数据库系统' },
  ];

  return (
    <Card title="知识输入处理器" className="input-processor">
      <div className="input-type-selector">
        <Radio.Group value={inputType} onChange={handleInputTypeChange}>
          <Radio.Button value="text"><FileTextOutlined /> 文本笔记</Radio.Button>
          <Radio.Button value="audio"><AudioOutlined /> 语音录音</Radio.Button>
          <Radio.Button value="image"><CameraOutlined /> 图片照片</Radio.Button>
        </Radio.Group>
      </div>

      <div className="tree-type-selector">
        <Radio.Group value={treeType} onChange={handleTreeTypeChange}>
          <Radio.Button value="new">创建新知识树</Radio.Button>
          <Radio.Button value="sub">添加到现有知识树</Radio.Button>
        </Radio.Group>
      </div>

      {treeType === 'sub' && (
        <div className="parent-tree-selector">
          <span className="label">选择父知识树:</span>
          <Radio.Group 
            value={parentTree} 
            onChange={e => setParentTree(e.target.value)}
            buttonStyle="solid"
          >
            {mockKnowledgeTrees.map(tree => (
              <Radio.Button key={tree.id} value={tree.id}>{tree.name}</Radio.Button>
            ))}
          </Radio.Group>
        </div>
      )}

      <div className="input-content">
        {inputType === 'text' ? (
          <textarea 
            className="text-input" 
            placeholder="请输入您的笔记内容..." 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            rows={6}
          />
        ) : (
          <Upload {...uploadProps}>
            {inputType === 'image' && fileList.length < 5 ? (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            ) : inputType === 'image' ? null : (
              <Button icon={<UploadOutlined />}>
                {inputType === 'audio' ? '上传音频文件' : '上传文件'}
              </Button>
            )}
          </Upload>
        )}
      </div>

      {isProcessing ? (
        <div className="processing-status">
          <Progress percent={processingProgress} status="active" />
          <div className="processing-message">
            正在处理{inputType === 'text' ? '文本' : inputType === 'audio' ? '音频' : '图片'}，
            提取知识点并构建知识图谱...
          </div>
        </div>
      ) : (
        <Button 
          type="primary" 
          className="process-button"
          onClick={handleProcess}
          disabled={
            (inputType === 'text' && !textInput.trim()) || 
            ((inputType === 'audio' || inputType === 'image') && fileList.length === 0)
          }
        >
          开始处理并构建知识图谱
        </Button>
      )}

      <Modal
        visible={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default InputProcessor;