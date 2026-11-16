# Ember Connect

A web page that talks to an Ember heater controller over Bluetooth LE (Web Bluetooth): live temperature, target, start/stop, boost and fault clear for each heater (one to four), and all off.

**Open it:** https://sedzenxp.github.io/ember-connect/

- Needs a Bluetooth build of the 2.8" v2 (the dev builds have it). Starting a heater from the page needs Settings › Safety › Remote start on the device; stopping always works.
- Chrome or Edge on Windows, Mac and Android; **Bluefy** on iPhone (Safari has no Web Bluetooth).
- On the device: Settings › Connect › Connect phone, then press Connect on the page and type the 6-digit code shown on the device.

The page is static and talks only to the device, over Bluetooth. It sends nothing to any server.

These files are published from the Ember project's `web/ble/` folder.
