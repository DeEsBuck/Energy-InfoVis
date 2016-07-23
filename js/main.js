// Kategorien Werte für Map und legende
var sumPhh = []; //Alle haushalte je statdteil
var dataname = []; //Stadtteil Nummer
var stadtteilname = []; 
var diversity = []; //einwohnerqkm
var sumOnePhh = [], sumTwoPhh = [], sumThreePhh = [], sumFourPhh = [], sumFivePhh = []; // Gesamt Stromverbrauch pro Haushalt
var onePhh = [], twoPhh = [], threePhh = [], fourPhh = [], fivePhh = []; // Anzahl der pHH
var _onePhh = [], _twoPhh = [], _threePhh = [], _fourPhh = [], _fivePhh = []; // Einwohneranzahl pro Haushalt
var avgOnePhh = [], avgTwoPhh = [], avgThreePhh = [], avgFourPhh = [], avgFivePhh = []; // Durchschnitts pro Kopf Energie
var resident = []; //Einwohner pro Stadtteil
var energyHeadSumPhh = []; // Pro Kopf Energie verbrauch
var energySumPhh = []; //Gesamt Energie verbrauch pro Haushalt

// Kennzahlen
var energyPhh = [2050,3440,4050,4750,5370]; // Der gesamt Stromverbrauch einer Haushaltsgröße
var germanEnergyHead = 8372.27;
var energyheadPhh = []; // Hilfswerte Energieverbrauch pro kopf je Haushaltsgröße

// Kennzahlen für Numbers Panel
var allResidents = 0;
var cityEnergy = 0;
var cityEnergyHead = 0;
var cityPhh = 0;
var citySize = 0;

var groupEnergyArray = [];
var groupResidents = 0;
var groupEnergy = 0;
var groupEnergyHead = 0;
var groupPhh = 0;
var groupSize = 0;

var red = d3.rgb(222,45,38);
var selectedColor = d3.rgb(129,15,124);
var linearGreen = [d3.rgb(255,255,204),d3.rgb(0,109,44)];
var linearRed = [d3.rgb(254,240,217),d3.rgb(179,0,0)];
var linearBlue = [d3.rgb(246,239,247),d3.rgb(1,108,89)];
var linearGray = [d3.rgb(240,240,240),d3.rgb(99,99,99)];
var linearPink = [d3.rgb(241,238,246), d3.rgb(152,0,67)];
var linearOrange = [d3.rgb(255,255,212),d3.rgb(153,52,4)];
var linearLila = [d3.rgb(241,238,246),d3.rgb(84,39,143)];
var redBlueScale = ["rgb(103, 0, 31)", "rgb( 178, 24, 43)", "rgb( 214, 96, 77)", "rgb( 244, 165, 130)", "rgb( 253, 219, 199)", "rgb( 209, 229, 240)", "rgb( 146, 197, 222)", "rgb( 67, 147, 195)", "rgb( 33, 102, 172)", "rgb( 5, 48, 97)"];
var linear3Color = ["rgb(103, 0, 31)", "rgb(200,200,200)", "rgb( 5, 48, 97)"];


var phhName = [], phhCityName = [], phhCityValue = [];
var groupValue = [], phhKey = [];
var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 720 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

function makeYAxis(y) {
  return d3.svg.axis()
      .scale(y)
      .orient("left")
}

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

function sum(input){  
  if (toString.call(input) !== "[object Array]")  
  return false;  
  
  var total =  0;  
  for(var i = 0 ; i < input.length ; i++) {                    
    if (isNaN(input[i])) {  
      continue;  
    }  
    total += +input[i];  
  }
  return total;  
}

function removeItem(array, item){
  for(var i in array){
    if(array[i]==item){
      array.splice(i,1);
      break;
    }
  }
  return array;
}

function removeBarChart (panelName, id, modi) {
  d3.selectAll(panelName)
  .selectAll("[barid='"+id+"-"+modi+"']")
  .remove();
}

function removeAllBarChart (panelName) {
  d3.selectAll(panelName)
  .selectAll("svg")
  .remove();
}
 
function removeBarById (panelName, id) {
  d3.selectAll(panelName + " svg [id='"+id+"']").remove();
}

function removeBarByName (panelName, name) {
  d3.selectAll(panelName + " svg [name='"+name+"']").remove();
}

