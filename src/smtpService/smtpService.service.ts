import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


const columns = [
    { title: 'Division Id', dataIndex: 'division_id' },
    { title: 'Sub Division Id', dataIndex: 'subdivision_id' },
    { title: 'Sub Division Name', dataIndex: 'subdivision_name' },
    { title: 'Section Id', dataIndex: 'section_id' },
    { title: 'Section Name', dataIndex: 'section_name' },
    { title: 'Division Name', dataIndex: 'division_name' },
    { title: 'Area', dataIndex: 'area_name' },
    { title: 'Meter Reader Id', dataIndex: 'mr_id' },
    { title: 'Consumer Count', dataIndex: 'consumer_count' },
    { title: 'Meter Readers', dataIndex: 'mrId_count' },
    { title: 'Meter Reader', dataIndex: 'meter_readers' },
    { title: 'Proper Readings (OK)', dataIndex: 'ok_count' },
    { title: 'OK With Exceptions', dataIndex: 'ok_with_exceptions_count' },
    { title: 'OK Without Exceptions', dataIndex: 'ok_without_exceptions_count' },
    { title: 'Field Issues', dataIndex: 'field_issues' },
    { title: 'Meter Defective (MD)', dataIndex: 'md_count' },
    { title: 'Door Lock (DL)', dataIndex: 'dl_count' },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Time', dataIndex: 'time' },
    { title: 'id', dataIndex: 'id' },
    { title: 'Meter Number', dataIndex: 'meter_number' },
    { title: 'Consumer Number', dataIndex: 'consumer_number' },
    { title: 'Location', dataIndex: 'location' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Status Code', dataIndex: 'status_code' },
    { title: 'Abnormalities Code', dataIndex: 'abnormalities_code' },
    { title: 'KWH', dataIndex: 'kwh' },
    { title: 'MD', dataIndex: 'MD' },
    { title: 'MR Remarks', dataIndex: 'mr_remarks' },
    { title: 'Exception Code', dataIndex: 'exception_code' },
    { title: 'Ok Without Exception', dataIndex: 'ok_exception_count' },
    { title: 'Incorrect Reading', dataIndex: 'ir_exception_count' },
    { title: 'InCorrect Parameter', dataIndex: 'ip_exception_count' },
    { title: 'Unclear Image', dataIndex: 'uc_exception_count' },
    { title: 'Spoof', dataIndex: 'sp_exception_count' },
    { title: 'Invalid Image', dataIndex: 'im_exception_count' },
    { title: 'Total', dataIndex: 'total' },
    { title: 'Consumer Billed', dataIndex: 'cosumer_billed' },
    { title: 'Mobile Number', dataIndex: 'mr_mobile_no' },
    { title: 'Consumer Count', dataIndex: 'count' },
  ];  
@Injectable()
export class SMTPService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPdfMail(email: string, apiData: any, name: string,fromDate:any,toDate:any): Promise<string> {
    try {
      console.log('API Data:', apiData);

      const htmlContent = await this.generateHtmlContent(apiData, columns,fromDate,toDate,name);
      const pdfBuffer = await this.generatePdfBuffer(htmlContent);

      await this.mailerService.sendMail({
        to: email,
        from: 'electricmeteremdee@gmail.com',
        subject: 'Pdf',
        attachments: [
          {
            filename: `${name}.pdf`,
            content: pdfBuffer.toString('base64'),
            encoding: 'base64',
            contentDisposition: 'attachment',
          },
        ],
      });

      return 'Email is Sent Successfully';
    } catch (error) {
      console.error('Error sending email:', error);
      return 'Error sending email';
    }
  }

  async generateHtmlContent(apiData: any, columns: any,fromDate:any,toDate:any,name:string): Promise<string> {
   
    const apiDataIndices = [...new Set(apiData.map(item => Object.keys(item)).flat())];
   
    const headers = apiDataIndices
  .filter(apiKey => columns.some(column => column.dataIndex === apiKey))
  .map(apiKey => {
    const matchingColumn = columns.find(column => column.dataIndex === apiKey);
    return `<th>${matchingColumn?.title || ''}</th>`;
  })
  .join('');
    // const rows = apiData.map(item =>
    //   columns.map(column => `<td>${item[column.dataIndex]?.toString() || ''}</td>`).join('')
    // );

    const rows = apiData.map(item => {
        const rowData = apiDataIndices
          .filter(apiKey => columns.some(column => column.dataIndex === apiKey))
          .map(apiKey => {
            const matchingColumn = columns.find(column => column.dataIndex === apiKey);
            return `<td>${item[matchingColumn?.dataIndex]?.toString() || ''}</td>`;
          })
          .join('');
        return `<tr>${rowData}</tr>`;
      });


    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: left;
            }

            h2{
                text-align:center;
            }
            footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                text-align: center;
                padding: 5px;
              }
        

              @page {
                counter-increment: page;
                @bottom-center {
                  content: 'Page ' counter(page);
                }
              }
          </style>
        </head>
        <body>
          <table>
            <h2>${name}</h2>
            <div>
              <h4>From Date : ${fromDate}</p>
              <h4>To Date   : ${toDate}</p>
            </div>
            <thead>
              <tr>${headers}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row}</tr>`).join('')}
            </tbody>
          </table>
          <footer id="pageFooter"></footer>

          <script type="text/javascript">
            // JavaScript to dynamically update the page number
            let pageNumber = 1;
    
            window.matchMedia('print').addListener(function (mediaQueryListEvent) {
              if (mediaQueryListEvent.matches) {
                updatePageNumber();
              }
            });
    
            function updatePageNumber() {
              document.getElementById('pageFooter').innerHTML = 'Page ' + pageNumber;
              pageNumber++;
            }
          </script>        
        </body>
      </html>
    `;

    return htmlContent;
  }

  async generatePdfBuffer(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({ format: 'letter' }); // Adjust format as needed

    await browser.close();

    return pdfBuffer;
  }
}