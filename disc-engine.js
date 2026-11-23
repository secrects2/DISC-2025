/**
 * DISC 企業測驗雙維度引擎 (v2 Ipsative Most/Least Model)
 * ------------------------------------------------------------
 * - 24 題強迫選擇題庫（每題選 1 個「最符合」與 1 個「最不符合」）
 * - 計算 內在(Internal) / 外在(External) / 總結(Summary) / 轉換(Shift)
 * - 計算 5x5 作風卡座標、16 項特性方格、分析表壓力與調適力
 * - 生成 9 大職場報告面向與 4 型關係互動指南
 */

export const FACTOR_META = {
    D: { key: 'D', name: '支配型', short: '支配', color: '#e74c3c', bg: '#fdecea', icon: '🦅' },
    I: { key: 'I', name: '影響型', short: '影響', color: '#f39c12', bg: '#fef9e7', icon: '✨' },
    S: { key: 'S', name: '穩健型', short: '穩健', color: '#27ae60', bg: '#eafaf1', icon: '🌿' },
    C: { key: 'C', name: '謹慎型', short: '謹慎', color: '#2980b9', bg: '#ebf5fb', icon: '🧭' }
};

export const QUESTIONS_V2 = [
    {
        stem: '面對全新專案或未知挑戰時',
        options: [
            { text: '直接設定目標，迅速拍板展開行動', type: 'D' },
            { text: '號召大家一起討論，炒熱團隊氣氛', type: 'I' },
            { text: '配合團隊步調，穩定把分內工作做好', type: 'S' },
            { text: '先釐清規則、風險與預期標準再動工', type: 'C' }
        ]
    },
    {
        stem: '與同事或主管出現意見分歧時',
        options: [
            { text: '直接表明立場，據理力爭直到有結論', type: 'D' },
            { text: '用輕鬆或說服的方式化解僵局', type: 'I' },
            { text: '先傾聽對方想法，盡量維持和諧關係', type: 'S' },
            { text: '整理客觀數據與事實，條理說明依據', type: 'C' }
        ]
    },
    {
        stem: '在日常工作溝通與表達時',
        options: [
            { text: '開門見山直講重點與結果', type: 'D' },
            { text: '語氣生動有感染力，樂於分享想法', type: 'I' },
            { text: '態度溫和有耐心，會先顧慮對方感受', type: 'S' },
            { text: '用詞精準謹慎，會先確認細節無誤', type: 'C' }
        ]
    },
    {
        stem: '當專案時程緊迫、必須趕進度時',
        options: [
            { text: '果斷刪減不必要流程，全力衝刺達標', type: 'D' },
            { text: '鼓勵大家打氣，維持正向的團隊士氣', type: 'I' },
            { text: '埋頭苦幹穩定輸出，不輕易抱怨', type: 'S' },
            { text: '重新排定優先順序，避免趕工出錯', type: 'C' }
        ]
    },
    {
        stem: '需要做關鍵工作決策時',
        options: [
            { text: '看準機會就快速決定，承擔風險也無妨', type: 'D' },
            { text: '依直覺與對人的觀察，相信會有好結果', type: 'I' },
            { text: '徵詢有經驗前輩或團隊共識後才定案', type: 'S' },
            { text: '反覆比較各種方案利弊與數據佐證', type: 'C' }
        ]
    },
    {
        stem: '面對既有的工作規範與標準作業流程（SOP）',
        options: [
            { text: '若覺得沒效率，會想辦法簡化或突破', type: 'D' },
            { text: '視狀況彈性調整，不喜歡被死板規定綁住', type: 'I' },
            { text: '照著既有流程執行最安心也最可靠', type: 'S' },
            { text: '嚴格遵守細節與標準，確保品質一致', type: 'C' }
        ]
    },
    {
        stem: '在會議或跨團隊討論中',
        options: [
            { text: '主動掌握議程節奏，推動快速產出決議', type: 'D' },
            { text: '積極提出新點子，帶動現場互動討論', type: 'I' },
            { text: '專心聆聽各方聲音，適時協助整合協調', type: 'S' },
            { text: '仔細檢視方案漏洞，提出關鍵疑問', type: 'C' }
        ]
    },
    {
        stem: '遇到計畫突然變更或臨時插單時',
        options: [
            { text: '立刻調整指令與資源，重新掌控局面', type: 'D' },
            { text: '隨遇而安見招拆招，保持樂觀應對', type: 'I' },
            { text: '需要一點緩衝時間，重新適應新節奏', type: 'S' },
            { text: '立即盤點影響範圍，修正執行細節', type: 'C' }
        ]
    },
    {
        stem: '工作上最能帶給你成就感的事',
        options: [
            { text: '攻克高難度目標、取得領先戰果', type: 'D' },
            { text: '獲得大家讚賞、建立良好人脈互動', type: 'I' },
            { text: '團隊氣氛融洽、長期穩定地提供支援', type: 'S' },
            { text: '產出零失誤、邏輯嚴密的高品質成果', type: 'C' }
        ]
    },
    {
        stem: '與主管或客戶對接需求時',
        options: [
            { text: '希望對方給明確目標，授權我自己發揮', type: 'D' },
            { text: '喜歡像夥伴一樣熱絡交流、腦力激盪', type: 'I' },
            { text: '重視清楚的期望與彼此穩定的信任感', type: 'S' },
            { text: '需要完整的書面規格與明確驗收條件', type: 'C' }
        ]
    },
    {
        stem: '協助或帶領他人一起完成任務時',
        options: [
            { text: '直接指派任務並要求執行速度與結果', type: 'D' },
            { text: '用願景與讚美激發對方的投入熱情', type: 'I' },
            { text: '一步步耐心示範並給予實際支援', type: 'S' },
            { text: '建立明確標準與檢查點，追蹤完成品質', type: 'C' }
        ]
    },
    {
        stem: '檢視一份工作成果或報告時，你最在意',
        options: [
            { text: '有沒有解決核心問題、帶來實際效益', type: 'D' },
            { text: '呈現方式是否吸睛、容易打動受眾', type: 'I' },
            { text: '是否照顧到相關人員的感受與配合度', type: 'S' },
            { text: '資料來源是否正確、細節與格式有無疏漏', type: 'C' }
        ]
    },
    {
        stem: '當你需要說服別人採納你的提案時',
        options: [
            { text: '直接強調能帶來的績效與關鍵優勢', type: 'D' },
            { text: '用生動的故事與熱情感染對方的情緒', type: 'I' },
            { text: '以誠懇態度建立信任，讓對方感到安心', type: 'S' },
            { text: '列出結構化分析、證據與風險評估', type: 'C' }
        ]
    },
    {
        stem: '當工作成果被批評或指出缺點時',
        options: [
            { text: '若認為自己有理，會直接反駁或捍衛做法', type: 'D' },
            { text: '表面保持笑容，但心裡很在意別人看法', type: 'I' },
            { text: '容易自責內耗，需要時間平復情緒', type: 'S' },
            { text: '冷靜檢視批評是否合理，並修正錯誤處', type: 'C' }
        ]
    },
    {
        stem: '規劃自己一週的工作行程時',
        options: [
            { text: '只列最重要的幾件事，其他看情況推進', type: 'D' },
            { text: '保持彈性空間，隨時留給有趣的新任務', type: 'I' },
            { text: '偏好固定有規律的節奏，避免天天趕場', type: 'S' },
            { text: '依時間表細分待辦與緩衝時間，按表執行', type: 'C' }
        ]
    },
    {
        stem: '在跨部門或大型團隊合作中，你常自然成為',
        options: [
            { text: '拍板推進的領頭羊或開拓者', type: 'D' },
            { text: '負責串聯氣氛與對外溝通的橋樑', type: 'I' },
            { text: '默默補位、讓團隊穩定運作的後盾', type: 'S' },
            { text: '把關流程、數據與品質的幕僚軍師', type: 'C' }
        ]
    },
    {
        stem: '當工作壓力長期累積到高點時，你較容易',
        options: [
            { text: '變得缺乏耐性、語氣強硬、想自己接手', type: 'D' },
            { text: '急著找人傾訴、容易分心或情緒起伏大', type: 'I' },
            { text: '選擇沉默退讓，把不滿壓在心裡硬撐', type: 'S' },
            { text: '過度擔心細節出錯，反覆檢查而延遲決定', type: 'C' }
        ]
    },
    {
        stem: '學習一套全新的專業技能或工具時',
        options: [
            { text: '邊做邊學，先抓重點馬上拿來實戰', type: 'D' },
            { text: '找朋友或同事一起學，邊聊邊試最快', type: 'I' },
            { text: '照著教學步驟一步一步穩穩練習', type: 'S' },
            { text: '先把官方說明書與原理讀透再動手', type: 'C' }
        ]
    },
    {
        stem: '與新認識的客戶或合作夥伴互動時',
        options: [
            { text: '迅速切入合作條件與實質需求', type: 'D' },
            { text: '很快熟絡起來，聊得像老朋友一樣', type: 'I' },
            { text: '親切有禮地傾聽，慢慢建立長期信任', type: 'S' },
            { text: '保持專業禮貌距離，先觀察對方可信度', type: 'C' }
        ]
    },
    {
        stem: '面對繁瑣的文書處理與資料核對',
        options: [
            { text: '覺得很浪費時間，希望越快結束越好', type: 'D' },
            { text: '容易覺得枯燥而分心，需要找事調劑', type: 'I' },
            { text: '不排斥照做，只要時間充裕就能完成', type: 'S' },
            { text: '能專注細心檢查，確保格式與數字零誤差', type: 'C' }
        ]
    },
    {
        stem: '公司推動新的組織制度或工作模式時',
        options: [
            { text: '只要有利結果，樂於帶頭突破舊習慣', type: 'D' },
            { text: '覺得新鮮有趣，期待體驗不同做法', type: 'I' },
            { text: '偏好循序漸進，希望說明改變的必要性', type: 'S' },
            { text: '會先質疑新制度的邏輯與配套是否周全', type: 'C' }
        ]
    },
    {
        stem: '當同事陷入低潮或遇到工作難題來找你時',
        options: [
            { text: '直接幫他分析癥結並給出解決方案', type: 'D' },
            { text: '先逗他開心、鼓勵他重新振作起來', type: 'I' },
            { text: '安靜陪伴傾聽，表達理解並主動分擔', type: 'S' },
            { text: '客觀拆解問題原因，協助找出可行步驟', type: 'C' }
        ]
    },
    {
        stem: '在沒有人監督的獨立作業環境下',
        options: [
            { text: '會自己訂出挑戰目標，推進效率更快', type: 'D' },
            { text: '容易因為缺少互動而覺得悶，進度起伏', type: 'I' },
            { text: '維持一貫穩定的步調，不疾不徐完成', type: 'S' },
            { text: '能高度專注於研究、分析與精修細節', type: 'C' }
        ]
    },
    {
        stem: '工作上你最不喜歡被他人貼上的標籤是',
        options: [
            { text: '動作太慢、沒有魄力或受制於人', type: 'D' },
            { text: '無聊嚴肅、不受歡迎或被群體忽視', type: 'I' },
            { text: '製造衝突、不近人情或讓人感到不安', type: 'S' },
            { text: '粗心草率、邏輯混亂或沒有專業依據', type: 'C' }
        ]
    }
];

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function round(v) {
    return Math.round(v);
}

