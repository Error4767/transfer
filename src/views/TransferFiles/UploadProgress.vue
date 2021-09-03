<template>
  <div>
    <div class="filename">{{ filename }}</div>
    <div class="container">
      <ElProgress
        class="percent"
        :status="status"
        :stroke-width="12"
        :percentage="percent"
      ></ElProgress>
      <div class="uploaded-size-info">{{ uploadedSizeInfo }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

import { ElProgress } from "element-plus";

import getSizeString from "@/common/getSizeString.js";

export default {
  components: {
    ElProgress,
  },
  props: {
    total: {
      // 总大小
      type: Number,
      default: 0,
    },
    loaded: {
      // 已上传大小
      type: Number,
      default: 0,
    },
    filename: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // 百分比
    const percent = computed(() => {
      const percent = (props.loaded / props.total) * 100;
      // 可能尚未初始化，默认为0尺寸会造成NaN导致进度条无法显示，默认percent为0
      return Number.isNaN(percent) ? 0 : +percent.toFixed(2);
    });
    // 已上传大小的详细信息
    const uploadedSizeInfo = computed(
      () => `${getSizeString(props.loaded)}/${getSizeString(props.total)}`
    );
    return {
      percent,
      uploadedSizeInfo,
    };
  },
};
</script>

<style scoped>
.container {
  display: column;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  --element-interval: 0.5rem;
}
.percent {
  width: 15rem;
  margin-top: var(--element-interval);
}
.uploaded-size-info {
  margin-top: var(--element-interval);
}
.filename {
  margin: 1rem 0 1rem 0;
}
</style>