/*---- Call Standard Parameter using Ajax ----*/
var total_std_param;
$.ajax({
    url: "services/call_standard_param.php",
    async: false,
    dataType: 'json',
    success: function (data) {
        total_std_param = data;
    }
});

function ProcessExcel() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx)$/;
    /* Checks whether the file is a valid excel file */
    if (regex.test($("#excelfile").val().toLowerCase())) {
        /* Checks whether the browser supports HTML5 */
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {
                    type: 'array',
                    cellDates: true,
                    cellNF: false,
                    cellText: false
                });
                /* Gets all the sheetnames of excel in to a variable */
                var sheet_name_list = workbook.SheetNames;

                /* Iterate through all sheets */
                sheet_name_list.forEach(function (y) {
                    /* Convert the cell value to Json */
                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y], {
                        raw: false,
                        range: 4,
                        defval: "",
                        dateNF: "YYYY-MM-DD"
                    });

                    $.post("services/import_excel.php", {
                        importExcel: ProcessJSON(exceljson)
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

function ProcessJSON(exceljson) {
    var result = [];
    for (var k = 0; k < exceljson.length; k++) {
        var object_keys = Object.keys(exceljson[k]);

        var detail = {};
        var data_para = [];
        for (var i = 0; i < object_keys.length; i++) {
            for (var j = 0; j < total_std_param.length; j++) {
                if (object_keys[i] == total_std_param[j].parameterCode &&
                    total_std_param[j].purposeid == 14 &&
                    total_std_param[j].standardID == 11 &&
                    exceljson[k][object_keys[i]] != "") {
                    var object_para = {}

                    /*** Tạo Object Detail cho từng Para ***/
                    object_para[total_std_param[j].id] = {};
                    object_para[total_std_param[j].id].v = parseFloat(exceljson[k][object_keys[i]]);
                    if (exceljson[k][object_keys[i]] >= total_std_param[j].min_value &&
                        exceljson[k][object_keys[i]] <= total_std_param[j].min_value) {
                        object_para[total_std_param[j].id].inlimit = "N"
                    } else {
                        object_para[total_std_param[j].id].inlimit = "Y"
                    }
                    data_para.push(object_para)
                }
            }
        }

        /*** Xử lý Time and Date ***/
        var time = exceljson[k]['Time (Sample_BTD)'];
        if (time == '') {
            time = "00:00:00";
        }

        var date_sampling = exceljson[k]['dateOfSampling (Sample_BTD)'];
        var string_date_sampling = date_sampling.split("-");
        var date_sampling_format = string_date_sampling[2] + "/" +
            string_date_sampling[1] + "/" + string_date_sampling[0]

        var date_analysis = exceljson[k]['dateOfAnalysis (Sample_BTD)'];
        var string_date_analysis = date_sampling.split("-");
        var date_analysis_format = string_date_analysis[2] + "/" +
            string_date_analysis[1] + "/" + string_date_analysis[0]

        if (date_analysis == "") {
            detail.time = time + ", " + date_sampling_format;
        } else {
            detail.time = time + ", " + date_analysis_format;
        }

        detail.data = data_para;

        /*** Đẩy các Items ***/
        result.push({
            "code_station": exceljson[k]['Trạm quan trắc'],
            "symbol": exceljson[k]['Trạm quan trắc'],
            "time": time,
            "dateOfSampling": exceljson[k]['dateOfSampling (Sample_BTD)'],
            "dateOfAnalysis": exceljson[k]['dateOfAnalysis (Sample_BTD)'] == ""
                ? exceljson[k]['dateOfSampling (Sample_BTD)'] : exceljson[k]['dateOfAnalysis (Sample_BTD)'],
            "samplingLocations": exceljson[k]['samplingLocations (Sample_BTD)'],
            "weather": exceljson[k]['Weather (Sample_BTD)'],
            "idExcel": exceljson[k]['IdSTT'],
            "detail_data": detail
        })
    }

    return result
}