/**
 * 將 24 題 Most/Least 計數映射為 0-100 常模分數
 * 24 題平均每軸出現次數為 6；採用以 6 為中心之平滑邏輯斯映射
 */
function normMost(count) {
    return clamp(round(100 / (1 + Math.exp(-(count - 6) * 0.42))), 2, 98);
}

function normLeast(count) {
    return clamp(round(100 / (1 + Math.exp((count - 6) * 0.42))), 2, 98);
}

export function getGraphShape(scores) {
    const entries = ['D', 'I', 'S', 'C']
        .map(k => ({ k, v: scores[k] }))
        .sort((a, b) => b.v - a.v);
    const high = entries.filter(e => e.v >= 50).map(e => e.k);
    if (high.length === 0) return `-/${entries[0].k}`;
    if (high.length === 1) return high[0];
    return `${high[0]}/${high.slice(1).join('')}`;
}

export function getPrimaryType(scores) {
    let best = 'D', max = -1;
    for (const k of ['D', 'I', 'S', 'C']) {
        if ((scores[k] ?? 0) > max) {
            max = scores[k] ?? 0;
            best = k;
        }
    }
    return best;
}

/**
 * 5x5 作風卡座標與 16 型原型解讀
 */
export function computeStylePoint(scores) {
    // Y 軸: 獨斷度 (0=被動, 100=獨斷) — 主動節奏 (D+I) vs 沉穩節奏 (S+C)
    const assertiveness = clamp(round(50 + ((scores.D + scores.I) - (scores.S + scores.C)) / 4), 5, 95);
    // X 軸: 開放度 (0=制約/任務, 100=開放/人際) — 人際導向 (I+S) vs 任務導向 (D+C)
    const openness = clamp(round(50 + ((scores.I + scores.S) - (scores.D + scores.C)) / 4), 5, 95);

    const col = Math.min(4, Math.floor(openness / 20)); // 0(制約) .. 4(開放)
    const row = Math.min(4, Math.floor((100 - assertiveness) / 20)); // 0(獨斷) .. 4(被動)
    return { assertiveness, openness, col, row };
}

const STYLE_ARCHETYPES = {
    D: {
        name: '開創領航型（高獨斷 × 任務導向）',
        summary: '目標導向明確、行事果決快速，習慣直接掌握主導權並推動事情突破。',
        values: '結果達成、效率、掌控感、勝任與突破',
        seeks: '權責自主、快速進展與具挑戰性的目標',
        avoids: '拖延猶豫、過度繁瑣的限制與失去主導權',
        stress: '壓力大時容易語氣強硬、急躁或直接接管他人工作',
        attitude: '直率果斷、勇於承擔並追求即時成果',
        strategy: '先建立明確目標與時間表，同時預留傾聽他人意見的緩衝點'
    },
    DI: {
        name: '魅力推進型（高獨斷 × 兼顧人際與目標）',
        summary: '兼顧強大行動力與群眾感染力，善於透過號召與願景帶領團隊衝刺。',
        values: '突破表現、影響力、被肯定與團隊動能',
        seeks: '舞台表現、新機會與充滿活力的協作節奏',
        avoids: '單調重複作業、冷漠封閉的環境',
        stress: '可能同時開太多戰線，或對細節耐心迅速耗盡',
        attitude: '自信樂觀、積極主動且善於說服',
        strategy: '聚焦關鍵少數目標，搭配細心執行夥伴負責收斂與細節把關'
    },
    I: {
        name: '熱情影響型（高獨斷 × 開放人際）',
        summary: '天生的溝通者與氣氛營造者，擅長建立信任連結並激發他人熱情。',
        values: '人際互動、認同感、創意空間與正向氛圍',
        seeks: '交流舞台、團隊肯定與靈活多變的工作內容',
        avoids: '孤立作業、冰冷嚴苛的批評與繁文縟節',
        stress: '容易分心、承諾過多或因過度在意評價而情緒波動',
        attitude: '熱情開放、富感染力且樂於表達',
        strategy: '建立可視化待辦清單與定期檢核點，將靈感轉化為穩定產出'
    },
    IS: {
        name: '親和協調型（友善開放 × 平衡穩健）',
        summary: '溫暖好相處又能照顧團隊氣氛，是極佳的跨部門溝通與凝聚橋樑。',
        values: '團隊和諧、互信合作與友善的工作關係',
        seeks: '穩定團隊歸屬感、正向回饋與協助他人的機會',
        avoids: '正面衝突、高壓對立與冷漠競爭',
        stress: '為了維持表面和氣而委屈自己，難以下達強硬拒絕',
        attitude: '親切真誠、同理心強且善於傾聽',
        strategy: '練習清楚表達底線與優先順序，避免承接超出負荷的人情請託'
    },
    S: {
        name: '穩健支援型（沉穩步調 × 開放合作）',
        summary: '可靠忠誠、情緒穩定且極具耐心，能讓團隊在變動中維持秩序與向心力。',
        values: '穩定性、信任感、安全感與長期配合',
        seeks: '明確的角色分工、可預期的節奏與夥伴支持',
        avoids: '朝令夕改、突發衝突與無預警的高風險變動',
        stress: '會壓抑真實不滿並默默硬撐，直到超過臨界點才突然退縮',
        attitude: '溫和堅定、任勞任怨且注重團隊長期穩定',
        strategy: '在變動發生前主動提問釐清範圍，適時說出真實想法與需求'
    },
    SC: {
        name: '精密守護型（被動沉穩 × 謹慎務實）',
        summary: '踏實細膩且極重視品質與一致性，是組織中最穩固的執行與品管基石。',
        values: '準確度、穩定流程、低風險與紮實可靠',
        seeks: '完整規範、充裕準備時間與安靜專注的空間',
        avoids: '草率行事、缺乏依據的臨時插單與混亂現場',
        stress: '可能過度保守、反覆確認而延誤出手的最佳時機',
        attitude: '審慎謙遜、有條理且重視承諾落實',
        strategy: '設定「夠好即可交付」的門檻，減少非核心細節上的過度猶豫'
    },
    C: {
        name: '分析專家型（低開放 × 嚴謹邏輯）',
        summary: '思維縝密、重視數據與原則，擅長拆解複雜問題並建立高標準制度。',
        values: '專業權威、邏輯嚴謹、事實根據與卓越品質',
        seeks: '清晰規格、獨立思考時間與可驗證的數據',
        avoids: '無邏輯的情緒化決策、品質妥協與倉促交差',
        stress: '容易陷入完美主義與自我檢討，對自己與他人要求過苛',
        attitude: '客觀冷靜、求真務實且標準明確',
        strategy: '適時向團隊說明「為什麼這樣標準重要」，避免只給結論讓人覺得有距離'
    },
    DC: {
        name: '戰略實踐型（高獨斷 × 嚴謹任務）',
        summary: '兼具強大推動力與高標準要求，不僅要贏得結果，更要求結構與品質到位。',
        values: '高績效、專業度、解決難題與系統化勝出',
        seeks: '高自主空間、複雜挑戰與高水準同儕',
        avoids: '低效率、含糊不清的指令與敷衍了事',
        stress: '容易對進度或品質不如預期的人失去耐性並展現批判性',
        attitude: '銳利務實、要求極高且目標明確',
        strategy: '區分「必須 100 分的關鍵任務」與「80 分即可的日常事項」，適度授權'
    }
};

function resolveStyleArchetype(scores) {
    const entries = ['D', 'I', 'S', 'C'].map(k => ({ k, v: scores[k] })).sort((a, b) => b.v - a.v);
    const top1 = entries[0], top2 = entries[1];
    if (top1.v - top2.v <= 10) {
        const pair = [top1.k, top2.k].sort((a, b) => 'DISC'.indexOf(a) - 'DISC'.indexOf(b)).join('');
        if (STYLE_ARCHETYPES[pair]) return STYLE_ARCHETYPES[pair];
    }
    return STYLE_ARCHETYPES[top1.k];
}

/**
 * 16 項行為特質方格（內在 X vs 外在 Y）
 */
