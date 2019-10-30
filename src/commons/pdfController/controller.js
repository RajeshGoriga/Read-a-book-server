import path from 'path';
import htmlPdf from 'html-pdf';
import fs from 'fs';
import templateController from '../templateController/controller';

class PdfController {
    constructor() {
    }

    convertToPdfBuffer(templateName, data, options, cb) {
        var file = templateController.getTemplate(templateName, data);
        htmlPdf.create(file, options).toBuffer((err, buffer) => {
            if (err) {
                cb && cb({ status: false, result: { message: err } });
            } else {
                cb && cb({ status: true, result: { data: buffer } });
            }
        });
    }
}

var pdfController = new PdfController();
export default pdfController;