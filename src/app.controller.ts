import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { TipJar } from "./schema/tip-jar.schema";
import { Owner } from "./schema/owner.schema";
import { TipCreateDto } from "./dto/tip-create.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get() getTipJarsList(): Promise<TipJar[]> {
    return this.appService.getTipJarsList();
  }

  @Get("owners") getOwnersList(): Promise<string[]> {
    return this.appService.getOwnersNamesList();
  }

  @Post("owners") createNewAccount(@Body() ownerDto: Owner): Promise<TipJar> {
    return this.appService.createNewAccount(ownerDto);
  }

  @Post() sendTip(@Body() tipCreateDto: TipCreateDto): Promise<void> {
    return this.appService.sendTip(tipCreateDto);
  }

  @Post("login") login(@Body() ownerDto: Owner) {
    return this.appService.login(ownerDto);
  }
}
