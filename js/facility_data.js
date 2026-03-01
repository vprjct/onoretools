// 施設データ
function createFacility(id, name, costAmount, costType, size, agriculture, commerce, technology, description, category) {
  return { id, name, cost: { type: costType, amount: costAmount }, size, effects: { agriculture, commerce, technology }, description, category };
}

window.facilities = [
  createFacility("barracks", "兵舎", 100000, "gold", 2, 0, 0, 0, "この施設がある都市に滞在すると訓練が自動的に行われ、毎月訓練度が20上がる。", "その他"),
  createFacility("samuraiTown", "武家町", 50000, "gold", 1, 0, 100, 0, "歩兵系兵種の徴兵が可能になる。", "徴兵"),
  createFacility("archeryDojo", "弓道場", 30000, "gold", 0, 0, 100, 0, "弓系兵種（弓兵）の徴兵が可能になる。", "徴兵"),
  createFacility("gunTown", "鉄砲町", 80000, "gold", 1, 0, 200, 0, "弓系兵種（弓兵・鉄砲系）の徴兵が可能になる。", "徴兵"),
  createFacility("ranch", "牧場", 50000, "gold", 1, 100, 0, 0, "騎兵系兵種の徴兵が可能になる。", "徴兵"),
  createFacility("ninjaVillage", "忍の里", 100000, "rice", 0, 0, 0, 0, "忍者系兵種の徴兵が可能になる。", "徴兵"),
  createFacility("grandShrine", "大社", 120000, "rice", 0, 100, 0, 0, "神道系の徴兵を可能にする。呪われた品物を売却することが出来る。", "徴兵"),
  createFacility("templeTown", "寺町", 120000, "rice", 0, 100, 0, 0, "僧兵系の徴兵を可能にする。また、呪われたアイテムを売却することが出来る。", "徴兵"),
  createFacility("monzenTown", "門前町", 200000, "rice", 1, 100, 100, 0, "寺町、大社の効果を併せ持つ。呪われたアイテムを売却することが出来る。", "徴兵"),
  createFacility("artisanTown", "職人町", 80000, "gold", 1, 0, 200, 0, "武器や品物の購入にかかる更新時間が半分に短縮される。", "その他"),
  createFacility("nanbanTown", "南蛮町", 200000, "gold", 1, 0, 500, 50, "南蛮由来の武器やアイテムが購入可能になり、南蛮系兵種の徴兵が可能になる。", "徴兵"),
  createFacility("innTown", "宿場町", 50000, "rice", 0, 0, 200, 0, "都市の内政値を自動的に回復させる。効果を発揮すると都市兵糧が減り治安が低下する。", "収入"),
  createFacility("shipyard", "造船所", 80000, "gold", 1, 0, 200, 0, "船兵種の徴兵を可能にする。", "徴兵"),
  createFacility("ironworks", "鉄工所", 250000, "gold", 2, 0, 300, 100, "鉄砲町・職人町の効果を併せ持つ。武器や品物の購入にかかる更新時間が半分に短縮され、必要技術が免除される。", "徴兵"),
  createFacility("navalPort", "軍港", 300000, "gold", 2, 0, 500, 100, "造船所と鉄工所の効果を併せ持つ。支配都市が10を超えると建設が可能になる。", "徴兵"),
  createFacility("suburbanExpansion", "郊外拡張", 200000, "gold", -1, 0, 0, 0, "その都市の都市サイズを1拡張する。", "その他"),
  createFacility("market", "市場", 40000, "gold", 3, 0, 300, 0, "都市資金への収入が1,7月の二度になる。", "収入"),
  createFacility("merchantTown", "商人町", 120000, "gold", 2, 0, 800, 0, "都市資金への収入が1,7月の二度になる。市場がないと建設不可。", "収入"),
  createFacility("rakuichiRakuza", "楽市楽座", 200000, "gold", 1, 0, 1200, 0, "都市資金への収入が1,7月の二度になる。商人町がないと建設不可。", "収入"),
  createFacility("tradingPort", "貿易港", 300000, "gold", 1, 0, 1500, 0, "都市資金への収入が1,7月の二度になり、楽市楽座がないと建設不可。南蛮町の効果も併せ持つ。", "収入"),
  createFacility("govMerchant", "御用商人", 100000, "gold", 1, 300, 300, 0, "農商+300。珍しい武器・アイテムが購入でき、米売買での取扱量が増える。（この施設がある都市のみ有効）", "収入"),
  createFacility("teaRoom", "茶室", 50000, "gold", 0, 0, 100, 0, "珍しい茶器やアイテムが購入できるかも知れない。", "収入"),
  createFacility("farmVillage", "農村", 40000, "rice", 2, 300, 0, 0, "都市兵糧への収入が1,7月の二度になる。", "収入"),
  createFacility("newRiceSettlement", "新田集落", 80000, "rice", 1, 600, 0, 0, "都市兵糧への収入が1,7月の二度になる。荒地を開拓・干拓を進めて新しく設定された農業集落。", "収入"),
  createFacility("rural", "田園", 100000, "rice", 0, 500, 0, 0, "農業値が増加する。", "収入"),
  createFacility("mine", "鉱山", 100000, "gold", 1, 0, 2000, 0, "都市資金への収入が1,7月の二度になる。", "収入"),
  createFacility("quarry", "採掘場", 100000, "gold", 3, 0, 0, 0, "鉱石を採掘する施設。採掘のコマンドが使用可能になる。", "その他"),
  createFacility("fishingVillage", "漁村", 50000, "rice", 1, 300, 100, 0, "都市兵糧への収入が1,7月の二度になる。少し商業も上がる。", "収入"),
  createFacility("fishingPort", "漁港", 100000, "rice", 1, 600, 100, 0, "都市兵糧への収入が1,7月の二度になる。漁を行うために必要な各種施設が用意された港。", "収入"),
  createFacility("canal", "運河", 120000, "gold", 0, 1000, 1000, 0, "都市資金と兵糧の収入が1,7月の二度になる。", "収入"),

createFacility("nanbanBarracks", "南蛮兵舎", 120000, "gold", 2, 0, 500, 0, "織田家の固有施設。兵舎と南蛮町の機能を併せ持つ。", "固有"),

createFacility("koshuMilitary", "甲州流軍学所", 100000, "rice", 0, 200, 0, 0, "武田家の固有施設。牧場・忍びの機能を併せ持つ。", "固有"),

createFacility("echigoMilitary", "越後流軍学所", 120000, "gold", 0, 200, 0, 0, "上杉家の固有施設。牧場・門前町の機能を併せ持つ。", "固有"),

createFacility("gouju", "郷中", 120000, "gold", 2, 0, 200, 0, "島津家の固有施設。兵舎と武家町の機能を併せ持つ。", "固有"),

createFacility("bukeResidence", "武家屋敷", 120000, "gold", 2, 0, 200, 0, "徳川家の固有施設。兵舎と武家町の機能を併せ持つ。", "固有"),

createFacility("dokuganryuJinsho", "独眼竜陣所", 300000, "gold", 2, 0, 300, 0, "伊達家の固有施設。兵舎と鉄工所の機能を併せ持つ。（要：鉄砲or職人）", "固有"),

createFacility("cathedral", "大聖堂", 200000, "gold", 1, 0, 500, 0, "大友家の固有施設。南蛮町・門前町の機能を併せ持つ。", "固有"),

createFacility("souGamae", "総構え", 120000, "gold", 1, 600, 0, 0, "北条家の固有施設。兵舎・忍びの里・石垣の機能を併せ持つ。", "固有"),

createFacility("matsushitaJuku", "松下村塾", 120000, "gold", 2, 0, 200, 0, "毛利家の固有施設。兵舎と武家町の機能を併せ持つ。", "固有"),

createFacility("honganji", "本願寺", 100000, "rice", 1, 500, 500, 0, "本願寺家の固有施設。鉄砲町・門前町の機能を併せ持つ。お布施がたくさん集まるので農商+500。", "固有"),

createFacility("amidadou", "阿弥陀堂", 100000, "gold", 1, 500, 500, 0, "本願寺家の固有施設。本願寺の機能を持ちオリジナル兵種が徴兵可能になる。（国宝に阿弥陀仏が必要）各国1つ、かつMAPで3つしか建立できない。", "固有"),

createFacility("ryouden", "一領具足領田", 100000, "rice", 1, 300, 0, 0, "長宗我部家の固有施設。兵舎と武家・農村の機能を併せ持つ。", "固有"),

createFacility("kugeMachi", "公家町", 120000, "gold", 2, 0, 200, 0, "今川家の固有施設。兵舎・武家の機能を併せ持つ。", "固有"),

createFacility("guntansho", "軍屯所", 100000, "rice", 2, 300, 0, 0, "曹家の固有施設。兵舎・武家・農村の機能を併せ持つ。", "固有"),

createFacility("doujakudai", "銅雀台", 300000, "gold", 0, 1000, 1000, 0, "曹家の象徴施設。銅雀を国宝にすると建設が可能になる。曹家の権力と文化の象徴。農商+1000。", "固有"),

createFacility("ryousoufu", "丞相府", 1000000, "gold", 2, 300, 0, 0, "曹家の固有施設。玉璽を国宝にすると建設が可能になる。兵舎・武家・鉄砲町、牧場の機能を併せ持つ。", "固有"),

createFacility("floatingCastle", "浮遊城", 120000, "gold", 2, 0, 200, 0, "幻想戦記文明の固有施設。兵舎と武家町の機能を併せ持つ。", "固有"),

createFacility("lordMansion", "領主館", 120000, "gold", 2, 0, 200, 0, "nika文明の固有施設。兵舎と武家町の機能を併せ持つ。", "固有"),

createFacility("pyramid", "ピラミッド", 1000000, "rice", 1, 1000, 1000, 0, "全国に一つしか建設できない特殊施設。農商+1000。米売買での取扱量が増える。（この施設がある都市のみ有効）", "固有"),

createFacility("earthReligion", "地球教本部", 120000, "gold", 0, 1000, 1000, 0, "地球の固有施設。宿場町と経済コロニーの効果を持つ。怪しいネットワークで資金・兵糧が集まる。", "固有"),

createFacility("fezzan", "フェザーン自治領", 1000000, "rice", 0, 1000, 2000, 0, "都市資金・兵糧への収入が1,7月の二度になる。商業+2,000、農業+1,000。米売買での取扱量が増える。（この施設がある都市のみ有効）", "固有"),

createFacility("newMukyuu", "新無憂宮", 0, "rice", 0, 0, 200, 0, "銀河帝国の首都星オーディンにあるゴールデンバウム王朝の皇宮。開祖ルドルフ大帝の「自分の足で歩けぬ者に人類の支配者たる資格無し」という信念の元、エスカレーターやエレベーター、自動ドアのようなものは一切存在しないダイエット向きの王宮。", "固有"),

createFacility("marchRabbit", "三月兎亭", 0, "rice", 0, 0, 200, 0, "読みは「マーチ・ラビット」。自由惑星同盟の首都ハイネセンにあるレストラン。店名の由来は「不思議の国のアリス」の登場キャラクターからと思われる。", "固有")
];