const TRAIT_FORMULAS = [
    { id: 1, name: '準確', desc: '重視細節正確與流程合規', fn: s => 0.65 * s.C + 0.25 * s.S + 0.10 * (100 - s.I) },
    { id: 2, name: '獨斷性', desc: '直接表態與堅持主導的傾向', fn: s => 0.70 * s.D + 0.15 * s.I + 0.15 * (100 - s.S) },
    { id: 3, name: '配合度', desc: '協調順應團隊規範與他人步調', fn: s => 0.55 * s.S + 0.25 * s.C + 0.20 * (100 - s.D) },
    { id: 4, name: '效率感', desc: '追求精簡流程與迅速達成產出', fn: s => 0.55 * s.D + 0.35 * s.C + 0.10 * (100 - s.I) },
    { id: 5, name: '熱忱', desc: '外顯活力、樂觀與鼓舞他人能力', fn: s => 0.75 * s.I + 0.15 * s.D + 0.10 * s.S },
    { id: 6, name: '友善度', desc: '親和接納並建立溫暖人際關係', fn: s => 0.50 * s.I + 0.40 * s.S + 0.10 * (100 - s.D) },
    { id: 7, name: '獨立性', desc: '不依賴外部肯定、自行推進任務', fn: s => 0.55 * s.D + 0.25 * s.C + 0.20 * (100 - s.S) },
    { id: 8, name: '客觀性', desc: '以事實與邏輯取代情緒判斷', fn: s => 0.60 * s.C + 0.25 * s.D + 0.15 * (100 - s.I) },
    { id: 9, name: '耐心', desc: '承受重複作業與等待成果之穩定度', fn: s => 0.65 * s.S + 0.20 * s.C + 0.15 * (100 - s.D) },
    { id: 10, name: '堅持度', desc: '不輕易放棄既定方向與原則', fn: s => 0.45 * s.S + 0.35 * s.D + 0.20 * s.C },
    { id: 11, name: '自信', desc: '面對未知局面時的自我把握感', fn: s => 0.55 * s.D + 0.35 * s.I + 0.10 * (100 - s.C) },
    { id: 12, name: '主動性', desc: '不等指示即自行開創行動', fn: s => 0.60 * s.D + 0.30 * s.I + 0.10 * (100 - s.S) },
    { id: 13, name: '敏銳度', desc: '察覺潛在風險與人際細節變化', fn: s => 0.45 * s.C + 0.35 * s.I + 0.20 * s.S },
    { id: 14, name: '社交傾向', desc: '主動拓展人脈與參與群體互動', fn: s => 0.65 * s.I + 0.20 * s.S + 0.15 * (100 - s.C) },
    { id: 15, name: '專業深化', desc: '鑽研專業標準並要求自我精進', fn: s => 0.70 * s.C + 0.20 * s.S + 0.10 * (100 - s.I) },
    { id: 16, name: '縝密度', desc: '事前規劃周全與風險預防習慣', fn: s => 0.60 * s.C + 0.30 * s.S + 0.10 * (100 - s.D) }
];

export function computeTraits(internal, external) {
    return TRAIT_FORMULAS.map(t => {
        const x = clamp(round(t.fn(internal)), 2, 98);
        const y = clamp(round(t.fn(external)), 2, 98);
        let quadrant = '非顯性';
        if (x >= 50 && y >= 50) quadrant = '永久';
        else if (x >= 50 && y < 50) quadrant = '潛在';
        else if (x < 50 && y >= 50) quadrant = '暫時';
        return { id: t.id, name: t.name, desc: t.desc, internalX: x, externalY: y, quadrant };
    });
}

function classifyFactorLevel(score) {
    if (score >= 60) return '高因數';
    if (score >= 42) return '中間 / 臨界';
    return '低因數';
}

const FACTOR_BEHAVIOR_TEXT = {
    D: {
        high: '果決直接、重視結果與效率，敢於承擔主導與挑戰現狀',
        mid: '視情境決定是否主導，在必要時能展現決斷力',
        low: '偏好合作共識而非強勢競爭，作風較為內斂務實'
    },
    I: {
        high: '熱情善於表達、容易與人建立連結並帶動團隊氣氛',
        mid: '社交與獨立作業都能適應，溝通風格視對象調整',
        low: '溝通偏向精簡務實，重視實質內容勝於社交寒暄'
    },
    S: {
        high: '穩重可靠、有耐心且重視長期關係與團隊和諧',
        mid: '在穩定節奏與適度變化間能取得良好平衡',
        low: '節奏明快、偏好變化與即時反應，較不喜一成不變'
    },
    C: {
        high: '講求準確、結構化思考與規範品質，決策前充分評估風險',
        mid: '在遵循標準與保留執行彈性之間能靈活拿捏',
        low: '看重大方向與直覺推進，不喜過度繁瑣的細節限制'
    }
};

export function describeProfileFactors(scores) {
    const groups = { high: [], mid: [], low: [] };
    ['D', 'I', 'S', 'C'].forEach(k => {
        const v = scores[k];
        const lvl = classifyFactorLevel(v);
        const bucket = lvl === '高因數' ? 'high' : lvl === '中間 / 臨界' ? 'mid' : 'low';
        groups[bucket].push({
            factor: k,
            name: FACTOR_META[k].name,
            score: v,
            level: lvl,
            summary: FACTOR_BEHAVIOR_TEXT[k][bucket]
        });
    });
    return groups;
}

/**
 * 9 大文字報告面向生成
 */
export function buildTextualSections(analysis) {
    const { summary, internal, external, shift, adaptability, style, tension } = analysis;
    const sumTop = getPrimaryType(summary);
    const extTop = getPrimaryType(external);
    const intTop = getPrimaryType(internal);

    const dominantShiftDir = shift[tension.primaryFactor] >= 0 ? '向上提升' : '向下收斂';
    const hasNotableShift = Math.abs(shift[tension.primaryFactor]) >= 15;
    const shiftComparison = hasNotableShift
        ? `在輕鬆隨意或高壓本能情境（內在主軸為 ${FACTOR_META[intTop].name}）與正式工作規範場合（外在主軸為 ${FACTOR_META[extTop].name}）之間，受測者將「${FACTOR_META[tension.primaryFactor].name} (${tension.primaryFactor})」${dominantShiftDir}了 ${Math.abs(shift[tension.primaryFactor])} 個百分點，顯示目前工作環境促使其主動進行角色調適。`
        : `受測者在輕鬆本我狀態（內在）與正式職場環境（外在）之間的行為表現相當一致，整體調適自然、心理耗能低。`;

    const highFactors = ['D', 'I', 'S', 'C'].filter(k => summary[k] >= 55);
    const lowFactors = ['D', 'I', 'S', 'C'].filter(k => summary[k] < 45);
    const highNames = highFactors.length ? highFactors.map(k => `${k} ${FACTOR_META[k].short}`).join('、') : '均衡型分布';
    const lowNames = lowFactors.length ? lowFactors.map(k => `${k} ${FACTOR_META[k].short}`).join('、') : '無明顯低點';

    return [
        {
            id: 'overview',
            title: '一、概述',
            source: '總結分析表',
            variation: shiftComparison,
            content: `${style.summary} 其綜合表現以「${highNames}」為主要行為驅動力，重視「${style.values}」，在團隊中能快速定位自己的貢獻方式。`
        },
        {
            id: 'adaptation',
            title: '二、行為調適與壓力狀態',
            source: '轉換模式',
            variation: `調適力指標為 ${adaptability}%；最大轉換因素為 ${tension.primaryFactor}（${shift[tension.primaryFactor] >= 0 ? '+' : ''}${shift[tension.primaryFactor]}%）。`,
            content: hasNotableShift
                ? `面對現階段工作角色需求，受測者正刻意${dominantShiftDir} ${FACTOR_META[tension.primaryFactor].name}特質。短期內有助於貼合職務期待，但長期維持大幅轉換需留意能量耗損，建議適時安排可回歸本我節奏的任務緩衝。`
                : `內外在行為曲線貼合度高，表示當前職務與個人天然性格契合度佳，無須過度勉強調整即可發揮應有水準。`
        },
        {
            id: 'strengths_weaknesses',
            title: '三、長處與潛在盲點',
            source: '總結分析表',
            variation: `相對較低因數為「${lowNames}」，代表該面向在壓力下較容易被忽略。`,
            content: `【核心長處】${style.attitude}，能持續追求「${style.seeks}」。\n【潛在盲點】${style.stress}。建議策略：${style.strategy}。`
        },
        {
            id: 'communication',
            title: '四、溝通作風',
            source: '外在分析表',
            variation: `外在溝通用語受 ${FACTOR_META[extTop].name} (${external[extTop]}%) 主導，偏好效率與清楚對焦。`,
            content: external.D >= 55 || external.I >= 55
                ? `表達主動直接且具影響力，擅長帶動討論與推進結論；與偏好深思熟慮的夥伴對話時，建議放慢語速並多留確認細節的空間。`
                : `溝通風格沉穩務實、重視傾聽與準確度；在需要快速表態的會議場合，可練習先講核心結論再補細節，讓觀點更容易被看見。`
        },
        {
            id: 'decision',
            title: '五、作決策風格',
            source: '內在分析表',
            variation: `決策本能反映內在分數分佈（D:${internal.D}% / C:${internal.C}%）。`,
            content: internal.D >= internal.C
                ? `傾向看準關鍵方向後快速拍板、邊推進邊修正，不喜歡因反覆討論錯失時機；重大風險決策可搭配數據型幕僚進行事前檢核。`
                : `決策前會審慎收集事實與評估可行性，力求低失誤與結構完整；在資訊不完全但需搶時效的情境下，建議設定決策截止線以避免過度猶豫。`
        },
        {
            id: 'planning',
            title: '六、組織與規劃能力',
            source: '總結分析表',
            variation: `結構規劃傾向來自 C(${summary.C}%) 與 S(${summary.S}%) 之整合表現。`,
            content: summary.C >= 55 || summary.S >= 55
                ? `習慣先拆解步驟、建立時間表與檢查清單，能維持穩定的交付品質與工作秩序，是團隊執行落地的重要穩定力量。`
                : `規劃偏向大方向與里程碑管理，保留高度彈性以應對市場或任務變化；繁複的追蹤與文件歸檔建議善用數位工具或流程協作支援。`
        },
        {
            id: 'motivation',
            title: '七、內在激勵因子',
            source: '內在分析表',
            variation: `核心動力對應「${FACTOR_META[intTop].name}」需求（${internal[intTop]}%）。`,
            content: `最能激勵該受測者全力投入的條件包括：「${style.seeks}」，以及價值觀獲得「${style.values}」的回應；反之，若長期處於「${style.avoids}」的環境中，工作熱忱會明顯下降。`
        },
        {
            id: 'management_style',
            title: '八、帶人與管理作風',
            source: '外在分析表',
            variation: `對外管理展現以 ${FACTOR_META[extTop].name} 為主的領導傾向。`,
            content: external[sumTop] >= 60 && (sumTop === 'D' || sumTop === 'C')
                ? `管理上重視目標明確度、標準落實與問題解決效率，會清楚界定權責並要求實質產出；建議搭配適度正向回饋，能大幅提升部屬的投入意願。`
                : `管理上重視團隊互信、溝通溫度與協作順暢度，善於傾聽與凝聚共識；在面對績效落後或重大變革時，需搭配明確的考核與紀律規範。`
        },
        {
            id: 'required_management',
            title: '九、所需之管理作風（主管帶人建議）',
            source: '內在分析表',
            variation: `依據內在特質（D:${internal.D}% I:${internal.I}% S:${internal.S}% C:${internal.C}%）推導最適領導方式。`,
            content: internal.D >= 60
                ? `主管應給予明確目標與充分授權，少做微觀干涉，並提供可發揮主導權的成長舞台。`
                : internal.I >= 60
                    ? `主管應多給予公開肯定、互動討論空間與清楚的成果節點，避免過於冰冷機械式的單向交辦。`
                    : internal.S >= 60
                        ? `主管應提供清楚穩定的期望、循序漸進的變動說明以及可靠的支持後盾，避免朝令夕改造成焦慮。`
                        : `主管應提供完整背景資訊、邏輯依據與客觀品質標準，給予足夠時間分析執行，並尊重其專業判斷。`
        }
    ];
}

