/* Problem1 solution*/

var fs = require('fs');
var csv = require('csv-parser');
var writeCsv = require('fast-csv');
var partnersDetails = [];
var inputDetails = [];

var writeFile = fs.createWriteStream('problem1Output.csv');

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
            resolve(true)
        });
});
callScript.then(() => {
    var results = []
    for (data of inputDetails) {
        console.log(data)
        var output = {'DID': data.dID, 'possible': false, 'PID': '', 'cost': ''}
        for (value of partnersDetails) {

            let lb = parseInt(value.size.trim().split('-')[0]);
            let ub = parseInt(value.size.trim().split('-')[1]);
            
            if (value.tId.trim() == data.dTID.trim() && (parseInt(data.dSize.trim()) > lb && parseInt(data.dSize.trim()) < ub)) {
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
   

    writeCsv.write(results, {headers:true}).pipe(writeFile);
    console.log("output copied to problem1Output.csv");
})
