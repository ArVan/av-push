# node-av-push

[![Build Status](https://travis-ci.org/ArVan/av-push.png?branch=master)](https://travis-ci.org/ArVan/av-push)

A Node.js universal Push Notification Distribution library.

# Installation

Via [npm][]:

    $ npm install av-push

As a sub-module of your project. In this case you will also need to install [apn][apn].

	$ git submodule add http://github.com/arvan/node-av-push.git av-push
	$ git submodule update --init

# Changelog

## v0.0.5

- Support for GCM notifications


# Quick start

Below is the simple usage of this class. Just require the object, initialise and use it.

	var avPush = require('av-push');
	avPush.init({cert: 'my-certificate-file', key: 'my-key-file', passphrase: 'my-passphrase'});

	....
	....

	avPush.configure({alert: 'This is a notification text', badge: 1});
	avPush.send('some-device-token');

Below you can find more detailed usage tips and examples.

# Usage

## Class reference

### Properties

	options
	apnConnection
	note

### Methods

	- init(options)
	- configure(notification)
	- send(device_tokens)
	- destroy()

## Creating class object

To get started with sending notifications, the class object should be created and initialized. Here is an example:

	var avPush = require('av-push');
	avPush.init({cert: 'my-certificate-file', key: 'my-key-file', passphrase: 'my-passphrase'});

The **init()** method gets 1 argument. it is the class options. For now, this options tell what are the push distribution certificate files and some other apn configuration.
Complete list of options is listed below:

	options = {
		cert: ''                            /* Certificate file path */
		key:  ''                            /* Key data */
		passphrase: ''                      /* A passphrase for the Key file */
		gateway: 'gateway.push.apple.com',  /* gateway address gateway.sandbox.push.apple.com */
		enhanced: true,                     /* enable enhanced format */
		errorCallback: function(err, notif) {
			if(err){
				console.log(err);
			}
		},                                  /* Callback when error occurs function(err,notification) */
		cacheLength: 100,                   /* Number of notifications to cache for error purposes */
		isLocalized: false,                 /* Boolean indicating if APN is localized or not */
		apiKey: '',                         /* The api key for GCM */
        type: this.type.APN                 /* Type of the notification. Currently supported types are APN and GCM */
	};

## Setting up the notification

After initializing class object, it can be used to send as many different notifications as you need using just one object.
In order to do so, you will need to set up a notification. Just like this:

	avPush.configure({alert: 'Some text'});

The configure method takes one argument which is a JSON object with the notification data.
Typically, notification data for APN looks like this:

	notification = {
		alert: String,
		badge: Number,
		key: String,
		args: Array,
		params: Object
	}

Note that you can easily send either simple text notification, or a localized notification.
In order to use localized notification, you need to initialize AVPush object with **isLocalized** option set to **true**.
Just like this:

	avPush.init({isLocalized: true, ...});

After that, back to where you're setting up the notification:

	avPush.configure({key: 'some_localization_key'});

You can also provide localization arguments to the notification:

	avPush.configure({key: 'some_localization_key', args: ['arg1', 'arg2', ...]});

If you wish to send some custom fields with your notification, just add them to the list under **params** key and they will be added to the notification payload.

For GCM messages, the notification object looks different. As you can send whatever you want with the notification, the standart alert, badge, key and arg parameters are missing.

    notification = {
        params: Object
    }

## Sending notification

Finally, you can send the created notification to as many users as you want.
Just call:

	avPush.send('some-device-token');

The send method takes one argument which is ether string of one device token, or array of device tokens.
 So you can send the same notification to several users like this:

    avPush.send(['device-token-1', 'device-token-2', 'device-token-3', ...]);

## Shutting down

When the **avPush** object is no longer needed, it should be shut down in order to close all connections and free some memory.

	avPush.destroy();




[npm]: https://npmjs.org
[apn]: https://github.com/argon/node-apn