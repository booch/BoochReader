# As suggested by Jeff Casimir - https://speakerdeck.com/u/j3/p/adventures-on-the-golden-path
%w[generate destroy server console].each do |command|
  desc "Rails CLI proxy for #{command}"
  task command do
    system("rails #{command} #{ARGV[1..-1].join(' ')}")
    exit
  end
end

namespace :server do
  desc 'Start the Rails server'
  task :start do
    system("rails server >>#{server_log_file} 2>&1 &")
  end

  desc 'Stop the Rails server'
  task :stop do
    system("kill -INT #{server_pid}") if File.exists?(server_pid_file)
  end

  desc 'Restart the Rails server'
  task :restart => [:stop, :start]
  
  def server_pid
    File.read(server_pid_file)
  end

  def server_pid_file
    "#{Rails.root}/tmp/pids/server.pid"
  end

  def server_log_file
    "#{Rails.root}/log/server.log"
  end
end

namespace :app do
  desc 'Build all the HTML and assets for the app'
  task :build => ['assets:precompile'] do
    %x(rake server:restart)

    # Don't need the pre-gzipped files for mobile apps.
    %x(rm public/assets/*.gz)

    # Wait until the server is ready. TODO: Need to make this a dynamic wait.
    sleep 5
    %x(curl http://localhost:3000/index.html > public/index.html)
  end
end

def phonegap_dir
  %x(ls -1trd phonegap-*).split(/\n/).last
end

def phonegap_version
  phonegap_dir.split('-').last
end

def app_name
  app_info['title']
end

def app_id
  app_info['id']
end

def app_version
  app_info['version']
end

require 'json'
def app_info
  JSON.parse(IO.read('appinfo.json'))
end
