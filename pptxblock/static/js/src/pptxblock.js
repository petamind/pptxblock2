/* Javascript for PptXBlock. */
function PptXBlock(runtime, element) {

    user_service = runtime.service(self, 'user')
    xb_user = user_service.get_current_user()
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
        var comment = $('#usermsg').val() + xb_user.full_name;
        $.ajax({
            type: "POST",
            url: handlerSubmitComment,
            data: JSON.stringify({ "comment": comment }),
            success: updateComments
        });
        eventObject.preventDefault();
        $("#chatbox").append("<span>" + comment + "</span><br/>");
        $('#usermsg').val('');
        
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */

    });
}
