require 'rake'

task :default => []

namespace :webos do
  desc 'Build the app for WebOS'
  task :build do
    # TODO: Build the appinfo.json file, based on global configuration info (like version number).
    %x{cp index.html webos/}
    %x{cd webos && palm-package .}
  end

  desc 'Deploy the latest build of the app to an attached WebOS device'
  task :deploy do
    %x{cd webos && palm-install #{ipk_file}}
  end
end

def ipk_file
  %x{cd webos && ls -1tr *.ipk | tail -1}
end
