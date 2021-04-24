import { ElMessage } from "element-plus";

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
    duration: 0,
  });
};

const message = {};

// 遍历类型创建
for(let key in messageTypes) {
  message[key] = createMessageCreator(messageTypes[key]);
};

export default message;