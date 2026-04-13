// classify.js — 武将タイプ分類ロジック

const CLOSE = 50; // この差以内なら「同格」とみなす

// バッジ・カラー定義（第一ステータスで色分け）
const TYPE_STYLE = {
  bu:     { badge: "badge-bu",    header: "card-header-bu"    },  // 赤
  chi:    { badge: "badge-chi",   header: "card-header-chi"   },  // 青
  tou:    { badge: "badge-tou",   header: "card-header-tou"   },  // 緑
  sei:    { badge: "badge-sei",   header: "card-header-sei"   },  // 黄
  buchi:  { badge: "badge-bu",    header: "card-header-bu"    },  // 赤（武主体）
  butou:  { badge: "badge-tou",    header: "card-header-tou"    },  // 緑（統主体）
  chitou: { badge: "badge-chi",   header: "card-header-chi"   },  // 青（知主体）
  senki:  { badge: "badge-senki", header: "card-header-senki" },  // 紫
  nazo:   { badge: "badge-nazo",  header: "card-header-nazo"  },  // 灰
};

const STAT_LABELS = [
  { key: "bu",  label: "武", cls: "stat-bu"  },
  { key: "chi", label: "知", cls: "stat-chi" },
  { key: "tou", label: "統", cls: "stat-tou" },
  { key: "sei", label: "政", cls: "stat-sei" },
];

