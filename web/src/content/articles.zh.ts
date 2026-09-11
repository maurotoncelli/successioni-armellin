import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Chinese courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleZhOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - 遗产继承申报",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - 如何缴纳税款",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS 第346/1990号立法法令",
  href: "https://www.normattiva.it",
};
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - 如何及何时提交申报",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - 税号申请（modello AA4/8）",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "欧盟条例 650/2012 跨境继承",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "欧盟条例 2016/1191 - 公共文件无需 legalization",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "意大利外交部 - 海外意大利人领事服务",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
};

export const articlesZh: Record<string, ArticleZhOverlay> = {
  "successione-cosa-e": {
    title: "遗产继承：是什么以及何时须提交",
    excerpt: "一份简明指南，帮助您了解该手续、谁必须办理、期限，以及不提交的风险。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "遗产继承申报是向 Agenzia delle Entrate 告知被继承人（de cuius）遗留并转移给继承人的财产的税务手续。它不是接受继承，也不是公证文书：用于申报遗产资产、结算应缴税款，并在有房产时通过过户更新地籍。" },
      { type: "h2", text: "谁必须提交" },
      { type: "p", text: "义务人包括继承人、被召继承人及受遗赠人（或其法定代理人），以及管理人、待继承遗产的监护人、遗嘱执行人和受托人。" },
      {
        type: "ul",
        items: [
          "只需一名义务人提交：申报对所有人有效。",
          "可由获授权的 Entratel 中介提交（如授权测绘师）：这正是我们的工作。",
        ],
      },
      { type: "h2", text: "须在何时提交" },
      { type: "p", text: "普通期限为遗产继承开启之日起 12 个月，通常与死亡日期重合（art. 31 TUS）。特殊情形（待继承遗产、附清单利益的接受、指定监护人）下，期限自当事人依法有权行事之日起算。" },
      { type: "callout", tone: "warning", title: "注意期限", text: "逾期提交可能导致处罚和利息。若 12 个月期限临近，建议立即行动：我们按时办理。" },
      { type: "h2", text: "如今如何提交" },
      { type: "p", text: "申报通过 Agenzia delle Entrate 软件以电子方式提交。生成的文件（.SUC 扩展名）由获授权纳税人直接发送，或更常见地由获授权的 Entratel 中介发送。旧的纸质 Modello 4 仅适用于残余情形（2006 年 10 月 3 日前死亡，或无法电子提交的海外居民）。" },
      { type: "h2", text: "不办理（或办错）有何风险" },
      { type: "p", text: "未提交将导致与应缴税款相应的处罚及利息；逾期或不实提交视情况适用减免或按比例处罚。金额会随时间变化：请查阅官方来源并咨询专业人士。" },
      { type: "callout", tone: "info", title: "并非总是必须", text: "某些情况下申报甚至不是强制的。我们在豁免专项指南中说明：免费核查您的情况。" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "何时您无需办理遗产继承",
    excerpt: "法律规定的豁免：须同时满足的三项条件，以及为何一处房产即可触发义务。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "遗产继承申报并非总是强制。法律（art. 28, c. 7 TUS）规定在三项条件同时具备时可豁免。只要缺一项，义务即恢复。" },
      { type: "h2", text: "豁免的三项条件" },
      {
        type: "ol",
        items: [
          "遗产归属于配偶和/或直系亲属（子女、父母）。",
          "遗产资产价值不超过 100,000 欧元。",
          "遗产不含不动产或不动产物权。",
        ],
      },
      { type: "callout", tone: "warning", title: "一处房产即足够", text: "即使仅有一处价值极低的房产，也会触发义务，不论总价值如何。有住宅、土地或车库就会改变一切。" },
      { type: "h2", text: "其他无需办理的情形" },
      { type: "p", text: "还有其他豁免或无需办理的情形，例如在 12 个月期限前放弃继承（art. 28, c. 5）。条件也可能因嗣后情况变化而不再适用：因此评估始终基于具体案件。" },
      { type: "callout", tone: "info", title: "我们免费告知您", text: "若根据您的情况可能无需办理遗产继承，我们不会推销无用服务：我们会告知您。最终核实仍基于具体案件。" },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "遗产继承税要缴多少",
    excerpt: "免税额、税率与 2025 自行申报：税款如何运作、谁缴纳，以及为何直系继承人往往为零。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "重要前提：我们的服务价格（专业服务费）是一回事，税款是另一回事。税款由继承人承担，与专业服务费分开，我们在提交前计算并告知。" },
      { type: "h2", text: "继承税：税率与免税额" },
      { type: "p", text: "继承税仅适用于超过免税额的部分，免税额取决于与被继承人的亲属关系。" },
      {
        type: "table",
        headers: ["受益人", "税率", "免税额（每位受益人）"],
        rows: [
          ["配偶及直系亲属（子女、父母）", "4%", "1.000.000 EUR"],
          ["兄弟姐妹", "6%", "100.000 EUR"],
          ["四等亲以内的其他亲属及姻亲（在法定范围内）", "6%", "nessuna"],
          ["其他主体（无亲属关系者）", "8%", "nessuna"],
          ["重度残疾人士（L. 104/1992）", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "对直系继承人往往为零", text: "配偶与子女每人免税额为 1,000,000 欧元：因此在多数家庭遗产继承中，继承税本身为零。" },
      { type: "h2", text: "抵押权税与地籍税（仅有房产时）" },
      { type: "p", text: "有房产时须缴纳抵押权税（地籍价值的 2%，最低 200 欧元）和地籍税（地籍价值的 1%，最低 200 欧元）。若继承人对首套住房适用优惠，两者均降至固定 200 欧元。另加固定金额的印花税、抵押权费及特殊地籍税费。" },
      { type: "h2", text: "2025 自行申报：有何变化" },
      { type: "p", text: "自 2025 年 1 月 1 日起开启的遗产继承，继承税由纳税人在申报中自行计算（不再由税务机关核定）。须在提交期限起 90 日内通过 F24 缴纳。" },
      {
        type: "ul",
        items: [
          "金额至少 1,000 欧元时可分期：最低预付 20%，余额分 8 期季度支付（超过 20,000 欧元最多 12 期），含利息。",
          "2025 年前开启的遗产继承仍由税务机关核定，收到通知后 60 日内支付。",
        ],
      },
      { type: "h2", text: "具体示例（匿名真实案例）" },
      { type: "p", text: "配偶与 2 名子女的家庭，遗产约 117,000 欧元（房产、证券与现金），含首套住房及地籍过户。税款合计约 1,200 欧元（抵押权税、地籍税、印花税及税费），而继承税为零，因直系继承人远低于免税额。服务专业费另计。" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "遗产继承中的首套住房优惠：如何运作",
    excerpt: "何时可按固定税额而非比例缴纳、谁可申请，以及如何避免失去优惠。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "当遗产中有房产且至少一名继承人可适用首套住房优惠时，抵押权税和地籍税不按比例而按固定金额缴纳：各 200 欧元，而非地籍价值的 2% 和 1%。对一定价值的房产，节省可观。" },
      { type: "h2", text: "谁可适用" },
      { type: "p", text: "优惠要求至少一名继承人具备法定首套住房条件（简言之：在同一市镇不对其他房产享有权利，且未在别处享受过该优惠，并在法定期限内在该房产所在市镇居住）。只要一名继承人符合，该优惠即可适用于该房产。" },
      { type: "callout", tone: "warning", title: "须核实资格条件", text: "优惠在表格 EH 栏申报并正确勾选。若不符合或失效，将失去优惠并追缴税款与处罚：最好事先进行技术核实。" },
      { type: "h2", text: "我们核查什么" },
      { type: "p", text: "作为测绘师，我们的职责正是地籍核实：地块、分户、类别、租金与权属文件。我们检查数据正确、首套住房申报妥当，使优惠得以成立、避免意外。" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "遗产继承文件：完整清单",
    excerpt: "所有典型文件及如何获取，按情形说明。并非总是全部需要：取决于您的情况。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "遗产继承申报所需文件因案而异：从不需要全部一次性提供。以下为最常见文件，按情形分类。若缺失，我们通常可以帮您获取（查册、权属文件、缺失数据）。" },
      { type: "h2", text: "始终需要的文件" },
      {
        type: "ul",
        items: [
          "被继承人死亡证明或摘录。",
          "被继承人及继承人的身份证件；继承人的税号。",
          "继承人家庭状况及亲属关系的自我证明。",
          "继承人 IBAN（始终需要，用于退款或税款扣缴）。",
        ],
      },
      { type: "h2", text: "如有房产" },
      {
        type: "ul",
        items: [
          "遗产中房产的地籍查册（我们可帮您获取）。",
          "权属来源文件：公证书、赠与或先前的遗产继承申报。",
          "平面图（地籍核实需要时）。",
        ],
      },
      { type: "h2", text: "如有遗嘱或特殊继承人" },
      {
        type: "ul",
        items: [
          "已公布遗嘱副本及可能的公布笔录。",
          "有未成年或无行为能力继承人时，监护法官的批准。",
        ],
      },
      { type: "h2", text: "如有账户与投资" },
      {
        type: "ul",
        items: [
          "死亡之日账户、存折及证券余额证明。",
        ],
      },
      { type: "callout", tone: "info", title: "缺少什么？我们通常可以帮您获取", text: "文件获取是我们工作的一部分：地籍查册、权属文件及缺失数据，我们向机构与银行索取。" },
      { type: "callout", tone: "warning", title: "参考清单", text: "此清单仅供参考，会根据您的情况调整。Lorenzo 核实具体情况后确认最终清单。" },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "居住海外时的意大利遗产继承：完整指南",
    excerpt: "您在德国、瑞士、英国、美国、阿根廷或其他地方生活，却继承了意大利的房屋或银行账户？真正有何不同、需要什么、如何全程远程办理而无需回国。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "若您居住海外，而意大利仍留有父母的房屋、土地或银行账户，dichiarazione di successione（遗产继承申报）仍须在意大利提交，且须在死亡之日起 12 个月内完成。无需回国：申报以电子方式提交，由获授权中介传输，这正是我们的角色。我们的服务在线设计，专为无法亲临办公室的人而设；居住海外正是最需要这种安排的情形。" },
      { type: "h2", text: "两种典型情形" },
      {
        type: "ul",
        items: [
          "被继承人居住在意大利，一名或多名继承人居住海外：手续与普通情形相同，只是收集文件与签名的方式不同。",
          "被继承人居住海外但在意大利有财产：申报仍须在意大利办理，在主管机关、税款及适用法律方面有一些额外规则。我们在专项指南中说明。",
        ],
      },
      { type: "h2", text: "与居住在意大利相比有何不同" },
      {
        type: "ul",
        items: [
          "codice fiscale（税号）：每位继承人都须拥有，即使从未在意大利生活。没有它，申报无法传输。可在领事馆申请，或更快的方式——在意大利通过向我们出具委托书办理。",
          "外国文件：在国外签发的死亡证明或遗嘱可能需要 apostille、认证及翻译。在欧盟内部规则更简单。",
          "签名：我们以您远程签署的委托函传输申报。仅就申报而言，无需公证授权书。",
          "缴纳税款：通过意大利银行账户扣款支付。若没有账户，有解决方案，包括以中介身份从本所账户扣款。",
          "时区与语言：我们以书面、WhatsApp 及电子邮件方式工作，您可在方便时回复。网站与我们的沟通提供多种语言。",
        ],
      },
      { type: "h2", text: "如何办理：五个步骤" },
      {
        type: "ol",
        items: [
          "填写在线问卷：约两分钟，即可知道需要哪个套餐及费用。",
          "通过 WhatsApp 联系我们或直接付款。我们为您开通个人区，列出您案件所需文件清单。",
          "随时上传文件，甚至可用手机拍照。我们核查地籍数据、权属文件及税号；若缺材料，我们常在意大利代为获取。",
          "我们以书面确认税款及金额，随后您远程签署委托，我们将申报传输至 Agenzia delle Entrate（意大利税务局）。",
          "您收到提交回执；若有房产，还有 voltura（地籍过户）。一切保留在您的个人区。",
        ],
      },
      { type: "callout", tone: "info", title: "您无需返回意大利", text: "遗产继承申报的任一步骤都不需要您本人到场。在意大利柜台办理的事项——如申请税号或地籍查册——我们凭您的委托书代为办理。" },
      { type: "h2", text: "我们实际为您做什么" },
      {
        type: "ul",
        items: [
          "凭委托书为没有税号的继承人向 Agenzia delle Entrate 申请 codice fiscale。",
          "核查 Catasto（地籍）及权属文件中的房产：远程办理的案件最常在此卡住。",
          "作为获授权中介准备并传输申报及地籍过户。",
          "若您没有意大利账户，我们书面约定通过本所支付税款，金额与收据均书面确认。",
          "明确告知哪些步骤需要公证人或领事馆，以及哪一个。",
        ],
      },
      { type: "h2", text: "何时还需要公证人或领事馆" },
      { type: "p", text: "遗产继承申报不是公证文书，也不需要公证人。放弃继承、附清单利益接受继承、公布遗嘱及出售继承房产，则需要公证人，或意大利领事馆（对意大利公民履行部分公证职能）。若您的案件涉及这些，我们会事先告知，而非事后。" },
      { type: "h2", text: "费用多少" },
      { type: "p", text: "套餐与居住在意大利者相同，见价格页面：专业服务费包括测绘师、申报及地籍过户。法定税款对所有人另行计算，我们在传输前告知金额。若您的案件需要额外步骤（如税号或翻译），我们会立即说明及具体费用。" },
      { type: "callout", tone: "warning", title: "12 个月期限对您同样适用", text: "期限自死亡之日起算，而非自您能够处理案件之时。若期限临近，请立即联系我们：对海外居住者，税号往往是最耗时的环节。" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "居住海外的继承人如何取得意大利税号",
    excerpt: "缺少每位继承人的 codice fiscale，申报无法传输。谁可能已有却不知、如何在领事馆或在意大利凭委托书申请、需要什么。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "意大利 codice fiscale（税号）是最常卡住海外继承人遗产继承的事项：电子申报要求每位继承人及受遗赠人都须具备，否则文件会被拒绝。好消息是，取得它比看起来简单，且无需来意大利。" },
      { type: "h2", text: "您可能已经有了" },
      { type: "p", text: "在意大利出生、在意大利工作或学习、持有旧健康卡或登记在 AIRE（海外意大利人登记）者，往往已有税号，即使多年未用。请查旧文件、健康卡或纳税申报。若找不到，我们可根据您的个人资料核查是否已存在：税号不会重复发放。" },
      { type: "h2", text: "若缺失如何取得" },
      {
        type: "ol",
        items: [
          "在您居住国的意大利领事馆：海外居民公民的常规途径。提交 modello AA4/8 及有效身份证件。时间取决于领事馆，可能较长。",
          "在意大利任一 Agenzia delle Entrate 办公室，通过被委托人：modello AA4/8 由您签署，委托书部分填妥，被委托人持本人证件及您的复印件提交。这是我们采用的方式，通常最快。",
        ],
      },
      { type: "callout", tone: "info", title: "我们凭您的委托书办理", text: "我们发送预填表格，您签署并连同身份证件复印件返还。我们向 Agenzia delle Entrate 提交，税号下发后立即告知您。" },
      { type: "h2", text: "需要什么" },
      {
        type: "ul",
        items: [
          "有效护照或身份证（清晰复印件，正反面）。",
          "完整个人资料：姓、名、性别、出生日期及地点、海外居住地址。",
          "申请理由：意大利的遗产继承。须在表格中注明。",
          "已签署的 modello AA4/8，若由我们提交则须填妥委托书部分。",
        ],
      },
      { type: "h2", text: "非意大利公民的继承人" },
      { type: "p", text: "程序相同：modello AA4/8 可通过被委托人向任一 Agenzia delle Entrate 办公室提交，并说明理由。对外国公民，意大利领事馆仅在特殊情形介入，因此在意大利通过委托书办理几乎总是最简单的途径。" },
      { type: "callout", tone: "warning", title: "若期限临近，从这里开始", text: "税号是整个手续中时间最不可预测的环节。若死亡已过去数月，请立即申请：申报的其余部分可并行准备。" },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "被继承人居住海外但在意大利有财产：该怎么办",
    excerpt: "即使死亡发生在国外，申报仍须在意大利提交：哪个机关、哪些财产须纳税、欧盟继承条例如何规定、何时需要公证人。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "这是许多移民家庭的典型情形：父母多年居住在德国、瑞士或阿根廷，却在意大利留下家乡房屋或出租公寓。若在意大利有财产，dichiarazione di successione（遗产继承申报）仍须在意大利于死亡之日起 12 个月内提交，即使死亡发生在国外、所有继承人均居住海外。" },
      { type: "h2", text: "哪些财产须纳税" },
      { type: "p", text: "规则见意大利继承税法 TUS（art. 2）。若被继承人死亡时在意大利居住，税适用于全部财产，无论位于何处。若不在意大利居住，税仅适用于位于意大利的财产：不动产、意大利银行账户、意大利公司股份。海外财产适用所在国规则。" },
      { type: "callout", tone: "info", title: "双重征税", text: "意大利仅与少数国家（含法国、英国、美国）有继承税协定。否则，您在意大利就意大利财产所缴税款须与居住国的遗产申报协调：值得咨询当地顾问。" },
      { type: "h2", text: "向哪个机关提交" },
      { type: "p", text: "若被继承人移居海外前曾在意大利居住，主管机关为其最后意大利居住地的 Agenzia delle Entrate 办公室。若从未在意大利居住或最后居住地不明，由税务局指定的罗马某办公室管辖。电子提交时，我们在编制申报时处理此细节。" },
      { type: "h2", text: "如何提交" },
      { type: "p", text: "通过获授权中介以电子方式提交，与居住在意大利者完全相同：我们远程收集文件与签名并传输。法律允许海外居民仅在无法电子提交时以挂号信邮寄纸质表格：实践中几乎从不需要此例外。" },
      { type: "h2", text: "谁继承：适用的法律" },
      { type: "p", text: "税务层面与民事层面是两回事。继承人是谁及份额多少，由适用于继承的法律决定。在欧盟，适用 Regolamento 650/2012：2015 年 8 月 17 日起的死亡，适用被继承人惯常居住国法律，除非遗嘱选择了国籍国法律。因此，在德国居住且无遗嘱的意大利人，按德国法继承，包括意大利的房屋。英国、爱尔兰、丹麦不适用该条例；对欧盟以外国家，适用意大利国际私法规则。" },
      { type: "callout", tone: "warning", title: "我们工作的边界", text: "我们为意大利境内的财产准备并传输申报及 voltura（地籍过户）。若继承受外国法管辖、有外国遗嘱须执行或须取得欧洲继承证书，还需要公证人或律师：我们在开始时告知，包括人选与步骤，而非办到一半才说。" },
      { type: "h2", text: "额外文件" },
      {
        type: "ul",
        items: [
          "在国外签发的死亡证明：若被继承人是意大利公民，须通过领事馆在意大利市镇登记，之后由市镇签发意大利证明。否则须使用外国证明并附 apostille 或认证及翻译，欧盟简化规则除外。",
          "被继承人海外居住证明，例如 AIRE 登记或外国居住证明。",
          "被继承人及所有继承人的 codice fiscale（税号）：非意大利继承人也需要。",
          "遗嘱（如有）及其公布或欧洲继承证书。",
        ],
      },
      { type: "h2", text: "首套住宅优惠" },
      { type: "p", text: "继承房产的抵押税与地籍税可通过首套住宅优惠降低，但对居住海外者规则特殊且 2023 年已变更：取决于房产位置及继承人与意大利的联系。我们在计算税款前逐案核查。" },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "来自海外的文件：apostille、翻译与远程签名",
    excerpt: "外国死亡证明、外国遗嘱、非意大利身份证件：何时需要 apostille、认证或 sworn 翻译，以及如何无需来意大利完成签名。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "有继承人或被继承人居住海外的继承，几乎所有文件与意大利案件相同。可能来自他国的文件不多但敏感：若死亡发生在国外的死亡证明、外国遗嘱、继承人身份证件，以及某些民事状态证明。以下是 Agenzia delle Entrate 与 Catasto（地籍）真正接受它们所需的条件。" },
      { type: "h2", text: "按国家划分的三条规则" },
      {
        type: "table",
        headers: ["签发国", "认证", "翻译"],
        rows: [
          ["欧盟", "不需要：Regolamento 2016/1191 对民事状态证明取消 apostille 与认证", "可与证明一并申请多语言标准表格以避免翻译"],
          ["1961 年海牙公约国（如英国、美国、瑞士、阿根廷、巴西、澳大利亚）", "apostille，由签发国主管机关加盖", "在意大利的 sworn 翻译或由意大利领事馆认证"],
          ["其他国家", "在签发国意大利领事馆认证", "在意大利的 sworn 翻译或由意大利领事馆认证"],
        ],
      },
      { type: "h2", text: "死亡证明" },
      { type: "p", text: "若被继承人是意大利公民且在国外死亡，最简便的方式是通过领事馆在意大利市镇登记死亡记录：此后证明由市镇以意大利语签发，无需 apostille 或翻译。若被继承人非意大利人，按上表规则使用外国证明。" },
      { type: "h2", text: "外国遗嘱" },
      { type: "p", text: "在国外订立的遗嘱通常须在意大利通过公证人公布或执行，附 sworn 翻译及必要时认证。这是少数需要我们以外专业人士的步骤之一：我们立即为您指明并协调申报与其时间安排。" },
      { type: "h2", text: "非意大利身份证件" },
      { type: "p", text: "有效外国护照或身份证可用于 dichiarazione di successione（遗产继承申报）及税号申请。清晰复印件正反面即可；无需翻译。" },
      { type: "h2", text: "签名：需要什么、不需要什么" },
      {
        type: "ul",
        items: [
          "遗产继承申报及 voltura（地籍过户）无需公证授权书：我们作为中介传输，凭您在个人区远程签署的委托或签名的委托函及身份证件复印件返还。",
          "申请 codice fiscale（税号）时，modello AA4/8 中的委托书由您签署即可。",
          "放弃继承、附清单利益接受继承及签署出售房产的授权书，则需要公证人或意大利领事馆（对意大利公民履行公证职能）。",
        ],
      },
      { type: "callout", tone: "info", title: "先照片，后原件", text: "初步核查时，上传至个人区的照片或扫描即可。原件或附 apostille 与翻译的复印件，仅对确实需要的文件才要求，且我们会事先说明。" },
      { type: "callout", tone: "warning", title: "注意 apostille 与翻译的时间", text: "从申请证明、apostille 到 sworn 翻译，可能需数周。若 12 个月期限临近，请先从这些文件着手，我们并行准备其余部分。" },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "从海外支付意大利继承税，无需意大利银行账户",
    excerpt: "税款通过意大利账户扣款支付。若您居住海外且没有账户，这里有三种可行方案，包括通过本所作为中介支付。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "对居住海外者，缴纳税款往往是最大的实际障碍：电子申报应缴金额通过意大利活期账户扣款支付，许多移民已不再持有意大利账户。以下说明须缴哪些税、如何缴纳，以及缺少意大利账户时的解决方案。" },
      { type: "h2", text: "须缴哪些税" },
      {
        type: "ul",
        items: [
          "随申报一并缴纳（若有房产）：抵押税（2%）及地籍税（1%），按地籍价值计算，各最低 200 欧元，另加 stamp duty 及特别费用。自行核定，在传输时缴纳。",
          "继承税本身仅在遗产超过免税额时缴纳：每位子女或配偶 100 万欧元（税率 4%），兄弟姐妹 100,000 欧元（6%），其他人无免税额（6% 或 8%）。2025 年起开启的继承由纳税人在申报中自行计算，须在提交截止日起 90 天内缴纳，或与其余税款一并立即缴纳。",
        ],
      },
      { type: "h2", text: "电子申报如何付款" },
      { type: "p", text: "自行核定的金额通过与 Agenzia delle Entrate 合作的银行或 Poste Italiane 的活期账户扣款。账户可属于申报人或负责电子传输者，即中介。申报中须注明 IBAN 及账户持有人的 codice fiscale（税号）。" },
      { type: "h2", text: "没有意大利账户？三种方案" },
      {
        type: "ol",
        items: [
          "居住在意大利的共同继承人代所有人支付：申报可注明其中一人的账户。有此种可能时最简单的方案。",
          "本所作为中介支付：您预先向我们汇出我们书面确认的确切税款金额，我们在传输时从本所账户扣款支付。您收到收据。此方案逐案商定。",
          "在意大利通过被委托人使用 F24 表格：在柜台提交申报时可行，但最慢，仅当前两种不可行时使用。",
        ],
      },
      { type: "callout", tone: "info", title: "一切事先书面确认", text: "传输前我们逐项发送税款计算。您仅在看到金额后支付该数额。税款归国家，不归我们：套餐专业服务费另行计算。" },
      { type: "h2", text: "从海外汇款与汇率" },
      { type: "p", text: "税款以欧元计。若您的账户为其他货币，请考虑银行手续费与汇率：欧元区国家及瑞士的 SEPA 转账费用低，其他国家建议事先核实。套餐专业服务费则可在网站通过 Stripe 用银行卡支付，任何国家均可。" },
      { type: "h2", text: "2025 年前开启的继承" },
      { type: "p", text: "截至 2024 年 12 月 31 日的死亡，若须缴纳继承税，仍由 Agenzia delle Entrate 计算并发出缴款通知，须在 60 天内用 F24 缴纳。此情形下若无意大利账户，我们也可通过本所代为支付。" },
      { type: "callout", tone: "warning", title: "金额可能变化", text: "税率、免税额及最低额以本指南发布时有效的为准。计算税款前我们始终核查具体案件及官方来源。" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "fai-da-te-precompilata": {
    title: "预填遗产继承：自助办理划算吗？",
    excerpt: "Agenzia 网站上的免费申报确实存在。我们看看何时合适、何时委托更划算。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "实话实说：可以自行免费办理遗产继承申报。Agenzia delle Entrate 为较简单情形提供网页引导流程，为较复杂情形提供官方软件。这是合法选项。" },
      { type: "h2", text: "何时自助办理可能足够" },
      { type: "p", text: "若情况确实简单（少数直系继承人、无房产或仅一处简单房产、地籍数据已清晰正确），且您熟悉 SPID 与在线流程，预填申报可能足够。" },
      { type: "h2", text: "自助办理变得有风险之处" },
      {
        type: "table",
        headers: ["方面", "自助办理", "由我们办理"],
        rows: [
          ["所需时间", "工时与 SPID 由您自行负责", "由我们负责办理"],
          ["地籍数据核查", "由您自行负责", "由测绘师办理"],
          ["税款计算", "自行办理", "由我们在提交前办理"],
          ["客服", "无", "真人服务"],
          ["因错误导致处罚的风险", "您的", "已处理"],
        ],
      },
      { type: "callout", tone: "warning", title: "薄弱环节是地籍数据", text: "预填申报不校验地籍数据：正是多数案件卡住或出错之处。地块、分户、附属物与权属文件须核实，这正是测绘师的专长。" },
      { type: "p", text: "总之：若情况简单且您有把握，自助办理是诚实选择。若有房产、疑问或时间不足，委托可避免错误与处罚风险。无论如何，我们在您决定前免费核查您的情况。" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleZh(slug: string): ArticleZhOverlay | undefined {
  return articlesZh[slug];
}
