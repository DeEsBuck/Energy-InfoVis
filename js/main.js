var h = 260, w = window.innerWidth, barPadding = 1, padding = 40;
var wLegend = 776, hLegend = 15;

var dataset = []; //2012-haushaltsgroesse-statdteil.csv
var dataname = []; //Stadtteil Namen
var dataset2 = []; //2012_flaeche_dichte_einwohner_stadtteil.csv
var dataname2 = []; 
var dataset3 = []; // Sonstige Datensätze z.B. CO²-Äquivalente 
var dataname3 = [];
// Kennzahlen
var energyPhh = [2050,3440,4050,4750,5370];

var germanEnergyHead = 8372.27;
var energyheadPhh = [];

var allResidents = 0;//1044555;
var cityEnergy = 0;
var cityEnergyHead = 0;
var cityPhh = 0;
var citySize = 0;

var groupResidents = 0;//1044555;
var groupEnergy = 0;
var groupEnergyHead = 0;
var groupPhh = 0;
var groupSize = 0;

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



var svgFile = "cologne-stadtteile.svg";
d3.xml(svgFile, "image/svg+xml", function(xml) {
    var importNode = document.getElementById("main-panel").appendChild(xml.documentElement);
});

var cLinear = [d3.rgb(237,248,251),d3.rgb(0,109,44)];
var c = d3.interpolateRgb(d3.rgb(237,248,251),d3.rgb(0,109,44));



d3.csv("data/2012-haushaltsgroesse-statdteil.csv", function (data) {
  for (var j = 0; j < data.length; j++) {
    dataset.push(+data[j]["sum"]);
    dataname.push(data[j]["number"]);
    cityPhh += +data[j]["sum"];
  }
  for (var k = 0; k < countPhh(data).length; k++) {
    energyheadPhh[k] = energyPhh[k]/(k+1);
    cityEnergy += countPhh(data)[k]*energyheadPhh[k];
  }
  
  if (!null) {
    $("#hhgroessen2").val(cityPhh);
    $("#gesamtverbrauch").val(cityEnergy);
  } else {
    $("#hhgroessen2").val(0);
    $("#gesamtverbrauch").val(0);
  }


// Legende
  var lScale = d3.scale.linear()
  .domain([d3.min(dataset), d3.max(dataset)])
  .range([cLinear[0], cLinear[1]]);

  colorlegend("#legende", lScale, "linear", 
  {title: "Einwohneranzahl", boxWidth: 25, linearBoxes: 35});

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
});


d3.csv("data/2012_flaeche_dichte_einwohner_stadtteil.csv", function (data2) {
  
  for (var j = 0; j < data2.length; j++) {
    dataset2.push(data2[j]["einwohner"]);
    dataname2.push(data2[j]["number"]);
    allResidents += +data2[j]["einwohner"];
    citySize += +data2[j]["stadtflaecheqkm"];
  }
  cityEnergyHead = cityEnergy / allResidents;

  if (!null) {
    $("#alleinwohneranzahl").val(allResidents);
    $("#gesamtflache").val(citySize);
    $("#verbrauchkopf").val(cityEnergyHead);
  } else {
    $("#alleinwohneranzahl").val(0);
    ("#gesamtflache").val(0);
    $("#verbrauchkopf").val(0);
  }

// Detail Panel 2
  var svg = d3.select("#detail-panel2")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
     .data(dataset2)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (w / dataset2.length);
     })
     .attr("y", function (d) {
        return h - (d / 140);
     })
     .attr("width", w / dataset2.length - barPadding)
     .attr("height", function (d) {
        return d / 140;
     })
     .attr("fill", function(d) {
      return "rgb(166, 0, " + Math.round((d / 110)) + ")";
     });

   svg.selectAll("text")
   .data(dataname2)
   .enter()
   .append("text")
   .text(function (d) {
    return d;
   })
    .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset2.length) + (w / dataset2.length - barPadding) / 2;
    })
   .attr("y", function(d) {
        return h-2;  //15 is now 14
    })
   .attr("font-family", "sans-serif")
   .attr("font-size", "7px")
   .attr("fill", "black");
});




d3.csv("data/2012-haushaltsgroesse-statdteil.csv", function (data3) {
  
  for (var j = 0; j < data3.length; j++) {
    dataset3.push(data3[j]["prohh"]);
    dataname3.push(data3[j]["number"]);
  }

// Detail Panel 3
  var svg = d3.select("#detail-panel3")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
     .data(dataset3)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (w / dataset3.length);
     })
     .attr("y", function (d) {
        return h - (d * 50);
     })
     .attr("width", w / dataset3.length - barPadding)
     .attr("height", function (d) {
        return d * 50;
     })
     .attr("fill", function(d) {
      return "rgb(166, 0, " + Math.round((d / 110)) + ")";
     });


   svg.selectAll("text")
   .data(dataname3)
   .enter()
   .append("text")
   .text(function (d) {
    return d;
   })
    .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset3.length) + (w / dataset3.length - barPadding) / 2;
    })
   .attr("y", function(d) {
        return h-2;  //15 is now 14
    })
   .attr("font-family", "sans-serif")
   .attr("font-size", "7px")
   .attr("fill", "black");
});

