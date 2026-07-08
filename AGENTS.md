# AGENTS.md

## Feature Module Boundaries

- 新增 feature 必须在 `src/` 下创建以功能命名的目录，例如
  `src/number-reading/`、`src/life-path-calculator/`。
- feature 自有的组件、数据、工具函数和测试应优先放在该 feature 目录内。
- 跨 feature 复用前先确认确实存在稳定复用场景；不要为了方便把 feature 细节放回
  `src/components/`、`src/data/` 或 `src/utils/` 这类宽泛目录。
- 页面文件只负责组合 feature，不承载具体业务计算、数据整理或复杂展示细节。
- 修改某个 feature 时，优先限定在对应功能目录内；公共接口变化时同步更新 README 和测试。

## Interaction Design Constraints

- 采用渐进式披露：生日数的具体日期解读页面不得一次展示 1-31
  全部日期，只展示与当前九宫格选中数字相关的日期。

