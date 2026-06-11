# 个人工具与游戏网站

一个集合了休闲小游戏和日常实用工具的个人网站，使用 React + Vite 构建。

## ✨ 功能清单

### 🎮 游戏
| 名称 | 说明 |
|------|------|
| **2048** | 经典数字合并游戏，键盘/触摸操作，分数持久化 |
| **贪吃蛇** | 经典贪吃蛇游戏，WASD/方向键/触摸操作，速度递增，分数持久化 |

### 🔧 工具
| 名称 | 说明 |
|------|------|
| **记事本** | 文本编辑器，内容实时自动保存到 localStorage |
| **日历** | 月历视图 + 备忘管理，支持添加/编辑/删除备忘 |
| **计算器** | 标准计算器，支持连续运算、正负切换、百分比 |
| **转盘抽奖** | 自定义选项转盘，支持添加/编辑/删除选项，旋转动画 |

## 🚀 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 构建工具 | Vite 5 |
| 路由 | React Router v6 |
| 样式 | CSS Modules |
| 状态管理 | React useState / useReducer |
| 持久化 | localStorage |
| 运行环境 | Node.js 18+ |

## 📁 目录结构

```
my-site/
├── src/
│   ├── main.jsx                          # 应用入口
│   ├── App.jsx                           # 路由配置
│   ├── styles/
│   │   └── global.css                    # 全局样式（CSS变量、基础样式）
│   ├── components/
│   │   ├── Navbar/                       # 顶部导航栏
│   │   └── AppCard/                      # 首页卡片组件
│   └── pages/
│       ├── Home/                         # 首页
│       ├── games/
│       │   ├── Game2048/                 # 2048 游戏
│       │   │   ├── components/           # Board, Tile, ScorePanel
│       │   │   └── hooks/                # use2048, useSwipe
│       │   └── Snake/                    # 贪吃蛇游戏
│       │       ├── components/           # SnakeBoard, StatusPanel
│       │       └── hooks/                # useSnake, useSwipe
│       └── tools/
│           ├── Notepad/                  # 记事本
│           ├── Calendar/                 # 日历
│           ├── Calculator/               # 计算器
│           └── Spinner/                  # 转盘抽奖
│               └── hooks/                # useSpinner
```

## 🛠️ 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build
```

## 🏗️ 如何新增功能

### 新增游戏
1. 在 `src/pages/games/` 下新建目录（如 `MyGame/`）
2. 创建 `MyGame.jsx` 和 `MyGame.module.css`
3. 在 `App.jsx` 追加路由：`<Route path="/games/mygame" element={<MyGame />} />`
4. 在 `Home.jsx` 的 `games` 数组追加数据
5. 卡片背景色使用 `--color-amber-100` 系列

### 新增工具
1. 在 `src/pages/tools/` 下新建目录
2. 创建对应页面和样式文件
3. `App.jsx` 追加路由 `/tools/xxx`
4. `Home.jsx` 的 `tools` 数组追加数据
5. 卡片背景色使用 `--color-coral-50` 系列
6. localStorage key 遵循 `{工具名}-{数据类型}` 格式

## 🎨 设计规范

### 色彩系统
- 页面背景：`#FFF8F0`
- 游戏卡片：暖橙色系（`--color-amber-100`）
- 工具卡片：珊瑚粉色系（`--color-coral-50`）

### 圆角规范
- 数字方块 / 转盘扇区：`16px`
- 卡片 / 面板：`12px`
- 按钮：`8px`
- 徽章 / 胶囊：`999px`

### localStorage 命名规范
| 模块 | key | 内容 |
|------|-----|------|
| 2048 | `2048-best` | 最高分 |
| 贪吃蛇 | `snake-best` | 最高分 |
| 记事本 | `notepad-content` | 文本内容 |
| 转盘抽奖 | `spinner-items` | 选项列表 |
| 日历 | `calendar-notes` | 备忘数据 |