
var sumPhh = []; //Alle haushalte je statdteil
var dataname = []; //Stadtteil Namen
var diversity = []; //einwohnerqkm
var onePhh = [], twoPhh = [], threePhh = [], fourPhh = [], fivePhh = [];
var _onePhh = [], _twoPhh = [], _threePhh = [], _fourPhh = [], _fivePhh = [];
var residentPhh = []; //Einwohner pro Stadtteil
var energyHeadSumPhh = []; // Pro Kopf Energie verbrauch
var energySumPhh = []; //Gesamt Energie verbrauch pro Haushalt
// Kennzahlen
var energyPhh = [2050,3440,4050,4750,5370];
var germanEnergyHead = 8372.27;
var energyheadPhh = []; // Hilfswerte Energieverbrauch pro kopf je phh

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
var linearOrange = [d3.rgb(254,230,206),d3.rgb(230,85,13)];
var linearLila = [d3.rgb(239,237,245),d3.rgb(117,107,177)];

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
  countPerPhh.push(onePhh,twoPhh,threePhh,fourPhh,fivePhh);
  return countPerPhh;
}

function valuesDetails (data) {
  for (var j = 0; j < data.length; j++) {
    cityPhh += +data[j]["sumphh"];
    allResidents += +data[j]["einwohner"];
    citySize += +data[j]["stadtflaecheqkm"];

    sumPhh.push(+data[j]["sumphh"]);
    dataname.push(data[j]["number"]);
    diversity.push(+data[j]["einwohnerqkm"]);
    residentPhh.push(+data[j]["einwohner"]);

    for (l = 0; l < countPhh(data).length; l++) {
      energyheadPhh[l] = energyPhh[l]/(l+1);
    }
    onePhh.push(+data[j]["einphh"]);
    twoPhh.push(+data[j]["zweiphh"]);
    threePhh.push(+data[j]["dreiphh"]);
    fourPhh.push(+data[j]["vierphh"]);
    fivePhh.push(+data[j]["funfphh"]); 

    energyHeadSumPhh.push(Math.floor((onePhh[j]*energyheadPhh[0]+
      twoPhh[j]*2*energyheadPhh[1]+
      threePhh[j]*3*energyheadPhh[2]+
      fourPhh[j]*4*energyheadPhh[3]+
      fivePhh[j]*5*energyheadPhh[4])/residentPhh[j]));

    energySumPhh.push(onePhh[j]*energyPhh[0]+
      twoPhh[j]*energyPhh[1]+
      threePhh[j]*energyPhh[2]+
      fourPhh[j]*energyPhh[3]+
      fivePhh[j]*energyPhh[4]);

    for (var i = 0; i < data.length; i++) {
      _onePhh[i] = onePhh[i]*energyheadPhh[0];
      _twoPhh[i] = twoPhh[i]*energyheadPhh[1];
      _threePhh[i] = threePhh[i]*energyheadPhh[2];
      _fourPhh[i] = Math.floor(fourPhh[i]*energyheadPhh[3]);
      _fivePhh[i] = fivePhh[i]*energyheadPhh[4];
    }
  }

  for (var k = 0; k < countPhh(data).length; k++) {
    energyheadPhh[k] = energyPhh[k]/(k+1);
    cityEnergy += countPhh(data)[k]*[k+1]*energyheadPhh[k]; 
  }

  cityEnergyHead = cityEnergy / allResidents;


  if (!null) {
    $("#alleinwohneranzahl").val(allResidents);
    $("#gesamtverbrauch").val(cityEnergy);
    $("#verbrauchkopf").val(Math.floor(cityEnergyHead));
    $("#hhgroessen2").val(cityPhh);
    $("#gesamtflache").val(citySize);
    
  } else {
    $("#alleinwohneranzahl").val(0);
    $("#gesamtflache").val(0);
    $("#verbrauchkopf").val(0);
    $("#hhgroessen2").val(0);
    $("#gesamtverbrauch").val(0);
  }
}

//TODO legende auch für mehr farben linear vorbereiten
function legende (data, color, title, id) {
  var lScale = d3.scale.linear()
  .domain([d3.min(data), d3.max(data)])
  .range([color[0], color[1]]);
  colorlegend("#legende", lScale, "linear", 
  {title: title, boxWidth: 38, linearBoxes: 20, id: id});
}

////////////////////STADTKARTE//////////////////////////
var green = d3.rgb(0,109,44);

function colorId (selection, value, id, color, max, min) {
  var colorpleth = d3.scale.linear()
  .range([color[0], color[1]]);
  colorpleth.domain([min,max]);
  //console.log("ID: "+id);
  //console.log("Value: "+value);
  selection.select("[id='"+id+"']")
  .data(value)
    .style("fill", function () {
      var val = value;
      if(val) {
        return colorpleth(val);
      }
      else {
        console.log("ERROR, does not exist: "+id);
        return green;
      }
    });
}

// TODO implement change darken color by hover and keep color by click
// and uncheck by second click. Return id of Polygon for groupedBarChart
function polygonHover (selection) {
  selection.selectAll("polygon")
    .on("mouseover", function () {
      d3.select(this).attr("fill", green);
    })
    .on("mouseout", function (d) {
      d3.select(this)
      .attr("fill", "#fff");
    })
    .append("text")
    .style("pointer-events", "none");
}

