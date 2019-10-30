import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';

class TemplateController {
    constructor() {
    }

    getTemplate(templateName, data) {
        var templatePath = path.resolve(process.cwd(), 'templates') + '/' + templateName;
        var templateData = fs.readFileSync(templatePath).toString();
        return Mustache.render(templateData, data);
    }
}

var templateController = new TemplateController();

export default templateController;