namespace :android do
  desc 'Build the app for Android'
  task :build => ['app:build', 'android:clean'] do
    # Copy over our app. TODO: This is generic PhoneGap stuff.
    %x(cp -a public/index.html android/assets/www/)
    %x(cp -a public/assets/* android/assets/www/assets/)

    # Install the ChildBrowser plugin. (From https://github.com/alunny/ChildBrowser)
    %x(mkdir -p android/src/com/phonegap/plugins/childBrowser)
    %x(cp -a phonegap-plugins/ChildBrowser/src/android/ChildBrowser.java android/src/com/phonegap/plugins/childBrowser/)
    %x(cp -a phonegap-plugins/ChildBrowser/www/childbrowser.js android/assets/www/assets/)
    %x(cp -a phonegap-plugins/ChildBrowser/www/childbrowser android/assets/www/assets/)
    %x(sed -i android/AndroidManifest.xml -e 's|</plugins>|    <plugin name="ChildBrowser" value="com.phonegap.plugins.childBrowser.ChildBrowser"/>\\n</plugins>|')
    %x(sed -i android/res/xml/config.xml -e 's|    </application>|      <activity android:name="com.phonegap.plugins.childBrowser.ChildBrowser" android:label="@string/app_name">\\n        <intent-filter></intent-filter>\\n      </activity>\\n    </application>|')

    # Build the package.
    %x(cd android && ant debug)
  end

  desc 'Clean the Android output directory.'
  task :clean do
    %x(rm -rf android)
    %x(#{phonegap_dir}/lib/android/bin/create android #{app_id} #{app_name})
    %x(mkdir -p android/assets/www/assets)
    %x(mkdir -p android/src/com/phonegap/plugins)
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
    # Sync time on emulator to work around bug, so Twitter doesn't complain about our time being too far off. See http://stackoverflow.com/questions/8916609/emulated-android-device-does-not-re-sync-time-date-after-restoring-snapshot
    %x(adb -e shell date -s $(date +'%Y%m%d.%H%M%S'))
    %x(adb -e install -r #{apk_file})
  end
end

def apk_file
  %x(ls -1tr android/bin/*.apk | tail -1)
end
