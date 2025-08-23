<script setup lang="ts">
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor/editor';

import { ref, watch } from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import '@wangeditor/editor/dist/css/style.css';

interface Props {
  height?: number | string;
  mode?: 'default' | 'simple';
  modelValue?: string;
  placeholder?: string;
  readonly?: boolean;
  toolbarKeys?: string[];
  uploadImageAccept?: string[];
  uploadImageMaxSize?: number;
  uploadImageServer?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  mode: 'default',
  modelValue: '',
  placeholder: '请输入内容',
  readonly: false,
  toolbarKeys: () => [
    'bold',
    'italic',
    'underline',
    'color',
    'bgColor',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'undo',
    'redo',
  ],
  uploadImageAccept: () => ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  uploadImageMaxSize: 5 * 1024 * 1024, // 5MB
  uploadImageServer: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', editor: IDomEditor): void;
  (e: 'uploadImageSuccess', url: string): void;
  (e: 'uploadImageError', error: Error): void;
  (e: 'focus', editor: IDomEditor): void;
  (e: 'blur', editor: IDomEditor): void;
}>();

const html = ref(props.modelValue);
const editorRef = ref<IDomEditor | null>(null);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== html.value) {
      html.value = newVal;
    }
  },
);

// 监听 html 变化
watch(
  () => html.value,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
);

// 编辑器创建完成时的回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  emit('change', editor);
};

// 组件销毁时销毁编辑器
const handleDestroyed = () => {
  editorRef.value?.destroy();
};

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: props.toolbarKeys,
};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: props.uploadImageAccept,
      maxFileSize: props.uploadImageMaxSize,
      onError(file: File, err: Error) {
        emit('uploadImageError', err);
      },
      onSuccess(file: File, res: any) {
        emit('uploadImageSuccess', res.url);
      },
      server: props.uploadImageServer,
    },
  },
  placeholder: props.placeholder,
  readOnly: props.readonly,
};

// 编辑器事件处理
const handleFocus = (editor: IDomEditor) => {
  emit('focus', editor);
};

const handleBlur = (editor: IDomEditor) => {
  emit('blur', editor);
};
</script>

<template>
  <div class="rich-text-editor">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
      class="editor-toolbar"
    />
    <Editor
      v-model="html"
      :default-config="editorConfig"
      :mode="mode"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
      class="editor-content"
      @on-created="handleCreated"
      @on-destroyed="handleDestroyed"
      @on-focus="handleFocus"
      @on-blur="handleBlur"
    />
  </div>
</template>

<style>
.rich-text-editor {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.editor-toolbar {
  border-bottom: 1px solid #d9d9d9;
}

.editor-content {
  overflow-y: hidden;
}

.rich-text-editor:hover {
  border-color: #40a9ff;
}

.rich-text-editor:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
}
</style>
