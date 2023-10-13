import got from "got";

interface candle_data{
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

async function sendGetRequest(end_time : string) {
  try {
    // const response = await got('https://candle.probit.com/candle?market_ids=BTC-USDT&start_time=1970-01-01T00%3A00%3A00.000Z&end_time=2023-09-27T00%3A33%3A13.000Z&interval=30m&sort=desc&limit=329', {
    const response = await got('https://api.probit.com/api/exchange/v1/candle?market_ids=BTC-USDT&start_time=2022-12-31T00:30:00.000Z&end_time=2022-12-31T01:01:01.001Z&interval=1m&sort=desc&limit=12', {
      responseType: 'json'
    });

    // let rb:Set<candle_data> = new Set<candle_data>(JSON.parse(JSON.stringify(response.body)).data);
    // console.log('Response body:', response.body);
    // let rBody = JSON.parse(JSON.stringify(response.body)).data;

    // const setIterator = rb.entries();
 
    // while ( !setIterator.next().done ) {
    //   const [value1, value2] = setIterator.next().value;
    //   console.log(value1.start_time +' , ' +value2.end_time);
    // }
    // console.log('Response body Set : ', rb.size);
    // console.log('Response body parse JSON : ', rBody[0], rBody[1], typeof (rBody));

    console.log('response-statusCode : ', response.statusCode, typeof(response.statusCode));
    // console.log('response-statusMessage : ', response.statusMessage);
    // console.log('responses: ', response);
    
    // console.log('Response body data : ', typeof(rb));
    // let c: candle_data = JSON.parse(response.body.data[0]);
    // console.log('Response body:', typeof(response.body));
  } catch (error) {
    console.error('Error:', error);
  }
}

sendGetRequest('');