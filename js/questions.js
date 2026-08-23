const QUESTION_BANK = {
  general: {
    title: "通則",
    questions: [
      {
        q: "依藥品給付規定通則，一般本保險處方用藥每次原則上可開給多少日以內的藥量？",
        options: ["3日", "7日", "14日", "30日"],
        answer: 1,
        explanation: "通則規定，醫師得按病情需要，每次開給七日以內之藥量；指定慢性疾病則得一次給予三十日以內。"
      },
      {
        q: "保險人指定之慢性疾病，一次原則上可給予多少日以內的用藥量？",
        options: ["7日", "14日", "21日", "30日"],
        answer: 3,
        explanation: "指定慢性疾病得一次給予三十日以內之用藥量。"
      },
      {
        q: "下列何者符合注射藥品的一般使用時機？",
        options: ["病人偏好注射即可", "只要藥價較低即可", "經醫師診斷，病情需要且不能口服，或口服不能期待治療效果，並記明於病歷", "門診病人一律可使用"],
        answer: 2,
        explanation: "注射藥品應在經醫師診斷後，判斷病情需要且病人不能口服，或口服不能期待治療效果，並記明於病歷後使用。"
      },
      {
        q: "慢性病毒性 B 型肝炎或 C 型肝炎使用之長效型或短效型 interferon，至多可攜回多少週使用量？",
        options: ["1週", "2週", "4週", "8週"],
        answer: 2,
        explanation: "通則列明，慢性病毒性 B 型肝炎、C 型肝炎使用之長效型或短效型 interferon，至多攜回四週使用量。"
      },
      {
        q: "抗精神病長效針劑依通則至多可攜回多久？",
        options: ["2週", "1個月", "2個月", "3個月"],
        answer: 3,
        explanation: "抗精神病長效針劑至多可攜回三個月。"
      },
      {
        q: "下列何者最符合抗微生物製劑的使用原則？",
        options: ["一律優先使用最新上市藥品", "應優先選用健保醫療常用第一線抗微生物製劑品名表所列者", "所有抗微生物製劑皆需事前審查", "只要病人要求即可使用後線藥品"],
        answer: 1,
        explanation: "通則規定，抗微生物製劑應優先選用全民健康保險醫療常用第一線抗微生物製劑品名表所列者；特定情況再依規定使用。"
      },
      {
        q: "維生素、荷爾蒙及白蛋白製劑若僅作一般營養補給，健保原則上如何處理？",
        options: ["全額給付", "半額給付", "不予給付", "僅住院給付"],
        answer: 2,
        explanation: "通則明定，凡作一般營養補給者，不予給付。"
      },
      {
        q: "依內服液劑使用原則，幾歲以下兒童得使用內服液劑？",
        options: ["6歲以下", "10歲以下", "12歲以下", "18歲以下"],
        answer: 2,
        explanation: "12歲（含）以下兒童得使用內服液劑。"
      },
      {
        q: "下列哪一種情況可作為『重複用藥』的例外？",
        options: ["為相同治療目的任意併用同機轉藥品", "長短效藥品搭配，且符合藥動學或藥理特性", "無文獻佐證的多重用藥", "病人自行要求併用"],
        answer: 1,
        explanation: "長短效藥品搭配或不同劑型配合使用，若其用法符合藥動學或藥理性質特色，可屬重複用藥規定的例外。"
      },
      {
        q: "給付規定中的『○歲以上』如何定義？",
        options: ["不包含○歲當日", "包含○歲當日", "僅自次日起計算", "需滿○歲後一個月"],
        answer: 1,
        explanation: "『○歲以上』包含○歲當日。"
      },
      {
        q: "給付規定中的『○歲以下』如何定義？",
        options: ["包含○歲當日", "不包含○歲當日", "只計算至前一日", "需依醫院自行定義"],
        answer: 0,
        explanation: "『○歲以下』包含○歲當日。"
      },
      {
        q: "給付規定中的『○歲至未滿○歲』，其中『未滿○歲』代表什麼？",
        options: ["包含該歲數生日當日", "不包含該歲數生日當日", "包含生日後7日", "僅適用住院病人"],
        answer: 1,
        explanation: "『未滿○歲』不包含○歲當日。"
      },
      {
        q: "依通則，處方用藥需符合哪項基本條件？",
        options: ["病人曾經使用過即可", "符合主管機關核准藥品許可證登載之適應症，並依病情使用合理含量或規格", "價格最低即可", "同科醫師曾處方即可"],
        answer: 1,
        explanation: "處方用藥需符合主管機關核准藥品許可證登載之適應症，並依病情治療所需劑量，處方合理含量或規格。"
      },
      {
        q: "下列哪一位病人依通則可因不適合固型製劑而使用內服液劑？",
        options: ["施行管灌飲食的病人", "所有18歲以上成人", "只有住院兒童", "僅急診病人"],
        answer: 0,
        explanation: "不適合服用固型製劑者，例如施行管灌飲食，可依病情需要使用內服液劑。"
      },
      {
        q: "下列何者符合生物標記檢測結果報告的條件之一？",
        options: ["任何自行購買的家用檢驗結果", "未經認證之研究室口頭報告", "使用經衛生福利部許可之伴隨式診斷用體外診斷醫療器材（IVD）檢測", "僅需病人自行陳述"],
        answer: 2,
        explanation: "通則列出的條件之一，是使用經衛生福利部許可之伴隨式診斷用體外診斷醫療器材（IVD）檢測。"
      }
    ]
 
  },  nervous: {
    title: "神經系統藥物",
    questions: [
      {
        q: "Flurbiprofen 40 mg patch 依健保給付規定，每4週最多可處方幾片？",
        options: ["8片", "12片", "16片", "20片"],
        answer: 2,
        explanation: "Flurbiprofen 40 mg patch 每4週限處方16片以內。"
      },
      {
        q: "Ketorolac 注射劑用於手術後中重度急性疼痛時，治療期間最長為多久？",
        options: ["3天", "5天", "7天", "14天"],
        answer: 1,
        explanation: "Ketorolac 注射劑限短期治療，治療期間為5天以內。"
      },
      {
        q: "Tramadol 用於非癌症慢性頑固性疼痛時，給付規定中的疼痛期須超過多久？",
        options: ["1個月", "3個月", "6個月", "12個月"],
        answer: 2,
        explanation: "非癌症慢性頑固性疼痛的疼痛期須超過6個月。"
      },
      {
        q: "Lidocaine 貼片劑用於帶狀疱疹皮膚病灶後神經痛時，每日最大劑量為多少？",
        options: ["1片", "2片", "3片", "4片"],
        answer: 2,
        explanation: "Lidocaine 貼片劑每日最大劑量為3片；日劑量超過2片時需於病歷記載理由。"
      },
      {
        q: "依給付規定，lidocaine 貼片劑不得與下列何者併用？",
        options: [
          "Acetaminophen",
          "Gabapentin 或 pregabalin 口服製劑",
          "Tramadol",
          "NSAIDs 外用製劑"
        ],
        answer: 1,
        explanation: "Lidocaine 貼片劑不得與 gabapentin 或 pregabalin 成分口服製劑併用。"
      },
      {
        q: "Pregabalin 用於帶狀疱疹皮膚病灶後神經痛時，每日最大劑量為多少？",
        options: ["150 mg", "300 mg", "450 mg", "600 mg"],
        answer: 3,
        explanation: "Pregabalin 用於帶狀疱疹皮膚病灶後神經痛，每日最大劑量為600 mg。"
      },
      {
        q: "Pregabalin 用於糖尿病併發周邊神經病變之神經疼痛時，每日最大劑量為多少？",
        options: ["150 mg", "300 mg", "450 mg", "600 mg"],
        answer: 1,
        explanation: "Pregabalin 用於糖尿病併發周邊神經病變之神經疼痛，每日最大劑量為300 mg。"
      },
      {
        q: "Duloxetine 用於糖尿病併發周邊神經病變之神經疼痛時，每日最大劑量為多少？",
        options: ["30 mg", "60 mg", "90 mg", "120 mg"],
        answer: 1,
        explanation: "Duloxetine 用於糖尿病併發周邊神經病變之神經疼痛，每日最大劑量為60 mg。"
      },
      {
        q: "Fentanyl citrate 口頰溶片或口頰錠依給付規定，不得用於下列何種疼痛？",
        options: [
          "癌症突發性疼痛",
          "急性或術後疼痛",
          "已接受類鴉片藥物治療之癌症突發痛",
          "18歲以上癌症患者之突發性疼痛"
        ],
        answer: 1,
        explanation: "Fentanyl citrate 口頰溶片或口頰錠不得用於急性或術後疼痛之處置。"
      },
      {
        q: "Acetaminophen 80 mg 一般錠劑膠囊劑依健保規定限用於哪一族群？",
        options: [
          "3歲以下病人",
          "6歲以下病人",
          "12歲以下病人",
          "18歲以下病人"
        ],
        answer: 1,
        explanation: "Acetaminophen 80 mg 一般錠劑膠囊劑限用於6歲以下病人。"
      }
    ]
  },
    cardiorenal: {
    title: "心臟血管及腎臟藥物",
    questions: [
      {
        q: "依健保給付規定，Ticagrelor 用於已發作急性冠心症住院病人，與 Aspirin 合併治療最長可給付多久？",
        options: ["3個月", "6個月", "9個月", "12個月"],
        answer: 2,
        explanation: "Ticagrelor 用於已發作急性冠心症住院病人時，得與 Aspirin 合併治療最長9個月，並需於病歷註明住院時間。"
      },
      {
        q: "依健保給付規定，Prasugrel 用於需接受 PCI 的急性冠心症住院病人，與 Aspirin 合併治療最長可給付多久？",
        options: ["3個月", "6個月", "9個月", "12個月"],
        answer: 3,
        explanation: "Prasugrel 用於需要冠狀動脈介入性治療（PCI）的急性冠心症住院病人，可與 Aspirin 合併治療最長12個月。"
      },
      {
        q: "rt-PA 用於急性缺血性腦中風時，依健保給付規定應於發病後多久內使用？",
        options: ["3小時", "4.5小時", "6小時", "12小時"],
        answer: 1,
        explanation: "rt-PA 用於急性缺血性腦中風，限於發病4.5小時內使用。"
      },
      {
        q: "Apixaban 用於治療深部靜脈血栓或肺栓塞時，第1至7日的給付用法為何？",
        options: [
          "每日1次，每次1顆",
          "每日1次，每次2顆",
          "每日2次，每次1顆",
          "每日2次，每次2顆"
        ],
        answer: 3,
        explanation: "Apixaban 治療深部靜脈血栓或肺栓塞，第1至7日每日2次、每次限用2顆；第8日起每日2次、每次限用1顆。"
      },
      {
        q: "下列何者屬於 Edoxaban 用於非瓣膜性心房纖維顫動時的排除標準？",
        options: [
          "肌酸酐清除率大於95 mL/min",
          "肌酸酐清除率大於60 mL/min",
          "75歲以上",
          "合併高血壓"
        ],
        answer: 0,
        explanation: "Edoxaban 的排除標準包括肌酸酐清除率小於15 mL/min或大於95 mL/min。"
      },
      {
        q: "Dabigatran 用於治療深部靜脈血栓或肺栓塞時，開始使用前需先接受至少多久的注射型抗凝血劑治療？",
        options: ["1日", "3日", "5日", "7日"],
        answer: 2,
        explanation: "治療深部靜脈血栓或肺栓塞時，需先接受至少5日注射型抗凝血劑治療，再開始使用 Dabigatran。"
      },
      {
        q: "依健保降膽固醇藥物給付規定，ASCVD 極高風險病人的 LDL-C 主要治療目標為何？",
        options: [
          "低於100 mg/dL",
          "低於70 mg/dL",
          "低於55 mg/dL",
          "低於40 mg/dL"
        ],
        answer: 2,
        explanation: "ASCVD 極高風險病人的 LDL-C 主要治療目標為低於55 mg/dL。"
      },
      {
        q: "Ivabradine 用於慢性心衰竭時，下列何者符合健保給付的心率條件？",
        options: [
          "心房顫動且心跳每分鐘60次以上",
          "竇性心率且心跳每分鐘75次以上",
          "竇性心率且心跳每分鐘60次以上",
          "心房顫動且心跳每分鐘75次以上"
        ],
        answer: 1,
        explanation: "Ivabradine 的給付條件之一為竇性心率，且每分鐘心跳速率須達75次以上。"
      },
      {
        q: "開始使用 Sacubitril/Valsartan 前，若病人原本使用 ACEI，至少需間隔多久？",
        options: ["12小時", "24小時", "36小時", "48小時"],
        answer: 2,
        explanation: "Sacubitril/Valsartan 不應與 ACEI 合併使用，開始使用本藥前至少需與 ACEI 間隔36小時。"
      },
      {
        q: "Dapagliflozin 或 Empagliflozin 用於健保規定之慢性腎臟病時，起始治療的 eGFR 範圍為何？",
        options: [
          "15至30 mL/min/1.73m²",
          "20至45 mL/min/1.73m²",
          "25至60 mL/min/1.73m²",
          "30至90 mL/min/1.73m²"
        ],
        answer: 2,
        explanation: "慢性腎臟病起始治療的 eGFR 須為25至60 mL/min/1.73m²，且另有 uACR 等相關給付條件。"
      }
    ]
 },    

  metabolic: {
    title: "代謝及營養劑",
    questions: [
      {
        q: "Fat emulsion 用於重大手術後病人，符合給付規定的情況為何？",
        options: [
          "術後3天仍不能經腸道進食",
          "術後5至7天仍不能經腸道進食",
          "術後10天仍不能經腸道進食",
          "所有重大手術後病人皆可使用"
        ],
        answer: 1,
        explanation: "重大手術後5至7天仍不能經腸道進食者，可使用 Fat emulsion，原則上每日不超過一瓶。"
      },
      {
        q: "Sodium glycerophosphate 用於成人時，給付規定最長使用多久？",
        options: ["3日", "5日", "7日", "14日"],
        answer: 2,
        explanation: "Sodium glycerophosphate 用於成人以使用7日為限。"
      },
      {
        q: "下列何者符合 Mecobalamin 製劑的給付條件？",
        options: [
          "單純疲勞",
          "糖尿病併發周邊神經病變並具有臨床神經學病徵",
          "一般營養補充",
          "單純失眠"
        ],
        answer: 1,
        explanation: "糖尿病併發周邊神經病變並具有臨床神經學病徵者，可使用 Mecobalamin，且須於處方上敘明。"
      },
      {
        q: "活性 vitamin D3 製劑用於慢性腎臟病引起的低血鈣症時，eGFR 須小於多少？",
        options: [
          "15 mL/min/1.73m²",
          "30 mL/min/1.73m²",
          "45 mL/min/1.73m²",
          "60 mL/min/1.73m²"
        ],
        answer: 2,
        explanation: "慢性腎臟病引起之低血鈣症，限 eGFR 小於45 mL/min/1.73m²，或 PTH-i 大於正常值三倍以上等規定條件。"
      },
      {
        q: "HBV（-）及 HCV（-）病患使用肝庇護劑時，GOT 或 GPT 至少須達正常值上限多少倍？",
        options: ["1倍", "1.5倍", "2倍", "3倍"],
        answer: 2,
        explanation: "HBV（-）及 HCV（-）病患，GOT 或 GPT 值須大於等於正常值上限2倍以上。"
      },
      {
        q: "門診使用肝庇護劑，原則上口服可使用幾種？",
        options: ["一種", "二種", "三種", "不限"],
        answer: 0,
        explanation: "肝庇護劑之使用，門診以口服一種為原則。"
      },
      {
        q: "Ketosteril 用於符合條件的慢性腎衰竭病患，每日至多使用幾顆？",
        options: ["4顆", "6顆", "8顆", "10顆"],
        answer: 1,
        explanation: "符合給付條件之慢性腎衰竭病患，每日至多使用6顆。"
      },
      {
        q: "使用 Ketosteril 期間，eGFR 達到多少時應停藥？",
        options: [
          "≥15 mL/min/1.73m²",
          "≥20 mL/min/1.73m²",
          "≥25 mL/min/1.73m²",
          "≥30 mL/min/1.73m²"
        ],
        answer: 2,
        explanation: "使用時應每兩個月檢查一次；eGFR ≥25 mL/min/1.73m²時應停藥。"
      },
      {
        q: "下列何者符合 oral calcium salt 的給付對象？",
        options: [
          "一般健康成人補鈣",
          "骨質疏鬆病患",
          "單純疲勞病患",
          "一般感冒病患"
        ],
        answer: 1,
        explanation: "Oral calcium salt 可給付於骨質疏鬆或軟骨病等規定病患。"
      },
      {
        q: "Nutrineal PD4 with 1.1% Amino Acid 每天最多使用幾袋？",
        options: ["1袋", "2袋", "3袋", "4袋"],
        answer: 0,
        explanation: "Nutrineal PD4 with 1.1% Amino Acid 每天限使用1袋代替葡萄糖腹膜透析液。"
        }
  ]
  },

  hematological: {
    title: "血液治療藥物",
    questions: [
      {
        q: "腎臟病病人使用 EPO 時，下列何種情況應暫停使用？",
        options: [
          "Hb 超過 9 g/dL",
          "Hb 超過 10 g/dL",
          "Hb 超過 11 g/dL",
          "Hb 超過 12 g/dL"
        ],
        answer: 2,
        explanation: "腎臟病病人使用 EPO 時，Hb 目標為10 g/dL；若 Hb 超過11 g/dL，應暫停使用。治療第6至8週 Hb 上升未達1 g/dL時，也應暫停使用。"
      },
      {
        q: "接受 EPO 治療的血液透析或腹膜透析患者，Hb 原則上多久檢查一次？",
        options: [
          "每週一次",
          "每月一次",
          "每3個月一次",
          "每6個月一次"
        ],
        answer: 1,
        explanation: "血液透析及腹膜透析患者每月應檢查一次 Hb；未透析患者至少每3個月檢查一次。"
      },
      {
        q: "短效型 G-CSF 使用期間，病人白血球超過多少時原則上應停藥？",
        options: [
          "2,000/cumm",
          "3,000/cumm",
          "4,000/cumm",
          "5,000/cumm"
        ],
        answer: 2,
        explanation: "患者白血球超過4,000/cumm，或中性白血球超過2,000/cumm時，原則上應停藥。"
      },
      {
        q: "長效型 G-CSF（如 pegfilgrastim）在同一化學治療療程內的使用規定為何？",
        options: [
          "限用1支，且不可併用短效型 G-CSF",
          "限用2支，可併用短效型 G-CSF",
          "使用支數不限",
          "僅限制總劑量"
        ],
        answer: 0,
        explanation: "長效型 G-CSF 在同一化學治療療程內限用1支，且不可併用短效型注射劑。"
      },
      {
        q: "肝硬化病人有相當腹水或合併水腫，且符合 Human Albumin 給付條件時，每日最多用量為何？",
        options: [
          "10 g",
          "20 g",
          "25 g",
          "50 g"
        ],
        answer: 2,
        explanation: "血清 Albumin 低於2.5 g/dL，且為肝硬化合併相當腹水或水腫者，每日最多使用25 g。"
      },
      {
        q: "使用 Human Albumin 時，作為給付依據的血清 Albumin 濃度檢驗日期原則上應為多久內？",
        options: [
          "最近24小時",
          "最近3天",
          "最近7天",
          "最近14天"
        ],
        answer: 1,
        explanation: "血清 Albumin 濃度檢驗日期限最近3天以內；如為多次注射，則需為上次注射後最近3天內的結果。"
      },
      {
        q: "Emicizumab 用於 A 型血友病且有抗體病人的預防性治療時，抗體條件為何？",
        options: [
          "一次檢測第八凝血因子抑制性抗體 ≥1 BU",
          "不只一次證實第八凝血因子抑制性抗體 ≥5 BU",
          "抗體必須低於5 BU",
          "不需檢測抗體"
        ],
        answer: 1,
        explanation: "須經 Bethesda 分析法不只一次證實帶有第八凝血因子抑制性抗體≥5.0 BU。"
      },
      {
        q: "Emicizumab 皮下注射預防性治療的最初4週負荷劑量為何？",
        options: [
          "每週1次，每次1.5 mg/kg",
          "每週1次，每次3 mg/kg",
          "每2週1次，每次3 mg/kg",
          "每4週1次，每次6 mg/kg"
        ],
        answer: 1,
        explanation: "Emicizumab 最初4週每週一次投予3 mg/kg；之後可依規定改為每週1.5 mg/kg、每2週3 mg/kg或每4週6 mg/kg。"
      },
      {
        q: "Deferasirox 用於需長期輸血且已併有鐵質沉積的患者時，血清 Ferritin 須高於多少才符合該項給付條件？",
        options: [
          "500 μg/L",
          "800 μg/L",
          "1,000 μg/L",
          "2,000 μg/L"
        ],
        answer: 3,
        explanation: "需長期輸血治療且已併有鐵質沉積的患者，血清 Ferritin＞2,000 μg/L時符合該項使用條件。"
      },
      {
        q: "中型海洋性貧血患者使用 Deferasirox 時，下列何種情況應停藥？",
        options: [
          "Ferritin <1,000 μg/L",
          "Ferritin <800 μg/L",
          "Ferritin <500 μg/L",
          "Ferritin <300 μg/L"
        ],
        answer: 3,
        explanation: "中型海洋性貧血患者使用 Deferasirox 時，若肝臟鐵質<3 mg/g dry weight，或血清 Ferritin<300 μg/L，應停藥。"
      }
    ]
  },
hormonal: {
  title: "激素及影響內分泌機轉藥物",
  questions: [
    {
      q: "依健保給付規定，第二型糖尿病治療原則上應優先使用下列何種藥物？",
      options: [
        "Metformin",
        "Semaglutide",
        "Empagliflozin",
        "Insulin"
      ],
      answer: 0,
      explanation: "第二型糖尿病治療原則上應優先使用 metformin，或考慮早期開始使用 insulin。"
    },
    {
      q: "Semaglutide 用於第二型糖尿病時，依給付規定，患者在接受最大耐受劑量 metformin 及/或 sulfonylurea，並合併其他指定藥物持續6個月後，HbA1c 仍須高於多少？",
      options: [
        "7.0%",
        "7.5%",
        "8.0%",
        "8.5%"
      ],
      answer: 3,
      explanation: "Semaglutide 等該類藥品限用於符合前述治療條件持續6個月後，HbA1c仍高於8.5%的第二型糖尿病患者。"
    },
    {
      q: "依給付規定，Semaglutide 不得與下列何種藥物併用？",
      options: [
        "Metformin",
        "Sulfonylurea",
        "DPP-4抑制劑或 SGLT-2抑制劑",
        "基礎 Insulin"
      ],
      answer: 2,
      explanation: "該段給付規定指出，Semaglutide 等藥品不得與 DPP-4抑制劑、SGLT-2抑制劑併用。"
    },
    {
      q: "Dapagliflozin 或 Empagliflozin 單方製劑，依給付規定每日最多處方幾粒？",
      options: [
        "1粒",
        "2粒",
        "3粒",
        "4粒"
      ],
      answer: 0,
      explanation: "Dapagliflozin、Empagliflozin 等 SGLT-2抑制劑單方製劑每日最多處方1粒。"
    },
    {
      q: "Finasteride 用於前列腺增生且有阻塞症狀時，下列何者符合給付條件？",
      options: [
        "前列腺體積大於20 mL",
        "前列腺體積大於30 mL",
        "Qmax 大於20 mL/sec",
        "不需超音波或尿流速評估"
      ],
      answer: 1,
      explanation: "Finasteride 限前列腺增生且有阻塞症狀，前列腺大於30 mL，或最大尿流速 Qmax 小於15 mL/sec 的病人使用。"
    },
    {
      q: "Octreotide injection 使用於胃、食道靜脈曲張出血時，最長使用多久為原則？",
      options: [
        "1天",
        "3天",
        "5天",
        "7天"
      ],
      answer: 1,
      explanation: "Octreotide injection 使用於胃、食道靜脈曲張出血，最長以3天為原則。"
    },
    {
      q: "骨質疏鬆症治療期間，依給付規定下列何者正確？",
      options: [
        "可同時使用兩種抗骨質再吸收劑",
        "可同時使用 Denosumab 與 Bisphosphonate",
        "一次限用一項骨質疏鬆症治療藥物",
        "可依病人需求任意併用"
      ],
      answer: 2,
      explanation: "骨質疏鬆症治療時，一次限用一項藥物，不得併用其他骨質疏鬆症治療藥物。"
    },
    {
      q: "使用 Bisphosphonate 治療骨質疏鬆症前，依給付規定應先檢測何項數值？",
      options: [
        "AST",
        "HbA1c",
        "Serum creatinine",
        "TSH"
      ],
      answer: 2,
      explanation: "使用 Bisphosphonate 類藥物前，須先檢測病人的 serum creatinine，並符合該藥品仿單建議規定。"
    },
    {
      q: "Teriparatide 依健保給付規定，最多可使用幾支？",
      options: [
        "12支",
        "18支",
        "24支",
        "36支"
      ],
      answer: 1,
      explanation: "Teriparatide 使用不得超過18支，並須於2年內使用完畢。"
    },
    {
      q: "Romosozumab 依健保給付規定，最多可使用幾支並於多久內使用完畢？",
      options: [
        "12支，1年內",
        "18支，2年內",
        "24支，1年內",
        "24支，2年內"
      ],
      answer: 2,
      explanation: "Romosozumab 使用不得超過24支，並須於1年內使用完畢。"
    }
  ]
},
  respiratory_gi: {
  title: "呼吸及腸胃道藥物",
  questions: [
    {
      q: "依健保給付規定，Trelegy Ellipta 用於 COPD 維持治療時，下列何者符合給付條件？",
      options: [
        "所有輕度 COPD 病人皆可使用",
        "已接受 ICS/LABA 或 LABA/LAMA 合併治療，仍有顯著症狀或惡化控制不佳",
        "僅限急性氣喘發作時使用",
        "必須與中、高劑量 ICS/LABA 固定複方併用"
      ],
      answer: 1,
      explanation: "Trelegy Ellipta 用於 COPD 維持治療時，病人須符合相關條件，包括已接受 ICS/LABA 或 LABA/LAMA 合併治療，仍有顯著症狀或惡化控制不佳。"
    },
    {
      q: "Trimbow 用於 COPD 維持治療時，依給付規定其肺功能條件為何？",
      options: [
        "FEV1 ≥80% predicted",
        "FEV1 ≥50% predicted",
        "FEV1 <50% predicted",
        "不需考慮 FEV1"
      ],
      answer: 2,
      explanation: "Trimbow 用於 COPD 維持治療時，限重度以上，也就是 FEV1 少於預測值50%，且有反覆惡化病史之成人病人。"
    },
    {
      q: "依健保給付規定，Tezepelumab 用於嚴重且控制不良的氣喘時，限用於幾歲以上的成人病人？",
      options: [
        "6歲以上",
        "12歲以上",
        "18歲以上",
        "20歲以上"
      ],
      answer: 2,
      explanation: "Tezepelumab 限用於經胸腔專科或過敏免疫專科醫師診斷為嚴重氣喘且控制不良的18歲以上成人病人。"
    },
    {
      q: "嚴重持續性氣喘病人使用 Omalizumab 時，依給付規定 Total IgE 原則上須介於何範圍？",
      options: [
        "10–100 IU/mL",
        "30–1300 IU/mL",
        "100–2000 IU/mL",
        "無 IgE 條件"
      ],
      answer: 1,
      explanation: "使用 Omalizumab 須檢附免疫球蛋白 IgE 檢驗結果，Total IgE 原則上須介於30–1300 IU/mL。"
    },
    {
      q: "Nintedanib 與 Pirfenidone 用於特發性肺纖維化時，下列敘述何者正確？",
      options: [
        "建議兩者合併使用",
        "可同時使用，但需減量",
        "兩者不得同時併用",
        "僅住院期間不得併用"
      ],
      answer: 2,
      explanation: "依健保給付規定，Nintedanib 與 Pirfenidone 不得同時併用。"
    },
    {
      q: "Mepolizumab 或 Benralizumab 用於嚴重嗜伊紅性氣喘時，投藥前12個月內血中嗜伊紅性白血球須達多少？",
      options: [
        "≥100 cells/mcL",
        "≥200 cells/mcL",
        "≥300 cells/mcL",
        "≥500 cells/mcL"
      ],
      answer: 2,
      explanation: "給付條件之一為投藥前12個月內血中嗜伊紅性白血球≥300 cells/mcL。"
    },
    {
      q: "逆流性食道炎符合 Los Angeles Classification Grade A 或 Grade B 時，使用消化性潰瘍用藥的給付期間原則上以多久為限？",
      options: [
        "1個月",
        "2個月",
        "4個月",
        "1年"
      ],
      answer: 2,
      explanation: "Grade A 或 Grade B 的逆流性食道炎，使用消化性潰瘍用藥原則上以4個月為限，並須符合相關檢查報告規定。"
    },
    {
      q: "經內視鏡診斷為重度逆流性食道炎，符合 Grade C 或 Grade D，經消化系專科醫師確認後，消化性潰瘍用藥可長期使用多久？",
      options: [
        "3個月",
        "4個月",
        "6個月",
        "1年"
      ],
      answer: 3,
      explanation: "Grade C 或 Grade D 的重度逆流性食道炎，經消化系專科醫師確認後，可長期使用消化性潰瘍用藥1年。"
    },
    {
      q: "Aprepitant 口服製劑用於化療相關噁心嘔吐時，依給付規定使用天數為何？",
      options: [
        "1天",
        "2天",
        "3天",
        "5天"
      ],
      answer: 2,
      explanation: "Aprepitant 口服製劑限用3天，每日限用1顆。"
    },
    {
      q: "Mesalazine 依健保給付規定主要限用於下列何種疾病？",
      options: [
        "胃食道逆流",
        "消化性潰瘍",
        "潰瘍性結腸炎、庫隆氏症",
        "化療引起的噁心嘔吐"
      ],
      answer: 2,
      explanation: "Mesalazine 限潰瘍性結腸炎、庫隆氏症病例使用。"
    }
  ]
}
};
