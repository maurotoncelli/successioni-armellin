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

const REVIEWED = "税务部分经会计师审核";

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
      { type: "callout", tone: "info", title: "并非总是必须", text: "某些情况下申报甚至不是强制的。我们在豁免专项指南中说明：付款前免费核查您的情况。" },
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
          "被继承人死亡证明或摘录（或在允许时的自我证明）。",
          "被继承人及所有继承人的身份证件与税号。",
          "继承人家庭状况及亲属关系的自我证明。",
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
          "继承人 IBAN，用于可能的退款或税款扣缴。",
        ],
      },
      { type: "callout", tone: "info", title: "缺少什么？我们通常可以帮您获取", text: "文件获取是我们工作的一部分：地籍查册、权属文件及缺失数据，我们向机构与银行索取。" },
      { type: "callout", tone: "warning", title: "参考清单", text: "此清单仅供参考，会根据您的情况调整。Lorenzo 核实具体情况后确认最终清单。" },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "居住在海外的继承人：如何办理案件",
    excerpt: "当一名继承人居住在意大利境外时有何变化，以及我们如何远程跟进案件，包括用您的语言。",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "有居住在海外的继承人不是问题：遗产继承申报针对意大利境内财产，仍向 Agenzia delle Entrate 提交。主要变化是文件与签名的收集方式，我们全程远程办理。" },
      { type: "h2", text: "真正需要什么" },
      {
        type: "ul",
        items: [
          "每位继承人的意大利税号（含海外居住者）：若缺失，可以申请。",
          "所有继承人的身份证件与户籍资料。",
          "向中介出具的委托书或授权，因为提交申报的是继承人，我们代其提交。",
        ],
      },
      { type: "p", text: "海外居民仅在无法电子提交时方可例外使用纸质表格；绝大多数情况下，我们作为获授权中介以电子方式办理。" },
      { type: "h2", text: "全程远程，也可用您的语言" },
      { type: "p", text: "问卷、文件、沟通与签名均在线完成：无需返回意大利。我们可用您的语言通过邮件或即时通讯跟进，必要时安排翻译通话。重要事项（金额、期限、文件）始终书面确认；正式文件仍为意大利语。" },
      { type: "callout", tone: "info", title: "时差与距离无关紧要", text: "您可随时在个人区上传文件，也可用手机拍照。我们负责核查并按时为您办妥。" },
    ],
    sources: [FONTE_ADE_SCHEDA],
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
