const $ = (id) => document.getElementById(id);
const drugImageBase = new URL('../assets/drugs/', document.currentScript.src);
const screens = { start: $('start-screen'), quiz: $('quiz-screen'), match: $('match-screen'), result: $('result-screen') };
// Google Apps Script 成績接收端。
const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyrCXiquLsV_rLpAPKzK6u1McsV2wTWKKO2nERcsu9jb4I01TZrz9JRiClpvx0RRCZo/exec';
let state = { cardNumber:'', role:'', topic:'general', index:0, score:0, answers:[], locked:false };
let matchState = { mode:'', cardNumber:'', role:'', questions:[], index:0, score:0, answers:[], answered:false };

// 藥品資料與圖片依使用者提供的藥品圖檔維護。
const MATCH_DATA = [
  { id:'metformin', name:'Metformin', dose:'500 mg', indication:'第二型糖尿病', image:'assets/drugs/metformin.jpeg' },
  { id:'amlodipine', name:'Amlodipine', dose:'5 mg', indication:'高血壓、心絞痛等心血管疾病', image:'assets/drugs/amlodipine.jpeg' },
  { id:'pentoxifylline', name:'Pentoxifylline', dose:'400 mg', indication:'末稍血管循環障礙', image:'assets/drugs/pentoxifylline.png' },
  { id:'prednisolone', name:'Prednisolone', dose:'5 mg', indication:'風濕性關節炎、風濕熱、骨關節炎、風濕性脊椎炎、氣喘、過敏性疾病', image:'assets/drugs/prednisolone.jpeg' },
  { id:'famotidine', name:'Famotidine', dose:'20 mg', indication:'十二指腸潰瘍、胃潰瘍、上消化道出血、逆流性食道炎', image:'assets/drugs/famotidine.png' },
  { id:'xigduo-xr', name:'Xigduo XR (Dapagliflozin ＋Metformin )', dose:'10 mg/1000 mg', indication:'第二型糖尿病', image:'assets/drugs/xigduo-xr.jpeg' },
  { id:'galvus-met', name:'Galvus Metfilm-coated', dose:'50 mg/850 mg', indication:'第二型糖尿病', image:'assets/drugs/galvus-met.jpeg' },
  { id:'exforge', name:'Exforge', dose:'5 mg/80 mg', indication:'高血壓', image:'assets/drugs/exforge.png' },
  { id:'valsartan', name:'Valsartan', dose:'80 mg', indication:'高血壓、心衰竭、心肌梗塞後左心室功能異常', image:'assets/drugs/valsartan.png' },
  { id:'furosemide', name:'Furosemide', dose:'40 mg', indication:'利尿、高血壓', image:'assets/drugs/furosemide.png' },
  { id:'imidapril', name:'Imidapril hydrochloride', dose:'10 mg', indication:'高血壓', image:'assets/drugs/imidapril.png' },
  { id:'rosuvastatin', name:'Rosuvastatin', dose:'10 mg', indication:'高膽固醇血症、高三酸甘油酯血症', image:'assets/drugs/rosuvastatin.png' },
  { id:'clopidogrel', name:'Clopidogrel', dose:'75 mg', indication:'預防中風、心肌梗塞或週邊動脈等之血管栓塞疾病', image:'assets/drugs/clopidogrel.png' },
  { id:'metoclopramide', name:'Metoclopramide', dose:'3.84 mg', indication:'預防嘔吐、逆流性消化性食道炎，胃腸蠕動異常', image:'assets/drugs/metoclopramide.png' }
];

const COMMON_BULK_DATA = [
  {
    "id": "common-acetaminophen",
    "name": "Acetaminophen",
    "dose": "500 mg",
    "indication": "退燒止痛",
    "image": "assets/drugs/common-bulk/acetaminophen.jpg"
  },
  {
    "id": "common-dimethicone",
    "name": "Dimethicone",
    "dose": "40 mg",
    "indication": "腸胃脹氣",
    "image": "assets/drugs/common-bulk/dimethicone.jpeg"
  },
  {
    "id": "common-magnesium-oxide",
    "name": "Magnesium Oxide",
    "dose": "250 mg",
    "indication": "緩解胃部不適或灼熱感、胃酸過多",
    "image": "assets/drugs/common-bulk/magnesium-oxide.jpeg"
  },
  {
    "id": "common-mefenamic-acid",
    "name": "Mefenamic Acid",
    "dose": "250 mg",
    "indication": "消炎、止痛、退燒",
    "image": "assets/drugs/common-bulk/mefenamic-acid.jpeg"
  },
  {
    "id": "common-tranexamic-acid",
    "name": "Tranexamic Acid",
    "dose": "250 mg",
    "indication": "消炎、消腫劑、出血性疾病",
    "image": "assets/drugs/common-bulk/tranexamic-acid.jpeg"
  },
  {
    "id": "common-dextromethorphan",
    "name": "Dextromethorphan",
    "dose": "30 mg",
    "indication": "鎮咳",
    "image": "assets/drugs/common-bulk/dextromethorphan.jpeg"
  },
  {
    "id": "common-soma",
    "name": "SOMA",
    "dose": "250 mg/150 mg/20 mg/7.7 mg",
    "indication": "關節、神經肌肉等疼痛之緩解",
    "image": "assets/drugs/common-bulk/soma.jpeg"
  },
  {
    "id": "common-benzonatate",
    "name": "Benzonatate",
    "dose": "100 mg",
    "indication": "咳嗽",
    "image": "assets/drugs/common-bulk/benzonatate.jpeg"
  },
  {
    "id": "common-cefixime",
    "name": "Cefixime",
    "dose": "100 mg",
    "indication": "感染症,支氣管炎、慢性呼吸系疾病的繼發性感染、肺炎、腎盂腎炎、膀胱炎、細菌性尿道炎、中耳炎、副鼻竇炎",
    "image": "assets/drugs/common-bulk/cefixime.jpeg"
  },
  {
    "id": "common-cephalexin",
    "name": "Cephalexin",
    "dose": "250 mg",
    "indication": "抗微生物劑",
    "image": "assets/drugs/common-bulk/cephalexin.jpeg"
  },
  {
    "id": "common-amoxycillin",
    "name": "Amoxycillin",
    "dose": "500 mg",
    "indication": "葡萄球菌、鏈球菌、肺炎雙球菌、腦膜炎球菌及其他具有感受性細菌",
    "image": "assets/drugs/common-bulk/amoxycillin.jpeg"
  },
  {
    "id": "common-sennoside",
    "name": "Sennoside",
    "dose": "12.5 mg",
    "indication": "軟便劑",
    "image": "assets/drugs/common-bulk/sennoside.jpeg"
  }
];

