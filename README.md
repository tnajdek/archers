
Get b/e dependencies
----------------
    pacman -Sy swig

    #for the time being we're using rogue version of the tmxlib
    cd ../../
    git clone https://github.com/tnajdek/pytmxlib.git
    cd archers/backend/
    ln -s ../../pytmxlib/tmxlib/ .

Get f/e deps
------------
    cd frontend
    npm install
    bower install

    cd components
    wget playcraft
    wget virtualjoystick-amd
    git checkout https://github.com/jquery/jquery.git
    cd jquery
    git checkout $(git describe --abbrev=0 --tags)
    npm install && grunt
    grunt custom:-ajax,-deprecated,-dimensions,-effects,-event-alias,-offset,-wrap,-sizzle
    npm install && grunt

Build f/e
---------
    cd frontend
    grunt build


Run devel env
-------------
    cd backend
    ./game.py &
    cd ../frontend
    python -m SimpleHTTPServer




~~learning purposes