/**
 * 關係基本精神：與高 D / 高 I / 高 S / 高 C 典型對比互動分析
 */
export const ARCHETYPE_PROFILES = {
    D: { name: '典型高支配型 (High D)', scores: { D: 85, I: 52, S: 25, C: 38 } },
    I: { name: '典型高影響型 (High I)', scores: { D: 55, I: 86, S: 42, C: 24 } },
    S: { name: '典型高穩健型 (High S)', scores: { D: 26, I: 48, S: 85, C: 52 } },
    C: { name: '典型高謹慎型 (High C)', scores: { D: 34, I: 22, S: 54, C: 86 } }
};

export function buildRelationshipKeynotes(external) {
    const extTop = getPrimaryType(external);
    return {
        D: {
            target: ARCHETYPE_PROFILES.D,
            overall: extTop === 'D'
                ? '雙方皆具強主導意識與快節奏，目標一致時推進力驚人，但權責不清時容易正面交鋒。'
                : '對方行動迅速且直接，溝通時需以結果與價值優先，避免過度鋪陳細節。',
            communication: '先講結論與可行選項，時間精簡不拖泥帶水；讓對方保有決策選擇權。',
            management: '設定清晰的績效界線與成果里程碑，給予自主空間並用數據檢視結果。',
            teamRole: '適合由對方擔任破局開拓者，受測者可依自身優勢互補推進落地或協調細節。'
        },
        I: {
            target: ARCHETYPE_PROFILES.I,
            overall: extTop === 'I'
                ? '雙方氣氛熱絡、創意不斷，能快速打開局面，但需共同約定進度追蹤機制以免發散。'
                : '對方熱情重人際與肯定，先建立良好互動溫度再談規範，合作效率會高出許多。',
            communication: '保持正向開放語氣，先肯定創意或熱情，再透過書面摘要確認待辦共識。',
            management: '多給予舞台與正向回饋，並安排簡短定期對焦以確保承諾事項如期交付。',
            teamRole: '對方擅長對外發聲與帶動士氣，適合搭配務實執行或細節把關角色互補。'
        },
        S: {
            target: ARCHETYPE_PROFILES.S,
            overall: extTop === 'S'
                ? '雙方步調穩定且彼此體諒，配合默契極佳；面對急迫變革時需互相提醒加快決策。'
                : '對方重視信任與穩定節奏，急躁催促容易讓對方退縮，需保留合理的說明與緩衝期。',
            communication: '語氣誠懇溫和，清楚說明背景原因與分工期待，主動詢問對方是否有困難。',
            management: '給予可預期的時程與穩定支持，變動前預先溝通，避免突發式壓力指令。',
            teamRole: '對方是團隊最可靠的長期後盾與協調樞紐，能有效承接穩定營運與跨組協助。'
        },
        C: {
            target: ARCHETYPE_PROFILES.C,
            overall: extTop === 'C'
                ? '雙方都重視邏輯與精準度，品質把關嚴格；需留意避免在完美細節上耗時過久。'
                : '對方看重事實、依據與風險控管，提案前先備妥數據與邏輯將大幅提升說服力。',
            communication: '提出具體事實、數據與前因後果，減少誇飾或情緒性說詞，給予充分檢視時間。',
            management: '明確訂定驗收標準與專業規範，尊重其對品質的堅持並協助對焦商業優先序。',
            teamRole: '對方擅長制度設計、品質把關與風險預警，能有效補足快節奏團隊的盲點。'
        }
    };
}

/**
 * 完整計算單一 24 題作答結果
 */
export function computeFullAssessment(answers) {
    if (!Array.isArray(answers) || answers.length !== QUESTIONS_V2.length) {
        throw new Error(`需要完整 ${QUESTIONS_V2.length} 題作答資料`);
    }
    const mostCounts = { D: 0, I: 0, S: 0, C: 0 };
    const leastCounts = { D: 0, I: 0, S: 0, C: 0 };

    answers.forEach((ans, idx) => {
        if (!ans || !mostCounts.hasOwnProperty(ans.most) || !leastCounts.hasOwnProperty(ans.least) || ans.most === ans.least) {
            throw new Error(`第 ${idx + 1} 題作答資料無效`);
        }
        mostCounts[ans.most]++;
        leastCounts[ans.least]++;
    });

    const external = {};
    const internal = {};
    const summary = {};
    const shift = {};
    const tensionFactors = {};

    for (const k of ['D', 'I', 'S', 'C']) {
        external[k] = normMost(mostCounts[k]);
        internal[k] = normLeast(leastCounts[k]);
        summary[k] = round((external[k] + internal[k]) / 2);
        shift[k] = external[k] - internal[k];
        tensionFactors[k] = Math.abs(shift[k]);
    }

    let primaryFactor = 'D', maxTension = -1, totalTension = 0;
    for (const k of ['D', 'I', 'S', 'C']) {
        totalTension += tensionFactors[k];
        if (tensionFactors[k] > maxTension) {
            maxTension = tensionFactors[k];
            primaryFactor = k;
        }
    }
    const avgTension = totalTension / 4;
    const adaptability = clamp(round(100 - avgTension * 1.15), 15, 95);

    const internalStyle = computeStylePoint(internal);
    const externalStyle = computeStylePoint(external);
    const styleArchetype = resolveStyleArchetype(summary);
    const traits = computeTraits(internal, external);

    const result = {
        assessment_version: 'v2_ipsative',
        mostCounts,
        leastCounts,
        internal,
        external,
        summary,
        shift,
        graph_shape: {
            internal: getGraphShape(internal),
            external: getGraphShape(external),
            summary: getGraphShape(summary)
        },
        primary_type: getPrimaryType(summary),
        adaptability,
        tension: {
            factors: tensionFactors,
            primaryFactor,
            maxTension,
            avgTension: round(avgTension),
            direction: shift[primaryFactor] >= 0 ? '向上調適' : '向下收斂'
        },
        style: {
            ...styleArchetype,
            internalPoint: internalStyle,
            externalPoint: externalStyle
        },
        traits
    };

    result.textualSections = buildTextualSections(result);
    result.relationshipKeynotes = buildRelationshipKeynotes(external);
    return result;
}

/**
 * 1 對 1 兩人關係比較分析（供 Stage 2 / 工具共用）
 */
export function comparePairwise(recordA, recordB) {
    const getScores = r => r.summary || {
        D: Number(r.d_score) || 0,
        I: Number(r.i_score) || 0,
        S: Number(r.s_score) || 0,
        C: Number(r.c_score) || 0
    };
    const sA = getScores(recordA);
    const sB = getScores(recordB);
    const diff = {};
    let totalDiff = 0;
    for (const k of ['D', 'I', 'S', 'C']) {
        diff[k] = sA[k] - sB[k];
        totalDiff += Math.abs(diff[k]);
    }
    const similarity = clamp(round(100 - totalDiff / 4), 0, 100);
    return { sA, sB, diff, similarity };
}

/**
 * 職缺理想模型配對分數計算（mode: 'recruit' 比對內在, 'appraisal' 比對綜合）
 */
export function computeJobMatch(record, targetScores, mode = 'appraisal') {
    const fallback = {
        D: Number(record.d_score) || 0,
        I: Number(record.i_score) || 0,
        S: Number(record.s_score) || 0,
        C: Number(record.c_score) || 0
    };
    const s = mode === 'recruit'
        ? (record.internal || record.summary || fallback)
        : (record.summary || fallback);
    let absErr = 0;
    for (const k of ['D', 'I', 'S', 'C']) {
        absErr += Math.abs((s[k] || 0) - (Number(targetScores[k]) || 50));
    }
    return clamp(round(100 - absErr / 3.2), 0, 100);
}

export const DEFAULT_JOB_TEMPLATES = [
    { name: '業務開發 / BD', target: { D: 78, I: 82, S: 36, C: 38 }, desc: '高主動開拓、善於社交說服、節奏快速' },
    { name: '專案經理 / PM', target: { D: 70, I: 66, S: 58, C: 74 }, desc: '兼具推動進度、跨部門協調與風險管控' },
    { name: '研發 / 技術工程師', target: { D: 48, I: 34, S: 62, C: 86 }, desc: '高度重視精準邏輯、系統品質與專注穩定' },
    { name: '客戶成功 / 營運支援', target: { D: 36, I: 64, S: 82, C: 60 }, desc: '耐心傾聽、友善溝通並維持長期穩定服務' },
    { name: '部門主管 / 管理職', target: { D: 80, I: 68, S: 50, C: 64 }, desc: '目標決斷、激勵團隊並兼顧制度落實' }
];

function extractLayerScores(rec, layer = 'summary') {
    const fallback = {
        D: Number(rec?.d_score) || 0,
        I: Number(rec?.i_score) || 0,
        S: Number(rec?.s_score) || 0,
        C: Number(rec?.c_score) || 0
    };
    if (layer === 'internal') return rec?.internal || rec?.summary || fallback;
    if (layer === 'external') return rec?.external || rec?.summary || fallback;
    return rec?.summary || fallback;
}

