namespace :android do
  desc 'Build the app for Android'
  task :build => ['app:build', 'android:clean'] do
    # Copy over our app. TODO: This is generic PhoneGap stuff.
    %x(cp -a public/index.html android/assets/www/)
    %x(cp -a public/assets/* android/assets/www/assets/)

    # Build the package.
    %x(cd android && ant debug)
  end

  desc 'Clean the Android output directory.'
  task :clean do
    %x(rm -rf android)
    %x(#{phonegap_dir}/lib/android/bin/create android #{app_id} #{app_name})
    %x(mkdir -p android/assets/www/assets)
    %x(mv android/assets/www/cordova-#{phonegap_version}.js android/assets/www/assets/)
  end

  desc 'Run the latest build of the app on the Android emulator'
  task :run => ['android:build'] do
    avd = %x(android list avd | grep 'Name:' | head -1 | awk '{print $2}').chomp
    puts "Starting Android emulator (#{avd})..."
    %x(emulator -avd #{avd} &)
    %x(adb wait-for-device)
    puts "Installing app."
    %x(adb -e install -r #{apk_file})
  end

  desc 'Deploy the latest build of the app to an attached Android emulator'
  task :deploy => ['android:build'] do
    %x(adb -e shell date -s $(date +'%Y%m%d.%H%M%S'))
    %x(adb -e install -r #{apk_file})
  end
end

def apk_file
  %x(ls -1tr android/bin/*.apk | tail -1)
end
