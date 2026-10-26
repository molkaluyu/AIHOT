// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "ocean", tagColor: "blue", label: "海运", feedLabel: "海运", section: "海运与航线", guide: "班轮、舱位、航线和船司运力：空班、跳港、航线调整，以及主因在船期或舱位一侧的港口拥堵。码头、仓库等设施本身的启用与扩建归枢纽；运价指数和现货/合约报价归运价。" },
  { key: "air", tagColor: "turquoise", label: "空运", feedLabel: "空运", section: "空运与运力", guide: "货机与客机腹舱、空运价格和机场货运运力。机场货站、跑道等设施本身归枢纽；只报运价指数、不讲一条航线或一家航司运力的归运价。" },
  { key: "land", tagColor: "green", label: "陆运", feedLabel: "陆运", section: "陆运与多式联运", guide: "公路、铁路、中欧班列、卡航和跨境陆运，以及海陆空之间的联运安排。只讲末端派送的归快递；口岸的关税、制裁和海关规则归政策。" },
  { key: "express", tagColor: "lime", label: "快递", feedLabel: "快递", section: "快递与末端", guide: "国际快递、跨境电商物流和末端配送。干线海运、空运、铁路本身归对应运输方式；快递公司的融资并购、人事和诉讼归行业。" },
  { key: "rates", tagColor: "orange", label: "运价", feedLabel: "运价", section: "运价与市场", guide: "运价指数、现货与合约价格、运力供需和旺淡季。某一条航线或一家船司、航司的具体舱位调整归海运、空运或陆运；公司经营本身归行业。" },
  { key: "hubs", tagColor: "wathet", label: "枢纽", feedLabel: "枢纽", section: "港口仓储", guide: "港口码头、仓库、转运中心和基础设施，看的是设施侧。拥堵、跳港若主因是船期和舱位，归海运；仓储系统软件归科技。" },
  { key: "policy", tagColor: "carmine", label: "政策", feedLabel: "政策", section: "贸易与合规", guide: "关税、制裁、海关、出口管制和贸易协定。公司因此改航线或运力，动作本身归对应运输方式；诉讼和并购归行业。" },
  { key: "industry", tagColor: "violet", label: "行业", feedLabel: "行业", section: "公司与并购", guide: "船司、货代和 3PL 已发生的融资并购、人事、合作与诉讼。运价、运力或政策文本不因出现公司名就归到这里。" },
  { key: "tech", tagColor: "indigo", label: "科技", feedLabel: "科技", section: "物流科技", guide: "TMS、WMS、货物可见性、自动化和物流数字化产品。用这些系统完成的一次运输操作仍归对应运输方式；公司融资归行业。" },
  { key: "opinion", tagColor: "purple", label: "观点", feedLabel: "观点", section: "分析与观点", guide: "重点是作者的判断、预测、评论或访谈观点。可复用的做法不要挤在这里，归它讲解的那种运输、枢纽或科技。讨论市场不自动归运价，已发生的事实不因带态度变成观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（物流站是运价信号）：日报报头的计数、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "rates", tag: "运价变动", unit: "条运价信号" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = [
  "teu", "feu", "fcl", "lcl", "bl", "bol", "demurrage", "detention", "eta", "etd", "scfi", "wci", "3pl", "4pl", "aftn",
];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = [
  "capacity_change", "rate_move", "hub_disruption", "trade_policy", "carrier_corporate", "product_tech", "practice_guide", "opinion_analysis",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "运力调整", "运价变动", "航线/网络", "港口仓储", "快递末端", "贸易合规", "公司动态", "融资并购", "物流科技", "事故Disruption", "实务指南", "分析观点", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "集装箱", "散货", "冷链", "跨境电商", "最后一公里", "碳排/ESG", "数字化", "自动化", "制裁合规", "旺季", "中欧班列", "美线", "欧线", "亚太", "中东/红海",
] as const;

/** 可选的实体标签（公司、机构、平台）。完整名录等确认后再补。 */
export const ENTITY_TAGS = ["Maersk", "MSC", "COSCO", "Amazon", "Flexport"] as const;

/** 模型常写的近义词，统一成词表里的写法。主题标签和实体标签不要写在这里，否则会被改写成分类标签。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  运力: "运力调整", 舱位: "运力调整", 停航: "运力调整", 空班: "运力调整", capacity: "运力调整", blanking: "运力调整",
  运价: "运价变动", 运费: "运价变动", 费率: "运价变动", rate: "运价变动", rates: "运价变动", "freight rate": "运价变动",
  航线: "航线/网络", 班轮: "航线/网络", loop: "航线/网络",
  港口: "港口仓储", 码头: "港口仓储", 仓库: "港口仓储", 仓储: "港口仓储", port: "港口仓储", terminal: "港口仓储", warehouse: "港口仓储",
  快递: "快递末端", 末端: "快递末端", parcel: "快递末端", "last mile": "快递末端",
  关税: "贸易合规", 制裁: "贸易合规", 海关: "贸易合规", 合规: "贸易合规", 出口管制: "贸易合规",
  tariff: "贸易合规", tariffs: "贸易合规", sanction: "贸易合规", sanctions: "贸易合规", customs: "贸易合规",
  人事: "公司动态", 诉讼: "公司动态", 合作: "公司动态",
  融资: "融资并购", 并购: "融资并购", 收购: "融资并购", 投资: "融资并购",
  tms: "物流科技", wms: "物流科技", 可见性: "物流科技", visibility: "物流科技",
  事故: "事故Disruption", 中断: "事故Disruption", disruption: "事故Disruption",
  指南: "实务指南", 实务: "实务指南", 教程: "实务指南", 实践: "实务指南", "how-to": "实务指南",
  观点: "分析观点", 评论: "分析观点", 预测: "分析观点", commentary: "分析观点",
  其他: "其他", other: "其他",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 * 这里只放少量公开公司名作骨架，完整名录等确认后再补；不要编造域名。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  maersk: { name: "Maersk", displayTag: "Maersk", aliases: ["Maersk", "马士基"], orgNames: ["A.P. Moller - Maersk", "Maersk"], otherNames: ["Maersk Line"] },
  msc: { name: "MSC", displayTag: "MSC", aliases: ["MSC", "地中海航运"], orgNames: ["Mediterranean Shipping Company", "MSC"] },
  cosco: { name: "COSCO", displayTag: "COSCO", aliases: ["COSCO", "中远海运"], orgNames: ["COSCO Shipping", "中远海运"] },
  amazon: { name: "Amazon", displayTag: "Amazon", aliases: ["Amazon", "亚马逊"], orgNames: ["Amazon"] },
  flexport: { name: "Flexport", displayTag: "Flexport", aliases: ["Flexport"], orgNames: ["Flexport"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 与上面的少量主体一致。行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "maersk", name: "Maersk", patterns: [/maersk|马士基/i] },
  { id: "msc", name: "MSC", patterns: [/\bMSC\b|地中海航运/] },
  { id: "cosco", name: "COSCO", patterns: [/cosco|中远海运/i] },
  { id: "amazon", name: "Amazon", patterns: [/\bamazon\b|亚马逊/i] },
  { id: "flexport", name: "Flexport", patterns: [/flexport/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。域名等名录确认后再填，不编造。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [];

/** 原文里的这些写法也算提到了对应公司。与上面的主体一致；暂无额外账号名。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