function extractSummaryScores(rec) {
    return extractLayerScores(rec, 'summary');
}

/**
 * 1 對 1 深度關係互動分析（對齊 DISCUS relationships.php：支援內在/外在/總結與正式/非正式風格）
 */
export function buildPairwiseAnalysis(recA, recB, options = {}) {
    const { layer = 'internal', tone = 'formal' } = options;
    const sA = extractLayerScores(recA, layer);
    const sB = extractLayerScores(recB, layer);
    const diff = {};
    let totalDiff = 0;
    for (const k of ['D', 'I', 'S', 'C']) {
        diff[k] = (sA[k] || 0) - (sB[k] || 0);
        totalDiff += Math.abs(diff[k]);
    }
    const similarity = clamp(round(100 - totalDiff / 4), 0, 100);
    const topA = getPrimaryType(sA);
    const topB = getPrimaryType(sB);

    const paceA = (sA.D + sA.I) - (sA.S + sA.C);
    const paceB = (sB.D + sB.I) - (sB.S + sB.C);
    const paceGap = Math.abs(paceA - paceB);

    let dynamics = '平衡互補型合作';
    if (similarity >= 78) dynamics = '高度相似型（默契快，但需留意相同盲點）';
    else if (paceGap >= 50) dynamics = '快慢節奏差異型（需主動對齊決策速度與溝通期待）';
    else if (topA !== topB) dynamics = '職能互補型（視角多元，分工明確可發揮綜效）';

    const nameA = recA?.taker_name || '人員 A';
    const nameB = recB?.taker_name || '人員 B';

    const synergyPoints = [];
    const frictionPoints = [];
    for (const k of ['D', 'I', 'S', 'C']) {
        const d = diff[k];
        if (Math.abs(d) <= 12) {
            synergyPoints.push(`${FACTOR_META[k].name} (${k}) 數值接近（差距 ${Math.abs(d)} 分），在此維度容易自然對焦。`);
        } else if (Math.abs(d) >= 25) {
            const higher = d > 0 ? nameA : nameB;
            const lower = d > 0 ? nameB : nameA;
            frictionPoints.push(`${FACTOR_META[k].name} (${k}) 落差達 ${Math.abs(d)} 分：${higher} 明顯高於 ${lower}，合作時容易產生標準或節奏期待落差。`);
        }
    }
    if (!synergyPoints.length) synergyPoints.push('雙方在各維度偏向不同優勢，適合明確分工各自負責擅長環節。');
    if (!frictionPoints.length) frictionPoints.push('雙方無極端分數衝突，溝通摩擦風險低，建議定期對齊目標優先順序即可。');

    const tipForTarget = (targetTop, targetName) => {
        if (targetTop === 'D') return `與 ${targetName} 協作時，請先講結論與實質效益，避免過長鋪陳，並給對方清楚的決策主導空間。`;
        if (targetTop === 'I') return `與 ${targetName} 協作時，先保持開放友善互動並肯定其點子，討論後再補上書面待辦清單對齊細節。`;
        if (targetTop === 'S') return `與 ${targetName} 協作時，請提前說明背景與時程期待，語氣溫和誠懇，避免臨時高壓催促。`;
        return `與 ${targetName} 協作時，請備妥具體事實、數據依據與明確規範，並預留合理時間讓對方檢視細節。`;
    };

    const buildPerspective = (selfName, selfS, selfTop, otherName, otherS, otherTop) => {
        const informal = tone === 'informal';
        const refSelf = informal ? '你' : selfName;
        const refOther = otherName;
        const pSelf = (selfS.D + selfS.I) - (selfS.S + selfS.C);
        const pOther = (otherS.D + otherS.I) - (otherS.S + otherS.C);
        const dGap = selfS.D - otherS.D;
        const iGap = selfS.I - otherS.I;
        const sGap = selfS.S - otherS.S;
        const cGap = selfS.C - otherS.C;

        const keynotes = [
            Math.abs(dGap) >= 22
                ? `${dGap > 0 ? refSelf : refOther} 在主導決策上明顯較強勢，需事先界定誰負責拍板與授權範圍。`
                : `雙方在權責主導度上較為接近，容易取得決策節奏的共識。`,
            Math.abs(iGap) >= 22
                ? `${iGap > 0 ? refSelf : refOther} 偏好口頭熱絡討論，${iGap > 0 ? refOther : refSelf} 偏向精簡務實對焦，會議後應留下文字結論。`
                : `雙方互動溫度與表達風格相近，日常溝通不容易產生隔閡。`,
            Math.abs(sGap) >= 22
                ? `面對變動或急件時，${sGap < 0 ? refSelf : refOther} 傾向快速切換，另一方則需要清楚的緩衝與步驟說明。`
                : `兩人對工作穩定度與節奏的耐受度一致，長期配合容易維持穩健步調。`,
            Math.abs(cGap) >= 22
                ? `${cGap > 0 ? refSelf : refOther} 十分要求細節與數據依據，建議提案時兼顧效率與檢查清單。`
                : `雙方對品質細節與規範標準的期待相當一致，驗收落差低。`
        ];

        const paragraphs = [
            `【社交與溝通互動】${refSelf}（${FACTOR_META[selfTop].name}）與 ${refOther}（${FACTOR_META[otherTop].name}）合作時，${
                selfS.I >= 55 && otherS.I >= 55
                    ? '雙方都能快速開啟話題並營造正向氣氛，但討論結束前務必確認具體負責人與期限，避免只停留在發想階段。'
                    : selfS.I < 45 && otherS.I < 45
                        ? '兩人都偏重實質內容與專業邏輯，對話精簡有效率，可適度增加正向回饋讓協作關係更有溫度。'
                        : `${selfS.I > otherS.I ? refSelf : refOther} 主動發聲帶動交流時，宜多留時間傾聽另一方的完整思考再做總結。`
            }`,
            `【步調與耐心摩擦】${
                Math.abs(pSelf - pOther) >= 40
                    ? `${pSelf > pOther ? refSelf : refOther} 行動節奏明顯更快、急於看到結果；${pSelf > pOther ? refOther : refSelf} 則重視周延思考與穩定秩序。建議把任務拆成「先求方向共識，再分階段落地」以減少催促焦慮。`
                    : `兩人的整體行動速度與耐性落差不大，在專案推進時不易因快慢不一而產生煩躁感。`
            }`,
            `【壓力下的協作反應】當專案進入高壓趕工期，${refSelf} 容易展現出高 ${FACTOR_META[selfTop].short} 的本能反應，而 ${refOther} 則偏向以 ${FACTOR_META[otherTop].short} 方式應對。${
                selfTop === 'D' && otherTop === 'S'
                    ? `${refSelf} 若語氣過急容易讓 ${refOther} 選擇沉默退讓，應改用明確且支持性的問句確認對方困難。`
                    : selfTop === 'S' && otherTop === 'D'
                        ? `面對 ${refOther} 的直接催促，${refSelf} 可先直接回報進度與卡關點，不必過度承受情緒壓力。`
                        : `雙方若能事前約定「對事不對人」的檢核節點，即可有效降低壓力期的誤解。`
            }`,
            `【時間管理與交付標準】${
                cGap >= 20
                    ? `${refSelf} 對結構與細節零失誤的要求較高，與 ${refOther} 協作時建議提前發放清楚規格與驗收表，減少來回返工。`
                    : cGap <= -20
                        ? `${refOther} 對精準度與事前規劃要求嚴格，${refSelf} 在匯報進度時備妥佐證資料與時程表將大幅提升信任感。`
                        : `雙方對時程控制與完成品質的認定接近，適合共同訂定里程碑並依序交付。`
            }`
        ];

        return { keynotes, paragraphs };
    };

    return {
        layer,
        tone,
        sA,
        sB,
        diff,
        similarity,
        topA,
        topB,
        dynamics,
        synergyPoints,
        frictionPoints,
        aToB: tipForTarget(topB, nameB),
        bToA: tipForTarget(topA, nameA),
        perspectiveA: buildPerspective(nameA, sA, topA, nameB, sB, topB),
        perspectiveB: buildPerspective(nameB, sB, topB, nameA, sA, topA)
    };
}

/**
 * 團隊動力分析（對齊 DISCUS teams.php & team-report.php 完整 8 大模組）
 */
