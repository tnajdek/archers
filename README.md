
Get b/e dependencies
----------------
    
    # Get Swig lib ('pacman -Sy swig' or 'brew install swig' etc.)
    sudo pip install -r requirements.txt

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



