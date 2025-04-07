import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Select, Slider, message, Tabs, Divider, Typography, Space, Row, Col } from 'antd';
import { SaveOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/settingsSlice';
import './index.scss';

const { Title, Text } = Typography;
const { Option } = Select;

// 简单的文本映射对象国际化
const textMap = {
  'settings.title': '系统设置',
  'settings.general': '通用设置',
  'settings.generalSettings': '通用设置',
  'settings.display': '显示设置',
  'settings.displaySettings': '显示设置',
  'settings.advanced': '高级设置',
  'settings.advancedSettings': '高级设置',
  'settings.advancedWarning': '警告：修改高级设置可能会影响系统性能',
  'settings.language': '语言',
  'settings.languageRequired': '请选择语言',
  'settings.theme': '主题',
  'settings.lightTheme': '浅色',
  'settings.darkTheme': '深色',
  'settings.systemTheme': '跟随系统',
  'settings.enableNotifications': '启用通知',
  'settings.fontSize': '字体大小',
  'settings.defaultZoomLevel': '默认缩放级别',
  'settings.dataStorage': '数据存储',
  'settings.localStorage': '本地存储',
  'settings.cloudStorage': '云端存储',
  'settings.clearDataOnExit': '退出时清除数据',
  'settings.saveSettings': '保存设置',
  'settings.resetSettings': '重置设置',
  'settings.saveSuccess': '设置保存成功',
  'settings.saveFailed': '设置保存失败',
  'settings.resetToDefault': '已重置为默认设置'
};

// 简单的翻译函数
const t = (key) => textMap[key] || key;

const Settings = () => {
  const dispatch = useDispatch();
  const currentSettings = useSelector(state => state.settings);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 初始化表单数据
    if (currentSettings) {
      form.setFieldsValue(currentSettings);
    }
  }, [currentSettings, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await dispatch(updateSettings(values));
      message.success(t('settings.saveSuccess'));
    } catch (error) {
      message.error(t('settings.saveFailed'));
      console.error('保存设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    form.resetFields();
    message.info(t('settings.resetToDefault'));
  };

// 删除未完成的 tabItems 定义
// cosnt tabItems = [
//   {
// key="general",
// label: (
// 
// )
//   }
// ]

// 定义正确的 tabItems
const tabItems = [
  {
    key: "general",
    label: t('settings.general'),
    children: (
      <>
        <Title level={4}>{t('settings.generalSettings')}</Title>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="language"
              label={t('settings.language')}
              rules={[{ required: true, message: t('settings.languageRequired') }]}
            >
              <Select>
                <Option value="zh-CN">中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="theme"
              label={t('settings.theme')}
            >
              <Select>
                <Option value="light">{t('settings.lightTheme')}</Option>
                <Option value="dark">{t('settings.darkTheme')}</Option>
                <Option value="system">{t('settings.systemTheme')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider />
        
        <Form.Item
          name="notifications"
          label={t('settings.enableNotifications')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </>
    )
  },
  {
    key: "display",
    label: t('settings.display'),
    children: (
      <>
        <Title level={4}>{t('settings.displaySettings')}</Title>
        <Form.Item
          name="fontSize"
          label={t('settings.fontSize')}
        >
          <Slider
            min={12}
            max={20}
            marks={{
              12: '12px',
              16: '16px',
              20: '20px',
            }}
          />
        </Form.Item>
        
        <Form.Item
          name="graphZoomLevel"
          label={t('settings.defaultZoomLevel')}
        >
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            marks={{
              0.5: '50%',
              1: '100%',
              2: '200%',
            }}
          />
        </Form.Item>
      </>
    )
  },
  {
    key: "advanced",
    label: t('settings.advanced'),
    children: (
      <>
        <Title level={4}>{t('settings.advancedSettings')}</Title>
        <Text type="warning">{t('settings.advancedWarning')}</Text>
        
        <Form.Item
          name="dataStorage"
          label={t('settings.dataStorage')}
        >
          <Select>
            <Option value="local">{t('settings.localStorage')}</Option>
            <Option value="cloud">{t('settings.cloudStorage')}</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="clearDataOnExit"
          label={t('settings.clearDataOnExit')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </>
    )
  }
]

  return (
    <div className="settings-container">
      <Card 
        title={
          <Space>
            <SettingOutlined />
            <span>{t('settings.title')}</span>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={currentSettings || {}}
        >
          <Tabs defaultActiveKey="general" items={tabItems} />
          
          <Divider />
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {t('settings.saveSettings')}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetSettings}
              >
                {t('settings.resetSettings')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;