export function analyzeTeam(members, options = {}) {
    const list = Array.isArray(members) ? members : [];
    const count = list.length;
    const { leaderId = '', includePotentialLeaders = true } = options;

    if (count === 0) {
        return {
            count: 0,
            avg: { D: 0, I: 0, S: 0, C: 0 },
            distribution: { D: 0, I: 0, S: 0, C: 0 },
            potentialLeaders: [],
            blindSpots: [],
            strengths: [],
            memberRoles: [],
            polarityFactors: [],
            structure: null,
            keynotes: [],
            dynamics: [],
            teamSubFactors: [],
            roleBreakdown: [],
            leadershipAnalysis: null,
            memberSummaries: []
        };
    }

    const sum = { D: 0, I: 0, S: 0, C: 0 };
    const distribution = { D: 0, I: 0, S: 0, C: 0 };
    const roleLabelMap = {
        D: '主導者（開創推動）',
        I: '社會者（溝通影響）',
        S: '管理者（穩定協調）',
        C: '製造者（品質分析）'
    };

    const memberRoles = list.map(rec => {
        const s = extractSummaryScores(rec);
        const top = getPrimaryType(s);
        for (const k of ['D', 'I', 'S', 'C']) sum[k] += s[k];
        distribution[top]++;
        const leaderScore = round(s.D * 0.55 + s.I * 0.30 + s.C * 0.15);
        const isPotentialLeader = s.D >= 62 || (s.D >= 55 && s.I >= 55);
        const pt = computeStylePoint(s);
        return {
            id: rec.id,
            name: rec.taker_name || '未命名',
            dept: rec.dept || '—',
            title: rec.title || '—',
            created_at: rec.created_at || '',
            primary: top,
            roleLabel: roleLabelMap[top],
            scores: s,
            leaderScore,
            isPotentialLeader,
            point: pt
        };
    });

    const avg = {
        D: round(sum.D / count),
        I: round(sum.I / count),
        S: round(sum.S / count),
        C: round(sum.C / count)
    };

    const leaderMember = memberRoles.find(m => m.id === leaderId) || null;
    const potentialLeaders = [...memberRoles]
        .filter(m => m.isPotentialLeader && m.id !== leaderId)
        .sort((a, b) => b.leaderScore - a.leaderScore);

    const strengths = [];
    const blindSpots = [];
    for (const k of ['D', 'I', 'S', 'C']) {
        if (distribution[k] === 0 && avg[k] < 45) {
            blindSpots.push(`缺少「${FACTOR_META[k].name} (${k})」主軸成員（平均 ${avg[k]} 分）：${
                k === 'D' ? '團隊可能較缺乏果斷拍板與強勢推進動能' :
                k === 'I' ? '團隊可能較缺乏對外熱情宣導與活絡氣氛角色' :
                k === 'S' ? '團隊在長線耐力、內部協調與穩定度上較脆弱' :
                '團隊較容易忽略流程規範、風險檢查與數據把關'
            }。`);
        } else if (avg[k] >= 58 || distribution[k] / count >= 0.4) {
            strengths.push(`「${FACTOR_META[k].name} (${k})」能量充沛（平均 ${avg[k]} 分，主力 ${distribution[k]} 人）。`);
        }
    }
    if (!strengths.length) strengths.push('團隊四型能量分佈均衡，具備多元視角與彈性調適空間。');
    if (!blindSpots.length) blindSpots.push('團隊在 D/I/S/C 四個象限均有代表或足夠覆蓋，結構完整。');

    // 1. 團隊 4 大極性因素 (Polarity Factors — 對齊 team-report.php)
    const dirPct = clamp(round(50 + (avg.D - avg.S) * 0.6), 10, 90);
    const comPct = clamp(round(50 + (avg.I - avg.C) * 0.6), 10, 90);
    const stdPct = clamp(round(50 + (avg.S - (avg.D + avg.I) / 2) * 0.6), 10, 90);
    const effPct = clamp(round(50 + (avg.C - avg.I) * 0.6), 10, 90);
    const statusOf = v => (v >= 62 || v <= 38) ? 'warn' : (v >= 55 || v <= 45) ? 'mid' : 'ok';

    const polarityFactors = [
        { left: '指示', right: '參與', leftPct: dirPct, rightPct: 100 - dirPct, status: statusOf(dirPct) },
        { left: '溝通', right: '專注', leftPct: comPct, rightPct: 100 - comPct, status: statusOf(comPct) },
        { left: '穩定', right: '通融', leftPct: stdPct, rightPct: 100 - stdPct, status: statusOf(stdPct) },
        { left: '效率', right: '隨機應變', leftPct: effPct, rightPct: 100 - effPct, status: statusOf(effPct) }
    ];

    // 2. 團隊結構 metrics
    const avgTop = getPrimaryType(avg);
    const spread = Math.max(avg.D, avg.I, avg.S, avg.C) - Math.min(avg.D, avg.I, avg.S, avg.C);
    const teamStyle = spread <= 14
        ? '均衡（多元互補）'
        : avgTop === 'D' ? '開創推進型團隊'
        : avgTop === 'I' ? '影響溝通型團隊'
        : avgTop === 'S' ? '穩健協作型團隊'
        : '謹慎精密型團隊';

    const structure = {
        teamStyle,
        leaderName: leaderMember ? leaderMember.name : '未指定領導者',
        memberCount: count,
        uniqueRelationships: round((count * (count - 1)) / 2),
        uniquePerspectives: count * (count - 1),
        paragraphs: [
            `本團隊目前共有 ${count} 位成員，形成 ${round((count * (count - 1)) / 2)} 組雙向關係與 ${count * (count - 1)} 個互動觀點，整體呈現「${teamStyle}」特徵（平均 D:${avg.D} / I:${avg.I} / S:${avg.S} / C:${avg.C}）。`,
            `${leaderMember ? `現任指定領導者為「${leaderMember.name}」（${FACTOR_META[leaderMember.primary].name}），` : '目前尚未指定正式領導者，'}建議依據下方「角色分解」分配推進、溝通、協調與品管職責，可大幅減少角色重疊或盲區。`
        ]
    };

    // 3. 團隊基本精神 & 重要團隊動力
    const keynotes = [
        ...strengths,
        ...blindSpots,
        `團隊整體對外溝通偏向「${comPct >= 50 ? '開放交流討論' : '專注任務與事實'}」，決策偏向「${dirPct >= 50 ? '快速指示推進' : '全員參與共識'}」。`
    ];

    const dynamics = [
        `【溝通與會議氣氛】團隊平均 I=${avg.I}、C=${avg.C}，${avg.I >= avg.C ? '會議討論氣氛相對開放活潑，點子產出快，但需指派專人紀錄決議並追蹤落實。' : '團隊重視事實根據與邏輯順序，討論較為冷靜克制，可適度鼓勵不同立場成員主動發言。'}`,
        `【衝突與壓力應對】團隊平均 D=${avg.D}、S=${avg.S}，${avg.D > avg.S + 15 ? '成員直接坦率、追求突破，意見衝突時較容易正面交鋒，需由主持人對齊共同目標。' : avg.S > avg.D + 15 ? '團隊重視表面和諧與關係維護，遇到分歧時可能傾向避開衝突，重要決議需主動確認真實反對意見。' : '團隊在果斷推進與維持和諧之間取得不錯平衡，能務實面對議題差異。'}`,
        `【執行標準與彈性】團隊平均 C=${avg.C}，${avg.C >= 55 ? '規範意識與品質門檻高，流程風險控管佳，須留意面對臨時市場變化時的應變速度。' : '團隊對任務變動的適應力強，但跨階段交付前建議建立標準檢核表避免遺漏細節。'}`
    ];

    // 4. 團隊次因子（6 組雙極性 0–100）
    const teamSubFactors = [
        { left: '獨裁的', right: '民主的', value: clamp(round(50 + ((avg.S + avg.I) - avg.D * 1.3) / 2), 8, 92), theme: avg.D >= 60 ? '專制主導' : '參與共識' },
        { left: '非正式的', right: '有組織的', value: clamp(round(50 + (avg.C - avg.I) * 0.7), 8, 92), theme: avg.C >= 55 ? '結構秩序' : '非正式彈性' },
        { left: '冒險進取的', right: '反應謹慎的', value: clamp(round(50 + ((avg.S + avg.C) - (avg.D + avg.I)) * 0.45), 8, 92), theme: avg.D + avg.I >= 110 ? '冒險進取' : '審慎穩健' },
        { left: '靈活變通的', right: '可靠一致的', value: clamp(round(50 + (avg.S - avg.D) * 0.65), 8, 92), theme: avg.S >= 55 ? '穩定可靠' : '靈活突破' },
        { left: '自決果斷的', right: '堅持原則的', value: clamp(round(50 + (avg.C - avg.D) * 0.65), 8, 92), theme: avg.D >= avg.C ? '自決果斷' : '原則把關' },
        { left: '善社交的', right: '獨立專注的', value: clamp(round(50 + (avg.C - avg.I) * 0.65), 8, 92), theme: avg.I >= 55 ? '活動社交' : '獨立專注' }
    ];

    // 5. 團隊角色分解（4 大職能角色）
    const roleSpecs = [
        {
            key: 'D',
            title: '主導者',
            desc: '驅動方向、承擔風險並快速推進目標突破',
            behaviors: ['主動發起變革', '果斷做出決策', '克服阻礙達標'],
            orientations: { pace: '動態的', scope: '概要', focus: '事件' }
        },
        {
            key: 'I',
            title: '社會者',
            desc: '串聯跨部門人脈、帶動熱情與對外影響力',
            behaviors: ['營造正向氣氛', '說服溝通協作', '激發團隊創意'],
            orientations: { pace: '動態的', scope: '概要', focus: '人' }
        },
        {
            key: 'S',
            title: '管理者',
            desc: '維持運作穩定、協調衝突與長期支援落地',
            behaviors: ['穩定日常節奏', '傾聽並凝聚共識', '主動支援補位'],
            orientations: { pace: '深思熟慮的', scope: '細節的', focus: '人' }
        },
        {
            key: 'C',
            title: '製造者',
            desc: '建立專業標準、風險控管與確保零瑕疵交付',
            behaviors: ['嚴謹數據分析', '檢核流程規範', '確保品質一致'],
            orientations: { pace: '深思熟慮的', scope: '細節的', focus: '事件' }
        }
    ];

    const roleBreakdown = roleSpecs.map(spec => ({
        ...spec,
        color: FACTOR_META[spec.key].color,
        members: memberRoles.filter(m => m.primary === spec.key)
    }));

    // 6. 領導能力分析（團隊需求 vs 領導供給）
    const leaderS = leaderMember ? leaderMember.scores : avg;
    const leadershipRequirements = [
        {
            label: '責任 / 尊重（明確授權與結果負責）',
            teamNeed: clamp(round(40 + avg.D * 0.55), 15, 95),
            leaderSupply: clamp(round(40 + leaderS.D * 0.55), 15, 95)
        },
        {
            label: '讚揚 / 欣賞（正向回饋與激勵溝通）',
            teamNeed: clamp(round(40 + avg.I * 0.55), 15, 95),
            leaderSupply: clamp(round(40 + leaderS.I * 0.55), 15, 95)
        },
        {
            label: '耐心 / 持續（穩定節奏與情緒包容）',
            teamNeed: clamp(round(40 + avg.S * 0.55), 15, 95),
            leaderSupply: clamp(round(40 + leaderS.S * 0.55), 15, 95)
        },
        {
            label: '細節 / 解釋（清楚規範與邏輯說明）',
            teamNeed: clamp(round(40 + avg.C * 0.55), 15, 95),
            leaderSupply: clamp(round(40 + leaderS.C * 0.55), 15, 95)
        }
    ];

    const leadershipAnalysis = {
        hasLeader: Boolean(leaderMember),
        leader: leaderMember,
        generalStyle: leaderMember
            ? `「${leaderMember.name}」為 ${FACTOR_META[leaderMember.primary].name} 領導者（D:${leaderS.D} / I:${leaderS.I} / S:${leaderS.S} / C:${leaderS.C}），習慣以「${roleLabelMap[leaderMember.primary]}」方式帶領團隊。面對本團隊結構，建議特別留意需求與供給落差超過 15 分的項目並刻意補強。`
            : '尚未於成員名單中指定「團隊領導者」；目前以團隊平均行為做為參考基準，指定領導者後將顯示精準的「團隊需求 vs 領導供給」落差分析。',
        requirements: leadershipRequirements,
        potentialLeaders: includePotentialLeaders ? potentialLeaders : []
    };

    // 7. 團隊成員個別摘要（5 點團隊基本精神）
    const memberSummaries = memberRoles.map(m => {
        const isL = m.id === leaderId;
        const bullets = [
            `在團隊中自然扮演「${m.roleLabel}」角色。`,
            m.scores.D >= 60 ? '能勇於承擔推進壓力，適合負責關鍵決策與攻堅。' : '不強求個人主導權，樂於在明確方向下分工合作。',
            m.scores.I >= 60 ? '擅長帶動會議氣氛與跨單位溝通，是團隊的潤滑劑。' : '溝通務實精簡，較專注於任務本質。',
            m.scores.S >= 60 ? '抗壓穩定度高，能長期維持團隊和諧與信任感。' : '喜歡變化與快速反饋，適合動態調整型任務。',
            m.scores.C >= 60 ? '重視細節與流程標準，能替團隊把關品質與風險。' : '重視大方向與執行速度，不喜過於繁複的限制。'
        ];
        return { ...m, isLeader: isL, bullets };
    });

    return {
        count,
        avg,
        distribution,
        potentialLeaders,
        blindSpots,
        strengths,
        memberRoles,
        polarityFactors,
        structure,
        keynotes,
        dynamics,
        teamSubFactors,
        roleBreakdown,
        leadershipAnalysis,
        memberSummaries
    };
}

