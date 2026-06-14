# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概要

「医者自保」——一个基于真实医患纠纷案例改编的生存模拟游戏。中文内容，面向医学教育。

## 开发命令

```bash
npm run dev        # 启动开发服务器 (Vite HMR)
npm run build      # 类型检查 + 构建 (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # 预览构建产物
```

## 技术栈

- React 19 + TypeScript 6 + Vite 8
- Tailwind CSS v4 (通过 `@tailwindcss/vite` 插件，无 tailwind.config 文件)
- 全局样式入口：`src/index.css`（`@import "tailwindcss"`）
- ESLint 使用 flat config (`eslint.config.js`)

## 架构

### 游戏状态机

全部游戏逻辑集中在 `src/hooks/useGameState.ts`，使用 `useReducer` 管理状态。游戏有 4 个相位流转：

```
CREATE → PLAYING → OUTCOME → PLAYING (循环) → ENDING
```

- **CREATE**: 创建角色（输入名字）
- **PLAYING**: 展示事件，玩家做出选择
- **OUTCOME**: 展示选择结果的模态框
- **ENDING**: 根据最终属性判定结局

每个职业阶段（住院医师 → 主治医师 → 副主任医师）随机从对应事件池中抽取 **6 个事件**（`EVENTS_PER_STAGE = 6`）。阶段之间通过 `getNextStage()` 推进，到副主任医师结束后自动进入 ENDING。

### 属性系统（5 维）

定义在 `src/types.ts`（`PlayerStats` 接口），范围 0-100：

| 属性 | 中文名 | 低值风险 |
|------|--------|----------|
| reputation | 职业声誉 | 社死退网结局 |
| safety | 安全指数 | 英年早逝结局 |
| mental | 心理状态 | 职业倦怠结局 |
| support | 科室支持 | 无直接结局，影响选项 |
| legalRisk | 法律风险 | 铁窗泪结局（≥90） |

任何属性归零（reputation/safety/mental）会触发**提前坏结局**。结局判定优先级见 `determineEnding()` 函数：安全→法律→心理→声誉→好结局→中等结局→默认结局。

### 核心文件

| 文件 | 作用 |
|------|------|
| `src/types.ts` | 所有类型定义、常量（INITIAL_STATS, STAGE_NAMES） |
| `src/hooks/useGameState.ts` | reducer、状态机、结局判定 |
| `src/data/events.ts` | 主游戏事件数据（数组 `allEvents`），按 `stage` 字段区分阶段 |
| `src/data/scenarios.ts` | 临床诊断场景数据（`allScenarios`），用于 GameOverScreen 的额外挑战模式 |
| `src/App.tsx` | 根据 `state.phase` 路由到不同界面组件 |

### 组件树

```
App
├── StartScreen       (phase=CREATE)
├── GameScreen         (phase=PLAYING/OUTCOME)
│   ├── StatsBar       (顶部属性条)
│   ├── EventCard      (事件描述 + 选项按钮)
│   └── OutcomeModal   (选择结果弹窗)
└── EndingScreen       (phase=ENDING)
    └── GameOverScreen (额外场景模式)
```

所有状态通过 props 向下传递，无路由库，无全局状态管理库。

### 数据格式注意事项

- `events.ts` 中部分事件对象存在**重复字段**（如 `imagePrompt` 和 `imageUrl` 各出现两次），编辑时注意保持一致性
- `imageUrl` 指向 `/images/*.png`（`public/images/` 目录下的静态资源）
- `imagePrompt` 用于 AI 生图的提示词，镜像保存在 `scripts/image_prompts.json`

### 脚本

`scripts/` 目录下是 Python 脚本，用于生成/处理游戏内容：
- `generate_images.py` — 调用通义万相 API 批量生成事件配图
- `image_prompts.json` — 图片生成提示词汇总
- `batch_gen.py`, `inject_prompts.py`, `fix_events.py`, `regenerate_events.py` — 事件数据批量处理和修复工具

运行脚本前需要 `conda activate mimic_doctor` 并设置 `DASHSCOPE_API_KEY` 环境变量。

### Tailwind CSS v4 注意

- CSS 配置在 `src/index.css` 中通过 `@import "tailwindcss"` 引入
- 主题通过 CSS 变量配置，无 `tailwind.config.js`
- 字体：优先使用 PingFang SC / Microsoft YaHei（中文优化）
