// Example data
const sample = [{
    country: 'Country1',
    all: 99.9,
    year: 13.0,
    month: 46.0,
    week: 42.0
  },
  {
    country: 'Country2',
    all: 75.1,
    year: 45.0,
    month: 96.0,
    week: 32.0
  },
  {
    country: 'Country3',
    all: 68.0,
    year: 83.0,
    month: 13.0,
    week: 23.0
  },
  {
    country: 'Country4',
    all: 67.0,
    year: 74.2,
    month: 66.0,
    week: 54.0
  },
  {
    country: 'Country5',
    all: 65.6,
    year: 93.0,
    month: 26.0,
    week: 78.0
  },
  {
    country: 'Country6',
    all: 65.1,
    year: 33.0,
    month: 67.0,
    week: 88.0
  },
  {
    country: 'Country7',
    all: 61.9,
    year: 13.0,
    month: 65.0,
    week: 37.0
  },
  {
    country: 'Country8',
    all: 60.4,
    year: 23.0,
    month: 57.0,
    week: 99.0
  },
  {
    country: 'Country9',
    all: 59.6,
    year: 1.0,
    month: 88.0,
    week: 54.0
  },
  {
    country: 'Country10',
    all: 59.6,
    year: 63.0,
    month: 67.0,
    week: 33.0
  },
  {
    country: 'Country11',
    all: 75.1,
    year: 19.0,
    month: 62.0,
    week: 84.0
  },
  {
    country: 'Country12',
    all: 68.0,
    year: 45.0,
    month: 56.0,
    week: 13.0
  },
  {
    country: 'Country13',
    all: 67.0,
    year: 57.0,
    month: 68.0,
    week: 36.0
  },
  {
    country: 'Country14',
    all: 65.6,
    year: 79.0,
    month: 78.0,
    week: 94.0
  },
  {
    country: 'Country15',
    all: 65.1,
    year: 33.0,
    month: 96.0,
    week: 37.0
  },
  {
    country: 'Country16',
    all: 61.9,
    year: 93.0,
    month: 63.0,
    week: 38.0
  },
  {
    country: 'Country17',
    all: 60.4,
    year: 57.0,
    month: 76.0,
    week: 48.0
  },
  {
    country: 'Country18',
    all: 59.6,
    year: 83.0,
    month: 6.0,
    week: 36.0
  },
  {
    country: 'Country19',
    all: 59.6,
    year: 29.0,
    month: 23.0,
    week: 189.0
  }
];


// pass in key for time frame being looked at
function updateGraph(dataSet, timeFrame) {
    const presentedSet = [];
    for (let i = 0; i < dataSet.length; i++) {
        var obj = dataSet[i];
        var map = {};
        map['country'] = obj['country'];
        map['dataValue'] = obj[timeFrame];
        presentedSet.push(map);
    }

    // Where g is the drawn svg graph. Allows new axes and bars to be drawn
    d3.selectAll("g").remove();

    const margin = ({top: 20, right: 0, bottom: 30, left: 20})
    height = 500
    width = 700

    x = d3.scaleBand()
        .domain(presentedSet.map(d => d.country))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.4)

    y = d3.scaleLinear()
        .domain([0, d3.max(presentedSet, d => d.dataValue)])
        .range([height - margin.bottom, margin.top])

    xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    yAxis = g => g
        .call(d3.axisLeft(y).ticks(15))

    yTitle = g => g.append("text")
        .attr("y", 10)
        .attr("x", -60)
        .text("Number of cases")

    tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("font-family", "'Open Sans', sans-serif")
        .style("font-size", "15px")
        .style("background-color", "white")
        .style("border", "solid 2px")
        .style("border-color", "#8087ba")
        .style("padding", "5px")
        .style("border-radius", "2px")
        .style("visibility", "hidden");

    var svg = d3.select('#cases');

    var chart = svg.append('g')
            .attr('transform', `translate(80, 50)`);

    chart.append("g")
    .selectAll("rect")
    .data(presentedSet)
    .enter().append("rect")
        .attr("id", "casesChart")
        .attr('x', d => x(d.country))
        .attr('y', d => y(d.dataValue))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.dataValue))
        .style("padding", "3px")
        .style("margin", "1px")
        .style("width", d => '${d * 10}px')
        .text(d => d)
        .attr("fill", "#8087ba")
        .attr("stroke", "#8087ba")
        .attr("stroke-width", 1)
    .on("mouseover", function(d) {
        tooltip.style("visibility", "visible").html(d.country + "<br>cases: " + d.dataValue);
        d3.select(this).attr("fill", "#b6bbe1");
    })
    .on("mousemove", d => tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")
        .html(d.country + "<br>cases: " + d.dataValue))
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", "#8087ba")
    });

    chart.append("g")
        .call(xAxis);
    chart.append("g")
        .call(yAxis);
    chart.call(yTitle);
}

function initiateGraphs(data) {
  
  //radio buttons
  d3.select(("label[value='all']")).on("click", function() {
      updateGraph(data, "all");
  });
  d3.select(("label[value='year']")).on("click", function() {
      updateGraph(data, "year");
  });
  d3.select(("label[value='month']")).on("click", function() {
      updateGraph(data, "month");
  });
  d3.select(("label[value='week']")).on("click", function() {
      updateGraph(data, "week");
  });

  updateGraph(data, "all")
}

initiateGraphs(sample)