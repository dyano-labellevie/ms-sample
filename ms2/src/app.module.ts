import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { CqrsModule } from '@nestjs/cqrs';
import * as schema from './db/schema';

@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      tag: 'DB_DEV',
      useFactory() {
        return {
          pg: {
            connection: 'client',
            config: {
              host: 'ms2-postgres',
              user: 'admin',
              password: 'admin',
              database: 'ms_db',
              port: 5432,
              ssl: false,
            },
          },
          config: {
            schema,
            mode: 'default',
          },
        };
      },
    }),
    CqrsModule.forRoot(),
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
