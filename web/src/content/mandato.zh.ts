import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  Chinese (Simplified) courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsZh({
  practiceCode,
  signerName,
}: MandatoParams): string[] {
  const studio = obj<{
    ragione_sociale?: string;
    forma_giuridica?: string;
    piva?: string;
    cf?: string;
    albo?: string;
    indirizzo?: string;
  }>("footer", "studio", {});
  const pec = text("settings", "pec", "");
  const email = text("settings", "email", "");

  return [
    `本人 ${signerName}（以下简称“客户”）委托 ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }，地址 ${studio.indirizzo ?? ""}，P.IVA ${studio.piva ?? ""}，C.F. ${
      studio.cf ?? ""
    }，登记于 ${
      studio.albo ?? "专业协会"
    }，PEC ${pec}，电子邮箱 ${email}（以下简称“专业人士”），办理与案卷 ${practiceCode} 相关的下述专业委托。`,

    "1. 标的。委托内容包括协助准备继承申报并电子提交至 Agenzia delle Entrate（专业人士作为获授权的 Entratel 中介执行），以及所购套餐中规定的相关手续（例如地籍过户 / volture）。套餐未包含的活动除外，可另行报价。",

    "2. 酬金。酬金为所购套餐的费用，列于个人区“您的购买”并已在下单时支付。应向国家缴纳的税费（继承税、抵押与地籍税、印花税、特别税费）不包含在酬金内：按具体情形计算，在提交申报前告知客户，由客户缴纳，专业人士不加价。",

    "3. 客户义务。客户承诺提供准确、完整且及时的数据与文件，并对准确性负责。交付期限自必要文件齐全且经专业人士核验之日起算，不包括第三方（Agenzia delle Entrate、地籍、银行）的办理时间。",

    "4. 勤勉与责任。专业人士以活动性质所要求的专业勤勉履行委托（手段义务），并由注册税务顾问进行税务监督。本委托书未规定事项，适用购买时接受的销售条件，包括责任限制、套餐变更与结算。",

    "5. 撤回。消费者法典第 52–59 条规定的撤回权，仍按销售条件及网站“撤回”页所述。若在工作开始后撤回，客户应按已提供服务的比例支付费用。",

    "6. 个人数据。客户及案卷相关人员（包括逝者及其他继承人）个人数据的处理，见网站隐私声明，客户声明已阅读。客户保证有权提供第三方数据。",

    "7. 授予与签署。本委托书以远程方式授予。签署可由客户选择电子方式（在个人区勾选接受并点击签署按钮，记录日期与时间），或下载文件手写签名后上传已签副本。",

    "（本委托书以意大利文版本具有法律约束力。任何翻译仅供参考；如有冲突，以意大利文版本为准。）",
  ];
}

export function buildMandatoTextZh(params: MandatoParams): string {
  return (
    `专业委托书 — 案卷 ${params.practiceCode}\n\n` +
    buildMandatoParagraphsZh(params).join("\n\n") +
    `\n\n地点与日期：_________________________\n\n客户签名：_________________________\n`
  );
}