const SIMILAR_TABLETS_DATA = [
  {
    "id": "similar-biperiden",
    "name": "Biperiden",
    "dose": "2 mg",
    "indication": "帕金森氏症",
    "image": "assets/drugs/similar-tablets/biperiden.jpeg"
  },
  {
    "id": "similar-bumetanide",
    "name": "Bumetanide",
    "dose": "1 mg",
    "indication": "水腫、高血壓等",
    "image": "assets/drugs/similar-tablets/bumetanide.jpeg"
  },
  {
    "id": "similar-dimenhydrinate",
    "name": "Dimenhydrinate",
    "dose": "50 mg",
    "indication": "預防或緩解動暈症（暈車、暈船、暈機）引起之頭暈、噁心",
    "image": "assets/drugs/similar-tablets/dimenhydrinate.jpeg"
  },
  {
    "id": "similar-buclizine",
    "name": "Buclizine",
    "dose": "25 mg",
    "indication": "暫時緩解過敏性鼻炎、過敏所引起之搔癢預防或緩解動暈症引起之頭暈、噁心、嘔吐、頭痛等症狀。",
    "image": "assets/drugs/similar-tablets/buclizine.jpeg"
  },
  {
    "id": "similar-digoxin",
    "name": "Digoxin",
    "dose": "0.25 mg",
    "indication": "心衰竭、心搏過速等心臟疾病",
    "image": "assets/drugs/similar-tablets/digoxin.jpg"
  },
  {
    "id": "similar-midodrine",
    "name": "Midodrine",
    "dose": "2.5 mg",
    "indication": "體質性血壓過低、直立性循環系統失調病後、手術後及產後之血壓過低",
    "image": "assets/drugs/similar-tablets/midodrine.jpeg"
  },
  {
    "id": "similar-pyridoxine",
    "name": "Pyridoxine HCL",
    "dose": "50 mg",
    "indication": "維他命Ｂ６缺乏症妊娠引起之噁心、嘔吐、皮膚炎",
    "image": "assets/drugs/similar-tablets/pyridoxine.jpeg"
  },
  {
    "id": "similar-stoline",
    "name": "Stoline",
    "dose": "Oxethazaine 5 mg＋Aluminum 100 mg",
    "indication": "急慢性胃炎、食道炎過敏性大腸症及消化性潰瘍等伴有的胃痛、腹痛",
    "image": "assets/drugs/similar-tablets/stoline.jpg"
  },
  {
    "id": "similar-sodium-bicarbonate",
    "name": "Sodium Bicarbonate",
    "dose": "300 mg",
    "indication": "代謝性酸中毒之鹼化劑",
    "image": "assets/drugs/similar-tablets/sodium-bicarbonate.jpeg"
  },
  {
    "id": "similar-baclofen",
    "name": "Baclofen",
    "dose": "5 mg",
    "indication": "肌肉痙攣, 肌肉拉傷等症狀",
    "image": "assets/drugs/similar-tablets/baclofen.jpg"
  },
  {
    "id": "similar-levothyroxine",
    "name": "Levothyroxine",
    "dose": "50 mcg",
    "indication": "甲狀腺機能減退症",
    "image": "assets/drugs/similar-tablets/levothyroxine.jpeg"
  },
  {
    "id": "similar-aluminum-hydroxide",
    "name": "Aluminum Hydroxide",
    "dose": "324 mg",
    "indication": "緩解胃部不適或灼熱感、或經診斷為胃及十二指腸潰瘍、胃炎、食道炎所伴隨之胃酸過多",
    "image": "assets/drugs/similar-tablets/aluminum-hydroxide.jpeg"
  }
];