function valuesDetails (data) {
  for (var j = 0; j < data.length; j++) {
    cityPhh += +data[j]["sumphh"];
    allResidents += +data[j]["einwohner"];
    citySize += +data[j]["stadtflaecheqkm"];

    sumPhh.push(+data[j]["sumphh"]);
    dataname.push(data[j]["number"]);
    stadtteilname.push(data[j]["stadtteil"]);
    diversity.push(+data[j]["einwohnerqkm"]);
    resident.push(+data[j]["einwohner"]);

    for (l = 0; l < countPhh(data).length; l++) {
      energyheadPhh[l] = energyPhh[l]/(l+1);
    }
    onePhh.push(+data[j]["einphh"]);
    twoPhh.push(+data[j]["zweiphh"]);
    threePhh.push(+data[j]["dreiphh"]);
    fourPhh.push(+data[j]["vierphh"]);
    fivePhh.push(+data[j]["funfphh"]); 

    energyHeadSumPhh.push(Math.round(((
      onePhh[j]*energyheadPhh[0]+
      twoPhh[j]*2*energyheadPhh[1]+
      threePhh[j]*3*energyheadPhh[2]+
      fourPhh[j]*4*energyheadPhh[3]+
      fivePhh[j]*5*energyheadPhh[4])/resident[j]) * 100) / 100);

    energySumPhh.push(
      onePhh[j]*energyheadPhh[0]+
      twoPhh[j]*2*energyheadPhh[1]+
      threePhh[j]*3*energyheadPhh[2]+
      fourPhh[j]*4*energyheadPhh[3]+
      fivePhh[j]*5*energyheadPhh[4]);

    _onePhh[j] = onePhh[j];
    _twoPhh[j] = twoPhh[j]*2;
    _threePhh[j] = threePhh[j]*3;
    _fourPhh[j] = fourPhh[j]*4;
    _fivePhh[j] = fivePhh[j]*5;

    sumOnePhh[j] = onePhh[j]*energyPhh[0];
    sumTwoPhh[j] = twoPhh[j]*energyPhh[1];
    sumThreePhh[j] = threePhh[j]*energyPhh[2];
    sumFourPhh[j] = fourPhh[j]*energyPhh[3];
    sumFivePhh[j] = fivePhh[j]*energyPhh[4];

    // Check if really needed 86 rows
    avgOnePhh[j] = sumOnePhh[j] / _onePhh[j];
    avgTwoPhh[j] = sumTwoPhh[j] / _twoPhh[j];
    avgThreePhh[j] = sumThreePhh[j] / _threePhh[j];
    avgFourPhh[j] = sumFourPhh[j] / _fourPhh[j];
    avgFivePhh[j] = sumFivePhh[j] / _fivePhh[j];
    
  }

  // TODO Verbrauch pro Kopf (kWh) Rechnungsfehler, vgl cityEnergyHead mit groupEnergyHead
  for (var k = 0; k < countPhh(data).length; k++) {
    energyheadPhh[k] = energyPhh[k]/(k+1);
    cityEnergy += countPhh(data)[k]*[k+1]*energyheadPhh[k]; 
  }

  cityEnergyHead = cityEnergy / allResidents;

  if (!null) {
    $("#alleinwohneranzahl").val(new Intl.NumberFormat().format(allResidents));
    $("#gesamtverbrauch").val(new Intl.NumberFormat().format(cityEnergy));
    $("#verbrauchkopf").val(new Intl.NumberFormat().format(Math.round(cityEnergyHead * 100) / 100));
    $("#hhgroessen2").val(new Intl.NumberFormat().format(cityPhh));
    $("#gesamtflache").val(new Intl.NumberFormat().format(Math.round(citySize * 100) / 100));
    
  } else {
    $("#alleinwohneranzahl").val(0);
    $("#gesamtflache").val(0);
    $("#verbrauchkopf").val(0);
    $("#hhgroessen2").val(0);
    $("#gesamtverbrauch").val(0);
  }
}

/**
* @param operation true = addition, false = subtraktion
**/ 
function groupedValues (i ,operation, key, index, data, kwhhead, kwhallphh) {
  if (operation) {
    groupPhh += +data[index]["sumphh"];
    groupResidents += +data[index]["einwohner"];
    groupSize += +data[index]["stadtflaecheqkm"];
    groupEnergy += kwhallphh;
    groupEnergyArray.push(kwhhead);
    groupEnergyHead = sum(groupEnergyArray) / i;
  }
  else {
    groupPhh -= +data[index]["sumphh"];
    groupResidents -= +data[index]["einwohner"];
    groupSize -= +data[index]["stadtflaecheqkm"];
    groupEnergy -= kwhallphh;
    if (i <= 0) {
      groupEnergyHead = 0;
      groupEnergyArray.shift();
    }
    else {
      groupEnergyArray = removeItem(groupEnergyArray, kwhhead);
      groupEnergyHead = sum(groupEnergyArray) / i;
    }
  }

  if (!null) {
    $("#einwohneranzahl").val(new Intl.NumberFormat().format(groupResidents));
    $("#stromverbrauch").val(new Intl.NumberFormat().format(groupEnergy));
    $("#stromprokopf").val(new Intl.NumberFormat().format(Math.round(groupEnergyHead * 100) / 100));
    $("#hhgrose2").val(new Intl.NumberFormat().format(groupPhh));
    $("#flache").val(new Intl.NumberFormat().format(Math.round(groupSize * 100) / 100));
  } else {
    $("#einwohneranzahl").val(0);
    $("#stromverbrauch").val(0);
    $("#stromprokopf").val(0);
    $("#hhgrose2").val(0);
    $("#flache").val(0);
  }
}

