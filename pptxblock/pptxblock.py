"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import time
import hashlib
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, List, Dict
from xblock.fragment import Fragment
from slice_video import SliceVideo


class PptXBlock(XBlock):
    """
    Download and slice videos
    """
    img_server_url = "http://192.168.56.1:8080"
    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    video_url = String(
        default="", scope=Scope.settings,
        help="Video URL to download",
    )

    processed_video_url = String(
        default="", scope=Scope.settings,
        help="Video URL to play",
    )

    processed_video_thumb_url = String(
        default="_", scope=Scope.settings,
        help="Video URL to play",
    )

    video_id = String(
        default="", scope=Scope.settings,
        help="Video id to store",
    )

    thumbs_html = String(
        default="", scope=Scope.settings,
        help="HTML code to display the result",
    )

    timestamps = List(
        default=[], scope=Scope.settings,
        help="List of timestamps of related slices",
    )

    # comments = String(
    #     default="", scope=Scope.user_state_summary,
    #     help="List of timestamps of related slices",
    # )

    comments_dict = Dict(
        default={}, scope=Scope.user_state_summary,
        help="List of comments of related slices",
    )


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the PptXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/pptxblock.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/pptxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/pptxblock.js"))
        frag.initialize_js('PptXBlock')
        return frag

    #Create simple setting for the xblock
    def studio_view(self, context=None):
        """
        The primary view of the PptXBlock, show settings.
        """
        html = self.resource_string("static/html/settings.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/pptxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/pptxblock.js"))
        frag.initialize_js('PptXBlock')
        return frag

    @XBlock.json_handler
    def submit_video_url(self, data, suffix=''):
        """
        A handler, which return the submited video_URL the data.
        """
        self.video_url = data['video_url'] 
        hash_object = hashlib.sha1(self.video_url)
        self.video_id = hash_object.hexdigest()
        thread = SliceVideo(1, self.video_id, self.video_url, self.thumbs_html, self.timestamps,self.img_server_url)
        thread.start()
        while (thread.is_alive()):
            time.sleep(30)
        
        self.thumbs_html = thread.thumbs_html
        self.processed_video_url = ('{1}/{0}/{0}.mp4').format(self.video_id,self.img_server_url)
        self.processed_video_thumb_url=  ('{1}/{0}/{0}.mp4.Scene-1-OUT.jpg').format(self.video_id,self.img_server_url)
        self.timestamps = thread.timestamps
        return {"video_url": self.video_url}

    @XBlock.json_handler
    def is_video_processed(self, data, suffix=''):
        """
        A handler, which return the submited video_URL the data.
        """
        if len(self.thumbs_html) > 50:
            return {"thumbs_html": self.thumbs_html}
        else:
            return {}

    @XBlock.json_handler
    def submit_slice_comment(self, data, suffix=''):
        """
        A handler, which save comment.
        """
        # if len(data['comment']) > 0:           
        #self.comments += data['comment']
        if self.comments_dict is None:
            self.comments_dict = {}
            
        if data['slice_number'] in self.comments_dict:
            self.comments_dict[data['slice_number']] += data['comment']
        else:
            self.comments_dict[data['slice_number']] = data['comment']

        return {"comment": self.comments_dict[data['slice_number']]}
        # else:
        #     return {}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("PptXBlock",
             """<pptxblock/>
             """),
            ("Multiple PptXBlock",
             """<vertical_demo>
                <pptxblock/>
                <pptxblock/>
                <pptxblock/>
                </vertical_demo>
             """),
        ]
