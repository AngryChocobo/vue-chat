# 记录支持 typescript 的改造过程

## 安装过程

1. vue add typescript
2. 添加 `tsconfig.json` (copy 官网文档)

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

## 改造过程

由于之前已经升到了 vue3，所以可以开心的改造啦

1. vue 文件的 `<script>` 标签改为 `<script lang="ts">`，这一步可以直接全局搜索改造

2. 提示你找不到一些 js 声明的模块

```ts
declare module '*.vue' {
  import {defineComponent} from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'jsencrypt'
```
