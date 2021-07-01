import { Tip } from "../schema/tip.embedded";
import { Owner } from "../schema/owner.schema";
import { TipCreateDto } from "./tip-create.dto";

export class TipCreateUtils {
  static isValid(tip: TipCreateDto): boolean {
    const validAmount = !!tip.amount && tip.amount > 0;
    const hasMessage = !!tip.message;
    const hasDonator = !!tip.fromName && !!tip.secret;
    const hasTarget = !!tip.toName;
    const namesUnique = tip.fromName !== tip.toName;
    return validAmount && hasMessage && hasDonator && hasTarget && namesUnique;
  }

  static toTip(tip: TipCreateDto): Tip {
    const from = {name: tip.fromName} as Owner;
    const to = {name: tip.toName} as Owner;
    return {from, to, amount: tip.amount, message: tip.message} as unknown as Tip
  }
}
