# 个人工具与游戏网站 · 完整开发文档 v1.2

---

## 一、项目概述

构建一个个人网站，集合自制小游戏与实用小工具。网站风格统一（柔和、暖色、活泼休闲），内容分为两大类：

**游戏（Games）**
- 2048
- 贪吃蛇

**工具（Tools）**
- 记事本
- 日历
- 计算器
- 转盘抽奖

所有数据使用 localStorage 本地持久化，无需后端。

---

## 二、技术栈与构建配置

### 技术选型

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 构建工具 | Vite 5 |
| 路由 | React Router v6 |
| 样式 | CSS Modules |
| 状态管理 | React useState / useReducer |
| 持久化 | localStorage |
| 运行环境 | Node.js 18+ |
| 包管理器 | npm |

### 项目初始化命令

```bash
npm create vite@latest my-site -- --template react
cd my-site
npm install react-router-dom
npm run dev
```

### 目录结构

```
my-site/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   └── global.css
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.module.css
│   │   └── AppCard/
│   │       ├── AppCard.jsx
│   │       └── AppCard.module.css
│   └── pages/
│       ├── Home/
│       │   ├── Home.jsx
│       │   └── Home.module.css
│       ├── games/
│       │   ├── Game2048/
│       │   │   ├── Game2048.jsx
│       │   │   ├── Game2048.module.css
│       │   │   ├── components/
│       │   │   │   ├── Board.jsx
│       │   │   │   ├── Board.module.css
│       │   │   │   ├── Tile.jsx
│       │   │   │   ├── Tile.module.css
│       │   │   │   ├── ScorePanel.jsx
│       │   │   │   └── ScorePanel.module.css
│       │   │   └── hooks/
│       │   │       ├── use2048.js
│       │   │       └── useSwipe.js
│       │   └── Snake/
│       │       ├── Snake.jsx
│       │       ├── Snake.module.css
│       │       ├── components/
│       │       │   ├── SnakeBoard.jsx
│       │       │   ├── SnakeBoard.module.css
│       │       │   ├── StatusPanel.jsx
│       │       │   └── StatusPanel.module.css
│       │       └── hooks/
│       │           ├── useSnake.js
│       │           └── useSwipe.js  # 与2048共用逻辑，可复制
│       └── tools/
│           ├── Notepad/
│           │   ├── Notepad.jsx
│           │   └── Notepad.module.css
│           ├── Calendar/
│           │   ├── Calendar.jsx
│           │   └── Calendar.module.css
│           ├── Calculator/
│           │   ├── Calculator.jsx
│           │   └── Calculator.module.css
│           └── Spinner/
│               ├── Spinner.jsx
│               ├── Spinner.module.css
│               └── hooks/
│                   └── useSpinner.js
├── index.html
├── vite.config.js
└── package.json
```

---

## 三、设计规范（全站通用）

### 3.1 色彩系统

在 `src/styles/global.css` 中定义：

```css
:root {
  /* 主色调：暖橙 */
  --color-amber-50:  #FAEEDA;
  --color-amber-100: #FAC775;
  --color-amber-400: #EF9F27;
  --color-amber-600: #BA7517;
  --color-amber-800: #633806;

  /* 辅助色：珊瑚粉 */
  --color-coral-50:  #FAECE7;
  --color-coral-100: #F5C4B3;
  --color-coral-400: #D85A30;
  --color-coral-600: #993C1D;

  /* 辅助色：粉紫 */
  --color-pink-50:   #FBEAF0;
  --color-pink-100:  #F4C0D1;
  --color-pink-400:  #D4537E;
  --color-pink-600:  #993556;

  /* 辅助色：紫 */
  --color-purple-50:  #EEEDFE;
  --color-purple-400: #7F77DD;
  --color-purple-600: #534AB7;
  --color-purple-800: #3C3489;

  /* 中性色 */
  --color-gray-50:   #F1EFE8;
  --color-gray-200:  #B4B2A9;
  --color-gray-600:  #5F5E5A;
  --color-gray-800:  #444441;

  /* 语义色 */
  --color-bg-page:        #FFF8F0;
  --color-bg-surface:     #FFFFFF;
  --color-text-primary:   #3D2B1F;
  --color-text-secondary: #7A6355;
  --color-border:         rgba(100, 60, 20, 0.12);
}
```

