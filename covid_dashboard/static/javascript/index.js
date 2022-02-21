function create_summary_table(summaryContent) {
    var dataset = summaryContent;
    $(document).ready(function() {
        $('#all-countries-table').DataTable( {
            "scrollY":        "250px",
            "scrollCollapse": true,
            "paging":         false,
            "data": dataset,
            "columns": [
                { "title": "Country" },
                { "title": "Cases" },
                { "title": "New Cases" },
                { "title": "Deaths" },
                { "title": "New Deaths" },
                { "title": "Vaccinated" },
                { "title": "New Vaccinations" },
            ],
            columnDefs: [
                {targets: [1,3,5],
                    className: 'dt-center',
                    render: function (data, type, row) {
                        var color = 'black';
                        return '<span style="color:' + color + '">' + data + '</span>';
                    }
                },
                {targets: [2,4],
                    className: 'dt-center',
                    render: function ( data, type, row ) {
                      var color = 'black';
                      if (data < 0) {
                        color = 'green';
                      } 
                      if (data > 0) {
                        color = 'red';
                      }
                      return '<span style="color:' + color + '">' + data + '</span>';
                    }
                },
                {targets: 6,
                    className: 'dt-center',
                    render: function ( data, type, row ) {
                      var color = 'black';
                      if (data > 0) {
                        color = 'green';
                      }
                      return '<span style="color:' + color + '">' + data + '</span>';
                    }
                }
            ]
        } );
    } );
}

let countries, population, mapChart, countryChart;
const getConfig = e => ({
    confirmed: {
      day: 0,
      header: "Confirmed Covid-19 Cases",
      name: "Confirmed cases",
      valueSuffix: "confirmed cases"
    },
    deaths: {
      day: 0,
      header: "Deaths caused by Covid-19",
      name: "Deaths",
      valueSuffix: "deaths"
    }
  } [e]),
  createMap = (e = "confirmed") => { 
    const t = getConfig(e);
    document.getElementById("map-header").innerHTML = t.header;
    const a = Highcharts.geojson(Highcharts.maps["custom/africa"]),
      o = {};
    a.forEach((function(e) {
      e.id = e.properties["hc-key"];
      const t = population.find((t => e.properties["hc-key"].toUpperCase() === t.code));
      o[e.name] = t && t.z || null
    }));
    let n = 0;
    const r = Object.keys(countries).map((t => {
      const a = countries[t],
        r = a[a.length - 1][e];
      if (o[t]) {
        const e = r / o[t];
        return o[t] > 1e3 && (n = Math.max(e, n)), {
          name: t,
          value: e,
          total: r
        }
      }
      return {
        name: t,
        value: null
      }
    }));
    mapChart || (mapChart = Highcharts.mapChart("container", {
      chart: {
        spacingLeft: 1,
        spacingRight: 1
      },
      mapNavigation: {
        enabled: !0,
        buttonOptions: {
          verticalAlign: "bottom"
        }
      },
      colorAxis: {
        minColor: "rgba(196, 0, 0, 0.1)",
        maxColor: "rgba(196, 0, 0, 1)"
      },
      tooltip: {
        headerFormat: "<b>{point.point.name}</b><br>",
        footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
      },
      legend: {
        title: {
          text: "Per 1000 inhabitants",
          style: {
            fontWeight: "normal"
          }
        }
      },
      series: [{
        id: "map",
        mapData: a,
        joinBy: ["name", "name"],
        cursor: "pointer",
        states: {
          select: {
            color: void 0,
            borderColor: "#333"
          }
        },
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)"
      }]
    })), mapChart.update({
      colorAxis: {
        max: n
      },
      tooltip: {
        pointFormat: "<b>{point.total}</b> " + t.valueSuffix + "<br><b>{point.value:.2f}</b> per 1000 inhabitants<br>"
      },
      series: [{
        data: r,
        name: t.name
      }]
    }, !0, !0);
    const i = a => {
      a && a.target && a.target.point && (a.preventDefault(), a.target.point.select(null, a.ctrlKey || a.metaKey || a.shiftKey || "touchstart" == a.type), a.target.point.selected && a.target.point.graphic.toFront());
      const o = mapChart.getSelectedPoints();
      if (o.length) {
        a && a.type, 1 == o.length ? (document.querySelector("#info .header-text").style.paddingLeft = "40px", document.querySelector("#info .header-text").innerHTML = o[0].name, document.querySelector("#info .subheader").innerHTML = `${t.name}, starting the day of the ${t.day0Value}th case<br>`, a && "touchstart" === a.type ? document.querySelector("#info .subheader").innerHTML += "<small><em>Tap on map to compare multiple countries</em></small>" : document.querySelector("#info .subheader").innerHTML += "<small><em>Shift+Click on map to compare multiple countries</em></small>") : (document.querySelector("#info .header-text").style.paddingLeft = 0, document.querySelector("#info .header-text").innerHTML = "Comparing countries", document.querySelector("#info .subheader").innerHTML = `${t.name}, starting the day of the ${t.day0Value}th case<br>`), countryChart || (countryChart = Highcharts.chart("country-chart", {
          chart: {
            spacingLeft: 0
          },
          credits: {
            enabled: !1
          },
          title: {
            text: null
          },
          subtitle: {
            text: null
          },
          xAxis: {
            crosshair: !0,
            allowDecimals: !1,
            labels: {
              format: "Day #{value}"
            }
          },
          yAxis: {
            title: null,
            opposite: !0
          },
          tooltip: {
            headerFormat: "<small>{series.name}</small><br>"
          },
          legend: {
            enabled: !1
          },
          plotOptions: {
            series: {
              animation: {
                duration: 50
              },
              label: {
                enabled: !0
              },
              marker: {
                enabled: !1
              },
              threshold: 0
            }
          }
        }));
        const n = [],
          r = o.filter((e => countries[e.name])).map((a => {
            n.push(a.id);
            const r = countries[a.name].findIndex((a => a[e] >= t.day0Value)),
              i = countries[a.name].slice(Math.max(r - 1, 0)).map(((t, a) => {
                const [o, n, r] = t.date.split("-");
                return {
                  date: Date.UTC(o, n - 1, r),
                  x: a,
                  y: t[e]
                }
              }));
            return {
              id: a.id,
              name: a.name,
              data: i,
              type: o.length > 1 ? "line" : "area",
              color: o.length > 1 ? void 0 : "#aa0000",
              fillColor: o.length > 1 ? void 0 : a.color
            }
          }));
        countryChart.update({
          series: r,
          tooltip: {
            pointFormat: "<b>Day {point.x}: {point.date:%b %e, %Y}</b><br>{point.y} " + t.valueSuffix
          }
        }, !0, !0), location.hash = n.join(",")
      } else document.querySelector("#info .header-text").innerHTML = "", document.querySelector("#info .subheader").innerHTML = "", countryChart && (countryChart = countryChart.destroy())
    };
    mapChart.container.querySelectorAll(".highcharts-point").forEach((e => {
      e.addEventListener("click", i), e.addEventListener("touchstart", i)
    })), selected.split(",").forEach((e => {
      if (/^[a-z]{2}$/.test(e)) {
        mapChart.get(e) && mapChart.get(e).select(!0, !0)
      }
    })), i()
  },
  activateButtons = () => {
    const e = document.querySelectorAll('input[name="source"]');
    e.forEach((t => {
      t.addEventListener("click", (() => {
        t.parentNode.classList.add("active"), e.forEach((e => {
          e !== t && e.parentNode.classList.remove("active")
        })), createMap(t.id)
      }))
    }))
  };
