Intro
=====

This is my first mobile app.
I'm using it as a learning experience, but also to build something useful for myself.
The functionality is to let me read from Twitter, Google Reader, and Pocket (Read It Later).
The idea is to combine everything in one app, and to allow offline reading.
The initial version will be for tablets, targeted at my HP TouchPad running WebOS.


Pages
=====

* Splash page
* Main page
* List of articles in a group/category
* Single article
  * Readable version
  * Full HTML version
* Single tweet
* Config
  * Which services to include
  * Accounts for each service
  * Readability vs. Pocket (Read It Later) for readable versions
  * Advanced browser vs. built-in browser for full HTML versions on WebOS
  * How much disk space to use for caching (assuming we can directly access disk space)


Inspiration
===========

* ReadOnTouch app on WebOS
* Graphite app on WebOS
* Twitter apps I've use on Android: Seesmic, TweetCast
* Popup menus in iPad apps


Target Platforms
================

* WebOS (HP TouchPad)
* web (including off-line)
* Chrome Extension
* Android (via PhoneGap)
* iOS (via PhoneGap)


Technologies
============

* Rails
  * Form Builders (SimpleForm 2)
  * Helpers
  * Asset Pipeline (minification)
* CoffeeScript
* Slim (preferred over HAML)
* SASS (SASS syntax)
* Cucumber + Capybara + WebDriver + RSpec testing

NOTE: None of these are required for the final app. The final app should stand alone.


JavaScript Libraries
====================

* jQuery
* jQuery Mobile
* Underscore.js (functional tools)
* AmplifyJS (pub/sub, simplified AJAX, storage API)
* Hammer.js (touch events)
* Momentum Scrolling (need to evaluate the following)
  * Joe Hewitt's Scrollability
  * iScroll 4
  * -webkit-overflow-scrolling: touch (iOS 5+)
  * DroidScroll
  * nanoScroller.js
* PhoneGap (Cordova)


License
=======

This software is copyright 2012 by Craig Buchek and BoochTek, LLC.

This software is licensed under the GNU General Public License, version 3.
