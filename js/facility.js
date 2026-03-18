console.log("JS loaded");

let buildPatterns = [];

document.addEventListener("DOMContentLoaded", function () {

  let selectedFacilities = [];
  let fixedFacilities = [];
  let activeCategories = ["徴兵", "収入", "その他", "固有"];

  const facilityContainer = document.getElementById("facilitySelectContainer");
  const sizeWarning = document.getElementById("sizeWarning");
  const comparisonTable = document.getElementById("comparisonTable");
  const citySelect = document.getElementById("citySelect");
  const sizeStatusBar = document.getElementById("sizeStatusBar");
  const currentResult = document.getElementById("currentResult");

  // =============================
  // 都市描画
  // =============================
  function renderCities() {
    citySelect.innerHTML = "";

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent =
        `${city.name}（農業:${city.agriculture.toLocaleString("ja-JP")} 商業:${city.commerce.toLocaleString("ja-JP")} スペース:${city.facilitySpace}）`;
      citySelect.appendChild(option);
    });
  }

citySelect.addEventListener("change", () => {

  selectedFacilities = [];
  updateSelectedCount();

  const city = cities.find(c => c.id === citySelect.value);

  fixedFacilities = [];

  if (city && city.initialFacilities) {
    fixedFacilities = facilities.filter(f =>
      city.initialFacilities.includes(f.name)
    );
  }

  renderFacilities();
  updateWarning();
  renderCurrentResult();
});

  // =============================
  // フィルタ
  // =============================
  document.querySelectorAll("#facilityFilter input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      activeCategories = Array.from(
        document.querySelectorAll("#facilityFilter input[type=checkbox]:checked")
      ).map(input => input.value);
      renderFacilities();
    });
  });

  // =============================
  // 施設描画（グレーアウト対応版）
  // =============================
