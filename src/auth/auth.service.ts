import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ code: string }> {
    const code = await this.emailVerificationService.generateVerificationCode(
      signupDto.email,
    );
    // You might want to store the code along with the email in your database 
    // for later verification.
    return { code };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<boolean> {
    return this.emailVerificationService.verifyCode(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );
  }
}