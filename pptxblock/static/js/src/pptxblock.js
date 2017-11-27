/* Javascript for PptXBlock. */
function PptXBlock(runtime, element) {
    var slice = "s1";

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
        var a = timestamp.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        // $("#chatbox").append("<span>" + timestamp + "</span><br/>");
        $("#ppt_video").get(0).currentTime = seconds;
        $("#ppt_video").get(0).play();
        slice = this.id;
        $.ajax({
            type: "POST",
            url: handlerSubmitComment,
            data: JSON.stringify({"slice_number": slice, "comment": "" }),
            success: updateComments
        });

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
        //alert("Your comment has been saved successfully!")
        // $("#chatbox").append(result['comment']);
        $("#chatbox").empty();
        $("#chatbox").append(result['comment'].replace(/\|/g, '<br/>'));//
    };

    var handlerSubmitComment = runtime.handlerUrl(element, 'submit_slice_comment');

    $(".comment_form", element).submit(function (eventObject) {
        var comment = $('#usermsg').val();
        var vid_current_time = msToTime($("#ppt_video")[0].currentTime);
        console.log(vid_current_time);
        var comment_log = "(" + getTimeStamp() +" - " +$(".label-username").text() + ") " + comment + "|";
        $.ajax({
            type: "POST",
            url: handlerSubmitComment,
            data: JSON.stringify({"slice_number": slice, "comment": comment_log }),
            success: updateComments
        });
        eventObject.preventDefault();
        //$("#chatbox").append("<span>(" + getTimeStamp() +" - " +$(".label-username").text() + ") " + comment + "</span><br/>");
        $('#usermsg').val('');
        
    });

    function getTimeStamp() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var hh = today.getHours();
        var min = today.getMinutes();
        var ss = today.getSeconds();
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd = '0'+dd
        } 
        
        if(mm<10) {
            mm = '0'+mm
        } 
        
        today = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + min + ':' + ss;
        return today;
    }

    $("#usermsg").focus(function () {
        $("#ppt_video").get(0).pause();
    });

    function msToTime(current_time) {
        var duration = parseInt(parseFloat(current_time) * 1000);
        console.log(current_time, duration);
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
