/* Javascript for PptXBlock. */
function PptXBlock(runtime, element) {

    // Settings---------------------------
    function updateVideoUrl(result) {
        $('.submited_video_url', element).text(result.video_url);
    }

    var handlerCheckReady = runtime.handlerUrl(element, 'is_Video_Processed');

    function checkLoop(result) {           //  create a loop function
        if (result) {
            location.reload();
            console.log("!null checkloop")
        } else {
            console.log("null checkloop")
            setTimeout(function () {    //  call a 10s setTimeout when the loop is called
                $.ajax({
                    type: "POST",
                    url: handlerCheckReady,
                    data: JSON.stringify({ "video_url": "video_url" }),
                    success: checkLoop
                });                    //  ..  setTimeout()
            }, 10000);
        }
    };

    var handlerSubmitUrl = runtime.handlerUrl(element, 'submit_video_url');

    $('.video_url', element).submit(function (eventObject) {
        var video_url = $('#video_url').val();
        checkLoop(); 
        $.ajax({
            type: "POST",
            url: handlerSubmitUrl,
            data: JSON.stringify({ "video_url": video_url }),
            success: updateVideoUrl
        });
    });

    $('.card', element).click(function (eventObject) {
        var timestamp = $(this).text();
        $("#chatbox").append("<span>"+timestamp+"</span><br/>");
    });

    $('#hide_chatbox', element).click(function(eventObject){
        if($("#chatbox").is(":visible")){
            $("#chatbox").hide();
            $('.comment_form').hide();
            $('hide_chatbox').text("Show comments")
        } else {
            $("#chatbox").show();
            $('.comment_form').show();
            $('hide_chatbox').text("Hide comments")
        }
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
