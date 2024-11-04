import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [AuthModule, EmailVerificationModule, ConfigModule.forRoot({
    envFilePath: '.env'
  })],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, EmailVerificationService],
})
export class AppModule { }
