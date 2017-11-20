"""Ok this is for slicing video"""
import os
import threading
import time

class SliceVideo(threading.Thread):
    """
    Slice the video to images
    """

    def __init__(self, threadID, video_id, video_url, thumbs_html, timestamps):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.video_id = video_id
        self.video_url = video_url
        self.thumbs_html = thumbs_html
        self.timestamps = timestamps

    def run(self):
        download_cmd = ('youtube-dl {1} -o /vids/{0}/{0}.mp4').format(self.video_id, self.video_url)
        os.system(download_cmd)
        
        slice_cmd = ('scenedetect -i /vids/{0}/{0}.mp4 -co /vids/{0}/{0}.csv -d content -si -df 4').format(self.video_id)
        os.system(slice_cmd)
        #read cvs
        fline = open(('/vids/{0}/{0}.csv').format(self.video_id)).readline().rstrip()
        timestamps = fline.split(",")
        #process to html div 
        i = 1
        for timestamp in timestamps:
            self.thumbs_html += ("<li><div class=\'card inline\' ><img src=\'http://192.168.56.1:8080/{0}/{0}.mp4.Scene-{1}-IN.jpg\' width=\'100\' height=\'100\' /><div class=\'timestamp\'><h4 id='card{i}'>").format(self.video_id, i)
            self.thumbs_html += timestamp
            self.thumbs_html += "</h4></div></li>"
            i = i + 1

        copy_cmd = ('find /edx/app -name \"{0}*\" -exec mv -t /vids/{0} {{}} +').format(self.video_id)
        os.system(copy_cmd)
        # self.timestamps = timestamps
        
