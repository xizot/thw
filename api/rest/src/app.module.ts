import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'nestjs-stripe';
import { AddressesModule } from './addresses/addresses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { CommonModule } from './common/common.module';
import { ConversationsModule } from './conversations/conversations.module';
import { CouponsModule } from './coupons/coupons.module';
import { FeedbackModule } from './feedbacks/feedbacks.module';
import { ImportsModule } from './imports/imports.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MessagesModule } from './messages/messages.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { RefundsModule } from './refunds/refunds.module';
import { ReportsModule } from './reports/reports.module';
import { ReviewModule } from './reviews/reviews.module';
import { SettingsModule } from './settings/settings.module';
import { ShippingsModule } from './shippings/shippings.module';
import { ShopsModule } from './shops/shops.module';
import { StoreNoticesModule } from './store-notices/store-notices.module';
import { TagsModule } from './tags/tags.module';
import { TaxesModule } from './taxes/taxes.module';
import { TypesModule } from './types/types.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { WebHookModule } from './web-hook/web-hook.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { WithdrawsModule } from './withdraws/withdraws.module';
import { HeartbeatModule } from './heartbeat/heartbeat.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { QuestionModule } from './questions/questions.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { RequestLoggingMiddleware } from './request-logging.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2022-11-15',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RedisModule,
    MailModule,
    UsersModule,
    CommonModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    AnalyticsModule,
    AttributesModule,
    ShippingsModule,
    TaxesModule,
    TagsModule,
    ShopsModule,
    TypesModule,
    WithdrawsModule,
    UploadsModule,
    SettingsModule,
    CouponsModule,
    AddressesModule,
    ImportsModule,
    AuthModule,
    RefundsModule,
    AuthorsModule,
    ManufacturersModule,
    NewslettersModule,
    ReviewModule,
    QuestionModule,
    WishlistsModule,
    ReportsModule,
    FeedbackModule,
    PaymentMethodModule,
    PaymentIntentModule,
    WebHookModule,
    PaymentModule,
    StoreNoticesModule,
    ConversationsModule,
    MessagesModule,
    HeartbeatModule,
    RedisModule,
    MailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
