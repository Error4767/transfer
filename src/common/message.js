import { ElMessage } from "element-plus";
// 样式导入，可能是 ElMessage 样式没有成功被导入，后续版本可能会修复
import "element-plus/theme-chalk/el-message.css";

const messageTypes = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error"
};

// 创建对应类型信息的创建者
function createMessageCreator(messageType) {
  return (message, closable = true)=> ElMessage({
    message,
    showClose: closable,
    type: messageType,
  });
};

const message = {};

// 遍历类型创建
for(let key in messageTypes) {
  message[key] = createMessageCreator(messageTypes[key]);
};

export default message;