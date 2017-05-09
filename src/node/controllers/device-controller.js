'use strict';

const adb = require('adbkit');

const MMDLError = require('../models/mmdl-error');
const logHelper = require('../utils/log-helper');

class DeviceController {
  constructor() {
    this._adbClient = adb.createClient();
    this._devices = {};
  }

  init() {
    return new Promise((resolve, reject) => {
      this._adbClient.trackDevices((err, tracker) => {
        if (err) {
          reject(new MMDLError('unable-to-track-devices', {
            originalError: err,
          }));
          return;
        }

        logHelper.log(`DeviceModel: Waiting for Android devices....`);
        resolve();

        tracker.on('add', (device) => {
          logHelper.log(`DeviceModel: Device ${device.id} was plugged in.`);
          this._addDevice(device);
        });
        tracker.on('remove', (device) => {
          logHelper.log(`DeviceModel: Device ${device.id} was unplugged.`);
          this._removeDevice(device);
        });
        tracker.on('change', (device) => {
          logHelper.log(`DeviceModel: Device ${device.id} state changed.`);
          if (device.type === 'device') {
            this._addDevice(device);
          } else if (device.type === 'offline') {
            this._removeDevice(device);
          }
        });
      });
    });
  }

  _addDevice(device) {
    try {
      if (this._devices[device.id]) {
        return;
      }

      this._devices[device.id] = device;
    } catch (err) {
      logHelper.error(err);
    }
  }

  _removeDevice(device) {
    try {
      delete this._devices[device.id];
    } catch (err) {
      logHelper.error(err);
    }
  }

  getDevices() {
    return this._devices;
  }

  triggerIntent(deviceId, intent) {
    return this._adbClient.startActivity(deviceId, intent);
      return adbclient.startActivity(deviceId, intent)
        .catch(function(err) {
          var intent = this.buildGenericBrowserIntent(url);
          return adbclient.startActivity(deviceId, intent)
            .catch(function(err) {
              // NOOP
            }.bind(this));
        }.bind(this));
  }
}

module.exports = new DeviceController();
