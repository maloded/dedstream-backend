import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ adapter });
    }
    public async onModuleInit() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await this.$connect();
    }

    public async onModuleDestroy() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await this.$disconnect();
    }
}