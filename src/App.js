import './App.css';
import React, { useState, useEffect, useRef} from 'react';
import { formatData} from "./utils";
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  //all available cryptocurrencies we can select
  const [currencies, setCurrencies] = useState([]);
  //current pair of cryptocurrencies we are looking at
  const [pair, setpair] = useState("");

  //values to display
  //price
  const [price, setprice] = useState("0.00");
  //best ask
  const [bestask, setbestask] = useState("0.00");
  //best bidBCH
  const [bestbid, setbestbid] = useState("0.00");


  //websocket reference to keep it consistent so it 
  //doesn't get recreated on everyv render
  const [pastData, setpastData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");
    //empty array for currency pairs
    let pairs = [];
    //asynchronous api call
    const apiCall = async () => {
      //using base url and fetch all of coinbases currency pairs, and assign
      //that to the currency array
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));
      //filter the pairs
      let filtered = pairs.filter((pair) => {
        
        // if (pair.quote_currency === "USD" && pair.base_currency === "BTC" || pair.quote_currency === "USD" && pair.base_currency === "ETH" || pair.quote_currency === "USD" && pair.base_currency === "LTC" || pair.quote_currency === "USD" && pair.base_currency === "BCH") {
        //   return pair;
        // }
        return pair.quote_currency === "USD" && (pair.base_currency === "BTC" || pair.base_currency === "ETH" || pair.base_currency === "LTC" || pair.base_currency === "BCH")
          // if(pair.base_currency === "BTC" || pair.base_currency === "ETH" || pair.base_currency === "LTC" || pair.base_currency === "BCH" ){
          //   console.log('pair',pair)
          //   return pair
          // }
        //}
    

      });
      //sort it alphabetically
     filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });

      
      setCurrencies(filtered);
      

      first.current = true;

    };

    apiCall();
//ws.current.close()
// return () => {
//   ws.current.close()
// }

  }, []);

  useEffect(() => {
    if (!first.current) {
      
      return;
    }

    
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg);
    //ws.current.onopen = () => ws.current.send(jsonMsg);
    ws.current.send(jsonMsg);
    // ws.current.onopen = function (e) {
    //   ws.send(jsonMsg);
    // };
    
    //https://api.exchange.coinbase.com/products/{product_id}/book
    //let idk  = requests.get('https://api.pro.coinbase.com/products/ADA-USD/ticker').json()
    //let historicalDataURL = `${url}/products/${pair}/ticker`;
    let historicalDataURL;
    console.log("pair", pair);
    if (pair === ""){
      historicalDataURL = `${url}/products/BCH-USD/candles?granularity=86400`;
    }
    else {
      historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    }
  let dataArr = [];
    //console.log(historicalDataURL, 'historical data url')
    const fetchHistoricalData = async () => {
      
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      //console.log('data arr before formatted', dataArr)
      
      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      //console.log('data', data)
      if (data.type !== "ticker") {
        return
      }

      if (data.product_id === pair) {
        setprice(data.price);
        setbestask(data.best_ask)
        setbestbid(data.best_bid)
      }
  
    };
  }, [pair]);

  const handleSelect = (e) => {
      setpair(e.target.value);
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);
    ws.current.send(unsub);
    
  };




  return (
    <div className="App">
      <Navbar/>
  
      <div className="container">
      {
        <select name="currency" value={pair} onChange={handleSelect} className="cselect">
            <option value="">Currency Pairs</option>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.display_name}
              </option>
            );
          })}
        </select>
      }
      </div>
<div className="dashboard">
      <div className="row">
            
        <div className="box">
            <div className="header">
            <h2>Best Ask</h2>
            </div>
            <div className="bottom">
            <h2>{`${bestask}`}</h2>
            </div>

        </div>
        <div className="box">
            <div className="header">
            <h2>Best Bid</h2>
            </div>
            <div className="bottom">
            <h2>{`${bestbid}`}</h2>
            </div>

        </div>
      </div>
     
        <Dashboard data={pastData} pair={pair} price={price} bestask={bestask} best_bid={bestbid}/>
     
      </div>

    </div>
  );
}

export default App;