const uniqueFacilities = [

{
  id: "nanban_barracks",
  name: "南蛮兵舎",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 2,
  effects: { agriculture: 0, commerce: 500 },
  description: "織田家の固有施設。兵舎と南蛮町の機能を併せ持つ。"
},

{
  id: "koshu_military",
  name: "甲州流軍学所",
  category: "unique",
  cost: { type: "rice", amount: 100000 },
  size: 0,
  effects: { agriculture: 200, commerce: 0 },
  description: "武田家の固有施設。"
},

{
  id: "echigo_military",
  name: "越後流軍学所",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 0,
  effects: { agriculture: 200, commerce: 0 },
  description: "上杉家の固有施設。"
},

{
  id: "gouju",
  name: "郷中",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 2,
  effects: { agriculture: 0, commerce: 200 },
  description: "島津家の固有施設。"
},

{
  id: "buke_residence",
  name: "武家屋敷",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 2,
  effects: { agriculture: 0, commerce: 200 },
  description: "徳川家の固有施設。"
},

{
  id: "dokuganryu",
  name: "独眼竜陣所",
  category: "unique",
  cost: { type: "gold", amount: 300000 },
  size: 2,
  effects: { agriculture: 0, commerce: 300 },
  description: "伊達家の固有施設。"
},

{
  id: "cathedral",
  name: "大聖堂",
  category: "unique",
  cost: { type: "gold", amount: 200000 },
  size: 1,
  effects: { agriculture: 0, commerce: 500 },
  description: "大友家の固有施設。"
},

{
  id: "sou_gamae",
  name: "総構え",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 1,
  effects: { agriculture: 600, commerce: 0 },
  description: "北条家の固有施設。"
},

{
  id: "matsushita",
  name: "松下村塾",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 2,
  effects: { agriculture: 0, commerce: 200 },
  description: "毛利家の固有施設。"
},

{
  id: "honganji",
  name: "本願寺",
  category: "unique",
  cost: { type: "rice", amount: 100000 },
  size: 1,
  effects: { agriculture: 500, commerce: 500 },
  description: "本願寺家の固有施設。"
},

{
  id: "amidadou",
  name: "阿弥陀堂",
  category: "unique",
  cost: { type: "gold", amount: 100000 },
  size: 1,
  effects: { agriculture: 500, commerce: 500 },
  description: "本願寺家の固有施設。"
},

{
  id: "ryouden",
  name: "一領具足領田",
  category: "unique",
  cost: { type: "rice", amount: 100000 },
  size: 1,
  effects: { agriculture: 300, commerce: 0 },
  description: "長宗我部家の固有施設。"
},

{
  id: "kujyou_machi",
  name: "公家町",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 2,
  effects: { agriculture: 0, commerce: 200 },
  description: "今川家の固有施設。"
},

{
  id: "guntan",
  name: "軍屯所",
  category: "unique",
  cost: { type: "rice", amount: 100000 },
  size: 2,
  effects: { agriculture: 300, commerce: 0 },
  description: "曹家の固有施設。"
},

{
  id: "doujakudai",
  name: "銅雀台",
  category: "unique",
  cost: { type: "gold", amount: 300000 },
  size: 0,
  effects: { agriculture: 1000, commerce: 1000 },
  description: "曹家の象徴施設。"
},

{
  id: "pyramid",
  name: "ピラミッド",
  category: "unique",
  cost: { type: "rice", amount: 1000000 },
  size: 1,
  effects: { agriculture: 1000, commerce: 1000 },
  description: "全国に一つの特殊施設。"
},

{
  id: "earth_religion",
  name: "地球教本部",
  category: "unique",
  cost: { type: "gold", amount: 120000 },
  size: 0,
  effects: { agriculture: 1000, commerce: 1000 },
  description: "地球の固有施設。"
},

{
  id: "fezzan",
  name: "フェザーン自治領",
  category: "unique",
  cost: { type: "rice", amount: 1000000 },
  size: 0,
  effects: { agriculture: 1000, commerce: 2000 },
  description: "商業+2000 農業+1000。"
}

];

