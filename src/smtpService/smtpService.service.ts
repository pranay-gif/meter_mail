// import { MailerService } from "@nestjs-modules/mailer";
// import { Injectable } from "@nestjs/common";
// import * as PDFDocument from 'pdfkit';

import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
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

// @Injectable({})
// export class SMTPService {
//     constructor(private readonly mailerService: MailerService) {}

//     async sendPdfMail(email: string, apiData: any): Promise<string> {
//         try {
//             console.log('API Data:', apiData);
    
//             const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
//                 const doc = new PDFDocument({
//                     size: 'LETTER',
//                     bufferPages: true,
//                     layout: 'landscape',
//                     margin: 0,
//                 });
    
//                 const headers = Object.keys(apiData[0]);
//                 console.log('Headers:', headers);
    
//                 const rows = apiData.map(item => headers.map(key => item[key]));
//                 console.log('Rows:', rows);
    
//                 const tableWidths = headers.map(header => doc.widthOfString(header));
//                 const rowHeight = 20;
//                 const padding = 10;  
    
//                 // Draw headers
//                 let currentX = 0;
//                 headers.forEach((header, index) => {
//                     doc.text(header, currentX, 0);
//                     currentX += tableWidths[index] + padding;
//                 });
    
//                 // Draw rows
//                 let currentY = rowHeight + padding;  // Add padding to avoid overlapping
//                 rows.forEach(row => {
//                     currentX = 0;
//                     row.forEach((cell, index) => {
//                         doc.text(cell.toString(), currentX, currentY);
//                         currentX += tableWidths[index] + padding;
//                     });
//                     currentY += rowHeight + padding;  // Add padding to avoid overlapping
//                 });
    
//                 doc.end();
    
//                 const buffer = [];
//                 doc.on('data', buffer.push.bind(buffer));
//                 doc.on('end', () => {
//                     const data = Buffer.concat(buffer);
//                     resolve(data);
//                 });
//                 doc.on('error', reject);
//             });
    
//             await this.mailerService.sendMail({
//                 to: email,
//                 from: "email",
//                 subject: "Pdf",
//                 attachments: [
//                     {
//                         filename: 'api_data_table.pdf',
//                         content: pdfBuffer.toString('base64'),
//                         encoding: 'base64',
//                         contentDisposition: 'attachment',
//                     },
//                 ],
//             });
    
//             return "Email is Sent Successfully";
//         } catch (error) {
//             console.error('Error sending email:', error);
//             return "Error sending email";
//         }
//     }
    
// }

// @Injectable({})
// export class SMTPService {
//     constructor(private readonly mailerService: MailerService) {}

//     async sendPdfMail(email: string, apiData: any,name:string): Promise<string> {
//         try {
//             console.log('API Data:', apiData);

//             // Extract unique dataIndex values from apiData
//             const uniqueDataIndices = [...new Set(apiData.map(item => Object.keys(item)).flat())];

//             // Filter columns to include only those with dataIndex present in apiData
//             const includedColumns = columns.filter(column => uniqueDataIndices.includes(column.dataIndex));

//             // Filter apiData to include only relevant columns
//             const filteredApiData = apiData.map(item => {
//                 const filteredItem = {};
//                 includedColumns.forEach(column => {
//                     filteredItem[column.dataIndex] = item[column.dataIndex];
//                 });
//                 return filteredItem;
//             });

//             const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
//                 const doc = new PDFDocument({
//                     size: [800, 1000],
//                     bufferPages: true,
//                     layout: 'landscape',
//                     margin: 0,
//                 });

//                 const headers = includedColumns.map(column => column.title);
//                 console.log('Headers:', headers);

//                 const rows = filteredApiData.map(item => {
//                     const row = includedColumns.map(column => {
//                         const value = item[column.dataIndex];
//                         console.log(`Item[${column.dataIndex}]:`, value);
//                         return value;
//                     });

//                     console.log('Row:', row);
//                     return row;
//                 });

//                 console.log('Rows:', rows);

//                 const tableWidths = headers.map(header => doc.widthOfString(header));
//                 const rowHeight = 20;
//                 const padding = 10;  

//                 // Draw headers
//                 let currentX = 0;
//                 headers.forEach((header, index) => {
//                     doc.text(header, currentX, 0);
//                     currentX += tableWidths[index] + padding;
//                 });

