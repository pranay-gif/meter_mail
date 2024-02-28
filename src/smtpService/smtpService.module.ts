import { Module } from "@nestjs/common";
import { SMTPServiceController } from "./smtpService.controller";
import { SMTPService } from "./smtpService.service";
import { MailerModule } from "@nestjs-modules/mailer";



@Module({
    imports:[
        MailerModule.forRoot({
            transport:{
                service:"gmail",
                host: 'smtp.gmail.com',
                port: 465,  // Change port to 587 for STARTTLS
                secure: true,  // Set to false for STARTTLS
                logger: true,
                debug:true,
                auth: {
                    user: "electricmeteremdee@gmail.com",
                    pass: "qrlo nppr trvn jygf",
                },
                tls:{
                    rejectUnauthorized:true,
                }
            }
        })
    ],
    controllers:[SMTPServiceController],
    providers:[SMTPService]
})
export class SMTPServiceModule{
    constructor(){
        // console.log("====",process.env.GMAIL_USERNAME)
    }
}