const RARE_BULK_DATA = [
  {
    "id": "rare-acetazolamide",
    "name": "Acetazolamide",
    "dose": "250 mg",
    "indication": "青光眼輔助治療：癲癇、水腫、高山症",
    "image": "assets/drugs/rare-bulk/acetazolamide.jpeg"
  },
  {
    "id": "rare-griseofulvin",
    "name": "Griseofulvin",
    "dose": "125 mg",
    "indication": "抗黴菌藥",
    "image": "assets/drugs/rare-bulk/griseofulvin.jpg"
  },
  {
    "id": "rare-haloperidol",
    "name": "Haloperidol",
    "dose": "5 mg",
    "indication": "躁病、噁心、嘔吐、攻擊性與破壞性之行為障礙、舞蹈病。",
    "image": "assets/drugs/rare-bulk/haloperidol.jpeg"
  },
  {
    "id": "rare-pilocarpine",
    "name": "Pilocarpine",
    "dose": "5 mg",
    "indication": "SJOGREN'S SYNDROME 所引起的口乾燥症。",
    "image": "assets/drugs/rare-bulk/pilocarpine.jpeg"
  },
  {
    "id": "rare-ergonovine",
    "name": "Ergonovine",
    "dose": "0.2 mg",
    "indication": "子宮收縮異常、子宮異常出血等",
    "image": "assets/drugs/rare-bulk/ergonovine.jpeg"
  },
  {
    "id": "rare-flavoxate",
    "name": "Flavoxate",
    "dose": "200 mg",
    "indication": "神經性頻尿、慢性前列腺炎、慢性膀胱炎之頻尿、殘尿感",
    "image": "assets/drugs/rare-bulk/flavoxate.jpeg"
  },
  {
    "id": "rare-pipoxolan",
    "name": "Pipoxolan",
    "dose": "10 mg",
    "indication": "解平滑肌痙攣痙攣所引起的疼痛、特別在腎臟及尿道，偏頭痛型的血管性頭痛",
    "image": "assets/drugs/rare-bulk/pipoxolan.jpeg"
  },
  {
    "id": "rare-doxycycline",
    "name": "Doxycycline",
    "dose": "100 mg",
    "indication": "細菌感染症革蘭氏陽性菌、陰性菌、立克次氏體及巨型濾過性病毒感染症",
    "image": "assets/drugs/rare-bulk/doxycycline.jpeg"
  },
  {
    "id": "rare-pyrazinamide",
    "name": "Pyrazinamide",
    "dose": "500 mg",
    "indication": "用於肺部及其他部位之結核症",
    "image": "assets/drugs/rare-bulk/pyrazinamide.jpeg"
  },
  {
    "id": "rare-pyridoxine",
    "name": "Pyridoxine",
    "dose": "50 mg",
    "indication": "維他命Ｂ６缺乏症妊娠引起之噁心、嘔吐、皮膚炎",
    "image": "assets/drugs/rare-bulk/pyridoxine.jpeg"
  },
  {
    "id": "rare-sodium-bicarbonate",
    "name": "Sodium Bicarbonate",
    "dose": "300 mg",
    "indication": "代謝性酸中毒之鹼化劑",
    "image": "assets/drugs/rare-bulk/sodium-bicarbonate.jpeg"
  },
  {
    "id": "rare-vancomycin",
    "name": "Vancomycin",
    "dose": "125 mg",
    "indication": "葡萄球菌感染所致之心內膜炎、骨髓炎、肺炎、敗血病軟組織感染、腸炎、梭狀桿菌感染所致之假膜性結腸炎。",
    "image": "assets/drugs/rare-bulk/vancomycin.jpg"
  }
];

