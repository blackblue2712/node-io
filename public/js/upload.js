$(document).ready(function() {
    $(".btn-click-upload").click(function() {
        $(".input-upload-file").click();
    });

    $(".input-upload-file").on("change", function() {
        if($(this).val != '') {
            let fileName = $(this)[0].files[0].name;
            $(".btn-click-upload").html(fileName);
        }
    });

    // $("#form-dashboard").on("submit", function () {
    //     var formData = new FormData();
    //     formData.append("upload", $(".input-upload-file")[0].files[0]);
    //     $.ajax({
    //         url: '/uploadFile',
    //         type: "POST",
    //         data: formData,
    //         processData: false,
    //         contentType: false,
    //         success: function (data) {
    //             console.log(data);
    //         }
    //     });
    // });
});
