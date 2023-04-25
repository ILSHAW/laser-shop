import { ConfigModule as BaseConfigModule } from "@nestjs/config"
import { Module } from "@nestjs/common"

import DatabaseConfig from "../configs/database.config"
import AppConfig from "../configs/app.config"

const configModule = BaseConfigModule.forRoot({
    load: [
        AppConfig, 
        DatabaseConfig
    ]
})

@Module({
    imports: [configModule],
    exports: [configModule]
})
export class ConfigModule {}