namespace :webos do
  desc 'Build the app for WebOS'
  task :build => ['app:build'] do
    %x(mkdir -p webos/assets)
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
