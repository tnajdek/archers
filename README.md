
Get dependencies
----------------
    pacman -Sy swig
    cd frontend
    npm install
    bower install

    #for the time being we're using rogue version of the tmxlib
    cd ../../
    git clone https://github.com/tnajdek/pytmxlib.git
    cd archers/backend/
    ln -s ../../pytmxlib/tmxlib/ .

Build f/e
---------
    cd frontend
    grunt build
    cd components
    wget playcraft
    wget virtualjoystick-amd

    git checkout https://github.com/jquery/jquery.git
    cd jquery
    npm install && grunt

    

Run devel env
-------------
    cd backend
    ./game.py &
    cd ../frontend
    python -m SimpleHTTPServer



