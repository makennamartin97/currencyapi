import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2' 
ChartJS.register(...registerables);



function Dashboard({ price, bestask, bestbid, pair, data}) {
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    responsive: true,
    maintainAspectRatio: true
  };
  if (price === "0.00") {
    return <h2></h2>;
  }
  return (
    <div className="dashboard">
      {/* <h2>Currency Pair: {pair}</h2> */}
      {/* <h2>Current Price: {`${price}`}</h2> */}
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
      <div className='chart'>
        <Line data={data} options={opts} className="line" />
        </div>
    </div>
      
        

        
        

  );
}

export default Dashboard;