function renderFacilities() {

  facilityContainer.innerHTML = "";

  const city = cities.find(c => c.id === citySelect.value);
  if (!city) return;
  const forbidden = city.forbiddenFacilities || [];

  const allFacilities = [...fixedFacilities, ...selectedFacilities];

  facilities
    .filter(f =>
      activeCategories.includes(f.category)
      || selectedFacilities.includes(f)
      || fixedFacilities.includes(f)
    )
    .forEach(f => {

      const label = document.createElement("div");
      label.className = "facility-select";
      // 説明ツールチップ
      if (f.description) {
        const desc = document.createElement("div");
        desc.className = "facility-desc";
        desc.textContent = f.description;
        label.appendChild(desc);

        // ツールチップをbodyに移動してoverflow/z-index制限を完全回避
        document.body.appendChild(desc);

        label.addEventListener("mouseenter", () => {
          if (window.matchMedia("(hover: none)").matches) return;
          const rect = label.getBoundingClientRect();
          const margin = 8;
          const tipW = 240;
          let x = rect.left;
          let y = rect.top - margin;
          // 画面右端を超える場合は右揃えに
          if (x + tipW > window.innerWidth) x = rect.right - tipW;
          // 上に収まらない場合はカードの下に表示
          desc.style.left = x + "px";
          desc.style.top  = y + "px";
          desc.style.opacity = "1";
          // top は描画後に高さが確定してから再計算
          requestAnimationFrame(() => {
            const tipH = desc.offsetHeight;
            let finalY = rect.top - tipH - margin;
            if (finalY < 0) finalY = rect.bottom + margin;
            desc.style.top = finalY + "px";
          });
        });

        label.addEventListener("mouseleave", () => {
          desc.style.opacity = "0";
        });

        // スマホ：長押しで表示、離すと非表示
        let longPressTimer = null;

        label.addEventListener("touchstart", (e) => {
          longPressTimer = setTimeout(() => {
            const touch = e.touches[0];
            const margin = 12;
            const tipW = 240;
            const tipH = desc.offsetHeight || 80;
            let x = touch.clientX + margin;
            let y = touch.clientY - tipH - margin;
            if (x + tipW > window.innerWidth) x = touch.clientX - tipW - margin;
            if (y < 0) y = touch.clientY + margin;
            desc.style.left = x + "px";
            desc.style.top  = y + "px";
            desc.style.opacity = "1";
          }, 500);
        }, { passive: true });

        label.addEventListener("touchend", () => {
          clearTimeout(longPressTimer);
          desc.style.opacity = "0";
        }, { passive: true });

        label.addEventListener("touchmove", () => {
          clearTimeout(longPressTimer);
          desc.style.opacity = "0";
        }, { passive: true });
      }

      const isSelected = selectedFacilities.includes(f);
      const isFixed = fixedFacilities.includes(f);

      if (isSelected) label.classList.add("active");
      if (isFixed) label.classList.add("fixed");

      // ===== 建設可否判定 =====
      let isDisabled = false;
      let isForbidden = false;


      if (!isSelected && !isFixed) {
        const newTotalSize =
          selectedFacilities.reduce((sum, ff) => sum + ff.size, 0)
          + f.size;

        const totalTypes = allFacilities.length;

        // ===== 都市固有の禁止施設 =====
        if (forbidden.includes(f.name)) {
          isDisabled = true;
          isForbidden = true;
        }

        // 6種類制限（selectedのみ）
        if (selectedFacilities.length >= 6) {
          isDisabled = true;
        }

        // スペース制限（fixedは消費しない）
        if (newTotalSize > city.facilitySpace) {
          isDisabled = true;
        }

        // 固定と同名禁止
        if (fixedFacilities.some(ff => ff.name === f.name)) {
          isDisabled = true;
        }
      }

      if (isDisabled) {
        if (isForbidden) {
          label.classList.add("disabled-forbidden");
        } else {
          label.classList.add("disabled");
        }
      }

      // ===== クリック処理 =====
      label.addEventListener("click", () => {

        if (isFixed) return;
        if (
          label.classList.contains("disabled") ||
          label.classList.contains("disabled-forbidden")
        ) return;

        const alreadySelected = selectedFacilities.includes(f);

        if (!alreadySelected) {
          selectedFacilities.push(f);
        } else {
          selectedFacilities =
            selectedFacilities.filter(ff => ff !== f);
        }

        renderFacilities();
        updateWarning();
        updateSelectedCount();
        renderCurrentResult();
      });

      // ===== 以下、既存DOM構造そのまま =====

      const header = document.createElement("div");
      header.className = "facility-header";

      const nameDiv = document.createElement("div");
      nameDiv.textContent = f.name;
      header.appendChild(nameDiv);

      const badgeWrapper = document.createElement("div");
      badgeWrapper.className = "facility-badges";

      const sizeBadge = document.createElement("div");
      sizeBadge.className = "facility-badge size";
      sizeBadge.textContent = `S${f.size}`;
      badgeWrapper.appendChild(sizeBadge);
      if (f.size === 0) sizeBadge.dataset.zero = "true";

      const costBadge = document.createElement("div");
      costBadge.className =
        "facility-badge " + (f.cost.type === "gold" ? "gold" : "rice");
      costBadge.textContent =
        `${f.cost.amount.toLocaleString("ja-JP")}${f.cost.type === "gold" ? "金" : "米"}`;
      badgeWrapper.appendChild(costBadge);

      header.appendChild(badgeWrapper);
      label.appendChild(header);

      const effectsDiv = document.createElement("div");
      effectsDiv.className = "facility-effects";

      let effectText = "";

      if (f.effects.agriculture) {
        effectText += `<span class="agri">農+${f.effects.agriculture.toLocaleString("ja-JP")}</span>`;
      }

      if (f.effects.commerce) {
        if (effectText) effectText += " / ";
        effectText += `<span class="comm">商+${f.effects.commerce.toLocaleString("ja-JP")}</span>`;
      }

      effectsDiv.innerHTML = effectText;
      label.appendChild(effectsDiv);

      facilityContainer.appendChild(label);
    });

  updateWarning();
}

  // =============================
  // サイズ警告
  // =============================
