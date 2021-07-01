import {
  BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { TipJar, TipJarDocument } from "./schema/tip-jar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Owner } from "./schema/owner.schema";
import { Tip } from "./schema/tip.embedded";
import { TipCreateDto } from "./dto/tip-create.dto";
import { TipCreateUtils } from "./dto/tip-create.utils";

@Injectable()
export class AppService {

  constructor(@InjectModel(TipJar.name) private readonly tipJarModel: Model<TipJarDocument>) {
  }

  async getTipJarsList(): Promise<TipJar[]> {
    return this.tipJarModel.find().exec();
  }

  async getOwnersNamesList(): Promise<string[]> {
    const tipJarsOwners = await this.tipJarModel.find().select("owner.name").exec();
    return tipJarsOwners.map(tipJar => tipJar.owner.name);
  }

  async createNewAccount(ownerDto: Owner) {
    if (await this.findUserJar(ownerDto.name)) {
      throw new ConflictException();
    }
    const createdJar = new this.tipJarModel({owner: ownerDto, tipsGiven: [], tipsReceived: []});
    return createdJar.save();
  }

  async sendTip(tipCreateDto: TipCreateDto) {
    if (!TipCreateUtils.isValid(tipCreateDto)) {
      throw new BadRequestException("Request invalid");
    }
    const donator = await this.findDonatorJar(tipCreateDto.fromName, tipCreateDto.secret);
    if (!donator) {
      throw new UnauthorizedException("Donator not found");
    }
    const receiver = await this.findUserJar(tipCreateDto.toName);
    if (!receiver) {
      throw new NotFoundException("Receiver not found");
    }
    const tip = TipCreateUtils.toTip(tipCreateDto);
    await this.updateDonatorJar(donator, tip);
    await this.updateReceiverJar(receiver, tip);
  }

  async findUserJar(name: string) {
    return this.tipJarModel.findOne({"owner.name": name}).exec();
  }

  async findDonatorJar(name: string, secret: string) {
    return this.tipJarModel.findOne({"owner.name": name, "owner.secret": secret})
      .exec();
  }

  async login(ownerDto: Owner): Promise<Owner> {
    if (!ownerDto.secret) {
      throw new UnauthorizedException();
    }
    const ownerJar = await this.findDonatorJar(ownerDto.name, ownerDto.secret);
    if (!ownerJar) {
      throw new UnauthorizedException();
    }
    return ownerJar.owner;
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
