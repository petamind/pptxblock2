/* Javascript for PptXBlock. */
function PptXBlock(runtime, element) {

    // Settings---------------------------
    function updateVideoUrl(result) {
        $('.submited_video_url', element).text(result.video_url);
    }

    var handlerCheckReady = runtime.handlerUrl(element, 'is_video_processed');

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

    // Interact with slices---------------------------
    $('.card', element).click(function (eventObject) {
        var timestamp = $(this).text();
        $("#chatbox").append("<span>" + timestamp + "</span><br/>");
    });

    $('#hide_chatbox', element).click(function (eventObject) {
        eventObject.preventDefault();
        if ($("#chatbox").is(":visible")) {
            $("#chatbox").hide();
            $('.comment_form').hide();
            $('#hide_chatbox').text("Show comments")
        } else {
            $("#chatbox").show();
            $('.comment_form').show();
            $('#hide_chatbox').text("Hide comments")
        }
    });

    // Commenting---------------------------
    function updateComments(result) {
        $("#chatbox").append(result['comment']);
    };

    var handlerSubmitComment = runtime.handlerUrl(element, 'submit_slice_comment');

    $(".comment_form", element).submit(function (eventObject) {
        var comment = $('#usermsg').val();
        var vid_current_time = msToTime($("#ppt_video").currentTime);
        console.log(vid_current_time);
        $.ajax({
            type: "POST",
            url: handlerSubmitComment,
            data: JSON.stringify({"timestamp": vid_current_time, "comment": comment }),
            success: updateComments
        });
        eventObject.preventDefault();
        $("#chatbox").append("<span>" + comment + "</span><br/>");
        $('#usermsg').val('');
        
    });

    function msToTime(current_time) {
        var duration = parseInt(parseFloat(current_time) * 1000);
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }


    $(function ($) {
        /* Here's where you'd do things on page load. */

    });
}
