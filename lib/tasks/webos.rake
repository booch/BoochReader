namespace :webos do
  desc 'Build the app for WebOS.'
  task :build => ['app:build', 'webos:clean'] do
    # Copy over the stuff from PhoneGap/Cordova.
    %x(cp #{phonegap_dir}/lib/webos/lib/cordova.webos.js webos/js/cordova-#{phonegap_version}.js)

    # TODO: Build the appinfo.json file, based on global configuration info (like version number).
    %x(cp -a appinfo.json webos/)

    # Copy over our app. TODO: This is generic PhoneGap stuff.
    %x(cp -a public/index.html webos/)
    %x(cp -a public/assets/*.js webos/js/)
    %x(cp -a public/assets/*.css webos/css/)
    %x(cp -a public/assets/*.{png,ico,gif} webos/images/)

    # Build the package.
    %x(palm-package webos)
    %x(mv *.ipk webos}
  end

  desc 'Clean the WebOS output directory.'
  task :clean do
    %x(rm -rf webos)
    %x(mkdir -p webos/{js,css,images})
  end

  desc 'Deploy the latest build of the app to an attached WebOS device.'
  task :deploy do
    %x(palm-install #{ipk_file})
  end
end

def ipk_file
  %x(ls -1tr webos/*.ipk | tail -1)
end