function clearGroupedArray () {
  groupPhh = 0;
  groupResidents = 0;
  groupSize = 0;
  groupEnergy = 0;
  groupEnergyArray.length = 0;
  $("#einwohneranzahl").val(0);
  $("#stromverbrauch").val(0);
  $("#stromprokopf").val(0);
  $("#hhgrose2").val(0);
  $("#flache").val(0);
}

/**
* das Bucket enthält Werte pro gewählten Stadtteil (Modi) 
* mit Werten für jeden phh
* @param key == modi := der Kontext der Map
* @param index == id := Stadtteilekennung
* @return
**/
function picker (key, index) {
  var bigBucket = d3.map([
    {key: "id", value: dataname[index]}, // id == index referenz
    {key: "einwohner", value: resident[index]},
    {key: "wohndichte", value: diversity[index]},
    {key: "kwhhead", value: energyHeadSumPhh[index]},
    {key: "allphh", value: sumPhh[index]},
    {key: "kwhallphh", value: energySumPhh[index]},
    {key: "einphh", value: onePhh[index]}, // Summe/Anzahl der HHg
    {key: "zweiphh", value: twoPhh[index]}, 
    {key: "dreiphh", value: threePhh[index]}, 
    {key: "vierphh", value: fourPhh[index]},
    {key: "fuenfphh", value: fivePhh[index]}, 
    {key: "residenteinphh", value: _onePhh[index]}, // Einwohneranzahl pro HHg
    {key: "residentzweiphh", value: _twoPhh[index]},
    {key: "residentdreiphh", value: _threePhh[index]}, 
    {key: "residentvierphh", value: _fourPhh[index]},
    {key: "residentfuenfphh", value: _fivePhh[index]},
    {key: "kwheinphh", value: sumOnePhh[index]}, // Summe Stromverbrauch pro HHg
    {key: "kwhzweiphh", value: sumTwoPhh[index]},
    {key: "kwhdreiphh", value: sumThreePhh[index]}, 
    {key: "kwhvierphh", value: sumFourPhh[index]},
    {key: "kwhfuenfphh", value: sumFivePhh[index]},
    {key: "avgkwhheadeinphh", value: avgOnePhh[index]}, //Pro Kopf Stromverbrauch pro HHg
    {key: "avgkwhheadzweiphh", value: avgTwoPhh[index]},
    {key: "avgkwhheaddreiphh", value: avgThreePhh[index]}, 
    {key: "avgkwhheadvierphh", value: avgFourPhh[index]},
    {key: "avgkwhheadfuenfphh", value: avgFivePhh[index]}
    ], 
    function (d) {
      return d.key;
    });

  var result = [bigBucket.get(key), bigBucket.get('id')];
  return result;
}

function pickerArray () {
  // Bucket für pro Haushaltsgrößen panel
  var bigBucket = [
    {"id": dataname, // id == index referenz
    "stadtteil": stadtteilname,
    "einwohner": resident,
    "wohndichte": diversity,
    "kwhhead": energyHeadSumPhh,
    "allphh": sumPhh,
    "kwhallphh": energySumPhh,
    "einphh": onePhh, // Summe/Anzahl der HHg
    "zweiphh": twoPhh, 
    "dreiphh": threePhh, 
    "vierphh": fourPhh,
    "fuenfphh": fivePhh, 
    "residenteinphh": _onePhh, // Einwohneranzahl pro HHg
    "residentzweiphh": _twoPhh,
    "residentdreiphh": _threePhh, 
    "residentvierphh": _fourPhh,
    "residentfuenfphh": _fivePhh,
    "kwheinphh": sumOnePhh, // Summe Stromverbrauch pro HHg
    "kwhzweiphh": sumTwoPhh,
    "kwhdreiphh": sumThreePhh, 
    "kwhvierphh": sumFourPhh,
    "kwhfuenfphh": sumFivePhh,
    "avgkwhheadeinphh": avgOnePhh, //Pro Kopf Stromverbrauch pro HHg
    "avgkwhheadzweiphh": avgTwoPhh,
    "avgkwhheaddreiphh": avgThreePhh, 
    "avgkwhheadvierphh": avgFourPhh,
    "avgkwhheadfuenfphh": avgFivePhh
    }];

  return bigBucket;
}

function legende (data, type, color, title, id) {
  var min = d3.min(data);
  var mean = d3.sum(data) / data.length;
  var max = d3.max(data);
  if (type == "linear") {
    var lScale = d3.scale.linear()
    .domain([min, max])
    .range([color[0], color[1]]);
    colorlegend("#legende", lScale, "linear", 
    {title: title, boxWidth: 760 / 20, linearBoxes: 20, id: id});
  }
  else if (type == "quantile") {
    var qScale = d3.scale.quantile()
    .domain([min, mean, max])
    .range(color);
    colorlegend("#legende", qScale, "quantile", 
    {title: title, boxWidth: 760 / 20, linearBoxes: 20, id: id});
  }
  else if (type == "linear3") {
    var lScale2 = d3.scale.linear()
    .domain([min, mean, max])
    .range(color);
    colorlegend("#legende", lScale2, "linear", 
    {title: title, boxWidth: 760 / 20, linearBoxes: 20, id: id});
  }
}

