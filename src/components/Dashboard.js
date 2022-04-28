
import React from 'react';
//import { Chart as ChartJS, registerables } from 'chart.js';
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from 'react-chartjs-2' 
//ChartJS.register(...registerables);



function Dashboard({ data, price}) {
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    responsive: true,
    maintainAspectRatio: true
  };
  if (price === "0.00" ) {
    return <h2>Please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      
      <div className='chart'>
        <Line data={data} options={opts} />
        </div>
    </div>
      
        

        
        

  );
}

export default Dashboard;