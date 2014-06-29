
Development prerequisites
------------

* git
* python (2.7)
* swig
* build tools (e.g. `base-devel` in arch Linux. Required for compiling pybox2d)
* swig library
* virtualenv

On Arch: 
`pacman -S git base-devel python2 swig python-virtualenv`

Get b/e dependencies
----------------

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
	grunt


Deployment
------

Create your own `server-configs/httpd-archers-your_server_name.conf` and `server-configs/supervisor-archers-your_server_name.conf` files based on the included examples.

Create `fabconfig.py`:

	import os
	from fabric.api import env, task

	# List all servers here
	LOCATIONS = ("your_server_name", )

	# All locations + the server browse
	PROVIDERS = LOCATIONS + ("serverbrowser", )

	@task
	def your_server_name():
		env.user = 'root'
		env.environment = 'your_server_name'
		env.hosts = ['127.0.0.1'] #put server ip here
		env.root = '/srv/http/archers-your_server_name'
		env.python = '/usr/bin/python2'
		env.httpd_config_dir = '/etc/httpd/conf/vhosts/' #trailing slash required
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
		env.httpd_config_dir = '/etc/httpd/conf/vhosts'
		env.code_root = os.path.join(env.root, 'archers')
		env.extra_opts = '-L'

Make sure you've the following on the remote server:
	* httpd server like Apache or Nginx or similar
	* supervisord
	* rsync
	* git (required for fetching a dependency)
	* build tools (e.g. `base-devel` in arch Linux. Required for compiling pybox2d)
	* python (2.7)
	* swig library
	* virtualenv

On Arch: 
`pacman -S nginx supervisor rsync git base-devel python2 swig python-virtualenv`

Ideally setup key-based authentication (`ssh-copy-id`) then run `fab build server bootstrap` where `server` is configured in fabconfig (above). After making changes locally, you can redeploy by executing `fab build server bootstrap`.

Server browser is optional, can be configured in fabconfig as shown above and deployed using `fab build server_browser bootstrap`.