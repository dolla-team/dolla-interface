let imports = {};
imports["__wbindgen_placeholder__"] = {
  __wbindgen_string_new: function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  },
  __wbindgen_init_externref_table: function () {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  }
};

let wasm;

const { TextDecoder, TextEncoder } = (() => {
  if (
    typeof globalThis.TextDecoder !== "undefined" &&
    typeof globalThis.TextEncoder !== "undefined"
  ) {
    return {
      TextDecoder: globalThis.TextDecoder,
      TextEncoder: globalThis.TextEncoder
    };
  }

  return {
    TextDecoder: class TextDecoder {
      constructor(encoding = "utf-8", options = {}) {
        this.encoding = encoding;
        this.options = options;
      }
      decode(input) {
        if (typeof input === "string") return input;
        return new TextDecoder().decode(input);
      }
    },
    TextEncoder: class TextEncoder {
      encode(input) {
        return new Uint8Array(Buffer.from(input, "utf8"));
      }
    }
  };
})();

let cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true
});

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len)
  );
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder("utf-8");

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_0.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}

/**
 * Calculate random number from JSON input
 * Input: JSON string containing RandomNumberDetailInfo
 * Returns: Game random number (u64 modulo WIN_RATE_DENOMINATOR)
 * @param {string} json_input
 * @returns {string}
 */
export function calculate(json_input) {
  let deferred3_0;
  let deferred3_1;
  try {
    const ptr0 = passStringToWasm0(
      json_input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.calculate(ptr0, len0);
    var ptr2 = ret[0];
    var len2 = ret[1];
    if (ret[3]) {
      ptr2 = 0;
      len2 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred3_0 = ptr2;
    deferred3_1 = len2;
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
  }
}

/**
 * @param {number} bets
 * @param {number} bid_unit
 * @param {number} odds_bep
 * @returns {string}
 */
export function threshold(bets, bid_unit, odds_bep) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ret = wasm.threshold(bets, bid_unit, odds_bep);
    var ptr1 = ret[0];
    var len1 = ret[1];
    if (ret[3]) {
      ptr1 = 0;
      len1 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_export_0;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}

export async function initWasm(wasmUrl = "/random_number_calculator_bg.wasm") {
  try {
    let wasmBytes;

    if (
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node
    ) {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const wasmPath = path.resolve(__dirname, wasmUrl);

      wasmBytes = fs.readFileSync(wasmPath);
    } else {
      const response = await fetch(wasmUrl);
      wasmBytes = await response.arrayBuffer();
    }

    const wasmModule = await WebAssembly.compile(wasmBytes);

    const wasmInstance = await WebAssembly.instantiate(wasmModule, imports);

    wasm = wasmInstance.exports;
    wasm.__wbindgen_start();
    return wasm;
  } catch (error) {
    console.error("Failed to initialize WASM:", error);
    throw error;
  }
}

export function initWasmSync(wasmBytes) {
  try {
    const wasmModule = new WebAssembly.Module(wasmBytes);
    const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
    wasm = wasmInstance.exports;
    wasm.__wbindgen_start();
    return wasm;
  } catch (error) {
    console.error("Failed to initialize WASM:", error);
    throw error;
  }
}
