import { SetMetadata } from "@nestjs/common"

export const Role = (...roles: Array<number>) => SetMetadata("roles", roles)
