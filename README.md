
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
    patch --verbose -p0 < patches/*.patch

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