/**
 * 職缺模型與受測者適配度排序
 */
/**
 * 職缺模型與受測者適配度排序（支援招募新人/在職評估、最低門檻、部門與效期篩選）
 */
export function rankCandidatesForJob(records, targetScores, options = {}) {
    const { mode = 'appraisal', minMatch = 0, dept = '', recencyYears = 0 } = options;
    const cutoffMs = recencyYears > 0 ? Date.now() - recencyYears * 365.25 * 24 * 3600 * 1000 : 0;

    return (Array.isArray(records) ? records : [])
        .filter(rec => {
            if (dept && (rec.dept || '').trim() !== dept) return false;
            if (cutoffMs && rec.created_at) {
                const ts = Date.parse(rec.created_at);
                if (!Number.isNaN(ts) && ts < cutoffMs) return false;
            }
            return true;
        })
        .map(rec => {
            const fallback = extractSummaryScores(rec);
            const s = mode === 'recruit' ? (rec.internal || rec.summary || fallback) : fallback;
            const matchPct = computeJobMatch(rec, targetScores, mode);
            const gaps = {
                D: s.D - (Number(targetScores.D) || 50),
                I: s.I - (Number(targetScores.I) || 50),
                S: s.S - (Number(targetScores.S) || 50),
                C: s.C - (Number(targetScores.C) || 50)
            };
            return {
                id: rec.id,
                name: rec.taker_name || '未命名',
                dept: rec.dept || '—',
                title: rec.title || '—',
                org: rec.company_name || rec.org || '—',
                primary: getPrimaryType(s),
                scores: s,
                gaps,
                matchPct,
                created_at: rec.created_at || ''
            };
        })
        .filter(r => r.matchPct >= minMatch)
        .sort((a, b) => b.matchPct - a.matchPct);
}

/**
 * 24 題強迫選擇工作分析問卷（對齊 DISCUS jpquest.php：每題選 1 個高、1 個低）
 */
export const JOB_QUESTIONNAIRE = [
    { stem: '職務核心行動要求', options: [{ text: '須敢於承擔風險並快速推進成果', type: 'D' }, { text: '須積極對外互動並建立正向人脈', type: 'I' }, { text: '須在群體中促成團隊合作與和諧', type: 'S' }, { text: '須嚴格控管流程細節與合規標準', type: 'C' }] },
    { stem: '日常溝通主要型態', options: [{ text: '直接要求進度與談判合作條件', type: 'D' }, { text: '說服推廣想法並炒熱合作氣氛', type: 'I' }, { text: '耐心傾聽同事與客戶的實際困擾', type: 'S' }, { text: '撰寫嚴謹報告與核對精準數據', type: 'C' }] },
    { stem: '面對工作目標與考核', options: [{ text: '以高挑戰性的績效突破為首要任務', type: 'D' }, { text: '透過影響力與口碑擴大外部認可', type: 'I' }, { text: '維持穩定且長期的服務與交付品質', type: 'S' }, { text: '確保專案執行零失誤與高正確率', type: 'C' }] },
    { stem: '授權與自主程度', options: [{ text: '需要自行拍板做決定並主導資源', type: 'D' }, { text: '需要彈性發揮創意與臨場應變', type: 'I' }, { text: '需要遵循既有分工並支援夥伴', type: 'S' }, { text: '需要依據完整規範與邏輯進行檢核', type: 'C' }] },
    { stem: '任務變化頻率', options: [{ text: '經常要破舊立新、主動發起變革', type: 'D' }, { text: '任務多元多變，需保持熱情與活力', type: 'I' }, { text: '作業節奏穩定規律，變動幅度低', type: 'S' }, { text: '變動前需經完整評估與標準化驗證', type: 'C' }] },
    { stem: '處理衝突或客訴情境', options: [{ text: '果斷捍衛立場並迅速給出解決指令', type: 'D' }, { text: '用親和力與正面溝通化解尷尬局面', type: 'I' }, { text: '保持冷靜體諒，致力撫平雙方情緒', type: 'S' }, { text: '調閱事實證據並釐清責任與規則', type: 'C' }] },
    { stem: '跨部門協作角色', options: [{ text: '擔任專案推手，要求各單位準時達標', type: 'D' }, { text: '擔任對外窗口與跨組溝通潤滑劑', type: 'I' }, { text: '擔任穩定後盾，協助補位與長期配合', type: 'S' }, { text: '擔任把關幕僚，檢查邏輯與潛在風險', type: 'C' }] },
    { stem: '時間壓力與交期', options: [{ text: '常處於高壓急件環境，講求速度優先', type: 'D' }, { text: '多任務並行，靠靈活協調應付時程', type: 'I' }, { text: '步調平穩可預期，注重持久耐力', type: 'S' }, { text: '須預留時間反覆校對以防趕工出錯', type: 'C' }] },
    { stem: '說服與影響他人方式', options: [{ text: '以明確利害與直接結論促成對方行動', type: 'D' }, { text: '以個人魅力、故事與熱情帶動他人', type: 'I' }, { text: '以真誠陪伴與長期信任慢慢感化', type: 'S' }, { text: '以客觀統計、圖表與專業分析說服', type: 'C' }] },
    { stem: '對規則與 SOP 的態度', options: [{ text: '為求效率必要時須敢於簡化或突破', type: 'D' }, { text: '規則僅作參考，視人際與情境彈性處理', type: 'I' }, { text: '照既定流程穩定執行最能發揮戰力', type: 'S' }, { text: '所有步驟皆須嚴格遵守、不得隨意省略', type: 'C' }] },
    { stem: '團隊管理／帶人期待', options: [{ text: '明確指派目標並嚴格追蹤產出結果', type: 'D' }, { text: '公開讚美激勵團隊士氣與凝聚熱情', type: 'I' }, { text: '細心照顧成員狀態並提供穩定支持', type: 'S' }, { text: '建立清楚制度與可量化的品質指標', type: 'C' }] },
    { stem: '對內與對外互動比例', options: [{ text: '需主導外部談判或商業開發攻堅', type: 'D' }, { text: '需頻繁接待拜訪、演講或社交公關', type: 'I' }, { text: '以內部穩定團隊或熟客維繫為主', type: 'S' }, { text: '以獨立研究、系統建置或文件審核為主', type: 'C' }] },
    { stem: '問題解決思考方式', options: [{ text: '抓大放小，先採取行動邊做邊修正', type: 'D' }, { text: '找人腦力激盪，從多元討論找靈感', type: 'I' }, { text: '參考過去成功經驗，選擇最穩妥做法', type: 'S' }, { text: '系統性拆解根本原因並驗證假設', type: 'C' }] },
    { stem: '面臨不確定資訊時', options: [{ text: '憑魄力與經驗直接做出判斷前進', type: 'D' }, { text: '樂觀相信團隊應變能力並先行溝通', type: 'I' }, { text: '先與相關人員確認共識再小步嘗試', type: 'S' }, { text: '要求補齊數據資料並評估所有風險', type: 'C' }] },
    { stem: '文書與細節負荷度', options: [{ text: '重點在於決策成果，瑣碎行政可交辦', type: 'D' }, { text: '偏重口頭表達與人際串聯，少文書', type: 'I' }, { text: '按固定表單流程穩定填寫與歸檔', type: 'S' }, { text: '大量數據核對、合約條文或技術規格', type: 'C' }] },
    { stem: '工作節奏偏好', options: [{ text: '快狠準，期待立即看見成效回饋', type: 'D' }, { text: '輕快有變化，喜歡熱鬧互動的工作日', type: 'I' }, { text: '從容有序，不喜歡天天救火突發', type: 'S' }, { text: '專注深入，需要安靜不被打斷的時段', type: 'C' }] },
    { stem: '面對外部市場或競爭', options: [{ text: '需要強烈的企圖心與不服輸的戰意', type: 'D' }, { text: '需要敏銳的人際感染力與話題營造', type: 'I' }, { text: '需要可靠的售後服務與高客戶留存', type: 'S' }, { text: '需要無可挑剔的產品專業與合規度', type: 'C' }] },
    { stem: '資訊傳遞精準度要求', options: [{ text: '只要大方向與結果明確即可', type: 'D' }, { text: '重在讓聽眾聽懂並產生共鳴興趣', type: 'I' }, { text: '確保團隊每個人都清楚自身分工', type: 'S' }, { text: '用字遣詞與數字定義必須百分百精確', type: 'C' }] },
    { stem: '工作挫折容忍來源', options: [{ text: '能承受強硬競爭與目標落空的挑戰', type: 'D' }, { text: '能承受頻繁被拒絕後迅速恢復熱情', type: 'I' }, { text: '能承受長時間重複作業而不感到焦躁', type: 'S' }, { text: '能承受反覆檢查挑錯的枯燥與壓力', type: 'C' }] },
    { stem: '會議中扮演的功能', options: [{ text: '收斂議題並做出最終拍板決議', type: 'D' }, { text: '提出創意點子與帶動與會者參與', type: 'I' }, { text: '傾聽整合不同立場並促成共識', type: 'S' }, { text: '指出方案盲點、成本與法規風險', type: 'C' }] },
    { stem: '建立專業信任的途徑', options: [{ text: '展現關鍵時刻扛起責任的能力', type: 'D' }, { text: '展現親切好聊與樂於分享的特質', type: 'I' }, { text: '展現長期守信與說到做到的穩定度', type: 'S' }, { text: '展現紮實專業知識與零瑕疵交付', type: 'C' }] },
    { stem: '自我驅動與監督需求', options: [{ text: '高度自我驅動，反感被過度微觀管理', type: 'D' }, { text: '需要正向鼓勵與舞台展現來維持動力', type: 'I' }, { text: '有明確主管指導與夥伴協同表現最佳', type: 'S' }, { text: '依循專業準則獨立自律完成高品質工作', type: 'C' }] },
    { stem: '資源有限時的取捨', options: [{ text: '集中火力搶攻最關鍵的突破口', type: 'D' }, { text: '靈活尋求外部合作與人脈資源交換', type: 'I' }, { text: '優先保護團隊現有運作不致失衡', type: 'S' }, { text: '精算投資報酬率並刪減低效支出', type: 'C' }] },
    { stem: '這個職位最不能接受的人選缺陷', options: [{ text: '優柔寡斷、不敢下決定或缺乏魄力', type: 'D' }, { text: '冷漠孤僻、不擅表達或讓人有距離感', type: 'I' }, { text: '急躁衝動、製造衝突或流動率高', type: 'S' }, { text: '粗心大意、邏輯混亂或不遵守規範', type: 'C' }] }
];

