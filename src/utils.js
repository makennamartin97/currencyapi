export const formatData = (data) => {
      let finalData = {
        labels: [],
        datasets: [
          {
            label: "Price",
            data: [],
            backgroundColor: "rgb(46, 45, 190, 0.8)",
            borderColor: "rgb(46, 45, 190, 0.8)",
            fill: false
          }
        ]
      };
    
      let dates = data.map((val) => {
        const ts = val[0];
        let date = new Date(ts * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let final = `${month}-${day}-${year}`;
        return final;
      });
    
      let priceArr = data.map((val) => {
        //console.log('val[4]',val[4])
          return val[4];

      });
  
    
      priceArr.reverse();
      dates.reverse();
      finalData.labels = dates;
      finalData.datasets[0].data = priceArr;
      console.log('final data', finalData)
  
      return finalData;
    };