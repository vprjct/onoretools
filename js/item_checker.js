// item_checker.js — 所持チェッカーロジック

const OWNED_KEY = "item_checker_owned";

// 所持済みセット（アイテム名のSet）
let ownedSet = new Set(JSON.parse(localStorage.getItem(OWNED_KEY) || "[]"));

// ── 初期化 ──
document.addEventListener("DOMContentLoaded", () => {
  renderItems();
  updateStats();
});

// ── アイテムグリッド描画 ──
function renderItems() {
  const grid = document.getElementById("itemGrid");
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  grid.innerHTML = "";

  ITEMS.forEach(item => {
    const isOwned = ownedSet.has(item.name);
    const matchSearch = !query
      || item.name.toLowerCase().includes(query)
      || item.effect.toLowerCase().includes(query);

    const card = document.createElement("div");
    card.className = "item-card" + (isOwned ? " owned" : "") + (!matchSearch ? " hidden" : "");

    card.innerHTML = `
      <div class="item-owned-badge">✓ 所持済み</div>
      <div class="item-name">${item.name}</div>
      ${item.effect ? `<div class="item-effect">${item.effect}</div>` : ""}
      ${item.price ? `<div class="item-price">${Number(item.price).toLocaleString("ja-JP")} 金</div>` : ""}
    `;

    // クリックで所持トグル
    card.addEventListener("click", () => {
      if (ownedSet.has(item.name)) {
        ownedSet.delete(item.name);
      } else {
        ownedSet.add(item.name);
      }
      saveOwned();
      renderItems();
      updateStats();
    });

    grid.appendChild(card);
  });
}

// ── カンマ区切り入力を反映 ──
function applyOwned() {
  const raw = document.getElementById("ownedInput").value;
  const names = raw.split(",").map(s => s.trim()).filter(s => s);

  names.forEach(name => {
    // 完全一致 → 前方一致の順で検索
    const found = ITEMS.find(i => i.name === name)
      ?? ITEMS.find(i => i.name.includes(name) || name.includes(i.name));
    if (found) ownedSet.add(found.name);
  });

  saveOwned();
  renderItems();
  updateStats();
}

// ── クリア ──
function clearOwned() {
  ownedSet.clear();
  document.getElementById("ownedInput").value = "";
  saveOwned();
  renderItems();
  updateStats();
}

// ── 保存 ──
function saveOwned() {
  localStorage.setItem(OWNED_KEY, JSON.stringify([...ownedSet]));
}

// ── 統計表示 ──
function updateStats() {
  const total = ITEMS.length;
  const owned = ownedSet.size;
  document.getElementById("checkerStats").textContent = `${owned} / ${total} 所持`;
}