function colorId (selection, value, id, color, max, min) {
  var colorpleth = d3.scale.linear()
  .range([color[0], color[1]]).domain([min,max]);
  
  selection.select("[id='"+id+"']")
  .data(value)
    .attr("fill", function () {
      var val = value;
      if(val) {
        return colorpleth(val);
      }
      else {
        console.log("ERROR, does not exist: "+id);
        return red;
      }
    });    
}

function colorIdQuantile (selection, value, color, id, data) {
  var min = d3.min(data);
  var mean = d3.sum(data) / data.length;
  var max = d3.max(data);
  var colorpleth = d3.scale.linear()
    .domain([min, mean, max])
    .range(color);
  
  selection.select("[id='"+id+"']")
  .data(value)
    .attr("fill", function () {
      var val = value;
      if(val) {
        return colorpleth(val);
      }
      else {
        console.log("ERROR, does not exist: "+id);
        return red;
      }
    });    
}

////////////////Funktion Balken diagramme für Detail Panel////////////////////
/**
* Creates Chart related to the csv for each city. Domain can be grouped
* @param data 
* @param panelName
* @param modi := der Kontext der Map
* @param index == id := Stadtteilekennung
* @return
**/
function allCityBarChart (data, panelName, modi, index) {
  var margin = {top: 20, right: 20, bottom: 80, left: 40},
      width = 2000 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

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

  if (modi == "Einwohneranzahl") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"
            && key !== "einphh"
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Einwohner pro qkm") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"
            && key !== "einphh"
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Gesamtanzahl pro Haushalt") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "einwohnerqkm"
            && key !== "prohh"
            && key !== "einphh"
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl der Haushalte") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Durchschnitt Einwohner") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "einphh"
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl Ein-PHH") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"            
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl Zwei-PHH") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"            
            && key !== "einphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl Drei-PHH") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"            
            && key !== "einphh"
            && key !== "zweiphh"
            && key !== "vierphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl Vier-PHH") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"            
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "einphh"
            && key !== "funfphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }
  else if (modi == "Anzahl Fuenf-PHH") {
    var phhName = d3.keys(data[0])
    .filter(function(key) { 
      return key !== "number"
            &&key !== "stadtteil"
            && key !== "sumphh"
            && key !== "prohh"            
            && key !== "zweiphh"
            && key !== "dreiphh"
            && key !== "vierphh"
            && key !== "einphh"
            && key !== "einwohnerqkm"
            && key !== "stadtflaecheqkm"
            && key !== "einwohner"
            && key !== "phhValue"; 
    });
  }

  data.forEach(function (d) {
    d.phhValue = phhName.map(function (name) {
      return {name: name, value: +d[name]};
    });
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
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".9em")
      .attr("dy", ".3em")
      .attr("transform", "rotate(55)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("Uebersicht: "+modi);

  svg.append("g")            
    .attr("class", "grid")
    .call(makeYAxis(y)
        .tickSize(-width, 0, 0)
        .tickFormat("")
    );

  var phh = svg.selectAll(".part")
      .data(data)
    .enter().append("g")
      .attr("class", "part")
      .attr("name", function(d) {return d.stadtteil})
      .attr("transform", function(d) { return "translate(" + x0(d.stadtteil) + ",0)"; });

  phh.selectAll("rect")
      .data(function(d) { return d.phhValue; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return colorOrdinal(d.name); })
      .append("title")
      .text(function(d) {return new Intl.NumberFormat().format(d.value)});   

  var legend = svg.selectAll(".legend")
      .data(phhName)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorOrdinal);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}

/**
* Implements a barChart which groups phh for each citypart 
* plott in the scale for each Group the scale should grow and add the Objects by Citypart
* @param data
* @param panelName 
* @param modi := Context of the Map
* @param index == id := Stadtteilekennung
* @return
**/
function groupedBarChart (data, panelName, modi, index) {
  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  var x0 = d3.scale.ordinal()
      .domain(data.map(function(d) { return d.groupValue; }))
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal()
      .domain(phhCityName)
      .rangeRoundBands([0, x0.rangeBand()]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { 
        return d3.max(d.groupValue, function(d) { 
          return d.value; 
        }); 
      })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x1)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select(panelName).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("barid", index+"-"+modi)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".9em")
      .attr("dy", ".3em")
      .attr("transform", "rotate(55)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("Pro Haushaltsgroesse: "+modi);   

  svg.append("g")            
    .attr("class", "grid")
    .call(makeYAxis(y)
        .tickSize(-(width-130), 0, 0)
        .tickFormat("")
    );

  var legend = svg.selectAll(".legend")
      .data(phhName)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorOrdinal);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  var phh = svg.selectAll(".part")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "part");

  var rect = phh.selectAll("rect")
      .data(function(d) { return d.groupValue; });

  return rect;
}

