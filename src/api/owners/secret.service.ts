import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class SecretService {

  async hash(secret: string): Promise<string> {
    return bcrypt.hash(secret, 10);
  }

  async compare(candidate: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidate, hash);
  }

}
