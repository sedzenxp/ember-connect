# Ember Connect

A web page that talks to an Ember heater controller over Bluetooth LE (Web Bluetooth): live temperature, setpoint, start/stop, boost and fault clear.

**Open it:** https://sedzenxp.github.io/ember-connect/

- Chrome or Edge on Windows, Mac and Android; **Bluefy** on iPhone (Safari has no Web Bluetooth).
- On the device: Settings › Bluetooth › Connect phone, then press Connect on the page and type the 6-digit code shown on the device.
- **Try demo** runs the page against a pretend device, no Bluetooth needed.

The page is static and talks only to the device, over Bluetooth. It sends nothing to any server.

These files are published from the Ember project's `web/ble/` folder.
