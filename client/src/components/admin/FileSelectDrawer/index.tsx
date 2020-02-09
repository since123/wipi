import React, { useState, useCallback, useEffect } from "react";
import { Drawer, Card, List, message } from "antd";
import { FileProvider } from "@providers/file";
import style from "./index.module.scss";

const { Meta } = Card;

interface IFileProps {
  isCopy?: boolean;
  visible: boolean;
  closeAfterClick?: boolean;
  onClose: () => void;
  onChange?: (arg: any) => void;
}

const copy = value => {
  let textarea: any = document.createElement("textarea");
  textarea.id = "t";
  textarea.style.height = 0;
  document.body.appendChild(textarea);
  textarea.value = value;
  let selector: any = document.querySelector("#t");
  selector.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  message.success("链接已复制到剪切板");
};

export const FileSelectDrawer: React.FC<IFileProps> = ({
  visible,
  isCopy = false,
  closeAfterClick = false,
  onClose,
  onChange
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<IFile[]>([]);

  const getFiles = useCallback(() => {
    FileProvider.getFiles()
      .then(files => {
        setFiles(files);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <Drawer
      width={640}
      placement="right"
      title={"文件选择"}
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      {isCopy && <p>点击图片即可复制</p>}
      <List
        grid={{
          gutter: 16,
          sm: 3
        }}
        dataSource={files}
        pagination={{ pageSize: 9 }}
        renderItem={file => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div className={style.preview}>
                  <img alt={file.originalname} src={file.url} />
                </div>
              }
              onClick={() => {
                isCopy && copy(file.url);
                onChange && onChange(file.url);
                closeAfterClick && onClose();
              }}
            >
              <Meta
                title={file.originalname}
                // description={
                //   "上传于 " +
                //   dayjs.default(file.createAt).format("YYYY-MM-DD HH:mm:ss")
                // }
              />
            </Card>
          </List.Item>
        )}
      />
    </Drawer>
  );
};
