import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })], // Import ConfigModule
  providers: [AuthService, EmailVerificationService],
  controllers: [AuthController],
})
export class AuthModule {}