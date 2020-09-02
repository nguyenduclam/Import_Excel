<?php
    include "config.php";
?>

<?php
    $exceljson = $_POST['importExcel'];

    foreach($exceljson as $row) {
        /*---- Insert vào bảng SampleBanTuDong ----*/
        $code_station = $row['Trạm quan trắc'];
        $symbol = $code_station;
        $time = $row['Time (Sample_BTD)'];
        $dateOfSampling = $row['dateOfSampling (Sample_BTD)'];
        $dateOfAnalysis = $row['dateOfAnalysis (Sample_BTD)'];
        $samplingLocations = $row['samplingLocations (Sample_BTD)'];
        $weather = $row['Weather (Sample_BTD)'];
        $idExcel = $row['IdSTT'];
    }
?>
