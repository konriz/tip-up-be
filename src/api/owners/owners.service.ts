import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Owner } from "../../schema/owner.schema";
import { SecretService } from "./secret.service";
import { OwnerDto } from "./owner.dto";

@Injectable()
export class OwnersService {

  constructor(@InjectModel(TipJar.name) private readonly tipJarModel: Model<TipJarDocument>,
              private readonly secretService: SecretService) {
  }

  async getOwnersNamesList(): Promise<string[]> {
    const tipJarsOwners = await this.tipJarModel.find().select("owner.name").exec();
    return tipJarsOwners.map(tipJar => tipJar.owner.name);
  }

  async createNewAccount(ownerDto: OwnerDto) {
    if (await this.findUserJar(ownerDto.name)) {
      throw new ConflictException();
    }
    const secret = await this.secretService.hash(ownerDto.secret);
    const createdJar = new this.tipJarModel({owner: {name: ownerDto.name, secret}, tipsGiven: [], tipsReceived: []});
    return createdJar.save().then((jar) => jar.owner.name);
  }

  async login(ownerDto: OwnerDto): Promise<Owner> {
    const ownerJar = await this.findDonatorJar(ownerDto.name, ownerDto.secret);
    return ownerJar.owner;
  }

  async findUserJar(name: string): Promise<TipJarDocument | null> {
    return this.tipJarModel.findOne({"owner.name": name}).exec();
  }

  async findDonatorJar(name: string, secret: string): Promise<TipJarDocument> {
    const donatorJar = await this.tipJarModel.findOne({"owner.name": name})
      .exec();
    if (!donatorJar || !donatorJar.owner.secret) {
      return Promise.reject(new UnauthorizedException());
    }
    const passwordValid = await this.secretService.compare(secret, donatorJar.owner.secret)
    if (!passwordValid) {
      return Promise.reject(new UnauthorizedException());
    }
    delete donatorJar.owner.secret;
    return donatorJar;
  }

}
