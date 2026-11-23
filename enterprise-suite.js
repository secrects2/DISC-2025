/**
 * 企業進階分析套件 UI 模組 (工作分析 JPR 與配對 / 1對1關係 / 團隊動力)
 * 共用於公司戶後台 (company.html) 與平台總管理後台 (query.html)
 */

import { db, collection, doc, addDoc, getDocs, deleteDoc, query, where, escapeHtml } from './firebase-config.js';
import {
    FACTOR_META,
    DEFAULT_JOB_TEMPLATES,
    JOB_QUESTIONNAIRE,
    computeJobProfileFromAnswers,
    deriveSubFactors,
    analyzeJobProfile,
    buildPairwiseAnalysis,
    analyzeTeam,
    rankCandidatesForJob
} from './disc-engine.js';

export function mountEnterpriseSuite({ containerId, getRecords, getScopeCode, getScopeName }) {
    const root = document.getElementById(containerId);
    if (!root) return { refresh: () => {} };

    const charts = { jobPreview: null, relMiniA: null, relMiniB: null, relCurve: null, relDiff: null, teamMap: null, teamPolarity: null, teamAvg: null, teamLead: null };
    let savedJobs = [];
    let savedTeams = [];
    let selectedTeamIds = new Set();
    let benchTeamIds = new Set();
    let teamLeaderId = '';
    const memberMiniCharts = [];

    // 目前選中用於預覽與配對的工作分析表
    let activeJob = {
        id: '',
        name: DEFAULT_JOB_TEMPLATES[1].name,
        category: '管理',
        target: { ...DEFAULT_JOB_TEMPLATES[1].target },
        subFactors: deriveSubFactors(DEFAULT_JOB_TEMPLATES[1].target),
        isTemplate: true
    };

    root.innerHTML = `
    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <h6 class="section-title mb-0"><i class="bi bi-diagram-3-fill text-primary"></i>企業進階決策分析</h6>
          <ul class="nav nav-pills nav-fill gap-1" id="esTabs" role="tablist">
            <li class="nav-item"><button class="nav-link active btn-sm py-1 px-3" data-bs-toggle="pill" data-bs-target="#esJobPane" type="button"><i class="bi bi-briefcase me-1"></i>工作分析與配對</button></li>
            <li class="nav-item"><button class="nav-link btn-sm py-1 px-3" data-bs-toggle="pill" data-bs-target="#esRelPane" type="button"><i class="bi bi-people me-1"></i>1對1 關係</button></li>
            <li class="nav-item"><button class="nav-link btn-sm py-1 px-3" data-bs-toggle="pill" data-bs-target="#esTeamPane" type="button"><i class="bi bi-microsoft-teams me-1"></i>團隊分析</button></li>
          </ul>
        </div>

        <div class="tab-content">
          <!-- ===== 1) 工作分析與配對 (對齊 jpr_lister + jpr_report + jpr_match) ===== -->
          <div class="tab-pane fade show active" id="esJobPane">
            <!-- 5 種建立選項 -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-3 pb-3 border-bottom">
              <span class="small fw-bold text-muted me-1">建立選項：</span>
              <button type="button" class="btn btn-sm btn-primary" id="esBtnOnlineQuest">
                <i class="bi bi-ui-checks-grid me-1"></i>線上創建工作問卷
              </button>
              <button type="button" class="btn btn-sm btn-outline-primary" id="esBtnCloneCand">
                <i class="bi bi-person-plus me-1"></i>複製受測者分析表
              </button>
              <button type="button" class="btn btn-sm btn-outline-primary" id="esBtnCloneJob">
                <i class="bi bi-copy me-1"></i>複製原有工作分析表
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary" id="esBtnCustomJob">
                <i class="bi bi-sliders me-1"></i>自訂工作分析表
              </button>
              <a class="btn btn-sm btn-outline-secondary" href="job-report.html?blank_questionnaire=1" target="_blank" rel="noopener">
                <i class="bi bi-printer me-1"></i>列印一份工作問卷
              </a>
            </div>

            <!-- 工作分析表列表 + 右側預覽 -->
            <div class="row g-3 mb-4">
              <div class="col-12 col-lg-7">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                  <div class="fw-bold small">工作分析表列表（點選即切換預覽與配對基準）</div>
                  <input class="form-control form-control-sm" id="esJobSearch" placeholder="搜尋職位或類別..." style="max-width:200px">
                </div>
                <div class="table-responsive border rounded-3" style="max-height:300px">
                  <table class="table table-hover table-sm mb-0" id="esJobListTable">
                    <thead><tr><th>工作分析表</th><th>類別</th><th>D / I / S / C</th><th>來源</th></tr></thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>

              <div class="col-12 col-lg-5">
                <div class="border rounded-3 p-3 bg-light h-100">
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <div class="fw-bold" id="esPrevName">—</div>
                      <div class="small text-muted">類別：<span id="esPrevCat">—</span> ｜ 形式：<code id="esPrevShape">—</code></div>
                    </div>
                    <span class="badge bg-primary-subtle text-primary" id="esPrevBadge">—</span>
                  </div>
                  <div class="bg-white rounded-3 p-2 border mb-3">
                    <div class="row g-2 align-items-center">
                      <div class="col-6"><div style="height:120px"><canvas id="esPrevChart"></canvas></div></div>
                      <div class="col-6"><ul class="list-unstyled small mb-0" id="esPrevKeywords"></ul></div>
                    </div>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button type="button" class="btn btn-sm btn-primary flex-grow-1" id="esBtnShowJobReport">
                      <i class="bi bi-file-earmark-bar-graph me-1"></i>顯示報告（12項特性 / 解析）
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary" id="esBtnEditJob">
                      <i class="bi bi-pencil-square me-1"></i>編輯
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger d-none" id="esBtnDeleteJob" title="刪除工作分析表">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 可收合的自訂工作分析表滑桿區 -->
            <div class="border rounded-3 p-3 bg-light mb-4 d-none" id="esCustomJobPanel">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0 small"><i class="bi bi-sliders me-1 text-primary"></i>自訂工作分析表</h6>
                <button type="button" class="btn-close btn-sm" id="esCloseCustomJob"></button>
              </div>
              <div class="row g-2 mb-2">
                <div class="col-12 col-sm-6">
                  <input class="form-control form-control-sm" id="esCustomName" placeholder="工作分析表名稱（必填）">
                </div>
                <div class="col-12 col-sm-6">
                  <input class="form-control form-control-sm" id="esCustomCat" placeholder="類別（例如：業務、研發、管理）" value="一般">
                </div>
              </div>
              <div class="row g-2 mb-2" id="esCustomSliders"></div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-sm btn-primary" id="esSaveCustomJob">
                  <i class="bi bi-bookmark-plus me-1"></i>建立並儲存工作分析表
                </button>
              </div>
            </div>

            <!-- 受測者配對（對齊 jpr_match.php） -->
            <div class="border rounded-3 p-3">
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <div class="fw-bold small"><i class="bi bi-person-check-fill me-1 text-primary"></i>受測者配對 — 基準：<span class="text-primary" id="esMatchTargetLabel">—</span></div>
                <small class="text-muted" id="esJobMeta"></small>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6 col-md-3">
                  <label class="form-label small text-muted mb-0">配對模式</label>
                  <select class="form-select form-select-sm" id="esMatchMode">
                    <option value="recruit">招募新人（比對內在）</option>
                    <option value="appraisal">在職評估（比對綜合）</option>
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label small text-muted mb-0">最低適配度限制</label>
                  <select class="form-select form-select-sm" id="esMatchMin">
                    <option value="0">(無限制)</option>
                    <option value="40" selected>40% 及以上</option>
                    <option value="60">60% 及以上</option>
                    <option value="70">70% 及以上</option>
                    <option value="80">80% 及以上</option>
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label small text-muted mb-0">部門篩選</label>
                  <select class="form-select form-select-sm" id="esMatchDept">
                    <option value="">全部部門</option>
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label small text-muted mb-0">分析表效期</label>
                  <select class="form-select form-select-sm" id="esMatchYears">
                    <option value="0">不限時間</option>
                    <option value="1">1 年內</option>
                    <option value="3">3 年內</option>
                    <option value="7">7 年內</option>
                  </select>
                </div>
              </div>
              <div class="table-responsive" style="max-height:360px">
                <table class="table table-hover table-sm mb-0" id="esJobTable">
                  <thead><tr><th>#</th><th>姓名</th><th>部門 / 職稱</th><th>主型</th><th>適配度</th><th>D/I/S/C 差距</th><th>個人報告</th></tr></thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ===== 2) 1對1 關係分析 (對齊 relationships.php) ===== -->
          <div class="tab-pane fade" id="esRelPane">
            <div class="row g-3 align-items-stretch mb-3">
              <div class="col-12 col-md-4">
                <div class="border rounded-3 p-2 bg-light h-100">
                  <label class="form-label small fw-bold text-primary mb-1">人員 A（左側）</label>
                  <select class="form-select form-select-sm mb-2" id="esRelA"></select>
                  <div class="bg-white rounded border p-1" style="height:105px"><canvas id="esRelMiniA"></canvas></div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="border rounded-3 p-2 bg-light h-100">
                  <label class="form-label small fw-bold text-success mb-1">人員 B（右側）</label>
                  <select class="form-select form-select-sm mb-2" id="esRelB"></select>
                  <div class="bg-white rounded border p-1" style="height:105px"><canvas id="esRelMiniB"></canvas></div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="border rounded-3 p-2 bg-light h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="small fw-bold text-muted mb-2">關係選項</div>
                    <div class="mb-2">
                      <label class="form-label small mb-0">分析表層級</label>
                      <select class="form-select form-select-sm" id="esRelLayer">
                        <option value="internal" selected>內在（最貼近真實本能）</option>
                        <option value="external">外在（工作調適表現）</option>
                        <option value="summary">總結（日常綜合表現）</option>
                      </select>
                    </div>
                    <div class="mb-2">
                      <label class="form-label small mb-0">報告風格</label>
                      <select class="form-select form-select-sm" id="esRelTone">
                        <option value="formal" selected>正式的（第三人稱）</option>
                        <option value="informal">非正式的（直接對話感）</option>
                      </select>
                    </div>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-secondary flex-grow-1" id="esRelSwap" type="button"><i class="bi bi-arrow-left-right me-1"></i>互換</button>
                    <button class="btn btn-sm btn-primary flex-grow-1" id="esRelPrint" type="button"><i class="bi bi-printer me-1"></i>列印</button>
                  </div>
                </div>
              </div>
            </div>
            <div id="esRelBody"></div>
          </div>

          <!-- ===== 3) 團隊分析 (對齊 teams.php & team-report.php) ===== -->
          <div class="tab-pane fade" id="esTeamPane">
            <!-- 團隊管理列 -->
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
              <div class="d-flex flex-wrap align-items-center gap-2">
                <button class="btn btn-sm btn-outline-primary" id="esTeamNewBtn" type="button"><i class="bi bi-plus-circle me-1"></i>新建團隊</button>
                <div class="input-group input-group-sm" style="width:auto">
                  <select class="form-select" id="esSavedTeamSel" style="max-width:190px"><option value="">— 打開已儲存團隊 —</option></select>
                  <button class="btn btn-outline-danger" type="button" id="esDelTeamBtn" title="刪除團隊" disabled><i class="bi bi-trash"></i></button>
                </div>
                <button class="btn btn-sm btn-outline-secondary" id="esTeamCloneBtn" type="button"><i class="bi bi-copy me-1"></i>複製團隊</button>
              </div>
              <div class="d-flex flex-wrap align-items-center gap-2">
                <div class="input-group input-group-sm" style="width:auto">
                  <input class="form-control" id="esTeamName" placeholder="輸入團隊名稱..." style="max-width:150px">
                  <button class="btn btn-primary" type="button" id="esSaveTeamBtn"><i class="bi bi-bookmark-plus me-1"></i>儲存</button>
                </div>
                <button class="btn btn-sm btn-outline-primary" id="esTeamPrintBtn" type="button"><i class="bi bi-printer me-1"></i>列印團隊報告</button>
                <button class="btn btn-sm btn-outline-secondary" id="esTeamPrintRelsBtn" type="button"><i class="bi bi-people me-1"></i>列印關係…</button>
              </div>
            </div>

            <div class="row g-3">
              <!-- 左側：成員 / 報告 子頁籤 -->
              <div class="col-12 col-lg-8">
                <ul class="nav nav-tabs mb-3" role="tablist">
                  <li class="nav-item"><button class="nav-link active fw-semibold py-1 px-3 small" data-bs-toggle="tab" data-bs-target="#esTeamMembersTab" type="button">成員與存儲庫</button></li>
                  <li class="nav-item"><button class="nav-link fw-semibold py-1 px-3 small" id="esTeamReportTabBtn" data-bs-toggle="tab" data-bs-target="#esTeamReportTab" type="button">完整團隊報告</button></li>
                </ul>

                <div class="tab-content">
                  <div class="tab-pane fade show active" id="esTeamMembersTab">
                    <div class="row g-2 align-items-end mb-3">
                      <div class="col-12 col-sm-5">
                        <label class="form-label small fw-semibold mb-1">指定團隊領導者</label>
                        <select class="form-select form-select-sm" id="esTeamLeaderSel"><option value="">（未指定領導者）</option></select>
                      </div>
                      <div class="col-6 col-sm-4">
                        <label class="form-label small fw-semibold mb-1">依部門快速勾選</label>
                        <select class="form-select form-select-sm" id="esTeamDeptPick"><option value="">依部門選取...</option></select>
                      </div>
                      <div class="col-6 col-sm-3 d-flex gap-1">
                        <button class="btn btn-sm btn-outline-secondary flex-grow-1" id="esTeamAll" type="button">全選</button>
                        <button class="btn btn-sm btn-outline-secondary flex-grow-1" id="esTeamNone" type="button">清空</button>
                      </div>
                    </div>

                    <div class="row g-3">
                      <div class="col-12 col-md-7">
                        <div class="border rounded-3 p-2 bg-light">
                          <div class="small fw-bold mb-2">團隊成員名單（勾選納入分析）</div>
                          <div class="bg-white rounded border p-2" style="max-height:320px;overflow-y:auto" id="esTeamMembersBox"></div>
                        </div>
                      </div>
                      <div class="col-12 col-md-5">
                        <div class="border rounded-3 p-2 bg-light h-100">
                          <div class="small fw-bold mb-1">存儲庫（備選候選人）</div>
                          <div class="text-muted mb-2" style="font-size:0.75rem">可暫存備選成員，一鍵加入或移出團隊</div>
                          <div class="bg-white rounded border p-2" style="max-height:290px;overflow-y:auto" id="esTeamBenchBox"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="tab-pane fade" id="esTeamReportTab">
                    <div id="esTeamReportBody"></div>
                  </div>
                </div>
              </div>

              <!-- 右側持久欄：團隊分析表 2D 散點圖與選項 -->
              <div class="col-12 col-lg-4">
                <div class="border rounded-3 p-3 bg-light">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0 small"><i class="bi bi-grid-fill me-1 text-primary"></i>團隊分析表（2D 分佈圖）</h6>
                    <span class="badge bg-primary-subtle text-primary" id="esTeamStyleBadge">—</span>
                  </div>
                  <div class="bg-white rounded border p-2 mb-3" style="height:240px">
                    <canvas id="esTeamMapChart"></canvas>
                  </div>
                  <div class="form-check form-switch small mb-2">
                    <input class="form-check-input" type="checkbox" id="esTeamLeaderToggle" checked>
                    <label class="form-check-label" for="esTeamLeaderToggle">包括潛在領導者</label>
                  </div>
                  <div id="esTeamSideSummary" class="small text-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    /* ===== Modals（掛載於 body 避免父容器遮罩問題） ===== */
    ['esQuestModal', 'esCloneCandModal'].forEach(id => {
        const old = document.getElementById(id);
        if (old) old.remove();
    });

    const modalHtml = `
    <div class="modal fade" id="esQuestModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title fw-bold"><i class="bi bi-ui-checks-grid me-1 text-primary"></i>線上創建工作問卷（24 題 高 / 低強迫選擇）</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2 mb-3">
              <div class="col-12 col-sm-7"><input class="form-control form-control-sm" id="esQJobName" placeholder="工作分析表名稱 *（例如：資深業務經理）"></div>
              <div class="col-12 col-sm-5"><input class="form-control form-control-sm" id="esQJobCat" placeholder="類別（例如：業務、執行）" value="一般"></div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2 small text-muted">
              <span>第 <strong class="text-dark" id="esQCur">1</strong> / ${JOB_QUESTIONNAIRE.length} 題</span>
              <span id="esQPct">0%</span>
            </div>
            <div class="progress mb-3" style="height:6px"><div class="progress-bar" id="esQProg" style="width:0%"></div></div>
            <div class="fw-bold mb-2" id="esQStem">—</div>
            <div class="d-flex flex-column gap-2" id="esQOpts"></div>
            <div class="small text-muted text-center mt-2" id="esQHint"></div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-sm btn-outline-secondary" id="esQPrev">上一題</button>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-primary" id="esQNext" disabled>下一題</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="esCloneCandModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title fw-bold"><i class="bi bi-person-plus me-1 text-primary"></i>複製受測者分析表為工作模型</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label small fw-semibold">選擇標竿受測者</label>
              <select class="form-select form-select-sm" id="esCloneCandSel"></select>
            </div>
            <div class="mb-2">
              <label class="form-label small fw-semibold">新工作分析表名稱 <span class="text-danger">*</span></label>
              <input class="form-control form-control-sm" id="esCloneCandName" placeholder="例如：王小明同款業務模型">
            </div>
            <div class="mb-2">
              <label class="form-label small fw-semibold">類別</label>
              <input class="form-control form-control-sm" id="esCloneCandCat" value="標竿複製">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-primary" id="esConfirmCloneCand">複製並建立</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const questModal = new bootstrap.Modal(document.getElementById('esQuestModal'));
    const cloneCandModal = new bootstrap.Modal(document.getElementById('esCloneCandModal'));

    /* ===== 工作分析表列表 + 預覽 + 5 種建立方式 ===== */
    function getAllJobRows() {
        const customRows = savedJobs.map(j => ({ ...j, isTemplate: false }));
        const tplRows = DEFAULT_JOB_TEMPLATES.map((t, idx) => ({
            id: `tpl_${idx}`,
            name: t.name,
            category: '內建範本',
            target: { ...t.target },
            subFactors: deriveSubFactors(t.target),
            isTemplate: true
        }));
        return [...customRows, ...tplRows];
    }

    function renderJobList() {
        const kw = document.getElementById('esJobSearch').value.trim().toLowerCase();
        const rows = getAllJobRows().filter(r =>
            !kw || (r.name || '').toLowerCase().includes(kw) || (r.category || '').toLowerCase().includes(kw)
        );
        const tbody = document.querySelector('#esJobListTable tbody');
        tbody.innerHTML = rows.map(r => {
            const isSel = r.id === activeJob.id;
            return `<tr class="${isSel ? 'table-primary' : ''}" data-job-id="${escapeHtml(r.id)}" style="cursor:pointer">
              <td class="fw-medium">${escapeHtml(r.name)}</td>
              <td><span class="badge bg-light text-dark border">${escapeHtml(r.category || '一般')}</span></td>
              <td class="small text-nowrap">${r.target.D}/${r.target.I}/${r.target.S}/${r.target.C}</td>
              <td class="small text-muted">${r.isTemplate ? '範本' : '自建'}</td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('tr').forEach(tr => {
            tr.onclick = () => {
                const found = getAllJobRows().find(x => x.id === tr.dataset.jobId);
                if (found) {
                    activeJob = structuredClone(found);
                    renderJobList();
                    renderJobPreviewAndMatch();
                }
            };
        });
    }

    document.getElementById('esJobSearch').addEventListener('input', renderJobList);

    function renderJobPreviewAndMatch() {
        const analysis = analyzeJobProfile(activeJob.target, {
            name: activeJob.name,
            subFactors: activeJob.subFactors
        });
        document.getElementById('esPrevName').textContent = activeJob.name;
        document.getElementById('esPrevCat').textContent = activeJob.category || '一般';
        document.getElementById('esPrevShape').textContent = analysis.shape;
        document.getElementById('esPrevBadge').textContent = activeJob.isTemplate ? '內建範本' : '已儲存模型';
        document.getElementById('esBtnDeleteJob').classList.toggle('d-none', activeJob.isTemplate || !activeJob.id);
        document.getElementById('esMatchTargetLabel').textContent = `${activeJob.name}（${activeJob.target.D}/${activeJob.target.I}/${activeJob.target.S}/${activeJob.target.C}）`;

        document.getElementById('esPrevKeywords').innerHTML = analysis.keywords
            .map(k => `<li class="mb-1"><i class="bi bi-dot text-primary"></i>${escapeHtml(k)}</li>`)
            .join('');

        const ctx = document.getElementById('esPrevChart').getContext('2d');
        if (charts.jobPreview) charts.jobPreview.destroy();
        charts.jobPreview = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['D', 'I', 'S', 'C'],
                datasets: [{
                    data: ['D', 'I', 'S', 'C'].map(k => analysis.scores[k]),
                    borderColor: '#2980b9',
                    backgroundColor: 'rgba(41,128,185,0.12)',
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: 3.5,
                    tension: 0.1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, display: false } } }
        });

        renderMatchTable();
    }

    function openJobReport(editMode = false) {
        if (!activeJob.isTemplate && activeJob.id) {
            window.open(`job-report.html?id=${encodeURIComponent(activeJob.id)}${editMode ? '&tab=edit' : ''}`, '_blank', 'noopener');
        } else {
            sessionStorage.setItem('preview_job_profile', JSON.stringify({
                name: activeJob.name,
                category: activeJob.category,
                scope_code: getScopeCode() || '__admin__',
                target: activeJob.target,
                subFactors: activeJob.subFactors
            }));
            window.open(`job-report.html?preview=1${editMode ? '&tab=edit' : ''}`, '_blank', 'noopener');
        }
    }

    document.getElementById('esBtnShowJobReport').onclick = () => openJobReport(false);
    document.getElementById('esBtnEditJob').onclick = () => openJobReport(true);

    document.getElementById('esBtnDeleteJob').onclick = async () => {
        if (activeJob.isTemplate || !activeJob.id) return;
        if (!confirm(`確定刪除工作分析表「${activeJob.name}」嗎？`)) return;
        try {
            await deleteDoc(doc(db, 'job_profiles', activeJob.id));
            await loadSavedConfigs();
            const first = getAllJobRows()[0];
            if (first) activeJob = structuredClone(first);
            renderJobList();
            renderJobPreviewAndMatch();
        } catch (err) {
            alert('刪除失敗：' + err.message);
        }
    };

    /* 建立方式 1：線上創建 24 題工作問卷 */
    let qIdx = 0;
    let qAnswers = [];
    function renderJobQuestion() {
        const q = JOB_QUESTIONNAIRE[qIdx];
        const ans = qAnswers[qIdx];
        document.getElementById('esQCur').textContent = qIdx + 1;
        const pct = Math.round((qIdx / JOB_QUESTIONNAIRE.length) * 100);
        document.getElementById('esQPct').textContent = pct + '%';
        document.getElementById('esQProg').style.width = pct + '%';
        document.getElementById('esQStem').textContent = `${qIdx + 1}. ${q.stem}`;

        const wrap = document.getElementById('esQOpts');
        wrap.innerHTML = '';
        q.options.forEach(o => {
            const isM = ans.most === o.type;
            const isL = ans.least === o.type;
            const row = document.createElement('div');
            row.className = 'border rounded-3 p-2 d-flex align-items-center justify-content-between gap-2 bg-light';
            row.innerHTML = `<span class="small flex-grow-1">${escapeHtml(o.text)}</span>`;
            const btns = document.createElement('div');
            btns.className = 'd-flex gap-1';
            const bM = document.createElement('button');
            bM.type = 'button';
            bM.className = `btn btn-sm ${isM ? 'btn-success' : 'btn-outline-secondary'}`;
            bM.textContent = '高';
            bM.onclick = () => {
                ans.most = ans.most === o.type ? null : o.type;
                if (ans.least === ans.most) ans.least = null;
                renderJobQuestion();
            };
            const bL = document.createElement('button');
            bL.type = 'button';
            bL.className = `btn btn-sm ${isL ? 'btn-danger' : 'btn-outline-secondary'}`;
            bL.textContent = '低';
            bL.onclick = () => {
                ans.least = ans.least === o.type ? null : o.type;
                if (ans.most === ans.least) ans.most = null;
                renderJobQuestion();
            };
            btns.appendChild(bM);
            btns.appendChild(bL);
            row.appendChild(btns);
            wrap.appendChild(row);
        });

        document.getElementById('esQPrev').disabled = qIdx === 0;
        const ready = Boolean(ans.most && ans.least && ans.most !== ans.least);
        const btnNext = document.getElementById('esQNext');
        btnNext.disabled = !ready;
        btnNext.textContent = qIdx === JOB_QUESTIONNAIRE.length - 1 ? '完成並建立工作分析表' : '下一題';
        document.getElementById('esQHint').textContent = ready ? '✓ 已完成本題' : '請為此職位選出 1 個「高（最需要）」與 1 個「低（最不需要）」';
    }

    document.getElementById('esBtnOnlineQuest').onclick = () => {
        qIdx = 0;
        qAnswers = JOB_QUESTIONNAIRE.map(() => ({ most: null, least: null }));
        document.getElementById('esQJobName').value = '';
        renderJobQuestion();
        questModal.show();
    };
    document.getElementById('esQPrev').onclick = () => { if (qIdx > 0) { qIdx--; renderJobQuestion(); } };
    document.getElementById('esQNext').onclick = async () => {
        if (qIdx < JOB_QUESTIONNAIRE.length - 1) {
            qIdx++;
            renderJobQuestion();
            return;
        }
        const name = document.getElementById('esQJobName').value.trim();
        if (!name) { alert('請填寫工作分析表名稱'); return; }
        const category = document.getElementById('esQJobCat').value.trim() || '問卷建立';
        try {
            const target = computeJobProfileFromAnswers(qAnswers);
            await saveNewJobProfile(name, category, target);
            questModal.hide();
        } catch (err) {
            alert(err.message);
        }
    };

    /* 建立方式 2：複製受測者分析表 */
    document.getElementById('esBtnCloneCand').onclick = () => {
        const recs = getRecords();
        if (!recs.length) { alert('目前尚無受測者紀錄可供複製'); return; }
        const sel = document.getElementById('esCloneCandSel');
        sel.innerHTML = recs.map(r => `<option value="${escapeHtml(r.id)}">${escapeHtml(r.taker_name || '未命名')} (${r.d_score}/${r.i_score}/${r.s_score}/${r.c_score})</option>`).join('');
        document.getElementById('esCloneCandName').value = `${recs[0].taker_name || '標竿員工'} 職務模型`;
        cloneCandModal.show();
    };
    document.getElementById('esCloneCandSel').onchange = e => {
        const r = getRecords().find(x => x.id === e.target.value);
        if (r) document.getElementById('esCloneCandName').value = `${r.taker_name || '標竿員工'} 職務模型`;
    };
    document.getElementById('esConfirmCloneCand').onclick = async () => {
        const r = getRecords().find(x => x.id === document.getElementById('esCloneCandSel').value);
        const name = document.getElementById('esCloneCandName').value.trim();
        const category = document.getElementById('esCloneCandCat').value.trim() || '標竿複製';
        if (!r || !name) { alert('請填寫名稱'); return; }
        const s = r.summary || { D: Number(r.d_score) || 50, I: Number(r.i_score) || 50, S: Number(r.s_score) || 50, C: Number(r.c_score) || 50 };
        await saveNewJobProfile(name, category, s);
        cloneCandModal.hide();
    };

    /* 建立方式 3：複製原有工作分析表 */
    document.getElementById('esBtnCloneJob').onclick = async () => {
        const newName = prompt('請輸入複製後的工作分析表名稱：', `${activeJob.name} (複製)`);
        if (!newName || !newName.trim()) return;
        await saveNewJobProfile(newName.trim(), activeJob.category || '一般', activeJob.target, activeJob.subFactors);
    };

    /* 建立方式 4：自訂工作分析表 */
    const customTarget = { D: 70, I: 65, S: 50, C: 65 };
    document.getElementById('esCustomSliders').innerHTML = ['D', 'I', 'S', 'C'].map(k => `
      <div class="col-6 col-md-3">
        <div class="bg-white border rounded p-2">
          <div class="d-flex justify-content-between small fw-bold">
            <span style="color:${FACTOR_META[k].color}">${k} ${FACTOR_META[k].short}</span>
            <span id="esCustVal_${k}">${customTarget[k]}</span>
          </div>
          <input type="range" class="form-range" min="5" max="95" value="${customTarget[k]}" id="esCustRange_${k}">
        </div>
      </div>`).join('');
    ['D', 'I', 'S', 'C'].forEach(k => {
        document.getElementById(`esCustRange_${k}`).addEventListener('input', e => {
            customTarget[k] = Number(e.target.value);
            document.getElementById(`esCustVal_${k}`).textContent = customTarget[k];
        });
    });
    document.getElementById('esBtnCustomJob').onclick = () => {
        document.getElementById('esCustomJobPanel').classList.toggle('d-none');
    };
    document.getElementById('esCloseCustomJob').onclick = () => {
        document.getElementById('esCustomJobPanel').classList.add('d-none');
    };
    document.getElementById('esSaveCustomJob').onclick = async () => {
        const name = document.getElementById('esCustomName').value.trim();
        const cat = document.getElementById('esCustomCat').value.trim() || '自訂';
        if (!name) { alert('請填寫工作分析表名稱'); return; }
        await saveNewJobProfile(name, cat, customTarget);
        document.getElementById('esCustomName').value = '';
        document.getElementById('esCustomJobPanel').classList.add('d-none');
    };

    async function saveNewJobProfile(name, category, target, subFactors = null) {
        const payload = {
            name,
            category,
            target: { D: Number(target.D), I: Number(target.I), S: Number(target.S), C: Number(target.C) },
            subFactors: subFactors ? { ...subFactors } : deriveSubFactors(target),
            scope_code: getScopeCode() || '__admin__',
            scope_name: getScopeName() || '',
            created_at: new Date().toISOString()
        };
        try {
            const docRef = await addDoc(collection(db, 'job_profiles'), payload);
            await loadSavedConfigs();
            const created = savedJobs.find(j => j.id === docRef.id);
            if (created) activeJob = { ...created, isTemplate: false };
            renderJobList();
            renderJobPreviewAndMatch();
        } catch (err) {
            alert('建立工作分析表失敗：' + err.message);
        }
    }

    /* ===== 受測者配對表格與篩選（對齊 jpr_match.php） ===== */
    function populateMatchDeptFilter() {
        const recs = getRecords();
        const sel = document.getElementById('esMatchDept');
        const prev = sel.value;
        const depts = [...new Set(recs.map(r => (r.dept || '').trim()).filter(Boolean))].sort();
        sel.innerHTML = '<option value="">全部部門</option>' +
            depts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
        if (depts.includes(prev)) sel.value = prev;
    }

    ['esMatchMode', 'esMatchMin', 'esMatchDept', 'esMatchYears'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderMatchTable);
    });

    function renderMatchTable() {
        const recs = getRecords();
        const mode = document.getElementById('esMatchMode').value;
        const minMatch = Number(document.getElementById('esMatchMin').value) || 0;
        const dept = document.getElementById('esMatchDept').value;
        const recencyYears = Number(document.getElementById('esMatchYears').value) || 0;

        const ranked = rankCandidatesForJob(recs, activeJob.target, { mode, minMatch, dept, recencyYears });
        const tbody = document.querySelector('#esJobTable tbody');
        document.getElementById('esJobMeta').textContent = `符合條件 ${ranked.length} / ${recs.length} 人`;
        if (!ranked.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">無符合配對條件的受測者（可嘗試放寬「最低適配度」或部門篩選）</td></tr>';
            return;
        }
        const fmtGap = v => `<span class="${Math.abs(v) <= 12 ? 'text-success' : Math.abs(v) >= 28 ? 'text-danger' : 'text-muted'}">${v >= 0 ? '+' : ''}${v}</span>`;
        tbody.innerHTML = ranked.map((r, idx) => {
            const badgeCls = r.matchPct >= 80 ? 'bg-success' : r.matchPct >= 65 ? 'bg-primary' : 'bg-secondary';
            return `<tr>
              <td class="fw-bold">${idx + 1}</td>
              <td>${escapeHtml(r.name)}</td>
              <td class="small text-muted">${escapeHtml(r.dept)} / ${escapeHtml(r.title)}</td>
              <td><span class="badge" style="background:${FACTOR_META[r.primary].color};color:#fff">${r.primary}</span></td>
              <td><span class="badge ${badgeCls}">${r.matchPct}%</span></td>
              <td class="small text-nowrap">D:${fmtGap(r.gaps.D)} I:${fmtGap(r.gaps.I)} S:${fmtGap(r.gaps.S)} C:${fmtGap(r.gaps.C)}</td>
              <td><a class="btn btn-sm btn-outline-primary py-0 px-2" href="report.html?id=${encodeURIComponent(r.id)}" target="_blank" rel="noopener">查看</a></td>
            </tr>`;
        }).join('');
    }

    /* ===== Firestore 儲存/載入職缺與團隊 ===== */
    async function loadSavedConfigs() {
        const scope = getScopeCode() || '__admin__';
        try {
            const [jobSnap, teamSnap] = await Promise.all([
                getDocs(query(collection(db, 'job_profiles'), where('scope_code', '==', scope))),
                getDocs(query(collection(db, 'teams'), where('scope_code', '==', scope)))
            ]);
            savedJobs = jobSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            savedTeams = teamSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) {
            console.warn('載入已存職缺/團隊失敗', err);
            savedJobs = [];
            savedTeams = [];
        }
        renderTeamSavedSelect();
        renderJobList();
    }

    function renderTeamSavedSelect() {
        const tSel = document.getElementById('esSavedTeamSel');
        tSel.innerHTML = '<option value="">— 自選或載入團隊 —</option>' +
            savedTeams.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)}（${(t.member_ids || []).length} 人）</option>`).join('');
        document.getElementById('esDelTeamBtn').disabled = !tSel.value;
    }

    /* ===== 列印報告通用函式（將 Canvas 轉圖片確保圖表完整列印） ===== */
    function printReportSection(title, sourceElOrHtml) {
        let html = '';
        if (typeof sourceElOrHtml === 'string') {
            html = sourceElOrHtml;
        } else if (sourceElOrHtml) {
            const clone = sourceElOrHtml.cloneNode(true);
            const origCanvases = sourceElOrHtml.querySelectorAll('canvas');
            const cloneCanvases = clone.querySelectorAll('canvas');
            origCanvases.forEach((c, idx) => {
                try {
                    const img = document.createElement('img');
                    img.src = c.toDataURL('image/png');
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    cloneCanvases[idx]?.replaceWith(img);
                } catch (_) { /* ignore empty canvas */ }
            });
            html = clone.innerHTML;
        }
        const win = window.open('', '_blank');
        if (!win) { alert('瀏覽器封鎖了彈出視窗，請允許列印視窗開啟。'); return; }
        win.document.write(`<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>body{padding:24px;font-size:13px;} .card{break-inside:avoid;margin-bottom:14px;}</style>
          </head><body><h4 class="fw-bold mb-3">${escapeHtml(title)}</h4>${html}
          <script>setTimeout(()=>window.print(),400);<\/script></body></html>`);
        win.document.close();
    }

    /* ===== 1對1 關係分析 (對齊 relationships.php) ===== */
    const selA = document.getElementById('esRelA');
    const selB = document.getElementById('esRelB');
    const selRelLayer = document.getElementById('esRelLayer');
    const selRelTone = document.getElementById('esRelTone');

    function populateRelSelects() {
        const recs = getRecords();
        const prevA = selA.value, prevB = selB.value;
        const opts = recs.map(r => {
            const label = `${r.taker_name || '未命名'}${r.dept ? ` (${r.dept})` : ''} [${r.primary_type || '?'}]`;
            return `<option value="${escapeHtml(r.id)}">${escapeHtml(label)}</option>`;
        }).join('');
        selA.innerHTML = opts;
        selB.innerHTML = opts;
        if (recs.some(r => r.id === prevA)) selA.value = prevA;
        if (recs.some(r => r.id === prevB)) selB.value = prevB;
        else if (recs.length > 1) selB.selectedIndex = 1;
        renderRelAnalysis();
    }

    document.getElementById('esRelSwap').onclick = () => {
        const tmp = selA.value;
        selA.value = selB.value;
        selB.value = tmp;
        renderRelAnalysis();
    };
    document.getElementById('esRelPrint').onclick = () => {
        const body = document.getElementById('esRelBody');
        if (!body.innerText.trim()) return;
        printReportSection('DISC 1對1 關係分析報告', body);
    };
    [selA, selB, selRelLayer, selRelTone].forEach(el => { el.onchange = renderRelAnalysis; });

    function drawMiniRelCardChart(canvasId, chartKey, scores, color) {
        if (charts[chartKey]) charts[chartKey].destroy();
        charts[chartKey] = new Chart(document.getElementById(canvasId).getContext('2d'), {
            type: 'line',
            data: {
                labels: ['D', 'I', 'S', 'C'],
                datasets: [{ data: ['D', 'I', 'S', 'C'].map(k => scores[k]), borderColor: color, borderWidth: 2, pointRadius: 3, tension: 0.1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, display: false }, x: { ticks: { font: { size: 10 } } } } }
        });
    }

    function renderRelAnalysis() {
        const body = document.getElementById('esRelBody');
        const recs = getRecords();
        if (recs.length < 2) {
            body.innerHTML = '<div class="text-center text-muted py-4">至少需要 2 筆測驗紀錄才能進行 1 對 1 關係比較。</div>';
            return;
        }
        const recA = recs.find(r => r.id === selA.value) || recs[0];
        const recB = recs.find(r => r.id === selB.value) || recs[1];
        if (!recA || !recB || recA.id === recB.id) {
            body.innerHTML = '<div class="text-center text-muted py-4">請選擇兩位不同的受測者進行比較。</div>';
            return;
        }

        const layer = selRelLayer.value;
        const tone = selRelTone.value;
        const rel = buildPairwiseAnalysis(recA, recB, { layer, tone });
        const nameA = recA.taker_name || '人員 A';
        const nameB = recB.taker_name || '人員 B';
        const layerLabel = layer === 'internal' ? '內在' : layer === 'external' ? '外在' : '總結';

        drawMiniRelCardChart('esRelMiniA', 'relMiniA', rel.sA, '#6c5ce7');
        drawMiniRelCardChart('esRelMiniB', 'relMiniB', rel.sB, '#00b894');

        body.innerHTML = `
          <div class="alert alert-light border d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div><strong>配對動態（${layerLabel}層級）：</strong>${escapeHtml(rel.dynamics)}</div>
            <span class="badge bg-primary fs-6">整體相似度 ${rel.similarity}%</span>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-6">
              <div class="border rounded-3 p-3 h-100">
                <div class="d-flex justify-content-between small fw-bold mb-2">
                  <span>因素比較（中線對比）</span>
                  <span><span class="text-primary">◀ 偏向 ${escapeHtml(nameA)}</span> ｜ <span class="text-success">偏向 ${escapeHtml(nameB)} ▶</span></span>
                </div>
                <div style="height:210px"><canvas id="esRelDiffChart"></canvas></div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="border rounded-3 p-3 h-100">
                <div class="small fw-bold mb-2">D / I / S / C 行為曲線對比（${layerLabel}）</div>
                <div style="height:210px"><canvas id="esRelCurveChart"></canvas></div>
              </div>
            </div>
          </div>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <div class="card border h-100">
                <div class="card-body">
                  <h6 class="fw-bold text-primary mb-2"><i class="bi bi-person-badge me-1"></i>${escapeHtml(nameA)} 視角</h6>
                  <ul class="small ps-3 mb-3">${rel.perspectiveA.keynotes.map(x => `<li class="mb-1">${escapeHtml(x)}</li>`).join('')}</ul>
                  ${rel.perspectiveA.paragraphs.map(p => `<p class="small text-secondary mb-2" style="line-height:1.65">${escapeHtml(p)}</p>`).join('')}
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card border h-100">
                <div class="card-body">
                  <h6 class="fw-bold text-success mb-2"><i class="bi bi-person-badge me-1"></i>${escapeHtml(nameB)} 視角</h6>
                  <ul class="small ps-3 mb-3">${rel.perspectiveB.keynotes.map(x => `<li class="mb-1">${escapeHtml(x)}</li>`).join('')}</ul>
                  ${rel.perspectiveB.paragraphs.map(p => `<p class="small text-secondary mb-2" style="line-height:1.65">${escapeHtml(p)}</p>`).join('')}
                </div>
              </div>
            </div>
          </div>`;

        if (charts.relCurve) charts.relCurve.destroy();
        charts.relCurve = new Chart(document.getElementById('esRelCurveChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['D 支配', 'I 影響', 'S 穩健', 'C 謹慎'],
                datasets: [
                    { label: nameA, data: ['D', 'I', 'S', 'C'].map(k => rel.sA[k]), borderColor: '#6c5ce7', borderWidth: 2.5, pointRadius: 4, tension: 0.15 },
                    { label: nameB, data: ['D', 'I', 'S', 'C'].map(k => rel.sB[k]), borderColor: '#00b894', borderDash: [5, 4], borderWidth: 2.5, pointRadius: 4, tension: 0.15 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { min: 0, max: 100 } } }
        });

        // Center-zero diverging bar: negative extends Left (Person A higher), positive extends Right (Person B higher)
        if (charts.relDiff) charts.relDiff.destroy();
        const factorDiffs = ['D', 'I', 'S', 'C'].map(k => (rel.sB[k] || 0) - (rel.sA[k] || 0));
        charts.relDiff = new Chart(document.getElementById('esRelDiffChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['支配型 (D)', '影響型 (I)', '穩健型 (S)', '謹慎型 (C)'],
                datasets: [{
                    label: '差異幅度',
                    data: factorDiffs,
                    backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#2980b9'],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const v = ctx.raw;
                                if (v === 0) return '雙方完全一致';
                                return v < 0 ? `${nameA} 較高 ${Math.abs(v)} 分` : `${nameB} 較高 ${v} 分`;
                            }
                        }
                    }
                },
                scales: { x: { min: -100, max: 100, ticks: { callback: v => Math.abs(v) } } }
            }
        });
    }

    /* ===== 團隊分析 (對齊 teams.php & team-report.php) ===== */
    function populateTeamMembers() {
        const recs = getRecords();
        const box = document.getElementById('esTeamMembersBox');
        const benchBox = document.getElementById('esTeamBenchBox');
        const deptSel = document.getElementById('esTeamDeptPick');
        const leaderSel = document.getElementById('esTeamLeaderSel');

        const depts = [...new Set(recs.map(r => (r.dept || '').trim()).filter(Boolean))].sort();
        deptSel.innerHTML = '<option value="">依部門選取...</option>' +
            depts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');

        if (selectedTeamIds.size === 0 && benchTeamIds.size === 0 && recs.length > 0) {
            recs.slice(0, Math.min(6, recs.length)).forEach(r => selectedTeamIds.add(r.id));
        }

        // Leader selector from active members
        const activeMembers = recs.filter(r => selectedTeamIds.has(r.id));
        leaderSel.innerHTML = '<option value="">（未指定領導者）</option>' +
            activeMembers.map(r => `<option value="${escapeHtml(r.id)}">${escapeHtml(r.taker_name || '未命名')} (${r.primary_type || '?'})</option>`).join('');
        if (activeMembers.some(r => r.id === teamLeaderId)) leaderSel.value = teamLeaderId;
        else teamLeaderId = '';

        if (!recs.length) {
            box.innerHTML = '<div class="text-muted small text-center py-3">尚無成員資料</div>';
            benchBox.innerHTML = '<div class="text-muted small text-center py-3">無</div>';
            renderTeamAnalysis();
            return;
        }

        box.innerHTML = recs.map(r => {
            const checked = selectedTeamIds.has(r.id) ? 'checked' : '';
            const isLeader = r.id === teamLeaderId;
            return `<div class="d-flex align-items-center gap-2 py-1 border-bottom small">
              <input type="checkbox" class="form-check-input mt-0 es-tm-chk" value="${escapeHtml(r.id)}" ${checked}>
              <span class="flex-grow-1">${escapeHtml(r.taker_name || '未命名')} ${isLeader ? '<span class="badge bg-warning text-dark">領導者</span>' : ''} <span class="text-muted">${r.dept ? `(${escapeHtml(r.dept)})` : ''}</span></span>
              <span class="badge" style="background:${FACTOR_META[r.primary_type || 'D']?.color || '#999'};color:#fff">${escapeHtml(r.primary_type || '?')}</span>
              ${!selectedTeamIds.has(r.id) && !benchTeamIds.has(r.id) ? `<button type="button" class="btn btn-xs btn-outline-secondary py-0 px-1 es-to-bench" data-id="${escapeHtml(r.id)}" title="加入存儲庫">備選</button>` : ''}
            </div>`;
        }).join('');

        box.querySelectorAll('.es-tm-chk').forEach(chk => {
            chk.onchange = () => {
                if (chk.checked) {
                    selectedTeamIds.add(chk.value);
                    benchTeamIds.delete(chk.value);
                } else {
                    selectedTeamIds.delete(chk.value);
                }
                populateTeamMembers();
            };
        });
        box.querySelectorAll('.es-to-bench').forEach(btn => {
            btn.onclick = () => {
                benchTeamIds.add(btn.dataset.id);
                selectedTeamIds.delete(btn.dataset.id);
                populateTeamMembers();
            };
        });

        const benchMembers = recs.filter(r => benchTeamIds.has(r.id));
        benchBox.innerHTML = benchMembers.length
            ? benchMembers.map(r => `
                <div class="d-flex align-items-center justify-content-between gap-1 py-1 border-bottom small">
                  <span>${escapeHtml(r.taker_name || '未命名')} <span class="badge bg-light text-dark border">${escapeHtml(r.primary_type || '?')}</span></span>
                  <div class="d-flex gap-1">
                    <button type="button" class="btn btn-xs btn-outline-primary py-0 px-1 es-bench-add" data-id="${escapeHtml(r.id)}">+入隊</button>
                    <button type="button" class="btn btn-xs btn-outline-danger py-0 px-1 es-bench-rm" data-id="${escapeHtml(r.id)}">×</button>
                  </div>
                </div>`).join('')
            : '<div class="text-muted small text-center py-3">尚無備選人員（可從左側按「備選」加入）</div>';

        benchBox.querySelectorAll('.es-bench-add').forEach(b => {
            b.onclick = () => {
                benchTeamIds.delete(b.dataset.id);
                selectedTeamIds.add(b.dataset.id);
                populateTeamMembers();
            };
        });
        benchBox.querySelectorAll('.es-bench-rm').forEach(b => {
            b.onclick = () => {
                benchTeamIds.delete(b.dataset.id);
                populateTeamMembers();
            };
        });

        renderTeamAnalysis();
    }

    document.getElementById('esTeamLeaderSel').onchange = e => {
        teamLeaderId = e.target.value;
        populateTeamMembers();
    };
    document.getElementById('esTeamAll').onclick = () => {
        getRecords().forEach(r => { selectedTeamIds.add(r.id); benchTeamIds.delete(r.id); });
        populateTeamMembers();
    };
    document.getElementById('esTeamNone').onclick = () => {
        selectedTeamIds.clear();
        teamLeaderId = '';
        populateTeamMembers();
    };
    document.getElementById('esTeamDeptPick').onchange = e => {
        const dept = e.target.value;
        if (!dept) return;
        selectedTeamIds.clear();
        getRecords().filter(r => (r.dept || '').trim() === dept).forEach(r => {
            selectedTeamIds.add(r.id);
            benchTeamIds.delete(r.id);
        });
        e.target.value = '';
        populateTeamMembers();
    };
    document.getElementById('esTeamLeaderToggle').onchange = renderTeamAnalysis;

    document.getElementById('esTeamNewBtn').onclick = () => {
        document.getElementById('esSavedTeamSel').value = '';
        document.getElementById('esDelTeamBtn').disabled = true;
        document.getElementById('esTeamName').value = '';
        selectedTeamIds.clear();
        benchTeamIds.clear();
        teamLeaderId = '';
        populateTeamMembers();
    };

    document.getElementById('esTeamCloneBtn').onclick = async () => {
        const baseName = document.getElementById('esTeamName').value.trim() || '新團隊';
        const cloneName = prompt('請輸入複製後的新團隊名稱：', `${baseName} (複製)`);
        if (!cloneName || !cloneName.trim()) return;
        await saveTeamToFirestore(cloneName.trim());
    };

    document.getElementById('esSavedTeamSel').onchange = e => {
        const found = savedTeams.find(t => t.id === e.target.value);
        document.getElementById('esDelTeamBtn').disabled = !found;
        if (found) {
            document.getElementById('esTeamName').value = found.name;
            selectedTeamIds = new Set(found.member_ids || []);
            benchTeamIds = new Set(found.bench_ids || []);
            teamLeaderId = found.leader_id || '';
            populateTeamMembers();
        }
    };

    async function saveTeamToFirestore(name) {
        if (selectedTeamIds.size === 0) { alert('請至少勾選 1 位團隊成員'); return; }
        const btn = document.getElementById('esSaveTeamBtn');
        btn.disabled = true;
        try {
            const docRef = await addDoc(collection(db, 'teams'), {
                name,
                member_ids: [...selectedTeamIds],
                bench_ids: [...benchTeamIds],
                leader_id: teamLeaderId || '',
                scope_code: getScopeCode() || '__admin__',
                scope_name: getScopeName() || '',
                created_at: new Date().toISOString()
            });
            await loadSavedConfigs();
            document.getElementById('esSavedTeamSel').value = docRef.id;
            document.getElementById('esDelTeamBtn').disabled = false;
            document.getElementById('esTeamName').value = name;
        } catch (err) {
            alert('儲存團隊失敗：' + err.message);
        }
        btn.disabled = false;
    }

    document.getElementById('esSaveTeamBtn').onclick = () => {
        const name = document.getElementById('esTeamName').value.trim();
        if (!name) { alert('請輸入團隊名稱'); return; }
        saveTeamToFirestore(name);
    };

    document.getElementById('esDelTeamBtn').onclick = async () => {
        const id = document.getElementById('esSavedTeamSel').value;
        if (!id) return;
        try {
            await deleteDoc(doc(db, 'teams', id));
            await loadSavedConfigs();
        } catch (err) {
            alert('刪除失敗：' + err.message);
        }
    };

    document.getElementById('esTeamPrintBtn').onclick = () => {
        const tabBtn = document.getElementById('esTeamReportTabBtn');
        if (tabBtn) new bootstrap.Tab(tabBtn).show();
        setTimeout(() => {
            const el = document.getElementById('esTeamReportBody');
            if (!el.innerText.trim()) return;
            const tName = document.getElementById('esTeamName').value.trim() || '未命名團隊';
            printReportSection(`DISC 團隊分析報告 — ${tName}`, el);
        }, 250);
    };

    document.getElementById('esTeamPrintRelsBtn').onclick = () => {
        const members = getRecords().filter(r => selectedTeamIds.has(r.id));
        if (members.length < 2) { alert('團隊至少需 2 名成員才能列印成員關係總覽'); return; }
        if (members.length > 12 && !confirm(`目前團隊有 ${members.length} 人（將產生 ${(members.length * (members.length - 1)) / 2} 組關係配對），確定產生批次關係報告嗎？`)) return;
        const pairsHtml = [];
        for (let i = 0; i < members.length; i++) {
            for (let j = i + 1; j < members.length; j++) {
                const rel = buildPairwiseAnalysis(members[i], members[j], { layer: 'internal', tone: 'formal' });
                pairsHtml.push(`
                  <div class="card"><div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <strong>${escapeHtml(members[i].taker_name || 'A')} ↔ ${escapeHtml(members[j].taker_name || 'B')}</strong>
                      <span class="badge bg-primary">相似度 ${rel.similarity}% ｜ ${escapeHtml(rel.dynamics)}</span>
                    </div>
                    <div class="row g-2 small">
                      <div class="col-6"><strong>${escapeHtml(members[i].taker_name || 'A')} 視角：</strong>${escapeHtml(rel.perspectiveA.keynotes[0])} ${escapeHtml(rel.aToB)}</div>
                      <div class="col-6"><strong>${escapeHtml(members[j].taker_name || 'B')} 視角：</strong>${escapeHtml(rel.perspectiveB.keynotes[0])} ${escapeHtml(rel.bToA)}</div>
                    </div>
                  </div></div>`);
            }
        }
        const tName = document.getElementById('esTeamName').value.trim() || '團隊';
        printReportSection(`團隊成員關係批次分析 — ${tName}`, pairsHtml.join(''));
    };

    function renderTeamAnalysis() {
        const reportBody = document.getElementById('esTeamReportBody');
        const sideSummary = document.getElementById('esTeamSideSummary');
        const styleBadge = document.getElementById('esTeamStyleBadge');
        memberMiniCharts.forEach(c => c.destroy());
        memberMiniCharts.length = 0;

        const members = getRecords().filter(r => selectedTeamIds.has(r.id));
        if (!members.length) {
            styleBadge.textContent = '無成員';
            sideSummary.innerHTML = '請從左側勾選成員。';
            reportBody.innerHTML = '<div class="border rounded-3 p-4 text-center text-muted">請先於「成員與存儲庫」勾選至少 1 位成員以產生團隊分析報告。</div>';
            if (charts.teamMap) { charts.teamMap.destroy(); charts.teamMap = null; }
            return;
        }

        const includePotentialLeaders = document.getElementById('esTeamLeaderToggle').checked;
        const team = analyzeTeam(members, { leaderId: teamLeaderId, includePotentialLeaders });
        styleBadge.textContent = team.structure.teamStyle;
        sideSummary.innerHTML = `
          <div>成員數：<strong>${team.structure.memberCount}</strong> ｜ 關係組數：<strong>${team.structure.uniqueRelationships}</strong></div>
          <div>領導者：<strong>${escapeHtml(team.structure.leaderName)}</strong></div>
          <div class="mt-1">平均分佈：D:${team.avg.D} / I:${team.avg.I} / S:${team.avg.S} / C:${team.avg.C}</div>`;

        // 右側 2D 團隊分析表散點圖
        const mapPlugin = {
            id: 'teamMapGrid',
            beforeDraw(chart) {
                const { ctx, chartArea, scales: { x, y } } = chart;
                const mx = x.getPixelForValue(50), my = y.getPixelForValue(50);
                ctx.save();
                ctx.strokeStyle = '#cbd5e1';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(mx, chartArea.top); ctx.lineTo(mx, chartArea.bottom);
                ctx.moveTo(chartArea.left, my); ctx.lineTo(chartArea.right, my);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.font = '700 10px sans-serif';
                ctx.fillStyle = '#e74c3c'; ctx.fillText('D 主導', chartArea.left + 6, chartArea.top + 14);
                ctx.fillStyle = '#f39c12'; ctx.fillText('I 影響', chartArea.right - 38, chartArea.top + 14);
                ctx.fillStyle = '#2980b9'; ctx.fillText('C 謹慎', chartArea.left + 6, chartArea.bottom - 8);
                ctx.fillStyle = '#27ae60'; ctx.fillText('S 穩健', chartArea.right - 38, chartArea.bottom - 8);
                ctx.restore();
            }
        };
        if (charts.teamMap) charts.teamMap.destroy();
        charts.teamMap = new Chart(document.getElementById('esTeamMapChart').getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '成員位置',
                    data: team.memberRoles.map(m => ({ x: m.point.openness, y: m.point.assertiveness, m })),
                    backgroundColor: team.memberRoles.map(m => FACTOR_META[m.primary].color),
                    pointStyle: team.memberRoles.map(m => m.id === teamLeaderId ? 'star' : 'circle'),
                    pointRadius: team.memberRoles.map(m => m.id === teamLeaderId ? 10 : 7),
                    borderColor: '#fff',
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: ctx => `${ctx.raw.m.name} (${ctx.raw.m.primary})${ctx.raw.m.id === teamLeaderId ? ' ★領導' : ''}` } }
                },
                scales: {
                    x: { min: 0, max: 100, ticks: { display: false }, title: { display: true, text: '制約 ↔ 開放', font: { size: 10 } } },
                    y: { min: 0, max: 100, ticks: { display: false }, title: { display: true, text: '被動 ↔ 獨斷', font: { size: 10 } } }
                }
            },
            plugins: [mapPlugin]
        });

        // 完整團隊報告 (team-report.php 8 大區塊)
        const statusDot = st => st === 'warn' ? '<span class="text-danger">▼</span>' : st === 'mid' ? '<span class="text-warning">●</span>' : '<span class="text-success">▲</span>';

        reportBody.innerHTML = `
          <!-- 1. 團隊分析表 & 極性因素 -->
          <div class="card border mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-2">1. 團隊分析表與四維極性因素</h6>
              <div class="row g-3 align-items-center">
                <div class="col-12 col-md-5"><div style="height:190px"><canvas id="esTeamAvgChart"></canvas></div></div>
                <div class="col-12 col-md-7">
                  ${team.polarityFactors.map(pf => `
                    <div class="mb-2 small">
                      <div class="d-flex justify-content-between fw-semibold mb-1">
                        <span>${statusDot(pf.status)} ${pf.left} (${pf.leftPct}%)</span>
                        <span>${pf.right} (${pf.rightPct}%)</span>
                      </div>
                      <div class="progress" style="height:10px">
                        <div class="progress-bar bg-primary" style="width:${pf.leftPct}%"></div>
                        <div class="progress-bar bg-info" style="width:${pf.rightPct}%"></div>
                      </div>
                    </div>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 團隊結構 & 3. 基本精神與重要動力 -->
          <div class="card border mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-2">2. 團隊結構與基本精神</h6>
              <div class="row g-2 text-center mb-3">
                <div class="col-6 col-sm-3"><div class="border rounded p-2"><div class="small text-muted">團隊作風</div><div class="fw-bold small">${escapeHtml(team.structure.teamStyle)}</div></div></div>
                <div class="col-6 col-sm-3"><div class="border rounded p-2"><div class="small text-muted">指定領導</div><div class="fw-bold small">${escapeHtml(team.structure.leaderName)}</div></div></div>
                <div class="col-6 col-sm-3"><div class="border rounded p-2"><div class="small text-muted">獨特關係</div><div class="fw-bold">${team.structure.uniqueRelationships} 組</div></div></div>
                <div class="col-6 col-sm-3"><div class="border rounded p-2"><div class="small text-muted">互動觀點</div><div class="fw-bold">${team.structure.uniquePerspectives} 個</div></div></div>
              </div>
              ${team.structure.paragraphs.map(p => `<p class="small text-secondary mb-2">${escapeHtml(p)}</p>`).join('')}
              <div class="bg-light rounded p-2 mb-2">
                <div class="small fw-bold mb-1">團隊基本精神</div>
                <ul class="small ps-3 mb-0">${team.keynotes.map(k => `<li>${escapeHtml(k)}</li>`).join('')}</ul>
              </div>
              <div class="small fw-bold mb-1">重要團隊動力</div>
              ${team.dynamics.map(d => `<p class="small text-secondary mb-1">${escapeHtml(d)}</p>`).join('')}
            </div>
          </div>

          <!-- 4. 團隊次因子 -->
          <div class="card border mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-2">3. 團隊次因子（行為傾向光譜）</h6>
              <div class="row g-2">
                ${team.teamSubFactors.map(sf => `
                  <div class="col-12 col-md-6">
                    <div class="border rounded p-2 small">
                      <div class="d-flex justify-content-between fw-semibold mb-1">
                        <span>${sf.left}</span>
                        <span class="badge bg-light text-dark border">${sf.theme} (${sf.value})</span>
                        <span>${sf.right}</span>
                      </div>
                      <div class="progress" style="height:8px"><div class="progress-bar" style="width:${sf.value}%"></div></div>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>

          <!-- 5. 團隊角色分解 -->
          <div class="card border mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-2">4. 團隊角色分解</h6>
              <div class="row g-2">
                ${team.roleBreakdown.map(rb => `
                  <div class="col-12 col-md-6">
                    <div class="border rounded-3 p-2 h-100 small">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong style="color:${rb.color}">${rb.title} (${rb.key})</strong>
                        <span class="badge" style="background:${rb.color};color:#fff">${rb.members.length} 人</span>
                      </div>
                      <div class="text-muted mb-1" style="font-size:0.78rem">${escapeHtml(rb.desc)}</div>
                      <div class="mb-1"><strong>成員：</strong>${rb.members.length ? rb.members.map(m => escapeHtml(m.name)).join('、') : '<span class="text-danger">從缺</span>'}</div>
                      <div class="text-muted" style="font-size:0.75rem">行為：${rb.behaviors.join(' · ')}</div>
                      <div class="mt-1"><span class="badge bg-light text-dark border me-1">${rb.orientations.pace}</span><span class="badge bg-light text-dark border me-1">${rb.orientations.scope}</span><span class="badge bg-light text-dark border">${rb.orientations.focus}</span></div>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>

          <!-- 6. 領導能力分析 -->
          <div class="card border mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-2">5. 領導能力分析（團隊需求 vs 領導供給）</h6>
              <p class="small text-secondary mb-2">${escapeHtml(team.leadershipAnalysis.generalStyle)}</p>
              <div style="height:190px" class="mb-2"><canvas id="esTeamLeadChart"></canvas></div>
              ${includePotentialLeaders ? `
                <div class="alert alert-light border py-2 px-3 mb-0 small">
                  <strong><i class="bi bi-award text-warning me-1"></i>有領導潛力的應試者：</strong>
                  ${team.leadershipAnalysis.potentialLeaders.length
                      ? team.leadershipAnalysis.potentialLeaders.map(l => `<span class="badge bg-warning-subtle text-dark border me-1">${escapeHtml(l.name)} (${l.primary})</span>`).join('')
                      : '<span class="text-muted">無額外非指定領導者具高 D/I 潛力指標。</span>'}
                </div>` : ''}
            </div>
          </div>

          <!-- 7. 團隊成員個別摘要 -->
          <div class="card border">
            <div class="card-body">
              <h6 class="fw-bold mb-2">6. 團隊成員個別摘要</h6>
              <div class="row g-2">
                ${team.memberSummaries.map((m, idx) => `
                  <div class="col-12 col-md-6">
                    <div class="border rounded-3 p-2 h-100 small">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong>${escapeHtml(m.name)} ${m.isLeader ? '<span class="badge bg-warning text-dark">團隊領導者</span>' : ''}</strong>
                        <a class="btn btn-xs btn-outline-primary py-0 px-2" href="report.html?id=${encodeURIComponent(m.id)}" target="_blank" rel="noopener">個人報告</a>
                      </div>
                      <div style="height:85px" class="mb-2"><canvas id="esTmMini_${idx}"></canvas></div>
                      <ul class="ps-3 mb-0" style="font-size:0.78rem">${m.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>`;

        if (charts.teamAvg) charts.teamAvg.destroy();
        charts.teamAvg = new Chart(document.getElementById('esTeamAvgChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['D 支配', 'I 影響', 'S 穩健', 'C 謹慎'],
                datasets: [{
                    label: '團隊平均',
                    data: ['D', 'I', 'S', 'C'].map(k => team.avg[k]),
                    backgroundColor: 'rgba(108,92,231,0.18)',
                    borderColor: '#6c5ce7',
                    borderWidth: 2,
                    pointBackgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#2980b9'],
                    pointRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { beginAtZero: true, max: 100 } } }
        });

        if (charts.teamLead) charts.teamLead.destroy();
        charts.teamLead = new Chart(document.getElementById('esTeamLeadChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: team.leadershipAnalysis.requirements.map(r => r.label.split('（')[0]),
                datasets: [
                    { label: '團隊需求', data: team.leadershipAnalysis.requirements.map(r => r.teamNeed), backgroundColor: '#6c5ce7', borderRadius: 4 },
                    { label: '領導供給', data: team.leadershipAnalysis.requirements.map(r => r.leaderSupply), backgroundColor: '#00b894', borderRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { min: 0, max: 100 } } }
        });

        team.memberSummaries.forEach((m, idx) => {
            const c = document.getElementById(`esTmMini_${idx}`);
            if (!c) return;
            memberMiniCharts.push(new Chart(c.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['D', 'I', 'S', 'C'],
                    datasets: [{ data: ['D', 'I', 'S', 'C'].map(k => m.scores[k]), borderColor: FACTOR_META[m.primary].color, borderWidth: 2, pointRadius: 3, tension: 0.1 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, display: false } } }
            }));
        });
    }

    /* ===== 初始化與外部資料同步 ===== */
    let lastLoadedScope = null;
    async function ensureConfigsFresh() {
        const scope = getScopeCode() || '__admin__';
        if (scope !== lastLoadedScope) {
            lastLoadedScope = scope;
            await loadSavedConfigs();
        }
    }
    ensureConfigsFresh();

    return {
        refresh() {
            ensureConfigsFresh();
            populateMatchDeptFilter();
            renderJobList();
            renderJobPreviewAndMatch();
            populateRelSelects();
            populateTeamMembers();
        }
    };
}
