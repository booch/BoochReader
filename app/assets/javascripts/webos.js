document.addEventListener("deviceready", function(){
    // PhoneGap docs say the platform name is 'webOS', but we're actually getting 'palm'.
    if ( device.platform == 'webOS' || device.platform == 'palm' ) {
        // Only allow landscape orientation.
        navigator.orientation.setOrientation('right');
        
        // Handle the WebOS App Menu. Note that PhoneGap calls this event 'appmenuopen', while Enyo calls it 'openAppMenu'.
        window.addEventListener('appmenuopen', function() {
            $('#webos-app-menu').show();
        });
        // Close the menu when an item is clicked.
        $('#webos-app-menu a').click(function(){
            $('#webos-app-menu').hide();
            // Don't prevent the default action, which is to transition to the target page.
        });
    }
});