**分类主题色**：

| 分类 | 卡片背景色 |
|------|-----------|
| 游戏 | `--color-amber-100` |
| 工具 | `--color-coral-50` |

### 3.2 圆角规范

| 用途 | 值 |
|------|----|
| 数字方块 / 转盘扇区 | `border-radius: 16px` |
| 卡片 / 面板 | `border-radius: 12px` |
| 按钮 | `border-radius: 8px` |
| 徽章 / 胶囊 | `border-radius: 999px` |

### 3.3 字体规范

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-text-primary);
  background: var(--color-bg-page);
}
```

| 用途 | 大小 | 字重 |
|------|------|------|
| 页面大标题 | 22px | 500 |
| 区块标题 | 18px | 500 |
| 正文 | 16px | 400 |
| 辅助说明 | 13px | 400 |
| 标签 | 12px | 400，letter-spacing: 0.04em |

### 3.4 间距规范

- 页面内边距：`24px`（移动端 `16px`）
- 组件间距：`8px` 的倍数
- 卡片内边距：`20px 24px`

### 3.5 动效规范

```css
@keyframes tile-appear {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@keyframes tile-merge {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* 通用交互过渡 */
/* transition: all 150ms ease */
```

### 3.6 阴影规范

```css
/* 卡片悬停，全站唯一允许的阴影 */
box-shadow: 0 4px 16px rgba(100, 60, 20, 0.10);
```

### 3.7 localStorage 命名规范

格式：`{模块名}-{数据类型}`

| 模块 | key | 内容 |
|------|-----|------|
| 2048 | `2048-best` | 最高分（number） |
| 贪吃蛇 | `snake-best` | 最高分（number） |
| 记事本 | `notepad-content` | 文本内容（string） |
| 转盘抽奖 | `spinner-items` | 选项列表（JSON） |

---

## 四、网站整体框架

### 4.1 路由结构

```
/                    → 首页
/games/2048          → 2048
/games/snake         → 贪吃蛇
/tools/notepad       → 记事本
/tools/calendar      → 日历
/tools/calculator    → 计算器
/tools/spinner       → 转盘抽奖
```

### 4.2 App.jsx 配置

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Game2048 from './pages/games/Game2048/Game2048'
import Snake from './pages/games/Snake/Snake'
import Notepad from './pages/tools/Notepad/Notepad'
import Calendar from './pages/tools/Calendar/Calendar'
import Calculator from './pages/tools/Calculator/Calculator'
import Spinner from './pages/tools/Spinner/Spinner'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/2048" element={<Game2048 />} />
        <Route path="/games/snake" element={<Snake />} />
        <Route path="/tools/notepad" element={<Notepad />} />
        <Route path="/tools/calendar" element={<Calendar />} />
        <Route path="/tools/calculator" element={<Calculator />} />
        <Route path="/tools/spinner" element={<Spinner />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 4.3 Navbar 组件

- 左侧：网站名称，点击跳转首页
- 背景：`var(--color-bg-surface)`，底部 `1px solid var(--color-border)`
- 高度：`56px`，字号 18px，字重 500

### 4.4 首页（Home）

**布局**：

```
┌─────────────────────────────────┐
│ Navbar                          │
├─────────────────────────────────┤
│  Hero 区域                       │
├─────────────────────────────────┤
│  🎮 游戏                         │
│  ┌─────────┐  ┌─────────┐       │
│  │ AppCard │  │ AppCard │       │
│  └─────────┘  └─────────┘       │
├─────────────────────────────────┤
│  🔧 工具                         │
│  ┌─────────┐  ┌─────────┐  ... │
│  │ AppCard │  │ AppCard │       │
│  └─────────┘  └─────────┘       │
└─────────────────────────────────┘
```

**Hero 区域**：
- 背景：`var(--color-amber-50)`，内边距 `48px 24px`
- 标题：22px，500
- 副标题：16px，secondary 色

**分区标题**：
- 18px，500
- 左侧 `4px` 宽 `var(--color-amber-400)` 竖线装饰
- 与上方间距 `32px`，与卡片间距 `16px`

**首页数据**：

```js
const games = [
  { title: '2048',   description: '合并数字，挑战 2048！',  path: '/games/2048',  color: '--color-amber-100', emoji: '🔢' },
  { title: '贪吃蛇', description: '经典贪吃蛇，吃得越多越难', path: '/games/snake', color: '--color-amber-100', emoji: '🐍' }
]

const tools = [
  { title: '记事本',   description: '随手记，自动保存',     path: '/tools/notepad',    color: '--color-coral-50', emoji: '📝' },
  { title: '日历',     description: '查看日期与备忘',       path: '/tools/calendar',   color: '--color-coral-50', emoji: '📅' },
  { title: '计算器',   description: '日常计算用',           path: '/tools/calculator', color: '--color-coral-50', emoji: '🔢' },
  { title: '转盘抽奖', description: '填入选项，转盘决定！',  path: '/tools/spinner',    color: '--color-coral-50', emoji: '🎡' }
]
```

### 4.5 AppCard 组件

**props**：

```js
{
  title: string,
  description: string,
  path: string,
  color: string,   // CSS 变量名
  emoji: string
}
```

**样式**：
- 背景使用 `color` prop，圆角 `12px`，内边距 `20px 24px`
- 最小宽度 `220px`，高度约 `140px`
- emoji：32px，标题：16px/500，描述：13px/secondary
- 悬停：`translateY(-2px)` + 阴影
- 整张卡片用 `<Link>` 包裹

**卡片列表容器**：

```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
gap: 16px;
```

---

## 五、2048 游戏规范

### 5.1 页面布局

```
┌──────────────────────────┐
│ Navbar                   │
├──────────────────────────┤
│ ← 返回                   │
│ 2048            [重新开始]│
│ ┌──────┐  ┌──────┐       │
│ │SCORE │  │ BEST │       │
│ └──────┘  └──────┘       │
│ ┌────────────────────┐   │
│ │    4×4 游戏棋盘    │   │
│ └────────────────────┘   │
│ 方向键 / 滑动 来操作      │
└──────────────────────────┘
```

### 5.2 数据结构

```js
{
  board: number[][],    // 4×4，0 代表空格
  score: number,
  bestScore: number,    // 从 localStorage 读取
  status: string        // 'playing' | 'won' | 'lost'
}
```

### 5.3 核心逻辑（use2048.js）

```js
function initBoard()              // 全0矩阵 + 2个随机初始方块
function addRandomTile(board)     // 90%生成2，10%生成4
function move(board, direction)   // 返回 { newBoard, scoreGained, moved }
function mergeLeft(row)           // [2,0,2,4] → { row:[4,4,0,0], score:4 }
function isGameOver(board)        // 四方向均不可移动
function isWon(board)             // 存在值为2048的格子
```

**方向变换**：
- left：直接 `mergeLeft`
- right：翻转 → `mergeLeft` → 翻转
- up：转置 → `mergeLeft` → 转置
- down：转置 → 翻转 → `mergeLeft` → 翻转 → 转置

**最高分**：
```js
localStorage.getItem('2048-best')
localStorage.setItem('2048-best', String(score))
```

### 5.4 输入处理

键盘：监听 `keydown`，映射 `ArrowUp/Down/Left/Right` → `up/down/left/right`

触摸（useSwipe.js）：监听 `touchstart/touchend`，`|delta| > 30px` 触发，取绝对值较大轴判断方向

### 5.5 组件规范

**Board.jsx**：
- 背景 `var(--color-amber-50)`，gap `10px`，内边距 `12px`，圆角 `16px`
- 格子尺寸：`72×72px`（移动端 `<420px` 时缩为 `60×60px`，gap `8px`）

**Tile.jsx** props：`{ value, isNew, isMerged }`

颜色映射：

| 数值 | 背景色 | 文字色 | 字号 |
|------|--------|--------|------|
| 0 | `#F1EFE8` | — | — |
| 2 | `#FAEEDA` | `#633806` | 20px |
| 4 | `#FAC775` | `#412402` | 20px |
| 8 | `#EF9F27` | `#412402` | 20px |
| 16 | `#F5C4B3` | `#4A1B0C` | 20px |
| 32 | `#D85A30` | `#FAECE7` | 20px |
| 64 | `#F4C0D1` | `#4B1528` | 20px |
| 128 | `#D4537E` | `#FBEAF0` | 18px |
| 256 | `#993556` | `#FBEAF0` | 18px |
| 512 | `#7F77DD` | `#EEEDFE` | 18px |
| 1024 | `#534AB7` | `#EEEDFE` | 16px |
| 2048 | `#3C3489` | `#CECBF6` | 16px |

动画：`isNew` → `tile-appear`（150ms），`isMerged` → `tile-merge`（200ms），通过 `key` 变化触发

**ScorePanel.jsx**：两个胶囊卡片，背景 `var(--color-amber-100)`，圆角 `999px`，标签 12px，数值 22px/500

### 5.6 游戏状态覆层

覆层 `position: absolute` 覆盖棋盘，父容器需 `position: relative`

- 胜利（won）：背景 `rgba(250,238,218,0.85)`，文字"🎉 达成 2048！"，按钮"继续游戏"+"重新开始"
- 失败（lost）：背景 `rgba(241,239,232,0.85)`，文字"游戏结束"，按钮"重新开始"

---

## 六、贪吃蛇游戏规范

### 6.1 页面布局

```
┌──────────────────────────┐
│ Navbar                   │
├──────────────────────────┤
│ ← 返回                   │
│ 贪吃蛇          [重新开始]│
│ ┌──────┐  ┌──────┐       │
│ │SCORE │  │ BEST │       │
│ └──────┘  └──────┘       │
│ ┌────────────────────┐   │
│ │     游戏棋盘        │   │
│ └────────────────────┘   │
│ 方向键 / 滑动 来操作      │
└──────────────────────────┘
```

### 6.2 数据结构

```js
{
  snake: [{ x: number, y: number }],  // 蛇身坐标数组，[0]为蛇头
  food: { x: number, y: number },     // 食物坐标
  direction: string,                  // 'up' | 'down' | 'left' | 'right'
  nextDirection: string,              // 缓冲下一帧方向，防止反向穿越
  score: number,
  bestScore: number,                  // 从 localStorage 读取
  status: string                      // 'idle' | 'playing' | 'paused' | 'lost'
}
```

### 6.3 棋盘规格

- 格子数：`20 × 20`
- 每格尺寸：`20px × 20px`
- 棋盘总尺寸：`400px × 400px`
- 移动端（`<420px`）：格子缩为 `16px`，棋盘 `320px × 320px`

### 6.4 核心逻辑（useSnake.js）

```js
// 游戏循环：使用 setInterval 驱动，每帧调用 step()
// 初始速度：每 150ms 一帧
// 每得 5 分提速一次，最快不低于 80ms/帧

function initGame()
// 初始蛇：长度3，位于棋盘中央，方向向右
// 随机生成第一个食物

function step()
// 1. 根据 nextDirection 更新 direction
// 2. 计算新蛇头位置
// 3. 判断碰墙或碰自身 → status = 'lost'
// 4. 判断是否吃到食物：
//    是 → score += 10，重新生成食物，蛇身增长
//    否 → 移除蛇尾（蛇向前移动）

function generateFood(snake)
// 在不与蛇身重叠的随机位置生成食物

function checkCollision(head, snake)
// 碰墙：head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20
// 碰自身：snake 数组中存在与 head 坐标相同的元素
```

**方向变更规则**：不允许直接反向（上↔下、左↔右），其他方向可随时切换

### 6.5 输入处理

键盘：监听 `keydown`，映射方向键和 WASD

```js
const keyMap = {
  ArrowUp: 'up',    w: 'up',
  ArrowDown: 'down', s: 'down',
  ArrowLeft: 'left', a: 'left',
  ArrowRight: 'right', d: 'right'
}
// 空格键：playing ↔ paused 切换
```

触摸：复用 `useSwipe.js`，逻辑与2048相同

### 6.6 组件规范

**SnakeBoard.jsx**：
- 使用 CSS Grid 渲染 20×20 格子
- 格子状态：`empty`（灰白）、`snake-head`（深绿）、`snake-body`（中绿）、`food`（珊瑚红）
- 颜色：
  - 棋盘背景：`var(--color-gray-50)`
  - 蛇头：`#3B6D11`
  - 蛇身：`#639922`
  - 食物：`var(--color-coral-400)`，圆角 `999px`（显示为圆形）
- 蛇身格子圆角：`4px`；蛇头圆角：`6px`

**StatusPanel.jsx**：与2048的 ScorePanel 样式一致，背景改用 `var(--color-coral-50)`

### 6.7 游戏状态覆层

- 未开始（idle）：文字"按方向键开始游戏"，无按钮
- 暂停（paused）：文字"已暂停"，按钮"继续"
- 失败（lost）：文字"游戏结束"，显示本次得分，按钮"重新开始"

### 6.8 最高分持久化

```js
localStorage.getItem('snake-best')
localStorage.setItem('snake-best', String(score))
```

---

## 七、工具规范

### 7.1 记事本（Notepad）

**功能**：
- 全屏文本输入区域
- 内容实时自动保存到 localStorage（`notepad-content`）
- 显示字数统计
- 清空按钮（需二次确认）

**布局**：

```
┌──────────────────────────┐
│ Navbar                   │
├──────────────────────────┤
│ ← 返回   记事本  [清空]   │
│ 已自动保存 · 共 xxx 字    │
│ ┌────────────────────┐   │
│ │                    │   │
│ │   文本输入区域      │   │
│ │   （占满剩余高度）  │   │
│ │                    │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

**实现要点**：
- `<textarea>` 占满剩余视口高度（`height: calc(100vh - Navbar高度 - 顶栏高度)`）
- 监听 `onChange`，每次变化写入 localStorage
- 初始化时从 localStorage 读取内容
- 字数统计：`content.length`（包含空格换行）

**样式**：
- textarea 背景 `var(--color-bg-surface)`，无边框，内边距 `16px`，字号 `16px`，行高 `1.8`
- 圆角 `12px`，`resize: none`

### 7.2 日历（Calendar）

**功能**：
- 显示当前月份的月历视图
- 上下月切换
- 今天高亮显示
- 点击日期可添加/查看当日备忘（存入 localStorage，key：`calendar-notes`，格式：`{ "2025-06-11": "备忘内容" }`）
- 有备忘的日期显示小圆点标记

**布局**：

```
┌──────────────────────────┐
│ Navbar                   │
├──────────────────────────┤
│ ← 返回                   │
│ ← 2025年6月 →            │  ← 月份切换
│ 日 一 二 三 四 五 六       │  ← 星期行
│  1  2  3  4  5  6  7    │
│  8  9 10 11 12 13 14    │  ← 日期格子
│    ...                   │
├──────────────────────────┤
│ 备忘输入区（点击日期后出现）│
└──────────────────────────┘
```

**日期格子样式**：
- 普通日期：圆角 `8px`，悬停背景 `var(--color-amber-50)`
- 今天：背景 `var(--color-amber-400)`，文字白色
- 有备忘：日期数字下方显示直径 `6px` 的 `var(--color-coral-400)` 圆点
- 非当月日期：文字色 `var(--color-gray-200)`

**数据结构**：
```js
// localStorage: 'calendar-notes'
{
  "2025-06-11": "今天要买菜",
  "2025-06-15": "朋友生日"
}
```

### 7.3 计算器（Calculator）

**功能**：标准计算器，支持加减乘除、小数点、正负切换、百分比、清零（AC）

**布局**：

```
┌──────────────────────────┐
│ Navbar                   │
├──────────────────────────┤
│ ← 返回                   │
│   ┌──────────────────┐   │
│   │         1,234.5  │   │  ← 显示屏
│   └──────────────────┘   │
│  [AC] [+/-] [%]  [÷]    │
│  [ 7] [ 8] [ 9]  [×]    │
│  [ 4] [ 5] [ 6]  [−]    │
│  [ 1] [ 2] [ 3]  [+]    │
│  [   0   ] [.]   [=]    │
└──────────────────────────┘
```

**按键颜色**：
- 数字键：背景 `var(--color-gray-50)`，文字 `var(--color-text-primary)`
- 运算符键（÷ × − + =）：背景 `var(--color-amber-400)`，文字白色
- 功能键（AC +/- %）：背景 `var(--color-coral-50)`，文字 `var(--color-coral-600)`
- `=` 键：背景 `var(--color-amber-600)`

**实现要点**：
- 状态：`{ display: string, operator: string, prevValue: number, waitingForOperand: boolean }`
- 连续运算支持（`1 + 2 = 3`，再按 `+ 4 =` 得 `7`）
- 显示数字超过 9 位时缩小字号

**计算器不需要 localStorage**（无需持久化）

### 7.4 转盘抽奖（Spinner）

**功能**：
- 动态添加/删除选项，不限数量
- 每个选项可自定义名称、颜色、emoji图标
- 选项数据持久化到 localStorage（`spinner-items`）
- 点击"开始"按钮，转盘旋转后减速停止
- 结果以覆层弹窗展示

**页面布局**：

```
┌──────────────────────────────────────┐
│ Navbar                               │
├──────────────────────────────────────┤
│ ← 返回                               │
│ ┌─────────────────┐ ┌─────────────┐  │
│ │                 │ │  选项列表   │  │
│ │   转盘（SVG）   │ │ ┌─────────┐ │  │
│ │                 │ │ │选项 1   │ │  │
│ │    ▲（指针）    │ │ │选项 2   │ │  │
│ │                 │ │ │...      │ │  │
│ │  [  开始转动  ] │ │ └─────────┘ │  │
│ └─────────────────┘ │  [+ 添加]  │  │
│                     └─────────────┘  │
└──────────────────────────────────────┘
```

移动端：转盘在上，选项列表在下，垂直排列。

**转盘 SVG 实现**：

转盘使用 SVG 绘制，每个扇形用 `<path>` 实现：

```js
// 每个扇形的路径计算
function getSectorPath(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}
```

指针：固定在转盘顶部中央，三角形 SVG，颜色 `var(--color-amber-800)`

**旋转动画**：

```js
// 使用 CSS transform: rotate() + transition 实现
// 旋转逻辑：
// 1. 随机生成最终停止角度（保证至少转3圈）
// finalAngle = currentAngle + (3 * 360) + randomOffset
// 2. transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)
// 3. 动画结束后计算指针指向的扇区（用最终角度反推）
```

**结果计算**：

```js
// 转盘停止后，指针固定在顶部（270度/−90度方向）
// 用最终旋转角度取模，反推指针落在哪个扇区
function getResult(items, finalAngle) {
  const normalized = ((finalAngle % 360) + 360) % 360
  const pointerAngle = (360 - normalized + 270) % 360
  // 找到 pointerAngle 落在哪个扇区范围内
}
```

**选项数据结构**：

```js
// localStorage: 'spinner-items'
[
  {
    id: string,       // 唯一ID，用 Date.now().toString() 生成
    label: string,    // 选项名称
    color: string,    // 十六进制颜色，如 "#FAC775"
    emoji: string     // emoji图标，如 "🎉"，可为空字符串
  }
]
```

**默认选项**（首次打开时写入 localStorage）：

```js
[
  { id: '1', label: '选项一', color: '#FAC775', emoji: '🎉' },
  { id: '2', label: '选项二', color: '#F5C4B3', emoji: '🌟' },
  { id: '3', label: '选项三', color: '#F4C0D1', emoji: '🎊' },
  { id: '4', label: '选项四', color: '#EEEDFE', emoji: '✨' }
]
```

**选项编辑面板（每条选项）**：

```
┌────────────────────────────────┐
│ [emoji] [名称输入框] [颜色] [删除]│
└────────────────────────────────┘
```

- emoji：点击弹出简易 emoji 选择器（提供约20个常用 emoji 供选择，不需要完整键盘）
- 颜色：`<input type="color">` 原生取色器
- 删除：点击删除该条选项（选项少于2条时禁用删除按钮）
- 名称输入框：`onChange` 实时更新，`onBlur` 时写入 localStorage

**结果覆层**：

```
┌─────────────────────────┐
│                         │
│   🎉                    │
│   恭喜！                │
│                         │
│   选项名称              │  ← 大字显示中奖选项
│                         │
│      [再转一次]          │
│                         │
└─────────────────────────┘
```

- 覆层背景：半透明黑色蒙层 `rgba(0,0,0,0.5)`
- 卡片背景：中奖选项的颜色（`item.color`）
- 圆角：`16px`，内边距 `40px 32px`
- 选项名称：28px，500
- "再转一次"按钮：关闭覆层，可立即重新转动

---

## 八、验收标准

### 8.1 网站框架

- [ ] 首页分游戏/工具两个分区，各有分区标题
- [ ] 所有卡片点击跳转正确
- [ ] 各页面返回按钮均可回到首页
- [ ] 移动端（375px）卡片列表正常显示

### 8.2 2048

- [ ] 初始2个随机方块
- [ ] 四方向移动合并正确
- [ ] 每次移动后生成新方块
- [ ] 分数实时更新，最高分持久化
- [ ] 胜利/失败覆层正常显示
- [ ] 键盘和触摸操作均正常

### 8.3 贪吃蛇

- [ ] 按方向键后游戏开始
- [ ] 蛇移动、吃食物、增长逻辑正确
- [ ] 碰墙/碰自身触发失败
- [ ] 得分与速度随吃食物增加
- [ ] 空格键暂停/继续
- [ ] 最高分持久化
- [ ] 移动端触摸滑动正常

### 8.4 记事本

- [ ] 内容实时自动保存
- [ ] 刷新页面后内容仍在
- [ ] 字数统计实时更新
- [ ] 清空按钮有二次确认

### 8.5 日历

- [ ] 正确显示当月日历
- [ ] 上下月切换正确
- [ ] 今天高亮
- [ ] 备忘可添加、查看、编辑
- [ ] 有备忘的日期显示圆点标记
- [ ] 备忘数据刷新后仍在

### 8.6 计算器

- [ ] 加减乘除运算结果正确
- [ ] AC、正负切换、百分比功能正常
- [ ] 连续运算正确
- [ ] 小数点处理正确

### 8.7 转盘抽奖

- [ ] 默认4个选项正确显示
- [ ] 可添加选项（无数量上限）
- [ ] 可修改名称、颜色、emoji
- [ ] 少于2个选项时删除按钮禁用
- [ ] 选项数据刷新后仍在
- [ ] 转盘旋转动画流畅，有减速效果
- [ ] 结果覆层正确显示中奖选项
- [ ] "再转一次"可关闭覆层并重新转动

### 8.8 视觉

- [ ] 全站背景色 `#FFF8F0`
- [ ] 游戏卡片（amber）与工具卡片（coral）有视觉区分
- [ ] 圆角、字体、间距符合设计规范
- [ ] 移动端各页面均无横向溢出

### 8.9 代码规范

- [ ] 每个组件有独立 `.module.css`，不使用内联样式
- [ ] 游戏逻辑封装在 hook 中，组件只负责渲染
- [ ] localStorage 命名遵循规范
- [ ] 无 `console.error` 或 React key 警告

---

## 九、扩展规范

### 新增游戏
1. 在 `src/pages/games/` 下新建目录
2. `App.jsx` 追加路由 `/games/xxx`
3. `Home.jsx` 的 `games` 数组追加数据
4. 卡片背景色使用 `--color-amber-100` 系列

### 新增工具
1. 在 `src/pages/tools/` 下新建目录
2. `App.jsx` 追加路由 `/tools/xxx`
3. `Home.jsx` 的 `tools` 数组追加数据
4. 卡片背景色使用 `--color-coral-50` 系列
5. localStorage key 遵循 `{工具名}-{数据类型}` 格式

---

*文档版本：v1.2 | 适用范围：个人工具与游戏网站*
