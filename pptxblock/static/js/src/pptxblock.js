/* Javascript for PptXBlock. */
function PptXBlock(runtime, element) {

    // Settings---------------------------
    function updateVideoUrl(result) {
        $('.submited_video_url', element).text(result.video_url);
    }

    var handlerCheckReady = runtime.handlerUrl(element, 'is_Video_Processed');

    function checkLoop(result) {           //  create a loop function
        setTimeout(function () {    //  call a 3s setTimeout when the loop is called
            if (result) {
                location.reload();
            } else {
                $.ajax({
                    type: "POST",
                    url: handlerCheckReady,
                    data: JSON.stringify({ "video_url": video_url }),
                    success: checkLoop
                });                    //  ..  setTimeout()
            }
        }, 30000)
    };

    var handlerSubmitUrl = runtime.handlerUrl(element, 'submit_video_url');

    $('.video_url', element).submit(function (eventObject) {
        var video_url = $('#video_url').val();
        checkLoop(null);
        $.ajax({
            type: "POST",
            url: handlerSubmitUrl,
            data: JSON.stringify({ "video_url": video_url }),
            success: updateVideoUrl
        });
    });


    // function updateCount(result) {
    //     $('.count', element).text(result.count);
    // }

    // var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    // $('p', element).click(function(eventObject) {
    //     $.ajax({
    //         type: "POST",
    //         url: handlerUrl,
    //         data: JSON.stringify({"hello": "world"}),
    //         success: updateCount
    //     });
    // });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