function drawGroupBar (data, modi, index) {
  for (var i = 0; i < phhName.length; i++) {
    phhCityName.push(data[0]["stadtteil"][index]);
    phhKey.push("resident"+[i+1]+"phh"+index);
    groupValue.push(+data[0][phhName[i]][index]);
  }

  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  data.forEach(function (d) {
    d.groupValue = phhKey.map(function (name, i) {
      return {name: name, city: phhCityName[i], value: groupValue[i]};
    });
  });

  var x0 = d3.scale.ordinal()
      .domain(function(d) { return d.groupValue;})
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal()
      .domain(phhKey)
      .rangeRoundBands([0, x0.rangeBand()]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { 
        return d3.max(d.groupValue, function(d) { 
          return d.value; 
        }); 
      })])
      .range([height, 0]);

  if (toString.call(svgPhhBar) !== "[object Array]") {
    removeAllBarChart("#detail-panel2");
    var svgPhhBar = groupedBarChart(data, "#detail-panel2", modi, index);
  }

  svgPhhBar.enter()
    .append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) { return x1(d.name); })
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .attr("name", function(d) {return d.city})
    .style("fill", function(d) { return colorOrdinal(d.name); })
    .append("title")
    .text(function(d) {return new Intl.NumberFormat().format(d.value)});

  svgPhhBar.exit()
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();  

  svgPhhBar //Update
    .attr("x", function(d) {return x1(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x1.rangeBand())
    .attr("height", function(d) {return height - y(d.value)})
    .style("");

  return svgPhhBar;
}

function exitGroupBar (data, index, modi, name) {
  var found = phhCityName.indexOf(name);

  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  for (var i = 0; i < phhName.length; i++) {
    groupValue.splice(found,1);
    phhKey.splice(found,1);
    phhCityName.splice(found,1);
  }
  
  data.forEach(function (d) {
    d.groupValue = phhKey.map(function (name, i) {
      return {name: name, city: phhCityName[i], value: groupValue[i]};
    });
  });

  var x0 = d3.scale.ordinal()
      .domain(function(d, i) { return d.groupValue;})
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal()
      .domain(phhKey)
      .rangeRoundBands([0, x0.rangeBand()]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { 
        return d3.max(d.groupValue, function(d) { 
          return d.value; 
        }); 
      })])
      .range([height, 0]);

  if (toString.call(svgPhhBar) !== "[object Array]") {
    removeAllBarChart("#detail-panel2");
    var svgPhhBar = groupedBarChart(data, "#detail-panel2", modi, index);
  }

  svgPhhBar.enter()
      .append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return colorOrdinal(d.name); })
      .append("title")
      .text(function(d) {return d.value});

  svgPhhBar.exit()
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();  

  svgPhhBar //Update
    .attr("x", function(d) {return x1(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x1.rangeBand())
    .attr("height", function(d) {return height - y(d.value)});

  return svgPhhBar;
}

function createPhhBar (modi, panelName, array, index) {
  var data = array[0];
  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  array.forEach(function (d) {
    d.phhValue = phhName.map(function (name) {
      return {name: name, value: +d[name][index]};
    });
  });

  var xScale = d3.scale.ordinal()
    .domain(array.map(function(d) { return d.length; }))
    .rangeBands([0, width], 0);

  var x = d3.scale.ordinal()
    .domain(phhName)
    .rangeBands([0, xScale.rangeBand()]);

  var y = d3.scale.linear()
   .domain([0, d3.max(array, function(d) { 
    return d3.max(d.phhValue, function(d) { 
      return d.value; 
    }); 
  })])
  .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  var svg = d3.select(panelName).append("svg")
    .attr("barid", index+"-"+modi)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var phh = svg.selectAll(".phh")
    .data(array)
    .enter()
    .append("g")
    .attr("class", "phh")
    .attr("transform", function(d, i) { return "translate(" + xScale(d.modi) + ",0)"; });

  var rect = phh.selectAll("rect")
    .data(function(d) { return d.phhValue; })
    .enter()
    .append("rect")
    .attr("x", function(d) {return x(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x.rangeBand())
    .attr("height", function(d) {return height - y(d.value)})
    .attr("fill",function(d) { return colorOrdinal(d.name)})
    .append("title")
    .text(function(d) {return new Intl.NumberFormat().format(d.value)});  

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "start")
    .text(data["stadtteil"][index]+", Modus: "+modi);

    return rect;
}


function createBar (modi, panelName, array, index, color) {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 78 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;
  
  var data = array[0][modi];

  var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([0, width], 0);

   var x1Scale = d3.scale.ordinal()
    .domain(array.map(function(d) { 
      return d.stadtteil[index]; 
    }))
    .rangeBands([0, width], 0);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d; })])
    .range([0, height]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var x1Axis = d3.svg.axis()
    .scale(x1Scale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  var svg = d3.select(panelName).append("svg")
    .attr("barid", index+"-"+modi)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {return 0})
    .attr("y", function(d) {return height - yScale(d);})
    .attr("width",  x1Scale.rangeBand())
    .attr("height", function(d) {return yScale(d);})
    .attr("fill", color)
    .attr("id", function(d, i) {return i})
    .attr("display", function() {
      return index != d3.select(this).attr("id") ? d3.select(this).remove() : "block";
    })
    .append("title")
    .text(new Intl.NumberFormat().format(array[0][modi][index]));  

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x1Axis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(modi);

  return svg;
}

