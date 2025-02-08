// Define the width and height of the map and bar chart
const mapWidth = 1000;
const mapHeight = 700;
const barWidth = 500;
const barHeight = 700;

// Create SVG elements for the map and bar chart
const mapSvg = d3.select("#map");
const barSvg = d3.select("#barChart");

// Define a projection and path generator for the map
const projection = d3.geoMercator()
  .scale(150)
  .translate([mapWidth / 2, mapHeight / 1.5]);
const path = d3.geoPath().projection(projection);

function showTooltip(countryName, participantCount, event) {
  d3.select(".tooltip")
    .style("display", "block")
    .html(`<strong>${countryName}</strong><br>Participants: ${participantCount}`)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px");
}

function highlightCountry(countryName) {
  const countries = mapSvg.selectAll(".country");
  countries
    .classed("dimmed", d => d.properties.name !== countryName)
    .classed("highlighted", d => d.properties.name === countryName);
  
  bars
    .classed("dimmed", d => d.Country !== countryName)
    .classed("highlighted", d => d.Country === countryName);
}

function clearHighlight() {
  const countries = mapSvg.selectAll(".country");
  countries.classed("dimmed", false).classed("highlighted", false);
  bars.classed("dimmed", false).classed("highlighted", false);
  d3.select(".tooltip").style("display", "none");
}

// Load GeoJSON and participant data
let participantData;
let colorScale;
let bars;

const loadData = (isWinnerData) => {
  const dataFile = isWinnerData ? "../static/data/Country_Winner_Count.csv" : "../static/data/Country_Particpation_Count.csv";
  const colorScheme = isWinnerData ? d3.schemeGreens[5] : d3.schemeBlues[5];

  Promise.all([
    d3.json("https://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
    d3.csv(dataFile)
  ]).then(([geoData, data]) => {
    participantData = data;
    const participantByCountry = {};
    participantData.forEach(d => {
      participantByCountry[d.Country] = +d["Participant Count"];
    });

    // Create a color scale for the map
    colorScale = d3.scaleThreshold()
      .domain([1, 5, 15, 50, 100])
      .range(colorScheme);

    // Draw the map
    const countries = mapSvg.selectAll(".country")
      .data(geoData.features)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", d => {
        const countryName = d.properties.name;
        const participantCount = participantByCountry[countryName] || 0;
        return colorScale(participantCount);
      })
      .on("mouseover", function(event, d) {
        const countryName = d.properties.name;
        const participantCount = participantByCountry[countryName] || 0;
        showTooltip(countryName, participantCount, event);
        highlightCountry(countryName);
      })
      .on("mousemove", function(event) {
        d3.select(".tooltip")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", clearHighlight);

    // Add legend to the map
    const legend = mapSvg.select(".legend").remove();
    const newLegend = mapSvg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20, 20)");

    const legendData = [0, 1, 5, 15, 50, 100];
    const legendColors = legendData.map(d => colorScale(d));

    newLegend.selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d, i) => legendColors[i]);

    newLegend.selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => i * 20 + 15)
      .text(d => d > 200 ? `>200` : `${d}`);

    // Sort data by participant count for the bar chart
    participantData.sort((a, b) => d3.descending(+a["Participant Count"], +b["Participant Count"]));

    // Create scales for the bar chart
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(participantData, d => +d["Participant Count"])])
      .range([0, barWidth - 220]);

    const yScale = d3.scaleBand()
      .domain(participantData.map(d => d.Country))
      .range([50, barHeight - 20])
      .padding(0.1);

    // Clear previous bar chart
    barSvg.selectAll("*").remove();

    // Add title to the bar chart
    barSvg.append("text")
      .attr("x", barWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(isWinnerData ? "Winners by Country" : "Participants by Country");

    // Create bar chart
    bars = barSvg.selectAll(".bar-group")
      .data(participantData)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    // Add country labels
    bars.append("text")
      .attr("class", "bar-label")
      .attr("x", 10)
      .attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.Country)
      .style("text-anchor", "start");

    // Add bars with animation
    bars.append("rect")
      .attr("class", "bar")
      .attr("x", 140)
      .attr("y", d => yScale(d.Country))
      .attr("height", yScale.bandwidth())
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", d => xScale(+d["Participant Count"]))
      .attr("fill", isWinnerData ? "#4CAF50" : "steelblue");

    // Add value labels
    bars.append("text")
      .attr("class", "bar-value")
      .attr("x", d => xScale(+d["Participant Count"]) + 145)
      .attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d["Participant Count"])
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add hover interaction for bar chart
    bars
      .on("mouseover", function(event, d) {
        showTooltip(d.Country, d["Participant Count"], event);
        highlightCountry(d.Country);
      })
      .on("mousemove", function(event) {
        d3.select(".tooltip")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", clearHighlight);
  }).catch(err => console.error(err));
};

// Initial load with participation data
loadData(false);

// Toggle between participation and winner data
document.getElementById("toggleButton").addEventListener("change", function() {
  loadData(this.checked);
});