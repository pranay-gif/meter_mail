import { Body, Controller, Post } from "@nestjs/common";
import { SMTPService } from "./smtpService.service";

@Controller('mailer')
export class SMTPServiceController{
    constructor(private readonly smtpService:SMTPService){}

    @Post("/sendMail")
    sendMail(@Body() data:any){
        let email=data.email;
        let pdfData=data.apiData;
        let name=data.name;
        let fromDate=data.fromDate;
        let toDate=data.toDate;
        // console.log(email,pdfData)
        return this.smtpService.sendPdfMail(email,pdfData,name,fromDate,toDate)
    }
}