// プレイヤーのタイプキーとラベルを返す
function getTypeInfo(p) {
  const { bu, chi, tou, sei } = p;

  // 武・知・統の最大値
  const maxBCT = Math.max(bu, chi, tou);

  // 政が武知統すべてを上回るなら政タイプ
  if (sei > bu && sei > chi && sei > tou) {
    return { key: "sei", label: "政", desc: "政治特化型" };
  }

  // 武・知・統それぞれが「最大値との差がCLOSE以内」かどうか
  const buClose  = maxBCT - bu  <= CLOSE;
  const chiClose = maxBCT - chi <= CLOSE;
  const touClose = maxBCT - tou <= CLOSE;

  // 3つすべてが近い場合
  if (buClose && chiClose && touClose) {
    // 政も武知統の最大値に近ければ「謎」（4ステすべて均等）
    const seiClose = maxBCT - sei <= CLOSE && sei >= maxBCT - CLOSE;
    if (seiClose) return { key: "nazo", label: "謎", desc: "万能型" };
    return { key: "senki", label: "戦闘狂", desc: "武力＋知力＋統率型" };
  }

  // 2つが近い場合 → 差が50未満なら複合、50以上なら主>副
  if (buClose && chiClose) {
    const diff = Math.abs(bu - chi);
    if (diff < CLOSE) return { key: "buchi",  label: "武知",  desc: "武力と知力の差が50未満" };
    return bu >= chi
      ? { key: "buchi",  label: "武>知", desc: "武力と知力の差が50以上" }
      : { key: "buchi",  label: "知>武", desc: "武力と知力の差が50以上" };
  }
  if (buClose && touClose) {
    const diff = Math.abs(bu - tou);
    if (diff < CLOSE) return { key: "butou",  label: "武統",  desc: "武力と統率の差が50未満" };
    return bu >= tou
      ? { key: "butou",  label: "武>統", desc: "武力と統率の差が50以上" }
      : { key: "butou",  label: "統>武", desc: "武力と統率の差が50以上" };
  }
  if (chiClose && touClose) {
    const diff = Math.abs(chi - tou);
    if (diff < CLOSE) return { key: "chitou", label: "知統",  desc: "知力と統率の差が50未満" };
    return chi >= tou
      ? { key: "chitou", label: "知>統", desc: "知力と統率の差が50以上" }
      : { key: "chitou", label: "統>知", desc: "知力と統率の差が50以上" };
  }

  // 1つだけが最大値に近い場合でも、80以上の能力が複数あれば複合型とする
  const ABS = 80; // 複合型とみなす絶対値閾値
  const buAbs  = bu  >= ABS;
  const chiAbs = chi >= ABS;
  const touAbs = tou >= ABS;

  if (buClose) {
    // 知か統が80以上なら複合型
    if (chiAbs && touAbs) {
      // 知も統も80以上 → 差の大きい方と組み合わせ
      const diffBC = Math.abs(bu - chi);
      const diffBT = Math.abs(bu - tou);
      if (diffBC < CLOSE && diffBT < CLOSE) return { key: "senki", label: "戦闘狂", desc: "武力＋知力＋統率型" };
      // より近い方と複合
      if (diffBC <= diffBT) return bu >= chi ? { key: "buchi", label: "武>知", desc: "武力と知力の差が50以上" } : { key: "buchi", label: "知>武", desc: "武力と知力の差が50以上" };
      return bu >= tou ? { key: "butou", label: "武>統", desc: "武力と統率の差が50以上" } : { key: "butou", label: "統>武", desc: "武力と統率の差が50以上" };
    }
    if (chiAbs) {
      const diff = Math.abs(bu - chi);
      if (diff < CLOSE) return { key: "buchi", label: "武知", desc: "武力と知力の差が50未満" };
      return bu >= chi ? { key: "buchi", label: "武>知", desc: "武力と知力の差が50以上" } : { key: "buchi", label: "知>武", desc: "武力と知力の差が50以上" };
    }
    if (touAbs) {
      const diff = Math.abs(bu - tou);
      if (diff < CLOSE) return { key: "butou", label: "武統", desc: "武力と統率の差が50未満" };
      return bu >= tou ? { key: "butou", label: "武>統", desc: "武力と統率の差が50以上" } : { key: "butou", label: "統>武", desc: "武力と統率の差が50以上" };
    }
    return { key: "bu", label: "武", desc: "武力特化型" };
  }
  if (chiClose) {
    if (buAbs && touAbs) {
      const diffCB = Math.abs(chi - bu);
      const diffCT = Math.abs(chi - tou);
      if (diffCB < CLOSE && diffCT < CLOSE) return { key: "senki", label: "戦闘狂", desc: "武力＋知力＋統率型" };
      if (diffCB <= diffCT) return chi >= bu ? { key: "buchi", label: "知>武", desc: "武力と知力の差が50以上" } : { key: "buchi", label: "武>知", desc: "武力と知力の差が50以上" };
      return chi >= tou ? { key: "chitou", label: "知>統", desc: "知力と統率の差が50以上" } : { key: "chitou", label: "統>知", desc: "知力と統率の差が50以上" };
    }
    if (buAbs) {
      const diff = Math.abs(chi - bu);
      if (diff < CLOSE) return { key: "buchi", label: "武知", desc: "武力と知力の差が50未満" };
      return chi >= bu ? { key: "buchi", label: "知>武", desc: "武力と知力の差が50以上" } : { key: "buchi", label: "武>知", desc: "武力と知力の差が50以上" };
    }
    if (touAbs) {
      const diff = Math.abs(chi - tou);
      if (diff < CLOSE) return { key: "chitou", label: "知統", desc: "知力と統率の差が50未満" };
      return chi >= tou ? { key: "chitou", label: "知>統", desc: "知力と統率の差が50以上" } : { key: "chitou", label: "統>知", desc: "知力と統率の差が50以上" };
    }
    return { key: "chi", label: "知", desc: "知力特化型" };
  }
  if (touClose) {
    if (buAbs && chiAbs) {
      const diffTB = Math.abs(tou - bu);
      const diffTC = Math.abs(tou - chi);
      if (diffTB < CLOSE && diffTC < CLOSE) return { key: "senki", label: "戦闘狂", desc: "武力＋知力＋統率型" };
      if (diffTB <= diffTC) return tou >= bu ? { key: "butou", label: "統>武", desc: "武力と統率の差が50以上" } : { key: "butou", label: "武>統", desc: "武力と統率の差が50以上" };
      return tou >= chi ? { key: "chitou", label: "統>知", desc: "知力と統率の差が50以上" } : { key: "chitou", label: "知>統", desc: "知力と統率の差が50以上" };
    }
    if (buAbs) {
      const diff = Math.abs(tou - bu);
      if (diff < CLOSE) return { key: "butou", label: "武統", desc: "武力と統率の差が50未満" };
      return tou >= bu ? { key: "butou", label: "統>武", desc: "武力と統率の差が50以上" } : { key: "butou", label: "武>統", desc: "武力と統率の差が50以上" };
    }
    if (chiAbs) {
      const diff = Math.abs(tou - chi);
      if (diff < CLOSE) return { key: "chitou", label: "知統", desc: "知力と統率の差が50未満" };
      return tou >= chi ? { key: "chitou", label: "統>知", desc: "知力と統率の差が50以上" } : { key: "chitou", label: "知>統", desc: "知力と統率の差が50以上" };
    }
    return { key: "tou", label: "統", desc: "統率特化型" };
  }

  return { key: "nazo", label: "謎", desc: "万能型" };
}