//                 // Draw rows
//                 let currentY = rowHeight + padding;  // Add padding to avoid overlapping
//                 rows.forEach(row => {
//                     currentX = 0;
//                     row.forEach((cell, index) => {
//                         doc.text(cell?.toString() || '', currentX, currentY);
//                         currentX += tableWidths[index] + padding;
//                     });
//                     currentY += rowHeight + padding;  // Add padding to avoid overlapping
//                 });

//                 doc.end();

//                 const buffer = [];
//                 doc.on('data', buffer.push.bind(buffer));
//                 doc.on('end', () => {
//                     const data = Buffer.concat(buffer);
//                     resolve(data);
//                 });
//                 doc.on('error', reject);
//             });

//             await this.mailerService.sendMail({
//                 to: email,
//                 from: "email",
//                 subject: "Pdf",
//                 attachments: [
//                     {
//                         filename: 'api_data_table.pdf',
//                         content: pdfBuffer.toString('base64'),
//                         encoding: 'base64',
//                         contentDisposition: 'attachment',
//                     },
//                 ],
//             });

//             return "Email is Sent Successfully";
//         } catch (error) {
//             console.error('Error sending email:', error);
//             return "Error sending email";
//         }
//     }
// }


// @Injectable({})
// export class SMTPService {
//     constructor(private readonly mailerService: MailerService) {}

//     // async sendPdfMail(email: string, apiData: any, name: string): Promise<string> {
//     //     try {
//     //         console.log('API Data:', apiData);

//     //         // Extract unique dataIndex values from apiData
//     //         const uniqueDataIndices = [...new Set(apiData.map(item => Object.keys(item)).flat())];

//     //         // Filter columns to include only those with dataIndex present in apiData
//     //         const includedColumns = columns.filter(column => uniqueDataIndices.includes(column.dataIndex));

//     //         // Filter apiData to include only relevant columns
//     //         const filteredApiData = apiData.map(item => {
//     //             const filteredItem = {};
//     //             includedColumns.forEach(column => {
//     //                 filteredItem[column.dataIndex] = item[column.dataIndex];
//     //             });
//     //             return filteredItem;
//     //         });

//     //         const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
//     //             const doc = new PDFDocument({
//     //                 size: [800, 1000],
//     //                 bufferPages: true,
//     //                 layout: 'landscape',
//     //                 margin: 0,
//     //             });


//     //             doc.text('Header Text', { align: 'center' });
            

//     //             // Add static data at the top of the page
//     //             // const staticData = ['Static Data 1', 'Static Data 2', 'Static Data 3'];
//     //             // const staticDataWidths = staticData.map(data => doc.widthOfString(data));
//     //             // let staticDataX = 0;

//     //             // staticData.forEach((data, index) => {
//     //             //     doc.text(data, staticDataX, 0);
//     //             //     staticDataX += staticDataWidths[index];
//     //             // });

//     //             const headers = includedColumns.map(column => column.title);
//     //             console.log('Headers:', headers);

//     //             const rows = filteredApiData.map(item => {
//     //                 const row = includedColumns.map(column => {
//     //                     const value = item[column.dataIndex];
//     //                     console.log(`Item[${column.dataIndex}]:`, value);
//     //                     return value;
//     //                 });

//     //                 console.log('Row:', row);
//     //                 return row;
//     //             });

//     //             console.log('Rows:', rows);

//     //             const tableWidths = headers.map(header => doc.widthOfString(header));
//     //             const rowHeight = 20;
//     //             const padding = 10;

//     //             // Draw headers
//     //             let currentX = 0;
//     //             headers.forEach((header, index) => {
//     //                 doc.text(header, currentX, rowHeight + padding);
//     //                 currentX += tableWidths[index] + padding;
//     //             });

//     //             // Draw rows
//     //             let currentY = 2 * (rowHeight + padding); // Add space for static data
//     //             rows.forEach(row => {
//     //                 currentX = 0;
//     //                 row.forEach((cell, index) => {
//     //                     doc.text(cell?.toString() || '', currentX, currentY);
//     //                     currentX += tableWidths[index] + padding;
//     //                 });
//     //                 currentY += rowHeight + padding; // Add padding to avoid overlapping
//     //             });

             

//     //             doc.end();

//     //             const buffer = [];
//     //             doc.on('data', buffer.push.bind(buffer));
//     //             doc.on('end', () => {
//     //                 const data = Buffer.concat(buffer);
//     //                 resolve(data);
//     //             });
//     //             doc.on('error', reject);
//     //         });

