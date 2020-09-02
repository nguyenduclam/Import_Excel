function ProcessExcel() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx)$/;
    /* Checks whether the file is a valid excel file */
    if (regex.test($("#excelfile").val().toLowerCase())) {
        /* Checks whether the browser supports HTML5 */
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                /* Gets all the sheetnames of excel in to a variable */
                var sheet_name_list = workbook.SheetNames;

                /* Iterate through all sheets */
                sheet_name_list.forEach(function (y) {
                    /* Convert the cell value to Json */
                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y], {
                        raw: false,
                        range: 4,
                        defval: ""
                    });

                    $.post("services/import_excel.php", {
                        importExcel: exceljson
                    }, function(){
                        console.log("Import Excel Success");
                    });
                });
            }
            /* If excel file is .xlsx extension than creates a Array Buffer from excel */
            reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        alert("Please upload a valid Excel (.xlsx) file!");
    }
}
