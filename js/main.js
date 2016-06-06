///////////// Test Variablen 
var h = 260, w = window.innerWidth, barPadding = 1, padding = 40;
var wLegend = 776, hLegend = 15;
//////////////////////////////////////

var dataset = []; //2012-haushaltsgroesse-statdteil.csv
var dataname = []; //Stadtteil Namen

// Kennzahlen
var energyPhh = [2050,3440,4050,4750,5370];

var germanEnergyHead = 8372.27;
var energyheadPhh = [];

var allResidents = 0;
var cityEnergy = 0;
var cityEnergyHead = 0;
var cityPhh = 0;
var citySize = 0;

var groupResidents = 0;
var groupEnergy = 0;
var groupEnergyHead = 0;
var groupPhh = 0;
var groupSize = 0;

var linearGreen = [d3.rgb(237,248,251),d3.rgb(0,109,44)];
var linearRed = [d3.rgb(254,224,210),d3.rgb(222,45,38)];
var linearBlue = [d3.rgb(222,235,247),d3.rgb(49,130,189)];
var linearGray = [d3.rgb(240,240,240),d3.rgb(99,99,99)];

function countPhh (data) {
  var onePhh = 0, twoPhh = 0, threePhh = 0, fourPhh = 0, fivePhh = 0;
  var countPerPhh = [];
  for (i = 0; i < data.length; i++) {
    onePhh += +data[i]["einphh"];
    twoPhh += +data[i]["zweiphh"];
    threePhh += +data[i]["dreiphh"];
    fourPhh += +data[i]["vierphh"];
    fivePhh += +data[i]["funfphh"]; 
  }
  countPerPhh.push(onePhh,twoPhh/2,threePhh/3,fourPhh/4,fivePhh/5);
  return countPerPhh;
}

function valuesDetails (data) {
  for (var j = 0; j < data.length; j++) {
    dataset.push(+data[j]["sum"]);
    dataname.push(data[j]["number"]);
    cityPhh += +data[j]["sum"];
    allResidents += +data[j]["einwohner"];
    citySize += +data[j]["stadtflaecheqkm"];
  }

  for (var k = 0; k < countPhh(data).length; k++) {
    energyheadPhh[k] = energyPhh[k]/(k+1);
    cityEnergy += countPhh(data)[k]*energyheadPhh[k];
  }

  cityEnergyHead = cityEnergy / allResidents;

  if (!null) {
    $("#hhgroessen2").val(cityPhh);
    $("#gesamtverbrauch").val(cityEnergy);
    $("#alleinwohneranzahl").val(allResidents);
    $("#gesamtflache").val(citySize);
    $("#verbrauchkopf").val(cityEnergyHead);
  } else {
    $("#alleinwohneranzahl").val(0);
    $("#gesamtflache").val(0);
    $("#verbrauchkopf").val(0);
    $("#hhgroessen2").val(0);
    $("#gesamtverbrauch").val(0);
  }
}

function legende (data, color) {
  var lScale = d3.scale.linear()
  .domain([d3.min(dataset), d3.max(dataset)])
  .range([color[0], color[1]]);
  console.log(dataset);
  colorlegend("#legende", lScale, "linear", 
  {title: "Einwohneranzahl", boxWidth: 25, linearBoxes: 35});
}

var svgFile = "cologne-stadtteile.svg";
d3.xml(svgFile, "image/svg+xml", function(xml) {
    var importNode = document.getElementById("main-panel").appendChild(xml.documentElement);
});


d3.csv("data/2012-haushaltsgroesse-statdteil.csv", function (data) {
    valuesDetails(data);
    legende(dataset, linearRed);    


///////// Test Diagramme für Detailansicht ////////////

// Detail Panel 1
  var svg = d3.select("#detail-panel")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (w / dataset.length) + padding + 5;
     })
     .attr("y", function (d) {
        return h - (d / 100);
     })
     .attr("width", w / dataset.length - barPadding)
     .attr("height", function (d) {
        return d/100;
     })
     .attr("fill", function(d) {
      return "rgb(166, 0, " + Math.round((d / 110)) + ")";
     });

   var yScale = d3.scale.linear()
   .domain([0, (d3.max(dataset)+1600)/10])
   .range([h - 1, 0]);

   var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

   svg.selectAll("text")
   .data(dataname)
   .enter()
   .append("text")
   .text(function (d) {
    return d;
   })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return (i * (w / dataset.length) + (w / dataset.length - barPadding) / 2) + padding + 5;
    })
   .attr("y", function(d) {
        return h-2;  //15 is now 14
    })
   .attr("font-family", "sans-serif")
   .attr("font-size", "7px")
   .attr("fill", "black");

   svg.append("g")
  .attr('class', 'axis')
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);


  
// Detail Panel 2
  var svg = d3.select("#detail-panel2")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (w / dataset.length);
     })
     .attr("y", function (d) {
        return h - (d / 140);
     })
     .attr("width", w / dataset.length - barPadding)
     .attr("height", function (d) {
        return d / 140;
     })
     .attr("fill", function(d) {
      return "rgb(166, 0, " + Math.round((d / 110)) + ")";
     });

   svg.selectAll("text")
   .data(dataname)
   .enter()
   .append("text")
   .text(function (d) {
    return d;
   })
    .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
    })
   .attr("y", function(d) {
        return h-2;  //15 is now 14
    })
   .attr("font-family", "sans-serif")
   .attr("font-size", "7px")
   .attr("fill", "black");

  

// Detail Panel 3
  var svg = d3.select("#detail-panel3")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (w / dataset.length);
     })
     .attr("y", function (d) {
        return h - (d * 50);
     })
     .attr("width", w / dataset.length - barPadding)
     .attr("height", function (d) {
        return d * 50;
     })
     .attr("fill", function(d) {
      return "rgb(166, 0, " + Math.round((d / 110)) + ")";
     });


   svg.selectAll("text")
   .data(dataname)
   .enter()
   .append("text")
   .text(function (d) {
    return d;
   })
    .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
    })
   .attr("y", function(d) {
        return h-2;  //15 is now 14
    })
   .attr("font-family", "sans-serif")
   .attr("font-size", "7px")
   .attr("fill", "black");
////////////////////////////

});