function updateWarning() {

  const city = cities.find(c => c.id === citySelect.value);
  if (!city) return;

  const totalSize =
    selectedFacilities.reduce((sum, f) => sum + f.size, 0);

  // ===== ステータスバー更新 =====
  sizeStatusBar.classList.remove("warning", "danger");

  sizeStatusBar.textContent =
    `使用サイズ ${totalSize} / ${city.facilitySpace}`;

  if (totalSize > city.facilitySpace) {
    sizeStatusBar.classList.add("danger");
  } else if (totalSize === city.facilitySpace) {
    sizeStatusBar.classList.add("warning");
  }

  // ===== 従来警告 =====
  if (totalSize > city.facilitySpace) {
    sizeWarning.textContent =
      `⚠ 施設スペースオーバー`;
  } else {
    sizeWarning.textContent = "";
  }
}

  // =============================
  // 選択数表示
  // =============================
function updateSelectedCount() {
  const el = document.getElementById("selectedCount");
  if (el) el.textContent = selectedFacilities.length;
}

  // =============================
  // 現在構成計算
  // =============================
function calculateCurrentPattern() {

  const city = cities.find(c => c.id === citySelect.value);
  if (!city) return null;

  const allFacilities = [...fixedFacilities, ...selectedFacilities];

  const totalAgriculture =
    city.agriculture +
    allFacilities.reduce((sum, f) => sum + (f.effects.agriculture || 0), 0);

  const totalCommerce =
    city.commerce +
    allFacilities.reduce((sum, f) => sum + (f.effects.commerce || 0), 0);

  const totalGold =
    selectedFacilities
      .filter(f => f.cost.type === "gold")
      .reduce((sum, f) => sum + f.cost.amount, 0);

  const totalRice =
    selectedFacilities
      .filter(f => f.cost.type === "rice")
      .reduce((sum, f) => sum + f.cost.amount, 0);

  const usedSize =
    selectedFacilities.reduce((sum, f) => sum + f.size, 0);

  const maxPopulation =
    (totalAgriculture * 200) +
    (totalCommerce * 100) +
    50000;

  const riceIncome =
    Math.floor(maxPopulation * totalAgriculture / 10000 * 1.5);

  const goldIncome =
    Math.floor(maxPopulation * totalCommerce / 10000 * 1.5);

  // ===== ここが重要 =====
  const sortedFacilityNames =
    facilities
      .filter(f => allFacilities.includes(f))
      .map(f => f.name);

  return {
    cityName: city.name,
    facilities: sortedFacilityNames,   // ← これが必須
    totalAgriculture,
    totalCommerce,
    totalGold,
    totalRice,
    usedSize,
    maxSize: city.facilitySpace,
    maxPopulation,
    riceIncome,
    goldIncome
  };
}

  // =============================
  // 現在構成表示
  // =============================
