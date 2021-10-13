/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 19.919646622716478, "KoPercent": 80.08035337728353};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.02296175445606091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [7.6118450130138E-4, 500, 1500, "tickets/1933/list"], "isController": false}, {"data": [0.028297779712668697, 500, 1500, "news/list?type=Article"], "isController": false}, {"data": [3.052130387010133E-4, 500, 1500, "games?type=history"], "isController": false}, {"data": [0.001223560196738788, 500, 1500, "tickets/stadium-ticket?id=2720&gameId=1931"], "isController": false}, {"data": [3.523094491823991E-4, 500, 1500, "games?type=upcoming"], "isController": false}, {"data": [0.0, 500, 1500, "stream?type=video"], "isController": false}, {"data": [6.174821547657273E-4, 500, 1500, "stream?type=audio"], "isController": false}, {"data": [0.006351775554247596, 500, 1500, "games/1933"], "isController": false}, {"data": [7.26547299460631E-4, 500, 1500, "games/1933/events"], "isController": false}, {"data": [0.15965298615816476, 500, 1500, "/tickets/list"], "isController": false}, {"data": [0.05208962800029006, 500, 1500, "news/list?type=Video"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 450510, 360770, 80.08035337728353, 3950.414701116514, 0, 88292, 59.0, 26335.900000000016, 41474.8, 60077.0, 138.65728557842348, 331.0073957126264, 104.28058949053812], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tickets/1933/list", 40726, 31287, 76.82315965231057, 4422.221823896288, 0, 71861, 0.0, 3193.6000000000204, 25918.40000000001, 37803.570000000065, 12.558586022737188, 17.6234767450995, 8.99614109770371], "isController": false}, {"data": ["news/list?type=Article", 41346, 32200, 77.87935955110531, 1246.4674696463894, 0, 27822, 0.0, 107.0, 3690.4000000000233, 9591.950000000008, 12.730718485344402, 39.566356858606845, 11.042604800441692], "isController": false}, {"data": ["games?type=history", 40955, 33291, 81.28677817116348, 8572.782151141551, 0, 88292, 0.0, 15121.900000000001, 54240.55, 60345.97, 12.622021088991797, 39.90866610106292, 9.230736566816427], "isController": false}, {"data": ["tickets/stadium-ticket?id=2720&gameId=1931", 41273, 31522, 76.37438519128729, 4451.128873597771, 0, 59552, 0.0, 3170.9000000000015, 26192.0, 38178.0, 12.719500995420448, 18.072139776927973, 9.391039790622708], "isController": false}, {"data": ["games?type=upcoming", 41157, 33263, 80.81978764244235, 8697.554049128958, 0, 84298, 0.0, 9509.000000000087, 56322.9, 60065.0, 12.683310462059314, 37.453704172288184, 9.315693783796506], "isController": false}, {"data": ["stream?type=video", 40492, 40492, 100.0, 349.7765484540155, 0, 42094, 0.0, 309.0, 493.0, 15197.990000000002, 12.491107967322975, 17.134806705101635, 8.942335948937984], "isController": false}, {"data": ["stream?type=audio", 40487, 31330, 77.38286363524094, 4322.342455603037, 0, 44768, 0.0, 117.0, 26616.750000000004, 35816.93000000001, 12.49145757325661, 17.703379175761874, 8.95123272231521], "isController": false}, {"data": ["games/1933", 40776, 31692, 77.72218952324897, 2462.11962919364, 0, 47785, 0.0, 3138.9000000000015, 15143.95, 23376.31000000027, 12.570631962810955, 52.94864697151538, 8.938232432336822], "isController": false}, {"data": ["games/1933/events", 40603, 31262, 76.9943107652144, 4462.7261286112025, 0, 64789, 0.0, 2582.500000000051, 27178.700000000004, 37230.750000000204, 12.523344596313905, 34.982808902406866, 9.116338354766924], "isController": false}, {"data": ["/tickets/list", 41324, 32002, 77.44168037944051, 2481.4369373729555, 0, 68873, 0.0, 103.0, 173.0, 52323.88000000002, 12.734182114458491, 17.809232248810062, 9.498517224900343], "isController": false}, {"data": ["news/list?type=Video", 41371, 32429, 78.38582582001885, 1981.8307510091568, 0, 42120, 0.0, 6603.100000000013, 15211.0, 28339.0, 12.736584732107177, 38.25477249125054, 11.006845034479843], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 108, 0.029935970285777644, 0.023972830791769328], "isController": false}, {"data": ["502/Bad Gateway", 29573, 8.197189345012058, 6.564338194490689], "isController": false}, {"data": ["504/Gateway Timeout", 3384, 0.9379937356210328, 0.7511486981421056], "isController": false}, {"data": ["500/Internal Server Error", 186176, 51.6051778141198, 41.325608754522655], "isController": false}, {"data": ["422/Unprocessable Entity", 9323, 2.5841949164287494, 2.069432421033939], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 132206, 36.645508218532584, 29.34585247830237], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 450510, 360770, "500/Internal Server Error", 186176, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 132206, "502/Bad Gateway", 29573, "422/Unprocessable Entity", 9323, "504/Gateway Timeout", 3384], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["tickets/1933/list", 40726, 31287, "500/Internal Server Error", 16715, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12028, "502/Bad Gateway", 2543, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 1, null, null], "isController": false}, {"data": ["news/list?type=Article", 41346, 32200, "500/Internal Server Error", 17314, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12037, "502/Bad Gateway", 2849, null, null, null, null], "isController": false}, {"data": ["games?type=history", 40955, 33291, "500/Internal Server Error", 17063, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12002, "502/Bad Gateway", 2731, "504/Gateway Timeout", 1476, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 19], "isController": false}, {"data": ["tickets/stadium-ticket?id=2720&gameId=1931", 41273, 31522, "500/Internal Server Error", 16828, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 11995, "502/Bad Gateway", 2693, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 6, null, null], "isController": false}, {"data": ["games?type=upcoming", 41157, 33263, "500/Internal Server Error", 16937, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 11978, "502/Bad Gateway", 2669, "504/Gateway Timeout", 1675, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 4], "isController": false}, {"data": ["stream?type=video", 40492, 40492, "500/Internal Server Error", 16603, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12023, "422/Unprocessable Entity", 9323, "502/Bad Gateway", 2534, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 9], "isController": false}, {"data": ["stream?type=audio", 40487, 31330, "500/Internal Server Error", 16712, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12003, "502/Bad Gateway", 2615, null, null, null, null], "isController": false}, {"data": ["games/1933", 40776, 31692, "500/Internal Server Error", 16922, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12043, "502/Bad Gateway", 2707, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 20, null, null], "isController": false}, {"data": ["games/1933/events", 40603, 31262, "500/Internal Server Error", 16726, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12021, "502/Bad Gateway", 2513, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 2, null, null], "isController": false}, {"data": ["/tickets/list", 41324, 32002, "500/Internal Server Error", 17009, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12017, "502/Bad Gateway", 2743, "504/Gateway Timeout", 233, null, null], "isController": false}, {"data": ["news/list?type=Video", 41371, 32429, "500/Internal Server Error", 17347, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: 704-football-qpr.pixelplexlabs.com", 12059, "502/Bad Gateway", 2976, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 704-football-qpr.pixelplexlabs.com:443 [704-football-qpr.pixelplexlabs.com/172.67.144.203, 704-football-qpr.pixelplexlabs.com/104.21.71.117] failed: Connection timed out: connect", 47, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