function getType(p) {
  return getTypeInfo(p);
}

function parsePlayers(raw) {
  const players = [];
  const lines = raw.split("\n").filter(l => l.trim());

  for (const line of lines) {
    const cols = line.split("\t");
    if (cols.length < 6) continue;

    // 順位あり形式: cols[0] が数字 → [0]順位 [1]空白 [2]名前 [3]武力...
    // 順位なし形式: cols[0] が空白等  → [0]空白  [1]名前 [2]武力...
    const hasRank = /^\d+$/.test(cols[0].trim());
    const offset = hasRank ? 2 : 1;

    const name = cols[offset]?.trim();
    const bu   = parseInt(cols[offset + 1]?.trim());
    const chi  = parseInt(cols[offset + 2]?.trim());
    const tou  = parseInt(cols[offset + 3]?.trim());
    const sei  = parseInt(cols[offset + 4]?.trim());

    if (!name || isNaN(bu) || isNaN(chi) || isNaN(tou) || isNaN(sei)) continue;
    if (name === "名前" || name === "武力") continue;

    players.push({ name, bu, chi, tou, sei });
  }
  return players;
}

function classify() {
  const raw = document.getElementById("inputData").value;
  const players = parsePlayers(raw);
  const grid = document.getElementById("resultGrid");
  const info = document.getElementById("statsInfo");

  if (players.length === 0) {
    info.textContent = "解析できるデータが見つかりませんでした";
    grid.innerHTML = "";
    return;
  }

  // タイプ情報付きで分類
  const typed = players.map(p => ({ ...p, typeInfo: getTypeInfo(p) }));

  info.textContent = `${players.length} 人を解析`;

  // 注釈用マップを構築（名前→タイプラベル）
  playerTypeMap = {};
  typed.forEach(p => { playerTypeMap[p.name] = p.typeInfo.label; });
  document.getElementById("annotateSection").style.display = "block";

  // keyでグループ化しつつ、ラベルは最初に現れたものを代表に
  const groupMap = new Map();
  typed.forEach(p => {
    const { key, label, desc } = p.typeInfo;
    if (!groupMap.has(key)) {
      groupMap.set(key, { key, label, desc, players: [] });
    }
    // サブラベル（武>知 など）は個別に持たせる
    groupMap.get(key).players.push({ ...p, typeLabel: label });
  });

  // 4行構成で表示順を定義
  const ROW_ORDER = [
    ["bu", "chi", "tou", "sei"],
    ["buchi", "chitou", "butou", "senki"],
    ["buchi_sub_buchi", "butou_sub_butou", "buchi_sub_chibу", "chitou_sub_chitou"],
    ["butou_sub_tou_bu", "chitou_sub_tou_chi", "nazo_80", "nazo"],
  ];

  // サブラベル単位で細分化したグループを作成
  const subGroups = new Map();
  const SUB_KEY_MAP = {
    "武>知":   "bu_chi",
    "武>統":   "bu_tou",
    "武>知統": "bu_chi",   // 武知カードに含める
    "知>武":   "chi_bu",
    "知>統":   "chi_tou",
    "知>武統": "chi_bu",
    "統>武":   "tou_bu",
    "統>知":   "tou_chi",
    "統>武知": "tou_bu",
    "武知":    "buchi",
    "武統":    "butou",
    "知統":    "chitou",
    "戦闘狂":  "senki",
    "武":      "bu",
    "知":      "chi",
    "統":      "tou",
    "政":      "sei",
    "謎":      "nazo",
  };

  // 表示順：ラベルキーのリスト（行×列）
  const DISPLAY_ROWS = [
    ["bu",      "chi",     "tou",    "sei"   ],
    ["buchi",   "chitou",  "butou",  "senki" ],
    ["bu_chi",  "bu_tou",  "chi_bu", "chi_tou"],
    ["tou_bu",  "tou_chi", "nazo",   null    ],
  ];

  // サブラベル単位で再グループ化
  const subGroupMap = new Map();
  typed.forEach(p => {
    const sk = SUB_KEY_MAP[p.typeInfo.label] ?? "nazo";
    if (!subGroupMap.has(sk)) subGroupMap.set(sk, []);
    subGroupMap.get(sk).push({ ...p, typeLabel: p.typeInfo.label });
  });

  // ラベル・説明マップ
  const SUB_LABEL = {
    bu:      { label: "武",    desc: "武力特化型",            style: TYPE_STYLE.bu     },  // 赤
    chi:     { label: "知",    desc: "知力特化型",            style: TYPE_STYLE.chi    },  // 青
    tou:     { label: "統",    desc: "統率特化型",            style: TYPE_STYLE.tou    },  // 緑
    sei:     { label: "政",    desc: "政治特化型",          style: TYPE_STYLE.sei    },  // 黄
    buchi:   { label: "武知",  desc: "武力と知力の差が50未満", style: TYPE_STYLE.buchi  },  // 赤
    chitou:  { label: "知統",  desc: "知力と統率の差が50未満", style: TYPE_STYLE.chitou },  // 青
    butou:   { label: "武統",  desc: "武力と統率の差が50未満", style: TYPE_STYLE.butou  },  // 緑
    senki:   { label: "戦闘狂",desc: "武力＋知力＋統率型",style: TYPE_STYLE.senki },  // 紫
    bu_chi:  { label: "武>知", desc: "武力と知力の差が50以上",   style: TYPE_STYLE.buchi  },  // 赤
    bu_tou:  { label: "武>統", desc: "武力と統率の差が50以上",   style: TYPE_STYLE.buchi  },  // 赤
    chi_bu:  { label: "知>武", desc: "武力と知力の差が50以上",   style: TYPE_STYLE.chitou },  // 青
    chi_tou: { label: "知>統", desc: "知力と統率の差が50以上",   style: TYPE_STYLE.chitou },  // 青
    tou_bu:  { label: "統>武", desc: "武力と統率の差が50以上",   style: TYPE_STYLE.tou    },  // 緑
    tou_chi: { label: "統>知", desc: "知力と統率の差が50以上",   style: TYPE_STYLE.tou    },  // 緑
    nazo:    { label: "謎",    desc: "万能型",        style: TYPE_STYLE.nazo   },  // 灰
  };

  // 描画
  grid.innerHTML = "";
  DISPLAY_ROWS.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "result-row";

    row.forEach(sk => {
      if (!sk) { rowDiv.appendChild(document.createElement("div")); return; }
      const meta = SUB_LABEL[sk];
      const list = subGroupMap.get(sk) || [];
      if (!meta) return;

      const card = document.createElement("div");
      card.className = "type-card";

      const header = document.createElement("div");
      header.className = `type-card-header ${meta.style.header}`;
      header.innerHTML = `
        <div class="type-name">
          <span class="type-badge ${meta.style.badge}">${meta.label}</span>
          <span style="font-size:11px;color:var(--text-dim);font-weight:400">${meta.desc}</span>
        </div>
        <div class="type-count">${list.length}<span>人</span></div>
      `;
      card.appendChild(header);

      const body = document.createElement("div");
      body.className = "type-card-body";

      if (list.length === 0) {
        body.innerHTML = `<span class="empty-msg">該当なし</span>`;
      } else {
        list.forEach(p => {
          const row = document.createElement("div");
          row.className = "player-row";
          const statHtml = STAT_LABELS.map(s => {
            const val = p[s.key];
            const hi = val >= CLOSE ? `stat-highlight ${s.cls}` : "";
            return `<span class="${hi}">${s.label}${val}</span>`;
          }).join(" ");
          row.innerHTML = `
            <span class="player-name">${p.name}</span>
            <span class="player-stats">${statHtml}</span>
          `;
          body.appendChild(row);
        });
      }

      card.appendChild(body);
      rowDiv.appendChild(card);
    });

    grid.appendChild(rowDiv);
  });
}

