
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

deploy
------

You might want to update `apache/*.conf` files.

Create `fabconfig.py`:

	import os
	from fabric.api import env, task

	# List all servers here
	LOCATIONS = ("london", )

	# All locations + the server browse
	PROVIDERS = LOCATIONS + ("serverbrowser", )

	@task
	def server():
		env.user = 'root'
		env.environment = 'server'
		env.hosts = ['127.0.0.1'] #put server ip here
		env.root = '/srv/http/archers-london'
		env.python = '/usr/bin/python2'
		env.apache_config_dir = '/etc/httpd/conf/vhosts'
		env.folders = {
			"backend/": "backend/",
			"frontend/public/": "frontend/",
			"resources/": "resources/",
		}
		env.code_root = os.path.join(env.root, 'archers')
		env.requirements = os.path.join(env.root, 'archers', "backend")
		env.virtualenv_root = os.path.join(env.root, 'env')
		env.activate = 'source %s' % os.path.join(env.virtualenv_root, 'bin', 'activate')
		env.extra_opts = '-l --omit-dir-times'

	@task
	def server_browser():
		env.user = 'root'
		env.environment = 'serverbrowser'
		env.hosts = ['127.0.0.1'] #put server-browser ip here
		env.root = '/srv/http/archers-serverbrowser'
		env.python = '/usr/bin/python2'
		env.folders = {
			"server_browser/build/": "."
		}
		env.apache_config_dir = '/etc/httpd/conf/vhosts'
		env.code_root = os.path.join(env.root, 'archers')
		env.extra_opts = '-L'

Then run `fab server bootstrap` and `fab server_browser bootstrap`