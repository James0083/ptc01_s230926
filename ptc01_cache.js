"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.Cache = void 0;
class Cache {
    constructor() {
        this.data = null;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
}
exports.Cache = Cache;
exports.cache = new Cache();
