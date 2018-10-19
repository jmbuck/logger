import React from 'react';

//for testing, need to make something clickable on webpage
<a href='#' onclick='downloadCSV({ filename: "stock-data.csv" });'>Download CSV</a>

export function convertArrayOfObjectsToCSV(args) {  
        let result, ctr, keys, columnDelimiter, lineDelimiter;
        let i = 0;

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(args[0]);

        result = '';
        result += "title,";
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        args.forEach(function(item) {
            ctr = 0;
            //result += args[i].name; //returns undefined?
            //i++;
            //result += ",";
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
}

export function downloadCSV(args) {  
    let data, filename, link;
    let csv = convertArrayOfObjectsToCSV(args);
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
} 
