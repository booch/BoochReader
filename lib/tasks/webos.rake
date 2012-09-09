namespace :app do
  desc 'Build all the HTML and assets for the app'
  task :build => ['assets:precompile'] do
    %x(rake server:restart)
    # Wait until the server is ready. TODO: Need to make this a dyanmic wait.
    sleep 5
    %x(curl http://localhost:3000/index.html > public/index.html)
  end  
end

namespace :webos do
  desc 'Build the app for WebOS'
  task :build => ['app:build'] do
    # TODO: Build the appinfo.json file, based on global configuration info (like version number).
    %x(cp -a public/index.html webos/)
    %x(cp -a public/assets/*.{js,css,png} webos/assets/)
    %x(cd webos && palm-package .)
  end

  desc 'Deploy the latest build of the app to an attached WebOS device'
  task :deploy do
    %x(palm-install #{ipk_file})
  end
end

def ipk_file
  %x(ls -1tr webos/*.ipk | tail -1)
end
