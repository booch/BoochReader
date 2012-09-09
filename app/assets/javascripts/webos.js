document.addEventListener("deviceready", function(){
    // PhoneGap docs say the platform name is 'webOS', but we're actually getting 'palm'.
    if ( device.platform == 'webOS' || device.platform == 'palm' ) {
        // Only allow landscape orientation.
        navigator.orientation.setOrientation('right');
        
        // Handle the WebOS App Menu. Note that PhoneGap calls this event 'appmenuopen', while Enyo calls it 'openAppMenu'.
        window.addEventListener('appmenuopen', function() {
            $('#webos-app-menu').show();
        });
    }
});
