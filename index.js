/**
 * Created with JetBrains WebStorm.
 * User: Arpy Vanyan
 * Date: 28/02/14
 * Time: 18:25 PM
 * To change this template use File | Settings | File Templates.
 */

var apn = require('apn');
var path = require("path");
var ROOT_PATH = path.dirname(__dirname);

/**
 * Create a PushNotification
 * @constructor
 */
module.exports.PushNotification = function PushNotification () {
    this.options = {};
    this.apnConnection = null;
    this.note = null;
    this.device = null;

    /**
     * Initialize PushNotification object
     * @function
     * @param options
     *
     * @since v0.0.1
     */
    this.init = function (options) {
        this.options = {
            cert: ROOT_PATH + global.PUSH.cert, /* Certificate file path */
            key:  ROOT_PATH + global.PUSH.key,  /* Key data */
            passphrase: global.PUSH.secret,     /* A passphrase for the Key file */
            gateway: 'gateway.push.apple.com',  /* gateway address gateway.sandbox.push.apple.com */
            enhanced: true,                     /* enable enhanced format */
            errorCallback: function(err, notif) {
                if(err){
                    console.log(err);
                }
            },                                 /* Callback when error occurs function(err,notification) */
            cacheLength: 100,                   /* Number of notifications to cache for error purposes */
            isLocalized: false
        };

        if(typeof options == 'object') {
            for(var key in options) {
                this.options[key] = options[key];
            }
        }

        this.apnConnection = new apn.Connection(this.options);

        this.note = new apn.Notification();
        this.note.payload = {};
        this.note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        this.note.badge = 0;
        this.note.alert = "";
        this.note.device = null;
    };

    /**
     * Configure PushNotification with given notification params and device token
     * @function
     * @param note
     * @param device_token
     *
     * @since v0.0.1
     */
    this.configure = function (note, device_token) {
        var theDevice = new apn.Device(device_token);

        if(note.badge) {
            this.note.badge = note.badge;
        }

        if(note.alert) {
            this.note.alert = note.alert;
        }

        if(note.type) {
            this.note.payload.type = note.type;
        }

        if(this.options.isLocalized) {
            if(note.key) {
                this.note.setLocKey(note.key);
            }
            if(note.args) {
                this.note.setLocArgs(note.args);
            }
        }

        if(note.params) {
            for (var i in note.params) {
                if(i != 'alert' && i != 'badge' && i != 'type' && i != 'key' && i != 'args') {
                    this.note.payload[i] = note.params[i];
                }
            }
        }
        this.device = theDevice;
    };

    /**
     * Send pre-configured PushNotification
     * @function
     * @since v0.0.1
     */
    this.send = function () {
        this.apnConnection.pushNotification(this.note, this.device);
    }
};