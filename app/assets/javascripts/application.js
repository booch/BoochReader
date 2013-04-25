// These come from config.js, which comes from config.js.erb, which pulls the from the environment when building.
// TODO: Move this whole thing to config.js.erb.
var TWITTER_OPTIONS = {
    consumerKey: TWITTER_OAUTH_KEY,
    consumerSecret: TWITTER_OAUTH_SECRET,
    callbackUrl: TWITTER_CALLBACK_URL
};


// Log all errors to the console. (But allow the normal error processing to happen as well.)
$(window).on('error',  function(message, uri, line) {
    console.log(message + uri + line);
});


// Start up the app.
$(document).on('deviceready', function() {
    // TODO: We actually use localStorage before we get here, to define the file-global variable "accounts".
    // Make sure we can store our credentials and other info. TODO: Also check to see if we get a SecurityError exception when trying to access localStorage.
    if ( typeof(Storage) == 'undefined' || typeof(window.localStorage) == 'undefined' ) {
        console.log('Platform does not support localStorage - quitting.');
        alert('Platform does not support localStorage - quitting.');
        navigator.app.exitApp();
        return;
    }

    // Check to see if we need to run initial setup; otherwise show the main screen.
    if ( no_accounts_registered() ) {
        $.mobile.changePage('#setup-screen');
    } else {
        $.mobile.changePage('#main-screen');
    }

    // Set up event handlers.
    $(document).on('click', '#add-twitter-account', add_twitter_account);

    $(document).on('updateTweets', updateTweets);

    $(document).on('accountAdded', function(event, account) {
        $('ul#twitter-accounts').append('<li>' + account.name + '</li>');
    });

    $('#setup-screen').on('pageshow', function() {
        $('ul#twitter-accounts').empty();
        $.each(Object.keys(accounts['twitter']), function(index, value) {
            $('ul#twitter-accounts').append('<li>' + value + '</li>');
        });
    });
});


// Storage of accounts. TODO: We should check for QuotaExceededError exceptions, and figure out how to handle them.
var accounts = JSON.parse(localStorage.getItem('accounts'));

var no_accounts_registered = function() {
    if ( typeof(accounts) == 'undefined' || accounts == null || accounts == {} ) {
        return true;
    }
    return ((typeof(accounts['twitter']) == 'undefined' || accounts['twitter'] == {} ) &&
            (typeof(accounts['pocket']) == 'undefined' || accounts['pocket'] == {} ) &&
            (typeof(accounts['google']) == 'undefined' || accounts['google'] == {} ));
};

var add_account = function(account) {
    if ( typeof(accounts) == 'undefined' || accounts == null ) {
        accounts = {};
    }
    if ( typeof(accounts[account['type']]) == 'undefined' ) {
        accounts[account['type']] = {};
    }
    accounts[account['type']][account['name']] = account;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    $(document).trigger('accountAdded', account);
};


var parse_query_string = function(query_string) {
    var query_args = query_string.split('&');
    var result = {};
    for ( var i = 0; i < query_args.length; i++ ) {
        var y = query_args[i].split('=');
        result[y[0]] = decodeURIComponent(y[1]);
    }
    return result;
};


// See https://dev.twitter.com/docs/auth/implementing-sign-twitter for a better understanding of how this OAuth process works.
// This code is loosely based on http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt5p1
var add_twitter_account = function() {
    var oauth = OAuth(TWITTER_OPTIONS);

    // Get a request token.
    oauth.get('https://api.twitter.com/oauth/request_token',
        function(data) {
            requestToken = data.text;

            // TODO: Check to see that we have Internet connectivity first.

            // Use PhoneGap's inBrowserApp to pop up a window to have the user authenticate to Twitter.
            var twitter_oauth_window = window.open('https://api.twitter.com/oauth/authorize?'+data.text, '_blank', 'location=no');

            // When the page has completed loading, check to see what URL they're at, to determine if they've completed the authentication.
            // Note that we do nothing if the user goes to some other page, like the info page for the application.
            $(twitter_oauth_window).bind('loadstop', function(e) {
                var url = e.originalEvent.url;

                // The supplied callback URL has been loaded after the user denied access to our app.
                if ( url.indexOf(TWITTER_OPTIONS.callbackUrl + '?denied') >= 0 ) {
                    twitter_oauth_window.close();
                    return;
                }

                // The supplied callback URL has been loaded after the user authorized access to our app.
                if ( url.indexOf(TWITTER_OPTIONS.callbackUrl + '?') >= 0 ) {
                    var params = parse_query_string(url.substr(url.indexOf('?') + 1));

                    // Exchange request token for access token.
                    oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier=' + params.oauth_verifier +'&' + requestToken,
                        function(data) {
                            var accessParams = parse_query_string(data.text);

                            oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                            oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                                function(data) {
                                    var entry = JSON.parse(data.text);
                                    add_account({'type': 'twitter', 'name': entry.screen_name, 'token': accessParams.oauth_token, 'secret': accessParams.oauth_token_secret});
                                },
                                function(data) {
                                    alert('Sorry, could not connect to Twitter to get user credentials.');
                                    console.log('Error getting Twitter user credentials: ' + data);
                                }
                            );
                            twitter_oauth_window.close();
                        },
                        function(data) {
                            alert('Sorry, could not connect to Twitter to complete authentication process.');
                            console.log('Error getting Twitter access token: ' + data);
                        }
                    );
                }
            });
        },
        function(data) {
            alert('Sorry, could not connect to Twitter to authenticate.');
            console.log('Error getting Twitter request token: ' + data);
        }
    );
};

// TODO: Either get tweets for all accounts, or pass in which account we want to see tweets for.
var updateTweets = function (event, twitter_account_name) {
    var oauth = OAuth(TWITTER_OPTIONS);
    oauth.setAccessToken([accounts['twitter'][twitter_account_name].key, accounts['twitter'][twitter_account_name].secret]);
    oauth.get('https://api.twitter.com/1.1/statuses/home_timeline.json',
        function(data) {
            var entries = JSON.parse(data.text);
            var count = entries.length;
            var data_html = '<h4>Home Timeline: 1 of ' + count + ' entries</h4>';

            if (count >= 0) {
                // Use count value to display all timelines
                // for (var i = 0; i < count; i++) {
                for (var i = 0; i < 1; i++) {
                    console.log('Got ' + count + ' tweets.');
                    data_html = data_html.concat('<div><img src="'
                        + entries[i].user.profile_image_url + '">'
                        + entries[i].user.name + '</div>');
                    data_html = data_html.concat('<p>' + entries[i].text + '<br>'
                        + entries[i].created_at + '</p>');
                }
            }
            $('#twitterdata').prepend($(data_html));
        },
        function(data) {
            alert('Error getting home timeline');
            console.log('Error ' + data.text);
            $('#twitterdata').html('<span style="color:red;">Error getting home timeline</span>');
        }
    );
};
