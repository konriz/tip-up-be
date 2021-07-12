import { OwnersService } from "./owners.service";
import { SecretService } from "./secret.service";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { Model, Query } from "mongoose";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { OwnerDto } from "./dto/owner.dto";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

describe("OwnersService", () => {

  let ownersService: OwnersService;
  let secretService: SecretService;
  let tipJarModel: Model<TipJarDocument>;

  beforeEach(async () => {

    const moduleRef = await Test.createTestingModule(
      {providers: [OwnersService, SecretService, {provide: getModelToken(TipJar.name), useValue: Model}]}).compile();

    ownersService = moduleRef.get(OwnersService);
    secretService = moduleRef.get(SecretService);
    tipJarModel = moduleRef.get(getModelToken(TipJar.name));

  })

  describe("createNewAccount", () => {
    it("given existing account name should throw ConflictException", () => {
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce({name: "newOne", secret: "random"})
        }) as unknown as Query<any, any>);
      const ownerDto: OwnerDto = {name: "newOne", secret: "random"};
      expect(ownersService.createNewAccount(ownerDto)).rejects.toThrow(ConflictException);
    });
    it("given valid account name should create new account", () => {
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce(null)
        }) as unknown as Query<any, any>);
      const ownerDto: OwnerDto = {name: "newOne", secret: "random"};
      expect(ownersService.createNewAccount(ownerDto)).resolves.toEqual(ownerDto.name);
    });
  });

  describe("login", () => {
    it("given existing user name and valid password should return owner data", async () => {
      const credentials = {name: "existing", secret: "valid"};
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce({owner: credentials})
        }) as unknown as Query<any, any>);
      const secretServiceMock = jest.spyOn(secretService, "compare")
        .mockResolvedValueOnce(true);
      const owner = await ownersService.login(credentials);
      expect(owner.name).toBe(credentials.name);
      expect(owner.secret).toBe(undefined);
      expect(secretServiceMock).toHaveBeenCalled();
    });
  });

  describe("findUserJar", () => {
    it("given existing user name should return jar", async () => {
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce({owner: {name: "newOne", secret: "random"}})
        }) as unknown as Query<any, any>);
      const existingUserJar = await ownersService.findUserJar("newOne");
      expect(existingUserJar).toBeTruthy();
      expect(existingUserJar?.owner.name).toBe("newOne");
    });
    it("given not existing user name should return null", () => {
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce(null)
        }) as unknown as Query<any, any>);
      expect(ownersService.findUserJar("notExisting")).resolves.toBe(null);
    });
  });

  describe("findDonatorJar", () => {
    it("given not existing user name should return UnauthorizedException", () => {
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce(null)
        }) as unknown as Query<any, any>);
      const credentials = {name: "notExisting", secret: "notImportant"};
      expect(ownersService.findDonatorJar(credentials.name, credentials.secret)).rejects.toThrow(UnauthorizedException);
    });

    it("given existing user name and invalid password should return UnauthorizedException", async () => {
      const credentials = {name: "existing", secret: "invalid"};
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce({owner: credentials})
        }) as unknown as Query<any, any>);
      const secretServiceMock = jest.spyOn(secretService, "compare")
        .mockResolvedValueOnce(false);
      await expect(ownersService.findDonatorJar(credentials.name, credentials.secret)).rejects
        .toThrow(UnauthorizedException);
      expect(secretServiceMock).toHaveBeenCalled();
    });

    it("given existing user name and valid password should return jar without secret", async () => {
      const credentials = {name: "existing", secret: "valid"};
      jest.spyOn(tipJarModel, "findOne")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce({owner: credentials})
        }) as unknown as Query<any, any>);
      const secretServiceMock = jest.spyOn(secretService, "compare")
        .mockResolvedValueOnce(true);
      const donatorJar = await ownersService.findDonatorJar(credentials.name, credentials.secret);
      expect(donatorJar.owner.name).toBe(credentials.name);
      expect(donatorJar.owner.secret).toBe(undefined);
      expect(secretServiceMock).toHaveBeenCalled();
    });
  });

});
