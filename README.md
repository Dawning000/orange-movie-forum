# 影视论坛网站 UI

一个使用 Vue 3 构建的现代化影视论坛网站界面，提供完整的用户交互体验。

## 🎬 项目特色

- **现代化设计**: 采用简洁美观的界面设计，提供优秀的用户体验
- **响应式布局**: 完美适配桌面端、平板和移动设备
- **Vue 3 技术栈**: 使用最新的 Vue 3 Composition API 和 Vite 构建工具
- **组件化架构**: 高度模块化的组件设计，便于维护和扩展
- **状态管理**: 使用 Pinia 进行状态管理
- **路由管理**: 基于 Vue Router 的单页面应用路由

## 🚀 功能特性

### 核心功能
- ✅ 用户注册/登录系统
- ✅ 论坛帖子发布和浏览
- ✅ 帖子分类管理（电影、电视剧、动漫、综艺）
- ✅ 用户个人资料管理
- ✅ 帖子收藏和点赞功能
- ✅ 评论系统
- ✅ 搜索功能（`/search` 视图、Pinia 状态、URL 同步、Facets）
- ✅ 响应式设计

### 页面结构
- 🏠 **首页**: 展示热门帖子和最新电影推荐
- 💬 **论坛**: 帖子列表和分类浏览
- 📝 **帖子详情**: 完整的帖子内容和评论系统
- 👤 **用户中心**: 个人资料和帖子管理
- 🔐 **登录/注册**: 用户认证系统

## 🛠️ 技术栈

- **前端框架**: Vue 3.3+
- **构建工具**: Vite 4+
- **状态管理**: Pinia 2+
- **路由管理**: Vue Router 4+
- **样式预处理**: Sass/SCSS
- **开发语言**: JavaScript ES6+
- **包管理**: npm

## 📦 安装和运行

### 环境要求
- Node.js 16.0+ 
- npm 7.0+

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```
访问 http://localhost:3000

### 生产环境构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── NavBar.vue      # 导航栏组件
│   └── Footer.vue      # 页脚组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Forum.vue       # 论坛页面
│   ├── PostDetail.vue  # 帖子详情页
│   ├── UserProfile.vue # 用户资料页
│   ├── Login.vue       # 登录页
│   └── Register.vue    # 注册页
├── stores/             # 状态管理
│   ├── user.ts         # 用户状态
│   └── search.ts       # 搜索状态
├── router/             # 路由配置
│   └── index.ts        # 路由定义
├── style/              # 样式文件
│   ├── main.scss       # 主样式文件
│   └── icons.scss      # 图标样式
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

## 🎨 设计系统

### 颜色方案
- **主色调**: #3b82f6 (蓝色)
- **成功色**: #10b981 (绿色)
- **警告色**: #f59e0b (黄色)
- **错误色**: #ef4444 (红色)
- **中性色**: #6b7280 (灰色)

### 字体系统
- **主字体**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **标题**: 700 字重
- **正文**: 400 字重
- **小字**: 500 字重

### 间距系统
- **基础单位**: 4px
- **常用间距**: 8px, 12px, 16px, 20px, 24px, 32px, 40px

## 📱 响应式断点

- **移动端**: < 768px
- **平板端**: 768px - 1024px  
- **桌面端**: > 1024px

## 🔧 开发指南

### 组件开发
1. 使用 Vue 3 Composition API
2. 遵循单一职责原则
3. 保持组件的可复用性
4. 添加适当的 TypeScript 类型（如需要）

### 样式开发
1. 使用 SCSS 预处理器
2. 遵循 BEM 命名规范
3. 使用 CSS 变量管理主题
4. 确保响应式设计

### 状态管理
1. 使用 Pinia 进行状态管理
2. 按功能模块划分 store
3. 保持状态的不可变性

## 🚀 部署

### 静态部署
构建完成后，将 `dist` 目录部署到任何静态文件服务器。

### 推荐平台
- Vercel
- Netlify  
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Vite 团队提供的高效构建工具
- 所有开源贡献者的支持

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 微信交流

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

## 🔗 后端参考：搜索与联想 API 契约（简要）

前端现已接入以下接口，后端可按此响应：

### 1) GET `/api/search`
- 参数（全部可选）：
  - `q` 关键词；`genres` 类型（逗号分隔）；`regions` 地区（逗号分隔）
  - `year_gte` `year_lte` 年份范围；`rating_gte` `rating_lte` 评分范围
  - `sort` 枚举：`relevance_desc|hot_desc|rating_desc|year_desc|updated_desc`
  - `page`（默认1），`page_size`（默认24）
- 返回：
```json
{
  "items": [
    { "id": 1, "title": "流浪地球2", "year": 2023, "rating": 8.3, "regions": ["中国"], "genres": ["科幻"], "poster": "...", "highlight": {"title": "<em>流浪</em>地球2"} }
  ],
  "facets": {
    "genres": [{"value":"科幻","count":132}],
    "regions": [{"value":"中国","count":165}],
    "yearRanges": [{"value":"2020s","count":210}],
    "ratingRanges": [{"value":"8-10","count":88}]
  },
  "total": 385,
  "page": 1,
  "pageSize": 24,
  "hasMore": true,
  "suggestions": ["流浪地球", "The Wandering Earth"]
}
```

说明：`items.highlight` 可选；`facets` 为当前筛选上下文下的可选项与计数。

### 2) GET `/api/suggest`
- 参数：`q`（关键词）
- 返回：
```json
[
  { "type": "movie", "text": "流浪地球2", "id": 1 },
  { "type": "person", "text": "郭帆", "id": 1001 },
  { "type": "tag", "text": "科幻" }
]
```

实现建议（可选）：
- MySQL：`FULLTEXT` + 索引 + `GROUP BY` 统计 facets；热门查询与 facets 使用缓存。
- 专用引擎：Meilisearch/Elasticsearch（同义词、拼音/简繁、字段加权、预聚合）。
