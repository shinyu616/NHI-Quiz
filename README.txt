NHI-Quiz 健保藥品給付規定學習平台
版本：v1.2（卡號彈性輸入版）
資料來源：完整給付規定1150723.pdf（115.7.23更新）

【執行方式】
1. 解壓縮 NHI-Quiz.zip。
2. 直接雙擊 index.html，可用瀏覽器開啟。
3. 若使用 VS Code，建議安裝 Live Server，對 index.html 按右鍵 → Open with Live Server。

【檔案結構】
index.html         首頁與測驗頁面
css/style.css      版面樣式
js/questions.js    題庫（後續新增題目主要修改這裡）
js/game.js         測驗流程、計分與結果

【目前第一版】
- 輸入卡號（必填，不限制長度與格式）
- 身分：新進藥師／PGY／實習生
- 學習主題下拉選單
- 通則 15 題單選題
- 即時答對／答錯提示
- 每題解析
- 答題進度
- 最終成績與逐題回顧
- 手機／電腦自適應版面

【後續可擴充】
可在 js/questions.js 中加入神經系統藥物及其他章節題庫。

【成績回傳預留】
js/game.js 已預留 RESULTS_ENDPOINT。
目前留空，因此不會送出任何資料。之後建立 Google Apps Script Web App 後，只要把網址貼到 RESULTS_ENDPOINT，即可啟用成績回傳。
畫面上會遮蔽卡號，只顯示最後 4 碼；回傳資料則保留完整卡號供管理端辨識。正式院內使用前仍建議依院內個資與資安規範確認。
