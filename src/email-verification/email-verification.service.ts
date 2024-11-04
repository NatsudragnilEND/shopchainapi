require('dotenv').config()
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class EmailVerificationService {
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;
  private readonly supabase: any; // Use any for now, will type later

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async generateVerificationCode(email: string): Promise<string> {
    const code = this.generateRandomCode();
    await this.storeVerificationCode(email, code);
    await this.sendVerificationEmail(email, code);
    return code;
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.getVerificationCode(email);
    if (storedCode === code) {
      await this.deleteVerificationCode(email);
      console.log(true);
      
      return true;

    }
    console.log(false);
    
    return false;
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Shopchain Email Verification',
      html: `
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>Please enter this code to verify your email address.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('doden' + code);
    
    setTimeout(async () => {
      await this.deleteVerificationCode(email)
    }, 180000);
  }

  private generateRandomCode(): string {
    const randomBytesLength = 7;
    return randomBytes(randomBytesLength)
      .toString('hex')
      .substring(0, randomBytesLength);
  }

  private async storeVerificationCode(email: string, code: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('email_verifications')
      .insert({ email, code });
    if (error) {
      console.error('Error storing verification code:', error);
      throw new Error('Failed to store verification code');
    }
  }

  private async getVerificationCode(email: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('email_verifications')
      .select('code')
      .eq('email', email)
      .single();
    if (error) {
      console.error('Error retrieving verification code:', error);
      throw new Error('Failed to retrieve verification code');
    }
    return data?.code || null;
  }

  private async deleteVerificationCode(email: string): Promise<void> {
    const { error } = await this.supabase
      .from('email_verifications')
      .delete()
      .eq('email', email);
    if (error) {
      console.error('Error deleting verification code:', error);
      throw new Error('Failed to delete verification code');
    }
  }
}