// 都市
window.cities = [
  {
    id: "capitalPlanet",
    name: "首都惑星",
    agriculture: 1200,
    commerce: 2000,
    facilitySpace: 7,
    forbiddenFacilities: ["造船所", "軍港","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲"]
  },
  {
    id: "newPlanet",
    name: "新興惑星",
    agriculture: 900,
    commerce: 900,
    facilitySpace: 6,
    forbiddenFacilities: ["造船所", "軍港","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "agriPlanet",
    name: "農業惑星",
    agriculture: 1300,
    commerce: 1000,
    facilitySpace: 5,
    initialFacilities: ["牧場"],
    forbiddenFacilities: ["造船所", "軍港","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "industrialPlanet",
    name: "工業惑星",
    agriculture: 1000,
    commerce: 1300,
    facilitySpace: 6,
    forbiddenFacilities: ["造船所", "軍港","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "religiousPlanet",
    name: "宗教惑星",
    agriculture: 1000,
    commerce: 1000,
    facilitySpace: 6,
    initialFacilities: ["門前町"],
    forbiddenFacilities: ["大社", "寺町","造船所", "軍港","採掘場","漁村","漁港","運河","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "fortressPlanet",
    name: "要塞惑星",
    agriculture: 1000,
    commerce: 1000,
    facilitySpace: 6,
    forbiddenFacilities: ["造船所", "軍港","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "resourcePlanet",
    name: "資源惑星",
    agriculture: 800,
    commerce: 1200,
    facilitySpace: 6,
    forbiddenFacilities: ["造船所", "軍港","漁村","漁港","運河","地球教本部","イゼルローン要塞","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "tradePlanet",
    name: "商業惑星",
    agriculture: 500,
    commerce: 2000,
    facilitySpace: 3,
    forbiddenFacilities: ["南蛮町","造船所", "軍港","貿易港","新田集落","採掘場","漁村","漁港","運河","地球教本部","イゼルローン要塞","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  },
  {
    id: "giantFortress",
    name: "巨大要塞",
    agriculture: 600,
    commerce: 600,
    facilitySpace: 3,
    forbiddenFacilities: ["造船所", "軍港","貿易港","農村","新田集落","採掘場","漁村","漁港","運河","総構え","地球教本部","フェザーン自治領","硬X線ビーム砲","アルテミスの首飾り","新無憂宮","三月兎亭"]
  }
];
