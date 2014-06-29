# -*- coding: utf-8 -*-
import logging
import os
from os.path import abspath, dirname, join
from fabric.api import env, task
from fabric.operations import local
from fabric.contrib.project import rsync_project
from fabric.api import *
from fabric import utils
from fabric.context_managers import lcd
from fabric.context_managers import shell_env 

BASEDIR = dirname(__file__)
BACKENDDIR = abspath(join(abspath(BASEDIR), 'backend'))
FRONTENDDIR = abspath(join(abspath(BASEDIR), 'frontend'))
SERVERBROWSERDIR = abspath(join(abspath(BASEDIR), 'server_browser'))
BLOGDIR = abspath(join(abspath(BASEDIR), 'blog'))
LOGGER = logging.getLogger(__name__)

from fabconfig import *

RSYNC_EXCLUDE = (
	'.DS_Store',
	'.git',
	'.gitignore',
	'archers.log',
	'*.pyc',
)

requirements_file = abspath(join(abspath(BACKENDDIR), 'requirements.txt'))


def get_venv():
	""" Get the current virtual environment name
		Bail out if we're not in one
	"""
	try:
		return os.environ['VIRTUAL_ENV']
	except KeyError:
		print('Not in a virtualenv')
		exit(1)


def get_pip():
	""" Get an absolute path to the pip executable
		for the current virtual environment
	"""
	return join(get_venv(), 'bin', 'pip')

def check_for(what, unrecoverable_msg, installation_cmd=None):
	def failure():
		print(unrecoverable_msg)
		exit()

	try:
		test_result = local("which %s" % what, capture=True)
		return test_result
	except:
		if(installation_cmd):
			print("Unable to find %s, will attempt installation (you might be asked for sudo password below)")
			local(installation_cmd)
		else:
			failure()
		try:
			test_result = local(cmd, capture=True)
			return test_result
		except:
			failure()

def get_node():
	return check_for('node', 'You need to install Node.js to run the Require.js optimiser')

def get_npm():
	return check_for('npm', 'You need to install Node.js and npm to run grunt, less, require.js optimiser')

def get_less():
	return check_for('lessc', 'You need to install LESS complier to be able to compile your LESS files.', 'sudo npm install -g less')

def get_bower():
	return check_for('bower', 'You need to install Bower to be able to install JS libs', 'sudo npm install -g bower')

def get_grunt():
	return check_for('grunt', 'You need to install Grunt to be able to compile front-end JS, stylesheets and run front-end tests', 'sudo npm install -g grunt-cli')

@task
def install_backend_deps():
	""" Install python dependencies from requirements.txt file
	"""
	with lcd(BACKENDDIR):
		cmd = '%(pip)s install -r %(requirements_file)s' % {
			'pip': get_pip(),
			'requirements_file': requirements_file
		}
		local(cmd)

@task
def install_frontend_deps():
	""" install front-end dependencies using npm and bower
	"""

	with lcd(FRONTENDDIR):
		cmd = '%(npm)s install' % {'npm': get_npm()}
		local(cmd)
		cmd = '%(bower)s install' % {'bower': get_bower()}
		local(cmd)

@task
def install_deps():
	install_backend_deps()
	install_frontend_deps()
	print ('Run `fab develop` to get everything ready for development')

@task
def build():
	with lcd(FRONTENDDIR):
		cmd = '%(grunt)s build' % {'grunt': get_grunt()}
		local(cmd)

	with lcd(SERVERBROWSERDIR):
		cmd = '%(grunt)s build' % {'grunt': get_grunt()}
		local(cmd)

	with lcd(BLOGDIR):
		cmd = '%(grunt)s build' % {'grunt': get_grunt()}
		local(cmd)

@task
def develop():
	with lcd(FRONTENDDIR):
		cmd = '%(grunt)s develop' % {'grunt': get_grunt()}
		local(cmd)

@task
def bootstrap():
	""" initialize remote host environment (virtualenv, deploy, update) """
	require('root', provided_by=PROVIDERS)
	run('mkdir -p %(root)s' % env)
	# run('mkdir -p %s' % os.path.join(env.home, 'www', 'log'))
	if("virtualenv_root" in env):
		create_virtualenv()
	
	deploy()

	if(hasattr(env, 'supervisor_config_dir')):
		supervisor_restart()

	if("virtualenv_root" in env):
		update_requirements()

def create_virtualenv():
	""" setup virtualenv on remote host """
	require('virtualenv_root', provided_by=PROVIDERS)
	args = '--clear --distribute -p %s' % env.python
	run('virtualenv %s %s' % (args, env.virtualenv_root))

@task
def httpd_config():
	""" install httpd (apache/nginx) config file """
	require('root', provided_by=PROVIDERS)

	rsync_project(
		env.httpd_config_dir,
		os.path.join(BASEDIR, "server-configs", "httpd-archers-%s.conf" % env.environment)
	)

@task
def supervisor_config():
	""" install supervisor config file """
	require('root', provided_by=PROVIDERS)

	rsync_project(
		env.supervisor_config_dir,
		os.path.join(BASEDIR, "server-configs", "supervisor-archers-%s.ini" % env.environment)
	)


@task
def deploy():
	""" rsync code to remote host """
	require('root', provided_by=PROVIDERS)
	# if env.environment == 'production':
	# 	if not console.confirm('Are you sure you want to deploy production?',
	# 						   default=False):
	# 		utils.abort('Production deployment aborted.')
	# defaults rsync options:
	# -pthrvz
	# -p preserve permissions
	# -t preserve times
	# -h output numbers in a human-readable format
	# -r recurse into directories
	# -v increase verbosity
	# -z compress file data during the transfer
	extra_opts = env.extra_opts

	for src, dest in env.folders.iteritems():
		run('mkdir -p {}'.format(os.path.join(env.code_root, dest)))
		rsync_project(
			os.path.join(env.code_root, dest),
			os.path.join(BASEDIR, src),
			exclude=RSYNC_EXCLUDE,
			delete=True,
			extra_opts=extra_opts,
		)
	httpd_config()
	
	if(hasattr(env, 'supervisor_config_dir')):
		supervisor_config()
	
	if(hasattr(env, 'folders') and 'backend/' in env.folders):
		run("touch %s" % os.path.join(env.code_root, env.folders['backend/'], 'archers.log'))
		run("chown -R nobody:nobody %s" % os.path.join(env.code_root, env.folders['backend/'], 'archers.log'))

	if(hasattr(env, 'supervisor_config_dir')):
		game_restart()

@task
def update_requirements():
	""" update external dependencies on remote host """
	require('code_root', provided_by=PROVIDERS)
	require("virtualenv_root", provided_by=LOCATIONS)

	requirements = os.path.join(env.requirements, 'requirements.txt')
	cmd = ['pip install']
	cmd += ['--requirement %s' % requirements]
	with prefix(env.activate):
		run(' '.join(cmd))


@task
def configtest():    
	""" test Apache configuration """
	require('root', provided_by=PROVIDERS)
	run('apachectl configtest')


@task
def apache_restart():    
	""" restart Apache on remote host """
	require('root', provided_by=PROVIDERS)
	run('systemctl restart httpd')

@task
def nginx_restart():    
	""" restart Nginx on remote host """
	require('root', provided_by=PROVIDERS)
	run('systemctl restart nginx')

@task
def game_restart():
	""" Use supervisor to restart game server on the remote host """
	require('root', provided_by=PROVIDERS)
	run('supervisorctl restart archers')

@task
def supervisor_restart():
	""" Restart supervisor deamon """
	require('root', provided_by=PROVIDERS)
	run('systemctl restart supervisord')