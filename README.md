# lifepathx

Vue 3 + Vite 生命灵数解读页，输入生日自动计算生命灵数，并联动数字解读。

## 目录结构

```text
lifepathx/
├── .gitignore          # 忽略依赖与构建产物
├── index.html          # Vite HTML 入口
├── package-lock.json   # 锁定依赖版本
├── package.json        # 脚本与依赖
├── src/
│   ├── main.js         # Vue 应用入口
│   ├── App.vue         # 根组件
│   ├── data/           # 页面静态解读数据 JSON
│   ├── style/          # 浅色与深色主题样式变量
│   ├── number-reading/ # 数字解读组件、工具与测试
│   ├── reading-export/ # 全局解读内容导出组件与工具
│   ├── reading-import/ # 全局解读内容导入弹层与校验
│   ├── reading-history/ # 全局历史版本控件与存储
│   ├── life-path-calculator/ # 生命灵数计算组件、逻辑与测试
│   └── pages/
│       └── MainPage.vue # main 页面
└── vite.config.js      # Vite 配置
```

## Feature 目录约束

新增 feature 必须在 `src/` 下使用独立功能目录承载组件、数据、工具函数和测试；页面只组合 feature，避免跨功能耦合。详细约束见 `AGENTS.md`。

## 命令

```bash
npm install
npm run dev
npm run test
npm run build
```

## 解读范围与参考

页面展示 1-9 以及卓越数 11、22、33。解读内容参考了生命灵数资料与计算器类应用常见口径，并整理为本项目自己的中文 JSON 数据。

计算口径：输入出生日期后，分别归约月、日、年，再汇总归约到 1-9；若得到 11、22、33，则保留为卓越数，并联动展示对应根数格子，例如 `22/4`、`33/6`。

- Allure: `https://www.allure.com/story/numerology-how-to-calculate-life-path-destiny-number`
- People: `https://people.com/what-is-a-life-path-number-everything-to-know-8712317`
- Times of India: `https://timesofindia.indiatimes.com/astrology/numerology-tarot/know-your-life-path-number-and-what-it-really-says-about-your-personality/photostory/125429527.cms`
- Times of India Master Numbers: `https://timesofindia.indiatimes.com/astrology/numerology-tarot/unlock-the-power-of-master-numbers-11-22-and-33-explained/articleshow/121791308.cms`
- Vogue: `https://www.vogue.com/article/numerology-of-letters-what-your-name-means`
