import { Model } from "mongoose";
import { TipsService } from "./tips.service";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { ServerSentEventsService } from "../../events/server-sent-events.service";
import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { OwnersService } from "../owners/owners.service";
import { TipCreateDto } from "./dto/tip-create.dto";
import { SecretService } from "../owners/secret.service";

describe("TipsService", () => {

  let tipsService: TipsService;
  let ownersService: OwnersService;
  let sseService: ServerSentEventsService;

  beforeEach(async () => {

    const moduleRef = await Test.createTestingModule({
      providers: [TipsService, OwnersService, ServerSentEventsService, SecretService,
        {provide: getModelToken(TipJar.name), useValue: Model}]
    }).compile();

    tipsService = moduleRef.get(TipsService);
    ownersService = moduleRef.get(OwnersService);
    sseService = moduleRef.get(ServerSentEventsService);
  });

  describe("sendTip", () => {
    it("given DTO with same from and to should throw BadRequestException", () => {
      const sameFromAndTo: Partial<TipCreateDto> = {fromName: "same", toName: "same"};
      expect(tipsService.sendTip(sameFromAndTo as TipCreateDto)).rejects.toThrow(BadRequestException);
    });

    it("given invalid donator authentication should throw UnauthorizedException", () => {
      const invalidSecret: Partial<TipCreateDto> = {fromName: "same", secret: "invalid", toName: "other"};
      jest.spyOn(ownersService, "findDonatorJar").mockImplementation(() => Promise.reject(new UnauthorizedException()));
      expect(tipsService.sendTip(invalidSecret as TipCreateDto)).rejects.toThrow(UnauthorizedException);
    });

    it("given invalid receiver should throw NotFoundException", () => {
      const invalidSecret: Partial<TipCreateDto> = {fromName: "same", secret: "invalid", toName: "other"};
      jest.spyOn(ownersService, "findDonatorJar").mockImplementation(() => Promise.resolve({} as TipJarDocument));
      jest.spyOn(ownersService, "findUserJar").mockImplementation(() => Promise.resolve(null))
      expect(tipsService.sendTip(invalidSecret as TipCreateDto)).rejects.toThrow(NotFoundException);
    });

    it("given valid data should update donator and receiver jar and emit event", async () => {
      const validData: TipCreateDto = {fromName: "same", secret: "invalid", toName: "other", amount: 10, message: "OK"};
      const donatorJarSpy = jest.spyOn(ownersService, "findDonatorJar")
        .mockResolvedValueOnce({tipsGiven: [], save: () => this} as unknown as TipJarDocument);
      const userJarSpy = jest.spyOn(ownersService, "findUserJar")
        .mockResolvedValueOnce({tipsReceived: [], save: () => this} as unknown as TipJarDocument);
      const eventBusSpy = jest.spyOn(sseService, "pushTipEvent")
        .mockImplementation();
      await expect(tipsService.sendTip(validData)).resolves.toBeTruthy();
      expect(donatorJarSpy).toHaveBeenCalled();
      expect(userJarSpy).toHaveBeenCalled();
      expect(eventBusSpy).toHaveBeenCalled();
    })
  });
});