function clearAll() {
  document.getElementById("inputData").value = "";
  document.getElementById("resultGrid").innerHTML = "";
  document.getElementById("statsInfo").textContent = "";
  document.getElementById("annotateSection").style.display = "none";
  document.getElementById("annotateInput").value = "";
  document.getElementById("annotateOutput").style.display = "none";
  localStorage.removeItem(CACHE_KEY);
}

function clearAnnotate() {
  document.getElementById("annotateInput").value = "";
  document.getElementById("annotateOutput").style.display = "none";
  document.getElementById("annotateOutput").value = "";
}

// 分類済みプレイヤーのマップ（名前→タイプラベル）
let playerTypeMap = {};

// ── キャッシュ ──
const CACHE_KEY = "classify_inputData";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputData");

  // 保存済みデータを復元して自動分類
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    input.value = cached;
    classify();
  }

  // 入力のたびに保存
  input.addEventListener("input", () => {
    localStorage.setItem(CACHE_KEY, input.value);
  });
});

function annotate() {
  const raw = document.getElementById("annotateInput").value.trim();
  const cutNames = document.getElementById("cutNames").checked;
  const cutCount = parseInt(document.getElementById("cutCount").value) || 10;

  if (!raw) return;

  // 「守備 : 」「出兵 : 」などの先頭固定部分を保持
  const colonIdx = raw.indexOf(":");
  const prefix = colonIdx >= 0 ? raw.slice(0, colonIdx + 1).trim() : "";
  const body   = colonIdx >= 0 ? raw.slice(colonIdx + 1).trim() : raw;

  // 名前をスペース区切りで分割（末尾の「(N人)」は除去して保持）
  const countMatch = body.match(/\((\d+人)\)$/);
  const countSuffix = countMatch ? ` (${countMatch[1]})` : "";
  const names = body.replace(/\(\d+人\)$/, "").trim().split(/\s+/).filter(n => n);

  // 先頭N名にカット
  const targets = names.slice(0, cutCount);

  // タイプ付きに変換
  const annotated = targets.map(name => {
    // マップから完全一致 → 前方一致で検索
    let type = playerTypeMap[name];
    if (!type) {
      const key = Object.keys(playerTypeMap).find(k => k.startsWith(name) || name.startsWith(k));
      type = key ? playerTypeMap[key] : "?";
    }
    const displayName = cutNames ? [...name].slice(0, 5).join("") : name;
    return `${displayName}(${type})`;
  });

  const ellipsis = names.length > cutCount ? " ..." : "";
  const result = prefix ? `${prefix} ${annotated.join(" ")}${ellipsis}${countSuffix}` : `${annotated.join(" ")}${ellipsis}${countSuffix}`;

  document.getElementById("annotateResult").textContent = result;
  document.getElementById("annotateOutput").style.display = "block";
}

function copyAnnotation() {
  const text = document.getElementById("annotateResult").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("annotateCopyBtn");
    btn.textContent = "✅ コピー完了";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "📋 コピー"; btn.classList.remove("copied"); }, 2000);
  });
}
