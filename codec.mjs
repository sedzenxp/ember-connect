// Ember remote-control protocol, browser side. Mirrors
// libraries/EmberCore/src/remote.h byte for byte; codec_test.mjs checks the
// same bytes as tests/remote_test.cpp.

export const SERVICE = '5e1d0001-6b5a-4f3e-9c1a-3e3be2000001';
export const INFO = '5e1d0002-6b5a-4f3e-9c1a-3e3be2000001';     // read, open
export const STATE = '5e1d0003-6b5a-4f3e-9c1a-3e3be2000001';    // read + notify, needs pairing
export const COMMAND = '5e1d0004-6b5a-4f3e-9c1a-3e3be2000001';  // write, needs pairing

export const TEMP_NONE = -32768;
export const OP = { START: 1, STOP: 2, SETPOINT: 3, BOOST: 4, CLEAR: 5 };
export const RESULT_TEXT = ['', 'ok', 'bad format', 'unknown command', 'no such heater', 'setpoint out of range',
  'remote start is off', 'clear the fault first', 'no thermocouple reading', 'no controller', 'not heating'];
export const MODE_TEXT = ['Off', 'Heating', 'Tuning'];
export const FAULT_TEXT = ['', 'Sensor', 'Over-temperature', 'No heat rise', 'Tune timeout', 'Probe over limit'];
export const BOARD_TEXT = { 1: '1.46" rotary', 2: '1.28" rotary', 3: '2.8" touch', 4: '5" P4' };

const bytes = (v) => (v instanceof DataView ? new Uint8Array(v.buffer, v.byteOffset, v.byteLength) : new Uint8Array(v));
const s16 = (b, i) => { const v = b[i] | (b[i + 1] << 8); return v & 0x8000 ? v - 0x10000 : v; };
const temp = (t) => (t === TEMP_NONE ? null : t / 10);

/** @returns {Uint8Array} 5 bytes: seq, op, zone, value (int16 LE) */
export function encodeCommand(seq, op, zone, value = 0) {
  const v = value & 0xffff;
  return new Uint8Array([seq & 0xff, op, zone, v & 0xff, v >> 8]);
}

/** Setpoint in degC -> the command's tenths (rounded, as the device does). */
export const tenths = (c) => Math.round(c * 10);

export function decodeInfo(view) {
  const b = bytes(view);
  if (b.length < 19) throw new Error(`info is ${b.length} bytes, expected 19`);
  let fw = '';
  for (let i = 10; i < 19 && b[i]; i++) fw += String.fromCharCode(b[i]);
  return {
    protocol: b[0], board: b[1], boardName: BOARD_TEXT[b[1]] || `board ${b[1]}`, layout: b[2],
    zones: b[3], heaters: b[4], fahrenheit: !!(b[5] & 1), remoteStart: !!(b[5] & 2),
    spMinC: s16(b, 6) / 10, spMaxC: s16(b, 8) / 10, fw,
  };
}

/** @returns {null|object} null if the notification was cut short (read the characteristic instead). */
export function decodeState(view) {
  const b = bytes(view);
  if (b.length < 6) return null;
  const n = b[2];
  if (b.length < 6 + n * 8) return null;
  const zones = [];
  for (let i = 0, p = 6; i < n; i++, p += 8) {
    zones.push({ pv: temp(s16(b, p)), sp: s16(b, p + 2) / 10, out: b[p + 4], mode: b[p + 5], fault: b[p + 6], boost: !!(b[p + 7] & 1) });
  }
  return { ackSeq: b[0], ackResult: b[1], autoOffLeftS: b[4] | (b[5] << 8), zones };
}

export const toUnit = (c, f) => (c == null ? null : f ? c * 9 / 5 + 32 : c);
export const fromUnit = (d, f) => (f ? (d - 32) * 5 / 9 : d);
