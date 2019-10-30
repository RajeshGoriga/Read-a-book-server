var exportToExcel = require('export-to-excel');
var fs = require('fs');

class ExcelController {
    constructor() {
    }

    exportToExcel(filename, sheetname, colTitle, jsonData, cb) {
        var excelName = exportToExcel.exportXLSX({
            filename: filename,
            sheetname: sheetname,
            title: colTitle,
            data: jsonData
        });


        //Default destination of exported excel sheet i.e root
        var dest = process.env.PWD + "/" + excelName;

        //New destination for exported excel sheet i.e public
        var newDest = process.env.PWD + "/src/public/" + excelName;

        //For copying exported excel sheet from default destination to new destination
        fs.createReadStream(dest).pipe(fs.createWriteStream(newDest));

        //Deleting exported excel sheet from default destination
        fs.unlink(dest, function (err, res) {
            if (err) {
                cb && cb({ status: false, result: { message: err } });
            } else {
                cb && cb({ status: true, result: {data: excelName} });
            }
        });
    }
}

var excelController = new ExcelController();
export default excelController;