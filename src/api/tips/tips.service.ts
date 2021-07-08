import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TipCreateDto } from "./dto/tip-create.dto";
import { TipCreateUtils } from "./dto/tip-create.utils";
import { Tip } from "../../schema/tip.embedded";
import { OwnersService } from "../owners/owners.service";

@Injectable()
export class TipsService {

  constructor(@InjectModel(TipJar.name) private readonly tipJarModel: Model<TipJarDocument>,
              private readonly ownersService: OwnersService) {
  }

  async sendTip(tipCreateDto: TipCreateDto) {
    if (!TipCreateUtils.isValid(tipCreateDto)) {
      throw new BadRequestException("Request invalid");
    }
    const donatorJar = await this.ownersService.findDonatorJar(tipCreateDto.fromName, tipCreateDto.secret);
    if (!donatorJar) {
      throw new UnauthorizedException("Donator not found");
    }
    const receiverJar = await this.ownersService.findUserJar(tipCreateDto.toName);
    if (!receiverJar) {
      throw new NotFoundException("Receiver not found");
    }
    const tip = TipCreateUtils.toTip(tipCreateDto);
    await this.updateDonatorJar(donatorJar, tip);
    await this.updateReceiverJar(receiverJar, tip);
  }

  private async updateDonatorJar(donatorJar: TipJarDocument, tip: Tip) {
    donatorJar.tipsGiven.push(tip);
    return donatorJar.save();
  }

  private async updateReceiverJar(donatorJar: TipJarDocument, tip: Tip) {
    donatorJar.tipsReceived.push(tip);
    return donatorJar.save();
  }

}
