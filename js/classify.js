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
function classifyPlayer({ bu, chi, tou, sei }) {
  const stats = [
    { key: "bu",  label: "武", value: bu },
    { key: "chi", label: "知", value: chi },
    { key: "tou", label: "統", value: tou },
    { key: "sei", label: "政", value: sei },
  ];

  const max = Math.max(...stats.map(s => s.value));
  const threshold = max < 80 ? 40 : 50;
  const group = stats.filter(s => max - s.value < threshold || (s.value >= 80 && s.key !== "sei") || s.value > 100);

  // 謎官判定
  if (group.length === 4) return { key: "nazo", label: "謎", desc: "品格" };
  if (group.length === 3 && group.some(s => s.key === "sei")) return { key: "nazo", label: "謎", desc: "品格" };

  // 戦闘狂判定
  if (group.length === 3) return { key: "senki", label: "戦闘狂", desc: "武力＋知力＋統率型" };

  // 1能力特化
  if (group.length === 1) {
    const h = group[0];
    return { key: h.key, label: h.label, desc: `${h.label}力特化型` };
  }

  // 2能力複合
  const [a, b] = group;
  const comboKey = a.key + b.key;
  const diff = a.value - b.value;
  if (diff > 50)  return { key: comboKey, label: `${a.label}>${b.label}`, desc: `${a.label}力と${b.label}力の差が50以上` };
  if (diff < -50) return { key: comboKey, label: `${b.label}>${a.label}`, desc: `${a.label}力と${b.label}力の差が50以上` };
  return { key: comboKey, label: a.label + b.label, desc: `${a.label}力と${b.label}力の複合型` };
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
  const typed = players.map(p => ({ ...p, typeInfo: classifyPlayer(p) }));
  typed.forEach(p => { playerTypeMap[p.name] = p.typeInfo.label; });

  info.textContent = `${players.length} 人を解析`;

  document.getElementById("annotateSection").style.display = "block";

  // サブラベル単位で細分化したグループを作成
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
    "武政":    "busei",
    "武>政":   "busei",
    "政>武":   "busei",
    "知政":    "chisei",
    "知>政":   "chisei",
    "政>知":   "chisei",
    "統政":    "tousei",
    "統>政":   "tousei",
    "政>統":   "tousei",
  };

  // 表示順：ラベルキーのリスト（行×列）
  const DISPLAY_ROWS = [
    ["bu",      "chi",     "tou",    "sei"   ],
    ["buchi",   "chitou",  "butou",  "busei" ],
    ["bu_chi",  "chi_bu",  "tou_bu", "chisei"],
    ["bu_tou",  "chi_tou", "tou_chi", "tousei" ],
    ["senki",   "nazo" ],
  ];

  // サブラベル単位で再グループ化
  const subGroupMap = new Map();
  typed.forEach(p => {
    console.log(p.typeInfo.label);
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
    butou:   { label: "武統",  desc: "武力と統率の差が50未満",  style: TYPE_STYLE.butou  },  // 緑
    senki:   { label: "戦闘狂",desc: "武力＋知力＋統率型",      style: TYPE_STYLE.senki },  // 紫
    bu_chi:  { label: "武>知", desc: "武力と知力の差が50以上",  style: TYPE_STYLE.buchi  },  // 赤
    bu_tou:  { label: "武>統", desc: "武力と統率の差が50以上",  style: TYPE_STYLE.buchi  },  // 赤
    chi_bu:  { label: "知>武", desc: "武力と知力の差が50以上",  style: TYPE_STYLE.chitou },  // 青
    chi_tou: { label: "知>統", desc: "知力と統率の差が50以上",  style: TYPE_STYLE.chitou },  // 青
    tou_bu:  { label: "統>武", desc: "武力と統率の差が50以上",  style: TYPE_STYLE.tou    },  // 緑
    tou_chi: { label: "統>知", desc: "知力と統率の差が50以上",  style: TYPE_STYLE.tou    },  // 緑
    nazo:    { label: "謎",    desc: "品格",                   style: TYPE_STYLE.nazo   },  // 灰
    busei:   { label: "武政",  desc: "武力＋政治",              style: TYPE_STYLE.sei    },  // 黄
    chisei:  { label: "知政",  desc: "知力＋政治",              style: TYPE_STYLE.sei    },  // 黄
    tousei:  { label: "統政",  desc: "統率＋政治",              style: TYPE_STYLE.sei    },  // 黄
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
  const targets = [
    document.getElementById("resultGrid"),
    document.getElementById("statsInfo"),
    document.getElementById("annotateSection"),
    document.getElementById("annotateOutput"),
  ].filter(Boolean);

  // inputData は即座にクリア
  document.getElementById("inputData").value = "";

  // 他の要素はフェードアウト
  targets.forEach(el => {
    el.style.transition = "opacity 0.4s ease";
    el.style.opacity = "0";
  });

  setTimeout(() => {
    document.getElementById("resultGrid").innerHTML = "";
    document.getElementById("statsInfo").textContent = "";
    document.getElementById("annotateSection").style.display = "none";
    document.getElementById("annotateInput").value = "";
    document.getElementById("annotateOutput").style.display = "none";
    localStorage.removeItem(CACHE_KEY);

    targets.forEach(el => {
      el.style.transition = "";
      el.style.opacity = "";
    });
  }, 400);
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
