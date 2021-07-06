import { Body, Controller, Get, Post } from "@nestjs/common";
import { OwnersService } from "./owners.service";
import { OwnerDto } from "./owner.dto";

@Controller()
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {
  }

  @Get("owners") getOwnersList(): Promise<string[]> {
    return this.ownersService.getOwnersNamesList();
  }

  @Post("owners") createNewAccount(@Body() ownerDto: OwnerDto): Promise<string> {
    return this.ownersService.createNewAccount(ownerDto);
  }

  @Post("login") login(@Body() ownerDto: OwnerDto) {
    return this.ownersService.login(ownerDto);
  }
}
