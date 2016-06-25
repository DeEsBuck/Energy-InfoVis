
// Kategorien Werte für Map und legende
var sumPhh = []; //Alle haushalte je statdteil
var dataname = []; //Stadtteil Namen
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

var groupResidents = 0;
var groupEnergy = 0;
var groupEnergyHead = 0;
var groupPhh = 0;
var groupSize = 0;

var red = d3.rgb(222,45,38);
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
    resident.push(+data[j]["einwohner"]);

    for (l = 0; l < countPhh(data).length; l++) {
      energyheadPhh[l] = energyPhh[l]/(l+1);
    }
    onePhh.push(+data[j]["einphh"]);
    twoPhh.push(+data[j]["zweiphh"]);
    threePhh.push(+data[j]["dreiphh"]);
    fourPhh.push(+data[j]["vierphh"]);
    fivePhh.push(+data[j]["funfphh"]); 

    energyHeadSumPhh.push(Math.floor((
      onePhh[j]*energyheadPhh[0]+
      twoPhh[j]*2*energyheadPhh[1]+
      threePhh[j]*3*energyheadPhh[2]+
      fourPhh[j]*4*energyheadPhh[3]+
      fivePhh[j]*5*energyheadPhh[4])/resident[j]));

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

function polygonInteraction (selection, pointer, color, max, min, modi) {
  var objectId = "", value = "", obj = [];
  createBar(modi, '#detail-panel');
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

      if (d3.select(this).attr("checked") == null) {
        d3.select(this).attr("checked", true);
        d3.select(this).attr("fill", color[1].darker(1.1))
        .attr("fill-opacity", 1);
        
        obj = addBar(modi, objectId, value);
        console.log('add this: '+obj.id+' of '+obj.key+' with '+obj.value);

      } 
      else if (d3.select(this).attr("checked")){
        colorId(selection, value, d3.select(this).attr("id"), color, max, min);
        d3.select(this).attr("checked", null);

        console.log('remove this: '+objectId+' for real '+obj.value);
        obj = removeBar(objectId);
        try {
          console.log('remove this: '+objectId+' for real '+obj.id);
        }
        catch (e) {
          console.log('removed: '+e);
        }
      }
    });
    return objectId;
}

var bucketView = [{}];
function addBar (key, id, value) {
  bucketView = d3.map([{key: key, id: id, value: value}],
    function (d) {
      return d.key;
    });  
  console.log(bucketView.values());
  return bucketView.get(key);
}

function removeBar (id) {
  bucketView.remove(id);
  return bucketView.get(id);
}

function createBar (name, panelName) {
  var h = 260, w = $(panelName).innerWidth;

  console.log('create barChart: '+name);
  /*var svg = d3.select(panelName)
    .append("svg")
    .attr("width", w)
    .attr("height", h);*/

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
      .append("title").text(function() {
         return "ID: "+data[i]["number"]+", Wert: "+String(value[i]);
      });
    }
    polygonInteraction(innerSVG, ".pointer", color, max, min, modi);
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
          &&key !== "stadtteil"
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
  initMap(data, resident, linearGreen, 41814, 1084, "einwohner");

  function switchLegends (index) {
    switch (index) {
      case "0": 
        legende(resident, linearGreen, "Einwohneranzahl", 0);
        initMap(data, resident, linearGreen, 41814, 1084, "einwohner");
      break;
      case "1":
        legende(diversity, linearRed, "Wohndichte", 1);
        initMap(data, diversity, linearRed, 13606, 170, "wohndichte");
      break;
      case "2":
        legende(energyHeadSumPhh, linearLila, "Stromverbrauch pro Kopf", 2);
        initMap(data, energyHeadSumPhh, linearLila, 1722, 1338, "kwhhead");
      break;
      case "3":
        legende(sumPhh, linearGray, "Gesamt Haushaltsgroessen", 3);
        initMap(data, sumPhh, linearGray, 25105, 459, "allphh");
      break;
      case "4":
        legende(energySumPhh, linearOrange, "Gesamt Stromverbrauch", 4);
        initMap(data, energySumPhh, linearOrange, 65481260, 1588240, "kwhallphh");
      break;
      case "5":
        legende(sumOnePhh, linearBlue, "Stromverbrauch Ein-PHH", 5);
        initMap(data, sumOnePhh, linearBlue, 35009900, 264450, "kwheinphh");
      break;
      case "6":
        legende(sumTwoPhh, linearBlue, "Stromverbrauch Zwei-PHH", 6);
        initMap(data, sumTwoPhh, linearBlue, 18758320, 505680, "kwhzweiphh");
      break;
      case "7":
        legende(sumThreePhh, linearBlue, "Stromverbrauch Drei-PHH", 7);
        initMap(data, sumThreePhh, linearBlue, 9481050, 360450, "kwhdreiphh");
      break;
      case "8":
        legende(sumFourPhh, linearBlue, "Stromverbrauch Vier-PHH", 8);
        initMap(data, sumFourPhh, linearBlue, 7281750, 361000, "kwhvierphh");
      break;
      case "9":
        legende(sumFivePhh, linearBlue, "Stromverbrauch Fuenf-PHH", 9);
        initMap(data, sumFivePhh, linearBlue, 4602090, 96660, "kwhfünfphh");
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
    }   
  });



////////////////Balken diagramme für Detail Panel////////////////////



  groupedBarChart(data, "#detail-panel3");
 
   
});
