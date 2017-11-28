# pptxblock2

#Prerequisites: youtube-dl and scenedetect

sudo pip install --upgrade youtube_dl

#Install pyscenedetect and dependencies: OpenCV

[PySceneDetect](https://pyscenedetect.readthedocs.io/en/latest/download/#installation)

#Prepare addional settup

sudo mkdir /vids

sudo chmod a+w /vids

sudo chmod a+w /edx/app/edxapp/edx-platform

sudo apt-get update

sudo apt install nodejs

sudo apt-get install npm

sudo npm install -g live-server

#run live-server in background at /vids directory and save the vid server URL
cd /vids

live-server &

#To install the xblock

git clone https://github.com/tungsd/pptxblock2.git

#edit pptxblock.py img_server_url = " vid server url", for example: img_server_url = "http://192.168.56.1:8080"

sudo -u edxapp /edx/bin/pip.edxapp install pptxblock2/

sudo /edx/bin/supervisorctl restart edxapp:

#Add 'pptxblock' to edx to enable it.
