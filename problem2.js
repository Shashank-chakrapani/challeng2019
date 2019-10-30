var fs = require('fs');
var csv = require('csv-parser');
var writeCsv = require('fast-csv');
var partnersDetails = [];
var inputDetails = [];
var capacityDetails = [];
var filterCapacity = [];
var results = [];
var max;

var writeFile = fs.createWriteStream('problem2Output.csv');

let callScript = new Promise((resolve, reject) => {
    fs.createReadStream('partners.csv')
        .pipe(csv())
        .on('data', (row) => {
            partnersDetails.push({
                tId: row['Theatre'],
                size: row['SizeSlab(inGB)'],
                minCost: row['Minimumcost'],
                CostPerGB: row['CostPerGB'],
                PartnerID: row['PartnerID']
            })
        })
        .on('end', () => {
        });
    fs.createReadStream('input.csv')
        .pipe(csv())
        .on('data', (row) => {
            inputDetails.push({
                dID: row['DID'],
                dSize: row['Size'],
                dTID: row['TID']
            })
        })
        .on('end', () => {

        });

    fs.createReadStream('capacities.csv')
        .pipe(csv())
        .on('data', (row) => {
            // console.log(row)
            capacityDetails.push({
                'PID': row['Partner ID'],
                'capacity': row['Capacity (in GB)']
            })
        })
        .on('end', () => {
            resolve(true)
            //console.log(partnersDetails)
            //console.log(inputDetails)
            //console.log(capacityDetails)
        })
});

function getMinCost() {
 
  
}

callScript.then(() => {
    var results = []
    var sumOfSize = 0;
    var maxCapacityPID;
    for (data of capacityDetails) {
        filterCapacity.push(parseInt(data.capacity));
    }
    console.log(filterCapacity)
    max = Math.max(...filterCapacity);
    console.log(max)

    for (data of inputDetails) {
        sumOfSize += parseInt(data.dSize);
        //console.log(":::", sumOfSize)
    }
    capacityDetails.forEach(x=>{
        if(max == x.capacity){
            maxCapacityPID = x.PID.trim()
        }
    });
console.log(sumOfSize,maxCapacityPID,max)
    if(max > sumOfSize){
    for (data of inputDetails) {
       // console.log(data)
        var output = {'DID': data.dID, 'possible': false, 'PID': '', 'cost': ''}
        for (value of partnersDetails) {

            let lb = parseInt(value.size.trim().split('-')[0]);
            let ub = parseInt(value.size.trim().split('-')[1]);
            
            if (value.tId.trim() == data.dTID.trim() && (parseInt(data.dSize.trim()) > lb && parseInt(data.dSize.trim()) < ub)&&value.PartnerID == maxCapacityPID) {
                var cost = parseInt(value.CostPerGB) * parseInt(data.dSize);
                cost = cost < parseInt(value.minCost) ? parseInt(value.minCost) : cost;
                output['possible'] = true;
                output['PID'] = value.PartnerID;
                output['cost'] = cost;
                break;
            } 
        }
        results.push(output);
       
    }
   
}

    writeCsv.write(results, {headers:true}).pipe(writeFile);
    console.log(results)
    console.log("output copied to problem2Output.csv");
})