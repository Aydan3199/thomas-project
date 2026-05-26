# Vercel 部署檢查清單

## ✅ 必須確認的文件結構

您的專案根目錄（**不是** src 資料夾）必須包含以下文件：

```
your-project/               ← Git 儲存庫根目錄
├── package.json           ✓ 包含 "build": "vite build --outDir dist"
├── vercel.json            ✓ Vercel 配置
├── index.html             ✓ HTML 入口
├── main.tsx               ✓ React 入口
├── vite.config.ts         ✓ Vite 配置
├── tsconfig.json          ✓ TypeScript 配置
├── App.tsx                ✓ 主應用程式
├── .gitignore             ✓ Git 忽略文件
├── components/            ✓ 組件資料夾
│   ├── LoginPage.tsx
│   ├── PatientDashboard.tsx
│   └── ...
└── styles/                ✓ 樣式資料夾
    └── globals.css
```

## ⚠️ 常見錯誤

### 1. 文件位置錯誤
- ❌ `src/package.json` （錯誤）
- ✅ `package.json` （正確 - 在根目錄）

### 2. 引用路徑錯誤
在 `main.tsx` 中：
- ✅ `import './styles/globals.css'` （正確）
- ✅ `import App from './App'` （正確）

### 3. Vercel 設置
在 Vercel Dashboard → Settings → Build & Development Settings：
- **Framework Preset**: `Vite`
- **Root Directory**: 留空或 `./`（不要設為 `src`）
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🚀 部署步驟

### 1. 確認本地文件結構
```bash
# 在專案根目錄執行
ls -la

# 應該看到：
# package.json
# index.html
# main.tsx
# vite.config.ts
# components/
# styles/
```

### 2. 確認 package.json 內容
```bash
cat package.json
```
確認包含：
```json
{
  "scripts": {
    "build": "vite build --outDir dist"
  }
}
```

### 3. 提交並推送
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### 4. 檢查 Vercel 構建日誌
- 進入 Vercel Dashboard
- 點擊最新的部署
- 查看 "Building" 區塊
- 確認輸出目錄為 `dist/`

## 🔍 如果還是失敗

### 查看錯誤訊息
在 Vercel 部署頁面，展開錯誤日誌並找到：
1. `Error:` 開頭的紅色訊息
2. `npm run build` 執行後的輸出
3. 複製完整錯誤訊息

### 常見錯誤類型
1. **No Output Directory named "dist"** 
   → 檢查 package.json 的 build 命令
   
2. **missing-public-directory**
   → 檢查 vercel.json 配置
   
3. **Module not found**
   → 檢查引用路徑是否正確

## 📞 需要更多幫助

提供以下資訊：
1. Vercel 錯誤日誌完整內容
2. 本地 `ls -la` 輸出
3. `cat package.json` 輸出
