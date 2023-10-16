"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candleSchema = exports.Candle = void 0;
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
;
const candleSchema = new mongoose_1.Schema({
    market_id: { type: String, required: true },
    open: { type: Number, required: true },
    close: { type: Number, required: true },
    low: { type: Number, required: true },
    high: { type: Number, required: true },
    base_volume: { type: Number, required: true },
    quote_volume: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true }
});
exports.candleSchema = candleSchema;
// candleSchema.index({ market_id: 1, start_time: 1, end_time: 1 }, { unique: true });
const Candle = (0, mongoose_1.model)('Candle', candleSchema);
exports.Candle = Candle;
