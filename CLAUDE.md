# 小学老师课件站

小学老师课件资源展示网站，支持主题班会、课件、绘本三个分类。

## 功能特点

- 课件展示：卡片式布局，支持封面、描述、标签
- 分类筛选：主题班会、课件、绘本
- 搜索功能：实时搜索课件标题和描述
- 免费资源：直接展示下载链接
- 付费资源：兑换码解锁下载
- 兑换码系统：A码解锁1个课件，B码解锁2个课件
- 管理后台：课件管理、兑换码管理

## 本地开发

1. 修改管理员密码：
   打开 `.env.local`，将 `your_admin_password_here` 改为你的密码

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js 页面
│   ├── page.tsx           # 首页
│   ├── meetings/          # 主题班会页面
│   ├── courseware/        # 课件页面
│   ├── picture-books/     # 绘本页面
│   ├── admin/             # 管理后台
│   └── api/               # API 路由
├── components/            # 组件
│   ├── Navbar.tsx         # 导航栏
│   └── CategoryPage.tsx   # 分类页面组件
├── types/                 # 类型定义
└── lib/                   # 工具函数和常量
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 在 Vercel 中配置环境变量：
   - `ADMIN_PASSWORD`：管理员密码（后端用）
   - `NEXT_PUBLIC_ADMIN_PASSWORD`：管理员密码（前端用）
4. 在 Vercel 中添加 Vercel KV 存储：
   - 进入项目 Settings > Storage
   - 点击 Create Database > KV
5. 部署

## 使用说明

### 添加课件

1. 进入管理后台（右上角"管理后台"按钮）
2. 输入管理员密码登录
3. 点击"课件管理"
4. 点击"添加课件"按钮
5. 填写课件信息：
   - 标题
   - 描述
   - 分类（主题班会/课件/绘本）
   - 封面图片URL（放到 `public` 目录后直接写文件名）
   - 下载链接（百度网盘链接）
   - 标签（用逗号分隔）
   - 是否免费

### 生成兑换码

1. 进入管理后台 > 兑换码管理
2. 点击"生成兑换码"
3. 选择类型（A码或B码）或批量生成
4. 生成的兑换码会显示在列表中

### 用户使用

1. 浏览课件，支持搜索和标签筛选
2. 免费课件直接点击下载
3. 付费课件点击"输入兑换码解锁"
4. 输入兑换码后显示下载链接

## 环境变量

- `ADMIN_PASSWORD`：管理员密码（服务端验证）
- `NEXT_PUBLIC_ADMIN_PASSWORD`：管理员密码（客户端验证）
- `KV_URL`、`KV_REST_API_URL` 等：Vercel KV 配置（部署时自动配置）