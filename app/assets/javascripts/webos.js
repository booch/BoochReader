document.addEventListener("deviceready", function(){
    // PhoneGap docs say the platform name is 'webOS', but we were actually getting 'palm' in PhoneGap 2.0, and 'HP webOS' in 2.3.
    if ( device.platform == 'HP webOS' || device.platform == 'webOS' || device.platform == 'palm' ) {
        // Only allow landscape orientation.
        navigator.orientation.setOrientation('right');
        
        // Handle the WebOS App Menu. Enyo calls it 'openAppMenu'. NOTE: PhoneGap 2.2 and 2.3 don't seem to support this.
        // NOTE: PhoneGap 2.0 and 2.1 call this event 'appmenuopen'.
        window.addEventListener('appmenuopen', function() {
            $('#webos-app-menu').show();
        });
        // NOTE: PhoneGap 2.4 calls this 'menubutton' and moves it to document -- which makes it match Android hardware menu button.
        document.addEventListener('menubutton', function() {
            $('#webos-app-menu').show();
        });
        // Close the menu when an item is clicked.
        $('#webos-app-menu a').click(function(){
            $('#webos-app-menu').hide();
            // Don't prevent the default action, which is to transition to the target page.
        });
    }
});