function initMap (data, value, color, max, min) {
  var mainPanel = d3.select("#main-panel")
  .append("svg")
  .attr({"width": 776, "height": 800});

  var svgFile = "cologne-stadtteile.svg";
  d3.xml(svgFile, "image/svg+xml", function (error, xml) {
    if (error) {console.log(error); return;}
    
    mainPanel.node().appendChild(xml.documentElement);
    
    mainPanel.select("#TT_Stadtteile_copy")
    .selectAll("path")
    .attr("fill", "#000000");

     mainPanel.select("#TT_Bezirke_copy")
    .selectAll("path")
    .attr("fill", "#000000"); 

    var innerSVG = mainPanel.selectAll("svg");

    for (var i = 0; i < data.length; ++i) {
      colorId(innerSVG, String(value[i]), data[i]["number"], color, max, min);
    }

  });
}


////////////////Funktion Balken diagramme für Detail Panel////////////////////
function groupedBarChart (data, panelName) {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 6000 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#1f78b4", "#ff7f00", "#df65b0", "#e31a1c", "#33a02c"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select(panelName).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Liste mit Spaltenname der Haushalte
 var phhName = d3.keys(data[0])
  .filter(function(key) { 
    return key !== "number" 
          && key !== "stadtteil"
          && key !== "sumphh"
          && key !== "prohh"
          && key !== "einwohnerqkm"
          && key !== "stadtflaecheqkm"
          && key !== "einwohner"; 
  });
  //console.log(phhName);

  data.forEach(function (d) {
    d.phhValue = phhName.map(function (name) {
      return {name: name, value: +d[name]};
    });
    //console.log(d.phhValue);
  });
  
  x0.domain(data.map(function(d) { return d.stadtteil; }));
  x1.domain(phhName).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { 
    return d3.max(d.phhValue, function(d) { 
      return d.value; 
    }); 
  })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Stromverbrauch in kWh");

  var phh = svg.selectAll(".phh")
      .data(data)
    .enter().append("g")
      .attr("class", "phh")
      .attr("transform", function(d) { return "translate(" + x0(d.stadtteil) + ",0)"; });

  phh.selectAll("rect")
      .data(function(d) { return d.phhValue; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); }); 

  var legend = svg.selectAll(".legend")
      .data(phhName.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}


//////////////////////CSV DATASET CONTEXT//////////////////////////

d3.csv("data/2012-haushaltsgroesse-statdteil.csv", function (error, data) {
  if (error) throw error;
  
  valuesDetails(data);
  initMap(data, residentPhh, linearGreen, 41814, 1084);

  function switchLegends (index) {
    switch (index) {
      case "0": 
        legende(residentPhh, linearGreen, "Einwohneranzahl", 0);
        initMap(data, residentPhh, linearGreen, 41814, 1084);
      break;
      case "1":
        legende(diversity, linearRed, "Wohndichte", 1);
        initMap(data, diversity, linearRed, 13606, 170);
      break;
      case "2":
        legende(energyHeadSumPhh, linearLila, "Stromverbrauch pro Kopf", 2);
        initMap(data, energyHeadSumPhh, linearLila, 1722, 1338);
      break;
      case "3":
        legende(sumPhh, linearGray, "Gesamt Haushaltsgrößen", 3);
        initMap(data, sumPhh, linearGray, 25105, 459);
      break;
      case "4":
        legende(energySumPhh, linearOrange, "Gesamt Stromverbrauch", 4);
        initMap(data, energySumPhh, linearOrange, 65481260, 1588240);
      break;
      case "5":
        legende(_onePhh, linearBlue, "Stromverbrauch Ein-PHH", 5);
        initMap(data, _onePhh, linearBlue, 35009900, 264450);
      break;
      case "6":
        legende(_twoPhh, linearBlue, "Stromverbrauch Zwei-PHH", 6);
        initMap(data, _twoPhh, linearBlue, 9379160, 252840);
      break;
      case "7":
        legende(_threePhh, linearBlue, "Stromverbrauch Drei-PHH", 7);
        initMap(data, _threePhh, linearBlue, 3160350, 120150);
      break;
      case "8":
        legende(_fourPhh, linearBlue, "Stromverbrauch Vier-PHH", 8);
        initMap(data, _fourPhh, linearBlue, 1820437, 90250);
      break;
      case "9":
        legende(_fivePhh, linearBlue, "Stromverbrauch Fünf-PHH", 9);
        initMap(data, _fivePhh, linearBlue, 920418, 19332);
      break; 
    }  
  }

  var prev = "0";
  var radioIndex = "0";
  legende(residentPhh, linearGreen, "Einwohneranzahl", 0);

  $("input[name='modi']").on("click",function(){
    radioIndex =  $(this).val();
    if (radioIndex == prev) { 
      console.log("do nothing");
    }
    else if (!$(this).checked && radioIndex != prev) {
      d3.selectAll("#legende [class='"+prev+"']").remove();
      d3.select("#main-panel svg").remove();
      prev = radioIndex;
      switchLegends(radioIndex);
    }   
  });



////////////////Balken diagramme für Detail Panel////////////////////
  var testdata = [12837,3677,1011,552,215];
  
  groupedBarChart(data, "#detail-panel");
 
   
});
