import {Schema, model, Model} from "mongoose";
import { Extension } from "typescript";

var mongoose = require('mongoose');

/*

export interface mongoose.Schema({
    market_id: 'string',
    open: 'number',
    close: 'number',
    low: 'number',
    high: 'number',
    base_volume: 'number',
    quote_volume: 'number',
    start_time: 'string',
    end_time: 'string'
});
*/

export interface candle_data{
  market_id: string;
  open: number;
  close: number;
  low: number;
  high: number;
  base_volume: number;
  quote_volume: number;
  start_time: string;
  end_time: string;
}

interface DBCandleModel extends Model<candle_data> { };

const candleSchema = new Schema<candle_data, DBCandleModel>({
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

// candleSchema.index({ market_id: 1, start_time: 1, end_time: 1 }, { unique: true });


const Candle = model<candle_data, DBCandleModel>('Candle', candleSchema);

export { Candle, candleSchema };