function createkwhPhhBar(modi, panelName, array, index) { 
  array.forEach(function (d) {
    d.phhCityValue = phhCityName.map(function (name,i) {
      return {name: name, value: phhCityValue[i]};
    });
  });

  var xScale = d3.scale.ordinal()
    .domain(array.map(function(d) { return d.length; }))
    .rangeBands([0, width], 0);

  var x = d3.scale.ordinal()
    .domain(phhCityName)
    .rangeBands([0, xScale.rangeBand()]);

  var y = d3.scale.linear()
   .domain([0, d3.max(array, function(d) { 
    return d3.max(d.phhCityValue, function(d) { 
      return d.value; 
    }); 
  })])
  .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  var svg = d3.select(panelName).append("svg")
    .attr("barid", index+"-"+modi)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("dx", ".9em")
    .attr("dy", ".3em")
    .attr("transform", "rotate(55)" );

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("Modus: "+modi);

  svg.append("g")            
    .attr("class", "grid")
    .call(makeYAxis(y)
        .tickSize(-width, 0, 0)
        .tickFormat("")
    );

  var bar = svg.selectAll(".bar")
    .data(array)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { 
      return "translate(" + xScale(d[index]) + ",0)"; 
    });

  var rect = bar.selectAll("rect")
    .data(function(d) { return d.phhCityValue; }); 

  return rect;
}

