import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';

import { CantSendEmailException } from '@exceptions/cant-send-email';

@Injectable()
export class SesService {
  constructor(private readonly configService: ConfigService) {}

  getSES() {
    return new SES({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION') || 'us-east-2',
      signatureVersion: 'v4',
    });
  }

  async sendFirstTimeOtpCodeEmail(
    code: string,
    email: string,
    name = '',
  ): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hi there,</p>

<p>Welcome to the RISE Initiative community portal. </p>

<p>The RISE Initiative empowers formerly incarcerated individuals to reclaim their voting rights and actively participate in shaping their community's future. Voting is our tool for personal transformation, resilience, and leadership. Together, through voter registration and civic engagement, we are rebuilding stronger, more inclusive communities. </p>

<p>How can you help?</p>

<p>- **Join challenges** on the community portal to help inform your friends, family, and community members about their voting rights. Earn points for each challenge you complete.</p>
<p>- **Access prizes** and rewards on the community portal by redeeming the points you've earned.</p>

<p>You can check out your points total any time on your profile.</p>

<p>Let's rise together.</p>

<p>The RISE Initiative</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Your login code is: ${code} Welcome to the RISE Initiative community portal`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendOtpCodeEmail(code: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hi there,</p>

<p>${code} is your login code.</p>

<p>Let's rise together.</p>

<p>The RISE Initiative</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `${code} is your login code for the RISE community portal.`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendVisaGiftCardClaimedEmail(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hey ${email}</p>

<p>Thanks for posting your first video through Rise! We are reviewing your submission and will approve it asap. </p>

<p>You will get an email when your submission is approved with your gift card information. Please reach out to <a href="mailto:no-reply@wewillriserewards.us">no-reply@wewillriserewards.us</a> if you have not received anything within 72 hours (make sure to check your spam folder). </p>

<p>Yeehaw,</p>

<p style="margin-bottom: 0px;">Hannah & Hugh</p>
<p style="margin-top: 0px;"><em>Co-founders, Drumbeat</em>  🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `🥳 $10 Visa Gift Card Pending (Just hold tight while we review)`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendVisaGiftCardApprovedEmail(
    gitCardCode: string,
    email: string,
    name = '',
  ): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hey ${name && name.length > 0 ? name : email}</p>

<p>We appreciate your patience, below is the code to redeem your $10 Visa gift card. </p>

<p>${gitCardCode}</p>

<p><strong><b>Win even more prizes by entering Drumbeat’s contest challenges.</b></strong> Every week you can post videos for each of the challenges for more tickets to enter the big prize giveaway. Each giveaway has a random drawing for $1,000 AND we choose one winner for ‘Viral Choice Award’ to win a separate $1,000 in Visa gift cards.</p>

<p>Anyone eligible can win! See <a href="https://www.drumbeat.fun/rules">contest rules</a> for more details. </p>

<p>We’re grateful for you,</p>

<p style="margin-bottom: 0px;">Hannah & Hugh</p>
<p style="margin-top: 0px;"><em>Co-founders, Drumbeat</em>  🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Your first prize: $10 Visa gift card 🎉`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendReferralEmail(referralCode: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey there,</p>

<p>You've been invited to join the RISE Initiative community by a friend.</p>

<p>The RISE Initiative empowers formerly incarcerated individuals to reclaim their voting rights and actively participate in shaping their community's future. Voting is our tool for personal transformation, resilience, and leadership. Together, through voter registration and civic engagement, we are rebuilding stronger, more inclusive communities.</p>

<p>RISE community members have the opportunity to earn exclusive rewards by helping inform people about their rights.</a></p>

<p>- **Sign up** with your email address at <a href="http://wewillriserewards.us">http://wewillriserewards.us</a></p>
<p>- **Join challenges** on the community portal to help inform your friends, family, and community members about their voting rights. Earn points for each challenge you complete.</p>
<p>- **Access prizes** and rewards on the community portal by redeeming the points you've earned.</p>
<p>- Once you sign up, you and your friend will both earn additional points.</p>

<p>You can check out your points total any time on your profile.</p>

<p>Let's rise together.</p>

<p>The RISE Initiative</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `You've been invited to the RISE Initiative by a friend`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendEmailToReferee(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey there,</p>

<p>Congratulations! One of your friends just joined the RISE Initiative community using your personal referral link.</p>

<p>You've earned an extra 150 points. Log in now at <a href="http://wewillriserewards.us">http://wewillriserewards.us to access rewards.</a></p>

<p>Let's rise together.</p>

<p>The RISE Initiative</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `You've earned points! Your friend just the RISE Initiative community through your personal referral link`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendRewardEmail(code: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
              <p>Congratulations on redeeming your tokens to access your reward! </p>

              <p>Your code is:</p>
              
              <p>${code}</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Congratulations!`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendReadyForClaimEmail(username: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@wewillriserewards.us',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey ${username},</p>

<p>Thanks for completing a TikTok challenge via Rise! We've verified your submission and you can now get entered to win big cash prizes.</p>

<p>Head back to wewillriserewards.us to claim your tickets 🙌</p>

<p>Please reach out to no-reply@wewillriserewards.us if you have questions.</p>

<p>Cheers, </p>

<p>Hannah & Hugh<br />Co-founders, Rise 🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Rise: TikTok submission verified! 🎉`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }
}
