import React, { useState, useEffect } from "react";
import { Form, Input, Button, Icon, message } from "antd";
import { FileSelectDrawer } from "@components/admin/FileSelectDrawer";
import { SettingProvider } from "@providers/setting";

export const SystemSetting = ({ setting }) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("logo");
  const [systemTitle, setSystemTitle] = useState(null);
  const [systemLogo, setSystemLogo] = useState(null);
  const [systemFavicon, setSystemFavicon] = useState(null);
  const [systemFooterInfo, setSystemFooterInfo] = useState(null);

  useEffect(() => {
    setSystemTitle((setting && setting.systemTitle) || null);
    setSystemLogo((setting && setting.systemLogo) || null);
    setSystemFavicon((setting && setting.systemFavicon) || null);
    setSystemFooterInfo((setting && setting.systemFooterInfo) || null);
  }, [setting]);

  const save = () => {
    const data = {
      systemTitle,
      systemLogo,
      systemFavicon,
      systemFooterInfo
    };
    SettingProvider.updateSetting(data).then(res => {
      message.success("保存成功");
    });
  };

  return (
    <div>
      <Form.Item label="系统标题">
        <Input
          placeholder="请输入系统标题，将作为 head.title 显示"
          value={systemTitle}
          onChange={e => {
            setSystemTitle(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Logo">
        <Input
          placeholder="请输入 logo 链接或选择文件"
          addonAfter={
            <Icon
              type="file-image"
              onClick={() => {
                setMode("logo");
                setVisible(true);
              }}
            />
          }
          value={systemLogo}
          onChange={e => {
            setSystemLogo(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Favicon">
        <Input
          placeholder="请输入 favicon 链接或选择文件"
          addonAfter={
            <Icon
              type="file-image"
              onClick={() => {
                setMode("favicon");
                setVisible(true);
              }}
            />
          }
          value={systemFavicon}
          onChange={e => {
            setSystemFavicon(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="页脚信息">
        <Input.TextArea
          placeholder="请输入页脚信息"
          value={systemFooterInfo}
          onChange={e => {
            setSystemFooterInfo(e.target.value);
          }}
        />
      </Form.Item>
      <FileSelectDrawer
        visible={visible}
        closeAfterClick={true}
        onClose={() => setVisible(false)}
        onChange={url => {
          if (mode === "logo") {
            setSystemLogo(url);
          } else {
            setSystemFavicon(url);
          }
        }}
      />
      <Button type="primary" onClick={save}>
        保存
      </Button>
    </div>
  );
};