document.addEventListener("DOMContentLoaded", (async function() {
  const e = await fetch("https://pomber.github.io/covid19/timeseries.json");
  countries = await e.json();
  const t = await fetch("https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json");
  population = await t.json(), activateButtons(), createMap()
}));

function draw_average_cases(content) {

var location_cases = {};
var dates = [];
var last_date = undefined;

content.forEach((row) => {
    var location_ = row[0];
    var datestamp = row[1];
    var n_cases = row[2];

    var cur_location = location_cases[location_];
    if (cur_location === undefined) {
        location_cases[location_] = {
            name: location_,
            data: [n_cases],
            date_recorded: [datestamp]
        };
    } else {
        cur_location.data.push(n_cases);
        cur_location.date_recorded.push(datestamp);
    }

    if (datestamp != last_date) {
        last_date = datestamp;
        dates.push(datestamp);
    }
});

var main_data = []
const countries = Object.keys(location_cases);
for (var i=0; i < countries.length; i += 1) {
    var country = countries[i]
    var xValues = location_cases[country].date_recorded
    var yValues = location_cases[country].data

    var data = [{
        type: 'scatter',
        name: country,
        meta: [country],
        x: xValues,
        y: yValues,
        mode: 'lines',
        hovertemplate: '%{x} <br> %{meta[0]}: %{y} cases <extra></extra>'
    }];

    main_data.push(data[0])
}

var layout = {
    title: 'Average Number of New Cases per Week',
    height: 600,
    xaxis: {
        showgrid: false,
        linecolor: 'black',
        rangeselector: {buttons: [
            {
                count: 1,
                label: '1m',
                step: 'month',
                stepmode: 'backward'
            },
            {
                count: 3,
                label: '3m',
                step: 'month',
                stepmode: 'backward'
            },
            {
                count: 6,
                label: '6m',
                step: 'month',
                stepmode: 'backward'
            },
            {
                count: 1,
                label: '1y',
                step: 'year',
                stepmode: 'backward'
            },
            {
                step: 'all'
            }
        ]}
    },
    yaxis: {
        title: {text: 'Number of New Cases'}
    },
    hovermode: 'closest',
    hoverlabel: {bgcolor: 'white'},
    legend: {text: 'country'},
};

Plotly.newPlot("average-cases", main_data, layout);
};