const SAME_INGREDIENT_QUESTIONS = {
  'coexisting-form': [
    {"question":"請問Acetaminophen現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Acetylcysteine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Acyclovir現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Amoxicillin＋clavulanate現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Aripiprazole現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Atropine Sulfate現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,2]},
    {"question":"請問Azithromycin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,3]},
    {"question":"請問Biperiden現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Bisacodyl現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Budesonide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Calcitriol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Cefuroxime現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Cetirizine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,3]},
    {"question":"請問Ciprofloxacin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Clindamycin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Cyproheptadine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,3]},
    {"question":"請問Desmopressin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Dexamethasone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Diazepam 現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Diclofenac現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Digoxin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Domperidone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,3]},
    {"question":"請問Doxepin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Erythromycin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Famotidine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Fenoterol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Fentanyl現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Fluconazole現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Flupentixol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Furosemide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Fusidic acid現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Gentamycin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,2]},
    {"question":"請問Granisetron現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Haloperidol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Hydrocortisone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,2]},
    {"question":"請問Labetalol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Lacosamide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Levetiracetam現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Levofloxacin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Lidocaine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,2]},
    {"question":"請問Linezolid現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Lorazepam現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Mecobalamin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Mesalazine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Metoclopramide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Metronidazole現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,2]},
    {"question":"請問Midazolam現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Moxifloxacin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Neostigmine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,2]},
    {"question":"請問Nitroglycerin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Ofloxacin現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Olanzapine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Paliperidone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Pilocarpine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Piracetam現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Potassium Chloride現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Prednisolone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2,3]},
    {"question":"請問Progesterone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Quetiapine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2]},
    {"question":"請問Risperidone現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Rivastigmine現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[1,2,3]},
    {"question":"請問Semaglutide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Sodium Bicarbonate現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Torsemide現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Tramadol現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Tranexamic Acid現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]},
    {"question":"請問Valproate現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1,3]},
    {"question":"請問Voriconazole現存哪些劑型","options":["針劑","口服","外用","水劑"],"answers":[0,1]}
  ],
  'coexisting-dose': [
    {"question":"請問(口)Acetylcysteine現存哪些劑量","options":["50mg","100mg","200mg","600mg"],"answers":[1,3]},
    {"question":"請問(口)Afatinib dimaleate現存哪些劑量","options":["10mg","20mg","30mg","40mg"],"answers":[2,3]},
    {"question":"請問(口)Apixaban現存哪些劑量","options":["1.25mg","2.5mg","3mg","5mg"],"answers":[1,3]},
    {"question":"請問(口)Aripiprazole現存哪些劑量","options":["5mg","10mg","15mg","20mg"],"answers":[0,1]},
    {"question":"請問(針)Ascorbic Acid現存哪些劑量","options":["500mg","1000mg","2000mg","5000mg"],"answers":[0,3]},
    {"question":"請問(口)Atorvastatin現存哪些劑量","options":["5mg","10mg","20mg","40mg"],"answers":[1,2,3]},
    {"question":"請問(口)Bisoprolol現存哪些劑量","options":["1.25mg","2.5mg","3mg","5mg"],"answers":[0,3]},
    {"question":"請問(口)Cabozantinib現存哪些劑量","options":["5mg","10mg","20mg","40mg"],"answers":[2,3]},
    {"question":"請問(口)Carvedilol現存哪些劑量","options":["6.25mg","15mg","20mg","25mg"],"answers":[0,3]},
    {"question":"請問(口)Clozapine現存哪些劑量","options":["25mg","50mg","100mg","200mg"],"answers":[0,2]},
    {"question":"請問(口)Dabigatran 現存哪些劑量","options":["100mg","110mg","120mg","150mg"],"answers":[1,3]},
    {"question":"請問(針)Denosumab現存哪些劑量","options":["30mg","60mg","100mg","120mg"],"answers":[1,3]},
    {"question":"請問(口)Dexamethasone現存哪些劑量","options":["0.5mg","2mg","4mg","5mg"],"answers":[0,2]},
    {"question":"請問(口)Dextromethorphan現存哪些劑量","options":["30mg","60mg","100mg","120mg"],"answers":[0,1]},
    {"question":"請問(口)Dipyridamole現存哪些劑量","options":["25mg","50mg","75mg","200mg"],"answers":[0,2]},
    {"question":"請問(口)Donepezil現存哪些劑量","options":["5mg","10mg","20mg","40mg"],"answers":[0,1]},
    {"question":"請問(針)Dopamine現存哪些劑量","options":["40mg","50mg","300mg","600mg"],"answers":[0,3]},
    {"question":"請問(針)Emicizumab現存哪些劑量","options":["30mg","60mg","100mg","120mg"],"answers":[0,1]},
    {"question":"請問(口)Empagliflozin現存哪些劑量","options":["5mg","10mg","25mg","100 mg"],"answers":[1,2]},
    {"question":"請問(口)Edoxaban現存哪些劑量","options":["10mg","15mg","30mg","60mg"],"answers":[1,2,3]},
    {"question":"請問(口)Entecavir現存哪些劑量","options":["0.5mg","1mg","2mg","5mg"],"answers":[0,1]},
    {"question":"請問(口)Entresto現存哪些劑量","options":["25mg","50mg","100mg","200mg"],"answers":[2,3]},
    {"question":"請問(口)Finasteride現存哪些劑量","options":["0.5mg","1mg","2mg","5mg"],"answers":[1,3]},
    {"question":"請問(針)Haloperidol現存哪些劑量","options":["5mg","10mg","20mg","50mg"],"answers":[0,3]},
    {"question":"請問(口)Herbesser現存哪些劑量","options":["10mg","20mg","30mg","60mg"],"answers":[2,3]},
    {"question":"請問(口) Isosorbide 5-Mononitrtate現存哪些劑量","options":["10mg","20mg","30mg","60mg"],"answers":[1,3]},
    {"question":"請問(針)Lenograstim現存哪些劑量","options":["50mcg","100mcg","200mcg","250mcg"],"answers":[1,3]},
    {"question":"請問(口)Lenvatinib現存哪些劑量","options":["2mg","4mg","5mg","10mg"],"answers":[1,3]},
    {"question":"請問(口)Nifedipine現存哪些劑量","options":["5mg","10mg","20mg","30mg"],"answers":[1,3]},
    {"question":"請問(口)Olanzapine現存哪些劑量","options":["5mg","10mg","20mg","30mg"],"answers":[0,1]},
    {"question":"請問(口)Oxycodone現存哪些劑量","options":["5mg","10mg","20mg","30mg"],"answers":[0,1]},
    {"question":"請問(口)Paliperidone現存哪些劑量","options":["2mg","3mg","5mg","9mg"],"answers":[1,3]},
    {"question":"請問(口)Pitavastatin現存哪些劑量","options":["2mg","4mg","5mg","10mg"],"answers":[0,1]},
    {"question":"請問(口)Pramipexole現存哪些劑量","options":["0.25mg","0.375mg","0.75mg","1.5mg"],"answers":[0,1,2,3]},
    {"question":"請問(口)Propranolol現存哪些劑量","options":["5mg","10mg","30 mg","40mg"],"answers":[1,3]},
    {"question":"請問(口)Quetiapine現存哪些劑量","options":["25mg","50mg","100mg","200mg"],"answers":[0,3]},
    {"question":"請問(針)Risperidone現存哪些劑量","options":["25mg","50mg","100mg","200mg"],"answers":[0,2]},
    {"question":"請問(口)Rivaroxaban現存哪些劑量","options":["2.5mg","10mg","15 mg","20mg"],"answers":[0,1,2,3]},
    {"question":"請問(口)Rivastigmine現存哪些劑量","options":["1.5mg","2mg","3 mg","4.5mg"],"answers":[0,3]},
    {"question":"請問(口)Rivotril現存哪些劑量","options":["0.5mg","1mg","1.5 mg","2mg"],"answers":[0,3]},
    {"question":"請問(口)Semaglutide現存哪些劑量","options":["2mg","3mg","7mg","14mg"],"answers":[1,2,3]},
    {"question":"請問(口)Sildenafil現存哪些劑量","options":["20mg","30mg","50mg","100mg"],"answers":[0,2,3]},
    {"question":"請問(口)Sulpiride現存哪些劑量","options":["20mg","50mg","100mg","200mg"],"answers":[1,3]},
    {"question":"請問(針)Methylprednisolone現存哪些劑量","options":["20mg","40mg","100mg","500mg"],"answers":[1,3]},
    {"question":"請問(口)Tamsulosin現存哪些劑量","options":["0.2mg","0.4mg","0.5 mg","2mg"],"answers":[0,1]},
    {"question":"請問(口)Theophylline現存哪些劑量","options":["100mg","125mg","200mg","250mg"],"answers":[1,2,3]},
    {"question":"請問(針)Tocilizumab現存哪些劑量","options":["80mg","160mg","162mg","200mg"],"answers":[0,2,3]},
    {"question":"請問(口)Topiramate現存哪些劑量","options":["5mg","10mg","25mg","100 mg"],"answers":[2,3]},
    {"question":"請問(口)Venlafaxine現存哪些劑量","options":["25mg","37.5mg","50mg","75mg"],"answers":[1,3]},
    {"question":"請問(口)Verapamil現存哪些劑量","options":["5mg","25mg","40mg","240mg"],"answers":[2,3]}
  ]
};

const DRUG_CHAPTERS = {
  'bare-tablets': { title:'裸錠藥品', groups:{'common-bulk':{title:'常用散裝',data:COMMON_BULK_DATA},'similar-tablets':{title:'相似裸錠',data:SIMILAR_TABLETS_DATA},'rare-bulk':{title:'少用散裝',data:RARE_BULK_DATA}}, modes:[['image-name','外觀辨識'],['drug-dose','劑量'],['drug-indication','適應症']], data:[] },
  'blister-pack': { title:'片裝藥品', modes:[['image-name','外觀辨識'],['drug-dose','劑量'],['drug-indication','適應症']], data:MATCH_DATA },
  'coexisting-brands': { title:'併存廠牌', modes:[['image-name','外觀辨識']], data:[] },
  'same-ingredient': { title:'同成分辨識', modes:[['coexisting-form','併存劑型'],['coexisting-dose','劑量']], questionBanks:SAME_INGREDIENT_QUESTIONS }
};

function selectedDrugBank(chapterId, groupId){
  const chapter = DRUG_CHAPTERS[chapterId];
  return chapter && (chapter.groups ? chapter.groups[groupId] : chapter);
}

function matchingTitle(){
  const chapter = DRUG_CHAPTERS[matchState.chapter];
  return chapter.title + (chapter.groups ? '｜' + chapter.groups[matchState.group].title : '') + '｜' + chapter.modes.find(([mode]) => mode === matchState.mode)[1];
}

function updateDrugPractice(){
  const chapter = DRUG_CHAPTERS[$('drug-learning-chapter').value];
  const isDrugLearning = $('learning-mode').value === 'drug-learning';
  const needsGroup = !!(chapter && chapter.groups);
  const bank = selectedDrugBank($('drug-learning-chapter').value, $('drug-learning-group').value);
  $('drug-group-field').classList.toggle('hidden', !isDrugLearning || !needsGroup);
  const select = $('drug-learning-mode');
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = bank ? '請選擇練習類型' : needsGroup ? '請先選擇分類' : '請先選擇章節';
  select.appendChild(placeholder);
  if(bank) chapter.modes.forEach(([value, title]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = title;
    select.appendChild(option);
  });
  $('drug-practice-field').classList.toggle('hidden', !bank || !isDrugLearning);
  $('start-error').textContent = isDrugLearning && bank && !(bank.questionBanks || bank.data.length) ? bank.title + '題庫尚未建置。' : '';
}
$('drug-learning-chapter').addEventListener('change', () => {
  $('drug-learning-group').value = '';
  updateDrugPractice();
});
$('drug-learning-group').addEventListener('change', updateDrugPractice);

function show(name){ Object.entries(screens).forEach(([k,v]) => v.classList.toggle('hidden', k !== name)); }

$('start-btn').addEventListener('click', () => {
  const cardNumber = $('card-number').value.trim();
  const role = $('role').value;
  const learningMode = $('learning-mode').value;
  const mode = learningMode === 'drug-learning' ? $('drug-learning-mode').value : learningMode;
  const topic = $('topic').value;
  const chapter = $('drug-learning-chapter').value;
  const group = $('drug-learning-group').value;
  const bank = selectedDrugBank(chapter, group);
  if(!cardNumber || !role || !learningMode){ $('start-error').textContent = '請輸入卡號，並選擇身分及學習模式。'; return; }
  if(learningMode === 'drug-learning' && !DRUG_CHAPTERS[chapter]){ $('start-error').textContent = '請選擇認識藥品章節。'; return; }
  if(learningMode === 'drug-learning' && !bank){ $('start-error').textContent = '請選擇裸錠藥品分類。'; return; }
  if(learningMode === 'drug-learning' && !mode){ $('start-error').textContent = '請選擇認識藥品的練習類型。'; return; }
  if(learningMode === 'drug-learning' && !(bank.questionBanks ? bank.questionBanks[mode]?.length : bank.data.length)){ $('start-error').textContent = bank.title + '題庫尚未建置，請選擇其他章節。'; return; }
  if(mode === 'quiz' && (!topic || !QUESTION_BANK[topic])){ $('start-error').textContent = '請選擇學習主題。'; return; }
  $('start-error').textContent = '';
  if(mode !== 'quiz'){ startMatching(mode, cardNumber, role, chapter, group); return; }
  state = { cardNumber, role, topic, index:0, score:0, answers:[], locked:false };
  $('learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  $('topic-title').textContent = QUESTION_BANK[topic].title;
  show('quiz'); renderQuestion();
});

$('learning-mode').addEventListener('change', (event) => {
  const isQuiz = event.target.value === 'quiz';
  const isDrugLearning = event.target.value === 'drug-learning';
  $('topic-field').classList.toggle('hidden', !isQuiz);
  $('drug-learning-field').classList.toggle('hidden', !isDrugLearning);
  updateDrugPractice();
  $('start-btn').textContent = isDrugLearning ? '開始練習' : '開始測驗';
});

function startMatching(mode, cardNumber, role, chapter, group){
  const bank = selectedDrugBank(chapter, group);
  matchState = {
    mode,
    chapter,
    group,
    cardNumber,
    role,
    questions: shuffle(bank.questionBanks ? bank.questionBanks[mode] : bank.data).slice(0, 10),
    index: 0,
    score: 0,
    answers: [],
    answered: false
  };
  $('match-learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  const titles = {'image-name':'藥品圖片辨識','drug-dose':'藥品劑量辨識','drug-indication':'藥品適應症辨識'};
  $('match-title').textContent = matchingTitle();
  $('match-next-btn').classList.add('hidden');
  show('match');
  renderMatchingQuestion();
}

function renderMatchingQuestion(){
  const item = matchState.questions[matchState.index];
  const total = matchState.questions.length;
  matchState.answered = false;
  $('match-progress').textContent = `${matchState.index + 1} / ${total}`;
  $('match-feedback').className = 'feedback info';
  $('match-feedback').textContent = '請選擇正確答案。';
  $('match-next-btn').classList.add('hidden');

  const left = $('match-left');
  const right = $('match-right');
  left.innerHTML = '';
  right.innerHTML = '';

  const questionCard = document.createElement('div');
  questionCard.className = 'match-question-card';

  if(item.answers){
    questionCard.textContent = item.question;
    left.appendChild(questionCard);
    renderMultipleAnswerOptions(item, right);
    return;
  }

  if(matchState.mode === 'image-name'){
    const prompt = document.createElement('div');
    prompt.className = 'match-question-label';
    prompt.textContent = '這是哪一種藥品？';
    const img = document.createElement('img');
    img.src = new URL(item.image.replace(/^assets\/drugs\//, ''), drugImageBase).href;
    img.alt = '請辨識此藥品';
    img.className = 'medicine-photo medicine-photo-large';
    img.onerror = () => {
      img.alt = '圖片載入失敗，請重新整理頁面後再試';
      $('match-feedback').textContent = '藥品圖片載入失敗，請重新整理頁面後再試。';
    };
    questionCard.append(prompt, img);
  } else {
    const prompt = document.createElement('div');
    prompt.className = 'match-question-label';
    prompt.textContent = matchState.mode === 'drug-dose' ? '請選擇正確劑量' : '請選擇正確適應症';
    const drugName = document.createElement('strong');
    drugName.className = 'match-drug-name';
    drugName.textContent = item.name;
    questionCard.append(prompt, drugName);
  }
  left.appendChild(questionCard);

  const answerKey = matchState.mode === 'image-name' ? 'name' : matchState.mode === 'drug-dose' ? 'dose' : 'indication';
  // 圖片辨識優先放入相近藥品，選項一律取自目前題庫。
  const candidates = selectedDrugBank(matchState.chapter, matchState.group).data.filter(other => other.id !== item.id);
  const distractorItems = matchState.mode === 'image-name'
    ? [...shuffle(candidates.filter(other => other.indication === item.indication)),
       ...shuffle(candidates.filter(other => other.indication !== item.indication))]
    : shuffle(candidates);
  // 適應症選項統一糖尿病名稱，並避免「第二型／第2型」同義選項重複。
  const formatOptionValue = (value) => {
    if(matchState.mode !== 'drug-indication') return value;
    if(value === '糖尿病') return '第一型糖尿病';
    if(value === '第2型糖尿病') return '第二型糖尿病';
    return value;
  };
  const correctValue = formatOptionValue(item[answerKey]);
  const pairedIds = ['xigduo-xr', 'galvus-met'];
  const pairedQuestion = matchState.mode === 'image-name' && pairedIds.includes(item.id);
  const pairedDistractors = pairedQuestion
    ? selectedDrugBank(matchState.chapter, matchState.group).data.filter(other => pairedIds.includes(other.id) && other.id !== item.id)
    : [];
  const distractors = [...pairedDistractors, ...distractorItems.filter(other => matchState.mode !== 'image-name' || !pairedIds.includes(other.id))]
    .map(other => ({id:other.id, value:formatOptionValue(other[answerKey])}))
    .filter((option, idx, array) =>
      option.value !== correctValue &&
      array.findIndex(entry => entry.value === option.value) === idx
    )
    .slice(0, 3);
  const options = shuffle([{id:item.id, value:correctValue}, ...distractors]);

  options.forEach((option, idx) => {
    const button = document.createElement('button');
    button.className = 'match-card answer-option';
    button.dataset.correct = option.id === item.id ? 'true' : 'false';
    button.textContent = `${String.fromCharCode(65 + idx)}. ${option.value}`;
    button.addEventListener('click', () => chooseMatchingAnswer(button, option.value, correctValue));
    right.appendChild(button);
  });
}

function renderMultipleAnswerOptions(item, right){
  $('match-feedback').textContent = '本題可複選。請勾選所有正確選項，再送出答案。';
  const inputs = item.options.map((value, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.style.width = 'auto';
    label.append(input, ' ' + value);
    right.appendChild(label);
    return input;
  });

  const submit = document.createElement('button');
  submit.type = 'button';
  submit.className = 'primary';
  submit.textContent = '送出答案';
  submit.disabled = true;
  inputs.forEach(input => input.addEventListener('change', () => {
    submit.disabled = !inputs.some(option => option.checked);
  }));
  submit.addEventListener('click', () => {
    if(matchState.answered) return;
    const selected = inputs.flatMap((input, index) => input.checked ? [index] : []);
    const correct = selected.length === item.answers.length && selected.every(index => item.answers.includes(index));
    inputs.forEach(input => { input.disabled = true; });
    submit.disabled = true;
    recordMatchingAnswer(
      item.question,
      selected.map(index => item.options[index]).join('、'),
      item.answers.map(index => item.options[index]).join('、'),
      correct
    );
  });
  right.appendChild(submit);
}

function chooseMatchingAnswer(button, selectedAnswer, correctAnswer){
  if(matchState.answered) return;
  const correct = button.dataset.correct === 'true';

  const item = matchState.questions[matchState.index];
  const question = matchState.mode === 'image-name'
    ? `藥品圖片辨識（${item.image.split('/').pop()}）`
    : matchState.mode === 'drug-dose'
      ? `${item.name} 的正確劑量為何？`
      : `${item.name} 的適應症為何？`;
  [...$('match-right').children].forEach(option => {
    option.disabled = true;
    if(option.dataset.correct === 'true') option.classList.add('matched');
  });
  if(!correct) button.classList.add('mismatch');
  recordMatchingAnswer(question, selectedAnswer, correctAnswer, correct);
}

function recordMatchingAnswer(question, selectedAnswer, correctAnswer, correct){
  matchState.answered = true;
  if(correct) matchState.score++;
  matchState.answers.push({question, selectedAnswer, correctAnswer, correct});
  $('match-feedback').className = `feedback ${correct ? 'good' : 'bad'}`;
  $('match-feedback').textContent = correct ? '答對了！' : `答錯了，正確答案是：${correctAnswer}`;
  $('match-next-btn').textContent = matchState.index === matchState.questions.length - 1 ? '查看結果' : '下一題';
  $('match-next-btn').classList.remove('hidden');
}

$('match-next-btn').addEventListener('click', () => {
  if(matchState.index < matchState.questions.length - 1){
    matchState.index++;
    renderMatchingQuestion();
  } else {
    renderMatchingResult();
  }
});

function renderMatchingResult(){
  const total = matchState.questions.length;
  const pct = Math.round(matchState.score / total * 100);
  $('match-title').textContent = '練習結果';
  $('match-progress').textContent = `${total} / ${total}`;
  $('match-left').innerHTML = `<div class="match-result-score"><strong>${matchState.score} / ${total}</strong><span>答對題數</span></div>`;
  $('match-right').innerHTML = '';
  $('match-feedback').className = `feedback ${matchState.score >= 8 ? 'good' : 'info'}`;
  $('match-feedback').textContent = '成績送出中…';
  $('match-next-btn').classList.add('hidden');
  submitMatchingResult(total, pct);
}

async function submitMatchingResult(total, pct){
  const titles = {
    'image-name':'藥品圖片辨識',
    'drug-dose':'藥品劑量辨識',
    'drug-indication':'藥品適應症辨識'
  };
  const payload = {
    cardNumber: matchState.cardNumber,
    role: matchState.role,
    topic: matchingTitle(),
    chapter: DRUG_CHAPTERS[matchState.chapter].title,
    category: '認識藥品',
    subgroup: DRUG_CHAPTERS[matchState.chapter].groups ? selectedDrugBank(matchState.chapter, matchState.group).title : '',
    score: pct,
    correct: matchState.score,
    total,
    completedAt: new Date().toISOString(),
    answers: matchState.answers.map((answer, index) => ({
      questionNo: index + 1,
      question: answer.question,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.correctAnswer,
      correct: answer.correct
    }))
  };
  try {
    await fetch(RESULTS_ENDPOINT, {
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(payload)
    });
    $('match-feedback').className = 'feedback good';
    $('match-feedback').textContent = matchState.score >= 8
      ? '表現很好！成績已送出。'
      : '成績已送出，可以返回首頁再練習一次。';
  } catch (err) {
    $('match-feedback').className = 'feedback bad';
    $('match-feedback').textContent = '成績送出失敗，請稍後再試。';
  }
}

function shuffle(items){
  const copy = [...items];
  for(let i=copy.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
$('match-home-btn').addEventListener('click', () => show('start'));

function renderQuestion(){
  const bank = QUESTION_BANK[state.topic].questions;
  const item = bank[state.index];
  state.locked = false;
  $('question-number').textContent = `第 ${state.index + 1} 題`;
  $('question-text').textContent = item.q;
  $('progress-text').textContent = `${state.index + 1} / ${bank.length}`;
  $('progress-bar').style.width = `${((state.index + 1)/bank.length)*100}%`;
  $('feedback').className = 'feedback hidden';
  $('feedback').textContent = '';
  $('next-btn').classList.add('hidden');
  const wrap = $('options'); wrap.innerHTML = '';
  item.options.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${String.fromCharCode(65+idx)}. ${text}`;
    btn.addEventListener('click', () => choose(idx));
    wrap.appendChild(btn);
  });
}

function choose(choice){
  if(state.locked) return;
  state.locked = true;
  const bank = QUESTION_BANK[state.topic].questions;
  const item = bank[state.index];
  const correct = choice === item.answer;
  if(correct) state.score++;
  state.answers.push({ question:item.q, choice, correctIndex:item.answer, correct, options:item.options, explanation:item.explanation });
  [...$('options').children].forEach((btn, idx) => {
    btn.disabled = true;
    if(idx === item.answer) btn.classList.add('correct');
    if(idx === choice && idx !== item.answer) btn.classList.add('wrong');
  });
  const feedback = $('feedback');
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  feedback.textContent = `${correct ? '答對了！' : '這題答錯了。'} ${item.explanation}`;
  $('next-btn').textContent = state.index === bank.length - 1 ? '查看成績' : '下一題';
  $('next-btn').classList.remove('hidden');
}

$('next-btn').addEventListener('click', () => {
  const bank = QUESTION_BANK[state.topic].questions;
  if(state.index < bank.length - 1){ state.index++; renderQuestion(); }
  else renderResult();
});

function renderResult(){
  const total = QUESTION_BANK[state.topic].questions.length;
  const pct = Math.round(state.score / total * 100);
  $('result-score').textContent = `${state.score} / ${total}`;
  $('result-summary').textContent = `卡號 ${maskCard(state.cardNumber)}（${state.role}）本次得分 ${pct} 分。`;
  submitResult(total, pct);
  const list = $('review-list'); list.innerHTML='';
  state.answers.forEach((a, i) => {
    const div = document.createElement('div'); div.className='review-item';
    const userAns = a.options[a.choice]; const correctAns = a.options[a.correctIndex];
    div.innerHTML = `<strong>第 ${i+1} 題：${escapeHtml(a.question)}</strong>
      <div class="${a.correct ? 'right' : 'wrong-text'}">你的答案：${escapeHtml(userAns)} ${a.correct ? '✓' : '✗'}</div>
      ${a.correct ? '' : `<div class="right">正確答案：${escapeHtml(correctAns)}</div>`}
      <div class="muted">解析：${escapeHtml(a.explanation)}</div>`;
    list.appendChild(div);
  });
  show('result');
}

$('retry-btn').addEventListener('click', () => { show('start'); });
$('download-btn').addEventListener('click', downloadResult);

function downloadResult() {
  const total = QUESTION_BANK[state.topic].questions.length;
  const pct = Math.round(state.score / total * 100);
  const topic = QUESTION_BANK[state.topic].title;

  const rows = [
    ['藥學互動學習平台'],
    ['卡號', state.cardNumber],
    ['身分', state.role],
    ['學習主題', topic],
    ['答對題數', state.score],
    ['總題數', total],
    ['分數', pct + '分'],
    ['測驗時間', new Date().toLocaleString('zh-TW')],
    [],
   ['題號', '題目', '你的答案', '正確答案', '作答結果', '解析']
  ];

  state.answers.forEach((a, i) => {
  const question = QUESTION_BANK[state.topic].questions[i];

  rows.push([
    i + 1,
    question.q,
    question.options[a.choice] ?? '',
    question.options[question.answer] ?? '',
    a.correct ? '答對' : '答錯',
    question.explanation ?? ''
  ]);
});

  const csv = rows
    .map(row => row.map(cell =>
      `"${String(cell ?? '').replace(/"/g, '""')}"`
    ).join(','))
    .join('\n');

  const dataUrl =
  'data:text/csv;charset=utf-8,' +
  encodeURIComponent('\uFEFF' + csv);

const link = document.createElement('a');
link.href = dataUrl;
link.download = `NHI_Quiz_${state.cardNumber}_${topic}.csv`;
link.style.display = 'none';

document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}
async function submitResult(total, pct){
  const status = $('submit-status');
  if(!RESULTS_ENDPOINT){
    status.className = 'feedback info';
    status.textContent = '目前為本機測試版，成績尚未回傳至 Google Sheet。';
    return;
  }
  status.className = 'feedback info';
  status.textContent = '成績送出中…';
  const payload = {
    cardNumber: state.cardNumber,
    role: state.role,
    topic: QUESTION_BANK[state.topic].title,
    score: pct,
    correct: state.score,
    total,
    completedAt: new Date().toISOString(),
    answers: state.answers.map((answer, index) => ({
      questionNo: index + 1,
      question: answer.question,
      selectedAnswer: answer.options[answer.choice],
      correctAnswer: answer.options[answer.correctIndex],
      correct: answer.correct
    }))
  };
  try {
    await fetch(RESULTS_ENDPOINT, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload) });
    status.className = 'feedback good';
    status.textContent = '成績已送出。';
  } catch (err) {
    status.className = 'feedback bad';
    status.textContent = '成績送出失敗，請稍後再試。';
  }
}

function maskCard(card){
  if(card.length <= 4) return card;
  return `${'*'.repeat(Math.max(0, card.length - 4))}${card.slice(-4)}`;
}

function escapeHtml(s){ return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
