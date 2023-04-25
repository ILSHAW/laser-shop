import { Module } from "@nestjs/common"

import { TokenController } from "../controllers/token.controller"
import { ExceptionService } from "../services/exception.service"
import { RefreshStrategy } from "../strategies/refresh.strategy"
import { UserDatabaseModule } from "../modules/database.module"
import { TokenService } from "../services/token.service"
import { JwtService } from "../services/jwt.service"

@Module({
    imports: [UserDatabaseModule],
    controllers: [TokenController],
    providers: [TokenService, ExceptionService, RefreshStrategy, JwtService]
})
export class TokenModule {}