export function computeJobProfileFromAnswers(answers) {
    if (!Array.isArray(answers) || answers.length !== JOB_QUESTIONNAIRE.length) {
        throw new Error(`請完成全部 ${JOB_QUESTIONNAIRE.length} 題工作問卷`);
    }
    const mostCounts = { D: 0, I: 0, S: 0, C: 0 };
    const leastCounts = { D: 0, I: 0, S: 0, C: 0 };
    answers.forEach((ans, idx) => {
        if (!ans || !mostCounts.hasOwnProperty(ans.most) || !leastCounts.hasOwnProperty(ans.least) || ans.most === ans.least) {
            throw new Error(`第 ${idx + 1} 題工作問卷作答無效`);
        }
        mostCounts[ans.most]++;
        leastCounts[ans.least]++;
    });
    const scores = {};
    for (const k of ['D', 'I', 'S', 'C']) {
        scores[k] = round((normMost(mostCounts[k]) + normLeast(leastCounts[k])) / 2);
    }
    return scores;
}

export const DISC_SUBFACTORS = [
    { key: 'DI', left: '效率', right: '友善', pair: ['D', 'I'] },
    { key: 'DS', left: '自動', right: '耐心', pair: ['D', 'S'] },
    { key: 'DC', left: '獨立', right: '配合', pair: ['D', 'C'] },
    { key: 'IS', left: '熱忱', right: '縝密', pair: ['I', 'S'] },
    { key: 'IC', left: '自信', right: '準確', pair: ['I', 'C'] },
    { key: 'SC', left: '堅持', right: '敏銳', pair: ['S', 'C'] }
];

export function deriveSubFactors(scores) {
    const out = {};
    DISC_SUBFACTORS.forEach(sf => {
        const [a, b] = sf.pair;
        out[sf.key] = clamp(round(50 + ((Number(scores[b]) || 50) - (Number(scores[a]) || 50)) / 2), 0, 100);
    });
    return out;
}

const JOB_TRAIT_GROUPS = [
    { key: 'D', title: '支配型特性', color: '#e74c3c', traits: [{ name: '效率', formulaName: '效率感' }, { name: '自動', formulaName: '主動性' }, { name: '獨立', formulaName: '獨立性' }] },
    { key: 'I', title: '影響型特性', color: '#f39c12', traits: [{ name: '友善', formulaName: '友善度' }, { name: '熱忱', formulaName: '熱忱' }, { name: '自信', formulaName: '自信' }] },
    { key: 'S', title: '穩健型特性', color: '#27ae60', traits: [{ name: '耐心', formulaName: '耐心' }, { name: '縝密', formulaName: '縝密度' }, { name: '堅持', formulaName: '堅持度' }] },
    { key: 'C', title: '服從／謹慎型特性', color: '#2980b9', traits: [{ name: '配合', formulaName: '配合度' }, { name: '準確', formulaName: '準確' }, { name: '敏銳', formulaName: '敏銳度' }] }
];

function levelLabel5(score) {
    if (score >= 82) return '非常高';
    if (score >= 62) return '高';
    if (score >= 42) return '中';
    if (score >= 22) return '低';
    return '非常低';
}

export function analyzeJobProfile(targetScores, meta = {}) {
    const s = {
        D: clamp(Number(targetScores?.D) || 50, 0, 100),
        I: clamp(Number(targetScores?.I) || 50, 0, 100),
        S: clamp(Number(targetScores?.S) || 50, 0, 100),
        C: clamp(Number(targetScores?.C) || 50, 0, 100)
    };
    const subFactors = { ...deriveSubFactors(s), ...(meta.subFactors || {}) };
    const primary = getPrimaryType(s);
    const shape = getGraphShape(s);

    // 12 項職位特性（對齊 jpr_report.php 四群 12 條進度條，並反映 6 個次因數微調）
    const formulaMap = Object.fromEntries(TRAIT_FORMULAS.map(t => [t.name, t]));
    const subAdj = {};
    DISC_SUBFACTORS.forEach(sf => {
        const val = Number(subFactors[sf.key] ?? 50);
        const delta = (val - 50) * 0.25;
        subAdj[sf.left] = (subAdj[sf.left] || 0) - delta;
        subAdj[sf.right] = (subAdj[sf.right] || 0) + delta;
    });

    const traitGroups = JOB_TRAIT_GROUPS.map(grp => ({
        key: grp.key,
        title: grp.title,
        color: grp.color,
        items: grp.traits.map(t => {
            const formula = formulaMap[t.formulaName];
            const base = formula ? formula.fn(s) : 50;
            const score = clamp(round(base + (subAdj[t.name] || 0)), 4, 96);
            return { name: t.name, score, level: levelLabel5(score) };
        })
    }));

    // 5 大行為關鍵字
    const keywords = [];
    if (s.D >= 62) keywords.push('果斷積極的'); else if (s.D <= 38) keywords.push('避免正面衝突');
    if (s.I >= 62) keywords.push('擅長溝通說服'); else if (s.I <= 38) keywords.push('務實安靜專注');
    if (s.S >= 62) keywords.push('穩定耐性協調'); else if (s.S <= 38) keywords.push('尋求多樣變化');
    if (s.C >= 62) keywords.push('嚴謹數據把關'); else if (s.C <= 38) keywords.push('靈活開放的');
    if (s.I >= 55 && s.S >= 55) keywords.push('通融友善的');
    else if (s.D >= 55 && s.I >= 55) keywords.push('主動影響領航');
    else if (s.D >= 55 && s.C >= 55) keywords.push('精準目標導向');
    else keywords.push('結構穩定推進');
    while (keywords.length < 5) keywords.push(`${FACTOR_META[primary].short}核心驅動`);

    const jobTitle = meta.name || '此職位';
    const textualSections = [
        {
            title: '一、權責、決策與目標導向',
            body: `「${jobTitle}」屬於以「${FACTOR_META[primary].name} (${primary})」為主軸的職務分析模型（分析表形式：${shape}）。${s.D >= 60 ? '此職務要求強烈的主導性與決策魄力，人選需具備獨力推進目標並承擔風險的能力。' : '此職務偏好團隊共識與穩健執行，不要求強勢主導，重視在明確架構下配合推進。'}`
        },
        {
            title: '二、工作節奏與變動適應',
            body: s.S <= 42
                ? `任務多變且節奏緊湊，需要能適應多樣化挑戰、在壓力下快速反應的人選；過於保守或依賴一成不變流程者較難勝任。`
                : `任務強調穩定持續性與耐心，人選需能維持長期一致的服務或執行水準，在可預期的節奏中把事情做深做穩。`
        },
        {
            title: '三、結構、細節與規範遵循',
            body: s.C >= 60
                ? `這個位置對準確度與制度合規有極高要求，人選必須細心縝密、重視證據與事前規劃，不可草率交差。`
                : `工作過程保留較大彈性，重在實質產出與互動推進，人選無須過度拘泥於繁複枝節，應保持行動靈活度。`
        },
        {
            title: '四、溝通、說服與人際展現',
            body: s.I >= 58
                ? `這個職位十分需要與人溝通。若要順利履行這項工作，人選必須在社交上十分有自信，擁有提供資訊及勸服他人的能力，並能良好地代表公司與團隊。`
                : `溝通方式以精簡明確與事實為本，不需過度仰賴社交魅力，只要能清楚對焦任務規格與進度即可。`
        },
        {
            title: '五、選才配對與面試檢核重點',
            body: `建議於「受測者配對」中使用【招募新人】模式比對受測者「內在」性格，優先挑選適配度 75% 以上者；面試時應針對「${keywords.slice(0, 3).join('、')}」設計情境追問，驗證其真實行為反應。`
        }
    ];

    return {
        scores: s,
        subFactors,
        primary,
        shape,
        keywords: keywords.slice(0, 5),
        traitGroups,
        textualSections
    };
}
