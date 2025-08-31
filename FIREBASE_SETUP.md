# Firebase 设置说明

## 问题：Firestore 400 错误请求错误

您遇到 400 错误请求错误是因为 Firestore 安全规则尚未配置。默认情况下，Firestore 出于安全考虑会拒绝所有读/写操作。

## 快速修复选项

### 选项 1：部署安全规则（推荐）

1. 如果您还没有安装 Firebase CLI：
   ```bash
   npm install -g firebase-tools
   ```

2. 登录到 Firebase：
   ```bash
   firebase login
   ```

3. 在您的项目中初始化 Firebase：
   ```bash
   firebase init firestore
   ```
   - 选择您的 Firebase 项目 (zendo-aaf81)
   - 接受默认数据库规则文件 (firestore.rules)
   - 接受默认数据库索引文件 (firestore.indexes.json)

4. 部署安全规则：
   ```bash
   firebase deploy --only firestore:rules
   ```

### 选项 2：临时测试规则（Firebase 控制台）

1. 前往 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择您的项目：`zendo-aaf81`
3. 进入 Firestore Database
4. 点击"规则"选项卡
5. 将默认规则替换为：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 允许用户读写自己的待办事项
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // 允许用户读写自己的用户资料
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. 点击"发布"

## 这些规则的作用

- **认证访问**：只有登录用户才能访问数据
- **用户隔离**：用户只能访问自己的待办事项（其中 `userId` 与其认证 UID 匹配）
- **安全创建**：新的待办事项必须有正确的 userId 字段，与认证用户匹配

## 替代方案：开发模式（不适用于生产环境）

仅用于快速测试，您可以临时使用测试模式规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**⚠️ 警告**：这些规则允许任何人读/写您的数据库。仅用于测试，在投入生产之前记得更新。

## 验证修复

更新规则后：
1. 尝试在您的应用中创建任务
2. 检查浏览器的网络选项卡 - Firestore 请求现在应该返回 200 OK
3. 验证任务出现在 Firebase 控制台的 Firestore Database 中

## 其他调试

如果您仍然遇到错误，请检查：
1. Firebase 控制台 > Authentication - 确保用户正在被创建
2. 浏览器开发工具 > 网络选项卡 - 检查确切的错误响应
3. Firebase 控制台 > Firestore > 数据 - 查看是否正在创建文档