//     //         await this.mailerService.sendMail({
//     //             to: email,
//     //             from: 'email',
//     //             subject: 'Pdf',
//     //             attachments: [
//     //                 {
//     //                     filename: 'api_data_table.pdf',
//     //                     content: pdfBuffer.toString('base64'),
//     //                     encoding: 'base64',
//     //                     contentDisposition: 'attachment',
//     //                 },
//     //             ],
//     //         });

//     //         return 'Email is Sent Successfully';
//     //     } catch (error) {
//     //         console.error('Error sending email:', error);
//     //         return 'Error sending email';
//     //     }
//     // }

//     async sendPdfMail(email: string, apiData: any, name: string): Promise<string> {
//         try {
//             console.log('API Data:', apiData);
    
//             // Extract unique dataIndex values from apiData
//             const uniqueDataIndices = [...new Set(apiData.map(item => Object.keys(item)).flat())];
    
//             // Filter columns to include only those with dataIndex present in apiData
//             const includedColumns = columns.filter(column => uniqueDataIndices.includes(column.dataIndex));
    
//             // Filter apiData to include only relevant columns
//             const filteredApiData = apiData.map(item => {
//                 const filteredItem = {};
//                 includedColumns.forEach(column => {
//                     filteredItem[column.dataIndex] = item[column.dataIndex];
//                 });
//                 return filteredItem;
//             });
    
//             const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
//                 const doc = new PDFDocument({
//                     size: [800, 1000],
//                     bufferPages: true,
//                     layout: 'landscape',
//                     margin: 0,
//                 });
    
//                 doc.text('Header Text', { align: 'center' });
    
//                 const headers = includedColumns.map(column => column.title);
//                 console.log('Headers:', headers);
    
//                 const rows = filteredApiData.map(item => {
//                     const row = includedColumns.map(column => {
//                         const value = item[column.dataIndex];
//                         console.log(`Item[${column.dataIndex}]:`, value);
//                         return value;
//                     });
//                     console.log('Row:', row);
//                     return row;
//                 });
    
//                 console.log('Rows:', rows);
    
//                 const tableWidths = headers.map(header => doc.widthOfString(header));
//                 const rowHeight = 10;
//                 const padding = 5;
//                 const borderWidth = 1; // Set the border width as needed
    
//                 // Draw headers with border
//                 let currentX = 0;
//                 headers.forEach((header, index) => {
//                     doc.rect(currentX, rowHeight + padding, tableWidths[index] + padding * 2, rowHeight)
//                         .stroke(); // Draw cell border
//                     doc.text(header, currentX + padding, rowHeight + padding * 2); // Add text with padding
//                     currentX += tableWidths[index] + padding * 2;
//                 });
    
//                 // Draw rows with border
//                 let currentY = 2 * (rowHeight + padding);
//                 rows.forEach(row => {
//                     currentX = 0;
//                     row.forEach((cell, index) => {
//                         doc.rect(currentX, currentY, tableWidths[index] + padding * 2, rowHeight)
//                             .stroke(); // Draw cell border
//                         doc.text(cell?.toString() || '', currentX + padding, currentY + padding); // Add text with padding
//                         currentX += tableWidths[index] + padding * 2;
//                     });
//                     currentY += rowHeight + padding;
//                 });
    
//                 // Draw border around the entire table
//                 const totalTableWidth = tableWidths.reduce((acc, width) => acc + width + padding * 2, 0);
//                 const totalTableHeight = rows.length * (rowHeight + padding) + padding;
//                 doc.rect(0, rowHeight + padding, totalTableWidth, totalTableHeight).stroke();
    
//                 doc.end();
    
//                 const buffer = [];
//                 doc.on('data', buffer.push.bind(buffer));
//                 doc.on('end', () => {
//                     const data = Buffer.concat(buffer);
//                     resolve(data);
//                 });
//                 doc.on('error', reject);
//             });
    
//             await this.mailerService.sendMail({
//                 to: email,
//                 from: 'email',
//                 subject: 'Pdf',
//                 attachments: [
//                     {
//                         filename: 'api_data_table.pdf',
//                         content: pdfBuffer.toString('base64'),
//                         encoding: 'base64',
//                         contentDisposition: 'attachment',
//                     },
//                 ],
//             });
    
//             return 'Email is Sent Successfully';
//         } catch (error) {
//             console.error('Error sending email:', error);
//             return 'Error sending email';
//         }
//     }
    
// }


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