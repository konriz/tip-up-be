import { Model, Query } from "mongoose";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JarsService } from "./jars.service";

describe("JarsService", () => {
  let jarsService: JarsService;
  let tipJarModel: Model<TipJarDocument>;
  beforeEach(async () => {

    const moduleRef = await Test.createTestingModule(
      {providers: [JarsService, {provide: getModelToken(TipJar.name), useValue: Model}]}).compile();

    jarsService = moduleRef.get(JarsService);
    tipJarModel = moduleRef.get(getModelToken(TipJar.name));

  });

  describe("getTipJarsList", () => {

    it("should return jars list without owner secrets", async () => {
      jest.spyOn(tipJarModel, "find")
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce(
            [{owner: {name: "newOne", secret: "random"}}, {owner: {name: "newTwo", secret: "random"}},
              {owner: {name: "newThree", secret: "random"}}])
        }) as unknown as Query<any, any>);
      const tipJars = await jarsService.getTipJarsList();
      expect(tipJars.length > 0).toBe(true);
      expect(tipJars.filter(tipJar => tipJar.owner.secret).length).toEqual(0);
    });
  });
});