function drawKwhBar(array, index, modi) {
  phhCityName.push(array[0]["stadtteil"][index]);
  phhCityValue.push(+array[0][modi][index]);

  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  array.forEach(function (d) {
    d.phhCityValue = phhCityName.map(function (name, i) {
      return {name: name, value: phhCityValue[i]};
    });
  });

  var xScale = d3.scale.ordinal()
    .domain(array.map(function(d) { return d.length; }))
    .rangeBands([0, width], 0);
  
  var x = d3.scale.ordinal()
    .domain(phhCityName)
    .rangeBands([0, xScale.rangeBand()]);

  var y = d3.scale.linear()
    .domain([0, d3.max(array, function(d) { 
    return d3.max(d.phhCityValue, function(d) { 
      return d.value; 
    }); 
    })])
    .range([height, 0]);

  if (toString.call(svgKwhPhhBar) !== "[object Array]") {
    removeAllBarChart("#detail-panel2");
    var svgKwhPhhBar = createkwhPhhBar(modi, "#detail-panel2", array, index);
  } 

  svgKwhPhhBar.enter()
    .append("rect")
    .attr("x", function(d) {return x(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x.rangeBand())
    .attr("height", function(d) {return height - y(d.value)})
    .attr("name", function(d) {return d.name})
    .attr("fill",function(d) { return colorOrdinal(d.name)})
    .append("title")
    .text(function(d) {return new Intl.NumberFormat().format(d.value)});  

  svgKwhPhhBar.exit()
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();  

  svgKwhPhhBar //Update
    .attr("x", function(d) {return x(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x.rangeBand())
    .attr("height", function(d) {return height - y(d.value)});

  return svgKwhPhhBar;
}

function exitKwhBar (array, index, modi, name) {
  phhCityValue.splice(phhCityName.indexOf(name),1);
  phhCityName.splice(phhCityName.indexOf(name),1);

  var colorOrdinal = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

  array.forEach(function (d) {
    d.phhCityValue = phhCityName.map(function (name, i) {
      return {name: name, value: phhCityValue[i]};
    });
  });

  var xScale = d3.scale.ordinal()
    .domain(array.map(function(d) { return d.length; }))
    .rangeBands([0, width], 0);
  
  var x = d3.scale.ordinal()
    .domain(phhCityName)
    .rangeBands([0, xScale.rangeBand()]);

  var y = d3.scale.linear()
    .domain([0, d3.max(array, function(d) { 
    return d3.max(d.phhCityValue, function(d) { 
      return d.value; 
    }); 
    })])
    .range([height, 0]);

  if (toString.call(svgKwhPhhBar) !== "[object Array]") {
    removeAllBarChart("#detail-panel2");
    var svgKwhPhhBar = createkwhPhhBar(modi, "#detail-panel2", array, index);
  } 

  svgKwhPhhBar.enter()
    .append("rect")
    .attr("x", function(d) {return x(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x.rangeBand())
    .attr("height", function(d) {return height - y(d.value)})
    .attr("name", function(d) {return d.name})
    .attr("fill",function(d) { return colorOrdinal(d.name)})
    .append("title")
    .text(function(d) {return d.value});  

  svgKwhPhhBar.exit()
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();  

  svgKwhPhhBar //Update
    .attr("x", function(d) {return x(d.name)})
    .attr("y", function(d) {return y(d.value)})
    .attr("width",  x.rangeBand())
    .attr("height", function(d) {return height - y(d.value)});

  return svgKwhPhhBar;
}

function polygonInteraction (selection, pointer, color, max, min, modi, data) {
  var objectId = "", value = "", obj = [], index = 0, i = 0, array = [];

  $(".reset").on("click", function () {
    i = 0;      
  });

  selection.select("#Viertel_Flaeche").selectAll(pointer)
    .on("mouseover", function () {
      d3.select(this).attr("fill-opacity", .7);
    })
    .on("mouseout", function () {
      d3.select(this)
      .attr("fill-opacity", 1);
    })
    .on("click", function () {
      value = d3.select(this).attr("value");
      objectId = d3.select(this).attr("id");
      index = d3.select(this).attr("index");
      var kwhhead = picker("kwhhead", index);
      var kwhallphh = picker("kwhallphh", index);
      array = pickerArray();

      if (d3.select(this).attr("checked") == true) {
        d3.selectAll(".note").style("display", "block");
      } else {
        d3.selectAll(".note").style("display", "none");
      }

      if (d3.select(this).attr("checked") == null) {
        d3.selectAll(".note").style("display", "none");
      } else {
        d3.selectAll(".note").style("display", "block");
      }

      if (d3.select(this).attr("checked") == null) {
        d3.select(this).attr("checked", true);
        d3.select(this).attr("fill", selectedColor)
        .attr("fill-opacity", 1);
        
        createBar(modi, "#detail-panel", array, index, color[1]);
        
        if ((modi == "allphh") 
          || (modi == "einwohner") 
          || (modi == "kwhallphh")
          || (modi == "kwhhead") 
          || (modi == "wohndichte")) {
          if (modi == "allphh") {
            phhName = [];
            phhName.push("einphh");
            phhName.push("zweiphh");
            phhName.push("dreiphh");
            phhName.push("vierphh");
            phhName.push("fuenfphh");
            removeBarChart("#detail-panel2", index, modi);
            drawGroupBar(array, modi, index);
          }
          else if (modi == "einwohner") {
            phhName = [];
            phhName.push("residenteinphh");
            phhName.push("residentzweiphh");
            phhName.push("residentdreiphh");
            phhName.push("residentvierphh");
            phhName.push("residentfuenfphh");
            removeBarChart("#detail-panel2", index, modi);
            drawGroupBar(array, modi, index);
          }
          else if (modi == "kwhhead") {
            phhName = [];
            phhName.push("avgkwhheadeinphh");
            phhName.push("avgkwhheadzweiphh");
            phhName.push("avgkwhheaddreiphh");
            phhName.push("avgkwhheadvierphh");
            phhName.push("avgkwhheadfuenfphh");
            removeAllBarChart("#detail-panel2", index, modi);
            drawGroupBar(array, modi, index);
            //createPhhBar(modi, "#detail-panel2", array, index);            
          }
          else if (modi == "kwhallphh") {
            phhName = [];
            phhName.push("kwheinphh");
            phhName.push("kwhzweiphh");
            phhName.push("kwhdreiphh");
            phhName.push("kwhvierphh");
            phhName.push("kwhfuenfphh");
            removeBarChart("#detail-panel2", index, modi);
            drawGroupBar(array, modi, index);
          }
          else if (modi == "wohndichte") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else { console.log("Error")}
        }

        else if ((modi == "kwheinphh") 
          || (modi == "kwhzweiphh") 
          || (modi == "kwhdreiphh")
          || (modi == "kwhvierphh") 
          || (modi == "kwhfuenfphh")) {
          if (modi == "kwheinphh") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else if (modi == "kwhzweiphh") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else if (modi == "kwhdreiphh") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else if (modi == "kwhvierphh") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else if (modi == "kwhfuenfphh") {
            removeBarChart("#detail-panel2", index, modi);
            drawKwhBar(array, index, modi);
          }
          else { console.log("Error");} 
        }
        i += 1;
        groupedValues(i, true, modi, index, data, kwhhead[0].value, kwhallphh[0].value);
      } 
      else if (d3.select(this).attr("checked")){
        colorId(selection, value, d3.select(this).attr("id"), color, max, min);
        d3.select(this).attr("checked", null);

        removeBarChart("#detail-panel", index, modi);
        removeBarChart("#detail-panel2", index, modi);
                
        if ((modi == "kwheinphh") 
          || (modi == "kwhzweiphh") 
          || (modi == "kwhdreiphh")
          || (modi == "kwhvierphh") 
          || (modi == "kwhfuenfphh")
          || (modi == "wohndichte")) {
          var name = d3.select(this).attr("name");
          exitKwhBar(array, index, modi, name);
        }
        if ((modi == "einwohner")
          || (modi == "allphh")
          || (modi == "kwhallphh")
          || (modi == "kwhhead")) {
          var name = d3.select(this).attr("name");
          exitGroupBar(array, index, modi, name);
        }
        i -= 1;
        groupedValues(i, false, modi, index, data, kwhhead[0].value, kwhallphh[0].value);
      } 
    });
}

function initMap (data, value, color, max, min, modi) {
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
    innerSVG.attr('id', modi);

    for (var i = 0; i < data.length; ++i) {
      colorId(innerSVG, String(value[i]), data[i]["number"], color, max, min);
      //Tooltip and define polygons pointer
      innerSVG.select("[id='"+data[i]["number"]+"']")
      .attr("class", "pointer")
      .attr("value", String(value[i]))
      .attr("index", i)
      .attr("name", data[i]["stadtteil"])
      .append("title").text(function() {
         return data[i]["stadtteil"]+": "+String(new Intl.NumberFormat().format(value[i]));
      });
    }
    polygonInteraction(innerSVG, ".pointer", color, max, min, modi, data);

    $(".reset").on("click", function () {
      removeAllBarChart("#detail-panel");
      removeAllBarChart("#detail-panel2");
      d3.selectAll(".note").style("display", "block");
      phhCityValue = [];
      phhCityName = [];
      phhKey = [];
      groupValue = [];
      clearGroupedArray();
      for (var i = 0; i < data.length; i++) {
        colorId(innerSVG, String(value[i]), data[i]["number"], color, max, min);
      }
      innerSVG.select("#Viertel_Flaeche").selectAll(".pointer").attr("checked", null);
    });
  });
}

//////////////////////CSV DATASET CONTEXT//////////////////////////

d3.csv("data/2012-haushaltsgroesse-statdteil.csv", function (error, data) {
  if (error) throw error;

  valuesDetails(data);
  initMap(data, resident, linearGreen, 41814, 1084, "einwohner");
  legende(resident, "linear", linearGreen, "Einwohneranzahl", 0);
  allCityBarChart(data, "#detail-panel3", "Einwohneranzahl");

  function switchLegends (index) {
    switch (index) {
      case "0": 
        legende(resident, "linear", linearGreen, "Einwohneranzahl", 0);
        initMap(data, resident, linearGreen, 41814, 1084, "einwohner");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Einwohneranzahl");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "1":
        legende(diversity, "linear", linearRed, "Wohndichte", 1);
        initMap(data, diversity, linearRed, 13606, 170, "wohndichte");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Einwohner pro qkm");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "2":
        legende(energyHeadSumPhh, "linear", linearLila, "Stromverbrauch pro Kopf", 2);
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Durchschnitt Einwohner");        
        initMap(data, energyHeadSumPhh, linearLila, 1722, 1338, "kwhhead");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "3":
        legende(sumPhh, "linear", linearPink, "Gesamt Haushaltsgroessen", 3);
        initMap(data, sumPhh, linearPink, 25105, 459, "allphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl der Haushalte");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "4":
        legende(energySumPhh, "linear", linearOrange, "Gesamt Stromverbrauch", 4);
        removeAllBarChart("#detail-panel3");
        initMap(data, energySumPhh, linearOrange, 65481260, 1588240, "kwhallphh");
        allCityBarChart(data, "#detail-panel3", "Gesamtanzahl pro Haushalt");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "5":
        legende(sumOnePhh, "linear", linearBlue, "Stromverbrauch Ein-PHH", 5);
        initMap(data, sumOnePhh, linearBlue, 35009900, 264450, "kwheinphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl Ein-PHH");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "6":
        legende(sumTwoPhh, "linear", linearBlue, "Stromverbrauch Zwei-PHH", 6);
        initMap(data, sumTwoPhh, linearBlue, 18758320, 505680, "kwhzweiphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl Zwei-PHH");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "7":
        legende(sumThreePhh, "linear", linearBlue, "Stromverbrauch Drei-PHH", 7);
        initMap(data, sumThreePhh, linearBlue, 9481050, 360450, "kwhdreiphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl Drei-PHH");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "8":
        legende(sumFourPhh, "linear", linearBlue, "Stromverbrauch Vier-PHH", 8);
        initMap(data, sumFourPhh, linearBlue, 7281750, 361000, "kwhvierphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl Vier-PHH");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break;
      case "9":
        legende(sumFivePhh, "linear", linearBlue, "Stromverbrauch Fuenf-PHH", 9);
        initMap(data, sumFivePhh, linearBlue, 4602090, 96660, "kwhfuenfphh");
        removeAllBarChart("#detail-panel3");
        allCityBarChart(data, "#detail-panel3", "Anzahl Fuenf-PHH");
        d3.selectAll("#tab2").selectAll(".note").style("display", "block");
      break; 
    }  
  }

  var prev = "0";
  var radioIndex = "0";
  legende(resident, linearGreen, "Einwohneranzahl", 0);

  $("input[name='modi']").on("click",function(){
    radioIndex =  $(this).val();
    if (radioIndex == prev) { 
      console.log("do nothing");
    }
    else if (!$(this).checked && radioIndex != prev) {
      d3.selectAll("#legende [class='"+prev+"']").remove();
      d3.select("#main-panel svg").transition().delay(10).remove();
      prev = radioIndex;
      switchLegends(radioIndex);
      clearGroupedArray();
      removeAllBarChart("#detail-panel2");
      phhCityValue = [];
      phhCityName = [];
      phhKey = [];
      groupValue = [];
    }   
  });
});