function renderCurrentResult() {

  const pattern = calculateCurrentPattern();
  if (!pattern) return;

  currentResult.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "result-wrapper";

  const main = document.createElement("div");
  main.className = "result-main";

  // 最大人口（フル幅）
  const popCard = document.createElement("div");
  popCard.className = "result-main-card";
  popCard.innerHTML = `<h3>最大人口</h3><div class="value">${pattern.maxPopulation.toLocaleString("ja-JP")}</div>`;
  main.appendChild(popCard);

  // 農業・商業（横2分割）
  const agriComm = document.createElement("div");
  agriComm.className = "result-agri-comm";
  agriComm.innerHTML = `
    <div class="result-main-card">
      <h3>農業</h3>
      <div class="value">${pattern.totalAgriculture.toLocaleString("ja-JP")}</div>
    </div>
    <div class="result-main-card">
      <h3>商業</h3>
      <div class="value">${pattern.totalCommerce.toLocaleString("ja-JP")}</div>
    </div>
  `;
  main.appendChild(agriComm);
  wrapper.appendChild(main);

  // サブ情報（2列グリッド）
  const sub = document.createElement("div");
  sub.className = "result-sub";

  const subItems = [
    ["米収入", pattern.riceIncome.toLocaleString("ja-JP")],
    ["金収入", pattern.goldIncome.toLocaleString("ja-JP")],
    ["費用(米)", pattern.totalRice.toLocaleString("ja-JP")],
    ["費用(金)", pattern.totalGold.toLocaleString("ja-JP")],
  ];

  subItems.forEach(([label, val]) => {
    const div = document.createElement("div");
    div.innerHTML = `${label}<span>${val}</span>`;
    sub.appendChild(div);
  });

  wrapper.appendChild(sub);
  currentResult.appendChild(wrapper);
}

  // =============================
  // 比較追加
  // =============================
  document.getElementById("addPatternBtn").addEventListener("click", () => {
    const pattern = calculateCurrentPattern();
    if (!pattern) return;

    buildPatterns.push(pattern);
    renderComparisonTable();
  });

  // =============================
  // 比較テーブル描画
  // =============================
function renderComparisonTable() {

  comparisonTable.innerHTML = "";

  if (buildPatterns.length === 0) return;

  const maxRiceIncome = Math.max(...buildPatterns.map(p => p.riceIncome));
  const maxGoldIncome = Math.max(...buildPatterns.map(p => p.goldIncome));

  // ===== ヘッダー行 =====
  const headerRow = comparisonTable.insertRow();

  const firstTh = document.createElement("th");
  firstTh.textContent = "項目";
  headerRow.appendChild(firstTh);

  buildPatterns.forEach((pattern, index) => {

    const th = document.createElement("th");

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";

    const title = document.createElement("span");
    title.textContent = `案${index + 1}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.color = "#cc0000";
    deleteBtn.style.fontWeight = "bold";

    deleteBtn.addEventListener("click", () => {
      buildPatterns.splice(index, 1);
      renderComparisonTable();
    });

    wrapper.appendChild(title);
    wrapper.appendChild(deleteBtn);
    th.appendChild(wrapper);

    headerRow.appendChild(th);
  });

  // ===== データ行 =====
  const rows = [
    ["都市", p => p.cityName],
    ["施設", p => p.facilities.join(", ")],
    ["サイズ", p => `${p.usedSize}/${p.maxSize}`],
    ["農業", p => p.totalAgriculture.toLocaleString("ja-JP")],
    ["商業", p => p.totalCommerce.toLocaleString("ja-JP")],
    ["最大人口", p => p.maxPopulation.toLocaleString("ja-JP")],
    ["最大収入(米)", p => p.riceIncome.toLocaleString("ja-JP")],
    ["最大収入(金)", p => p.goldIncome.toLocaleString("ja-JP")],
    ["建設費用(米)", p => p.totalRice.toLocaleString("ja-JP")],
    ["建設費用(金)", p => p.totalGold.toLocaleString("ja-JP")]
  ];

  rows.forEach(rowDef => {
    const row = comparisonTable.insertRow();
    row.insertCell().textContent = rowDef[0];

    buildPatterns.forEach(pattern => {

      const cell = row.insertCell();
      const value = rowDef[1](pattern);
      cell.textContent = value;

      // ===== ハイライト判定 =====
      if (rowDef[0] === "最大収入(米)" && pattern.riceIncome === maxRiceIncome) {
        cell.classList.add("highlight-max");
      }

      if (rowDef[0] === "最大収入(金)" && pattern.goldIncome === maxGoldIncome) {
        cell.classList.add("highlight-max");
      }

    });
  });
}

  // =============================
  // 初期化
  // =============================
  renderCities();
  renderFacilities();
  renderCurrentResult();

});