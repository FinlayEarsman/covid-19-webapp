function create_summary_table(summaryContent) {
    
    // Slimmed summary removes unneccessary fields from summaryContext
    var slimmed_summary = [];
    summaryContent.forEach(country => {
        var location = country[0]
        var cases = country[3];
        var new_cases = country[4];
        var deaths = country[6];
        var new_deaths = country[7];
        var vaccinations = country[9];
        var new_vaccinations = country[10];
        slimmed_country = [location, cases, new_cases, deaths, new_deaths, vaccinations, new_vaccinations];
        slimmed_summary.push(slimmed_country)
    });

    var dataset = slimmed_summary;
    $('#all-countries-table').DataTable( {
        language: {
            searchPlaceholder: "Search table...",
            search: "",
        },
        "scrollY":        "250px",
        "scrollCollapse": true,
        "paging":         false,
        "data": summaryContent,
        "columns": [
            { "title": "Country" },
            { "title": "Cases" },
            { "title": "New Cases"},
            { "title": "Deaths" },
            { "title": "New Deaths" },
            { "title": "Vaccinated" },
            { "title": "New Vaccinations" },
        ],
        columnDefs: [
            {   type: 'num-html',
                targets: [1,3,5],
                className: 'dt-justify',
                render: function (data, type, row) {
                    if (data == null){
                        return "<span style=color:black><i>No data</i></span>";
                    }
                    var color = 'black';
                    return '<span style="color:' + color + '">' + data + '</span>';
                }
            },
            {   type: 'num-html',
                targets: [2,4],
                className: 'dt-justify',
                render: function ( data, type, row ) {
                    if (data == null){
                        return "<span style=color:black><i>No data</i></span>";
                    }
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
            {   type: 'num-html',
                targets: 6,
                className: 'dt-justify',
                render: function ( data, type, row ) {
                    if (data == null){
                        return "<span style=color:black><i>No data</i></span>";
                    }
                    console.log(data);
                    var color = 'black';
                    if (data > 0) {
                    color = 'green';
                    }
                    return '<span style="color:' + color + '">' + data + '</span>';
                }
            }
        ]
    } );
}


function insert_weekly_maxs(weeklyMaxsContent) {
    // request returns list containing three sublists
    var box_type = ["case", "death", "vacc"];
    // loop over each sublist
    weeklyMaxsContent.forEach((item, index) => {
        var table = document.getElementById(box_type[index] + '-table');
        // each sublist contains 5 country names and corresponding numbers
        for (let i = 0; i < item.length; i++) {
            var newRow = table.insertRow(-1);

            var countryCol = newRow.insertCell(0);
            var numCol = newRow.insertCell(1);

            countryCol.innerHTML = item[i][0];
            numCol.innerHTML = "+"+item[i][1];
        }
    });
}


function draw_map(content) {

    var location_cases = {}

    content.forEach((row) => {
        var location_ = row[0];
        var n_cases = row[2];

        var cur_location = location_cases[location_];
        if (cur_location === undefined) {
            location_cases[location_] = {
                name: location_,
                data: [n_cases],
            };
        } else {
            cur_location.data.push(n_cases)
        }
    });

    // Dictionary from Highcharts hc-key mappings from country names
    var convert = {'Uganda':'ug', 'Nigeria':'ng',
        'Sao Tome and Principe':'st', 'Tanzania':'tz', 'Sierra Leone':'sl',
        'Guinea-Bissau':'gw', 'Cape Verde':'cv', 'Seychelles':'sc',
        'Tunisia':'tn', 'Madagascar':'mg', 'Kenya':'ke',
        'Democratic Republic of Congo':'cd', 'France':'fr', 'Mauritania':'mr',
        'Algeria':'dz', 'Eritrea':'er', 'Equatorial Guinea':'gq',
        'Mauritius':'mu', 'Senegal':'sn', 'Comoros':'km',
        'Ethiopia':'et', 'Cote d\'Ivoire':'ci', 'Ghana':'gh',
        'Zambia':'zm', 'Namibia':'na', 'Rwanda':'rw',
        'Somaliland':'sx', 'Somalia':'so', 'Cameroon':'cm',
        'Congo':'cg', 'Western Sahara':'eh', 'Benin':'bj',
        'Burkina Faso':'bf', 'Togo':'tg', 'Niger':'ne',
        'Libya':'ly', 'Liberia':'lr', 'Malawi':'mw',
        'Gambia':'gm', 'Chad':'td', 'Gabon':'ga',
        'Djibouti':'dj', 'Burundi':'bi', 'Angola':'ao',
        'Guinea':'gn', 'Zimbabwe':'zw', 'South Africa':'za',
        'Mozambique':'mz', 'Eswatini':'sz', 'Mali':'ml',
        'Botswana':'bw', 'Sudan':'sd', 'Morocco':'ma',
        'Egypt':'eg', 'Lesotho':'ls', 'South Sudan':'ss',
        'Central African Republic':'cf'
    }

    var map_arr = []
    for (var key in location_cases) {
        var hc_key = convert[key];
        if (hc_key != undefined) {
            var country = location_cases[key];
            // For seeing all cases on map
            var summed_cases = country.data.reduce((a, b) => a+b, 0);
            // Finding cases in most recent week
            var all_cases_arr = country.data;
            var recent_week_cases = all_cases_arr[all_cases_arr.length-1];

            if (recent_week_cases > 0 && recent_week_cases != null) {
                map_arr.push([hc_key, recent_week_cases]);
            } else {
                map_arr.push([hc_key, 0]);
            }
        }
    }

    Highcharts.mapChart('choropleth', {
        chart: {
            map: 'custom/africa',
            height: (9/16*100)+'%'
        },

        title:false,
        legend: {
            enabled: false
        },

        /* For when data is normalised
        colorAxis: {
            minColor: '#80ff80',
            maxColor: '#ff8080'
        }, */

        series: [{
            data: map_arr,
            name: 'Weekly cases',
            color: '#b3b3b3',
            states: {                
                hover: {
                    color: '#cccccc',
                    borderColor: 'red'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
}

async function draw_average_cases(content) {

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
countries.sort();
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

var start_graph_date = await start_date_of_graph(last_date);

var layout = {
    margin: {
        l: 50,
        r: 20,
        t: 20,
        b: 50,
        pad: 0
    },
    xaxis: {
        fixedrange: true,
        showgrid: false,
        linecolor: 'black',
        range: [start_graph_date, last_date],
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
        title: {text: 'Number of New Cases'},
        fixedrange: true
    },
    hovermode: 'closest',
    hoverlabel: {bgcolor: 'white'},
    legend: {text: 'country'},
};
var config = {responsive: true};
Plotly.newPlot("average-cases", main_data, layout, config);
};

function draw_countries_vaccinations(content) {
    var location_vaccines = {};

    content.forEach((row) => {
        var location_ = row[0];
        var first_dose = row[5];
        var second_dose = row[6];
        var third_dose = row[7];

        if (first_dose == null) {
            first_dose = 0
        }
        if (second_dose == null) {
            second_dose = 0
        }
        if (third_dose == null) {
            third_dose = 0
        }

        var cur_location = location_vaccines[location_];
        if (cur_location === undefined) {
            location_vaccines[location_] = {
                name: location_,
                first_dose: first_dose,
                second_dose: second_dose,
                third_dose: third_dose
            };
        }
    });

    main_data = []
    var country_names = Object.keys(location_vaccines);
    for (var i=country_names.length-1; i >= 0; i -= 1) {
        var country = country_names[i]
        var percentage_first_dose = location_vaccines[country].first_dose
        var percentage_second_dose = location_vaccines[country].second_dose
        var percentage_third_dose = location_vaccines[country].third_dose

        var first_dose_data = {
            type: 'bar',
            name: country,
            meta: [country],
            x: [percentage_first_dose],
            y: [country],
            orientation: 'h',
            text: percentage_first_dose + '%',
            textposition: 'outside',
            marker: {
                color: 'orange'
            },
            hovertemplate: '<b><span style="color:orange">First Dose</span>\
                            <br>%{meta[0]}:</b> %{x}%<extra></extra>',
            legendgroup: country
        };

        var second_dose_data = {
            type: 'bar',
            name: country,
            meta: [country],
            x: [percentage_second_dose],
            y: [country],
            xaxis: 'x2',
            yaxis: 'y',
            orientation: 'h',
            text: percentage_second_dose + '%',
            textposition: 'outside',
            marker: {
                color: 'green'
            },
            hovertemplate: '<b><span style="color:green">Second Dose</span>\
                            <br>%{meta[0]}:</b> %{x}%<extra></extra>',
            legendgroup: country,
            showlegend: false
        }

        var third_dose_data = {
            type: 'bar',
            name: country,
            meta: [country],
            x: [percentage_third_dose],
            y: [country],
            xaxis: 'x3',
            yaxis: 'y',
            orientation: 'h',
            text: percentage_third_dose + '%',
            textposition: 'outside',
            marker: {
                color: 'brown'
            },
            hovertemplate: '<b><span style="color:brown">Third Dose</span>\
                            <br>%{meta[0]}:</b> %{x}%<extra></extra>',
            legendgroup: country,
            showlegend: false
        }

        main_data.push(first_dose_data)
        main_data.push(second_dose_data)
        main_data.push(third_dose_data)
    }

    var layout = {
        margin: {
            l: 50,
            r: 20,
            t: 20,
            b: 50,
            pad: 0
        },
        barmode: 'group',
        height: 1000,
        legend: {'traceorder':'reversed'},
        grid: {
            columns: 3,
            subplots:[['xy', 'x2y', 'x3y']],
            roworder:'bottom to top'
        },
        xaxis: {
            'range': [0, 100],
            'zeroline': false,
            'showticklabels': false,
            'visible': true,
            side: 'top',
            title: {
                text: 'First Dose',
                font: {
                    color: 'orange',
                }
            },
            fixedrange: true
        },
        xaxis2: {
            'range': [0, 100],
            'zeroline': false,
            'showticklabels': false,
            'visible': true,
            side: 'top',
            title: {
                text: 'Second Dose',
                font: {
                    color: 'green'
                }
            },
            fixedrange: true
        },
        xaxis3: {
            'range': [0, 100],
            'zeroline': false,
            'showticklabels': false,
            'visible': true,
            side: 'top',
            title: {
                text: 'Third Dose',
                font: {
                    color: 'brown'
                }
            },
            fixedrange: true
        },
        yaxis: {
            bargap: 0.5,
            'showgrid':true,
            automargin: true,
            fixedrange: true
        },
        hoverlabel: {bgcolor: 'white'},
        hovermode: 'closest'
    };
    var config = {responsive: true};
    Plotly.newPlot("countries-vaccinations", main_data, layout, config);
};


async function draw_country_new_vaccinations(content) {

    var location_vaccinations = {};
    var dates = [];
    var last_date = undefined;
    
    content.forEach((row) => {
        var location_ = row[0];
        var datestamp = row[1];
        var n_vaccines = row[2];
        var n_avg_vaccines = row[3];
    
        var cur_location = location_vaccinations[location_];
        if (cur_location === undefined) {
            location_vaccinations[location_] = {
                name: location_,
                vaccine_data: [n_vaccines],
                avg_vaccine_data: [n_avg_vaccines],
                date_recorded: [datestamp]
            };
        } else {
            cur_location.vaccine_data.push(n_vaccines);
            cur_location.avg_vaccine_data.push(n_avg_vaccines);
            cur_location.date_recorded.push(datestamp);
        }
    
        if (datestamp != last_date) {
            last_date = datestamp;
            dates.push(datestamp);
        }
    });

    var start_graph_date = await start_date_of_graph(last_date);

    // Default Country Data for countries ordered alphabetically
    setPlot('Algeria')

    function setPlot(countryName) {

        var main_data = [];
        var country = countryName
        var xValues = location_vaccinations[country].date_recorded;
        var yValues = location_vaccinations[country].vaccine_data;
        var avgValues = location_vaccinations[country].avg_vaccine_data;
    
        var data = {
            type: 'bar',
            name: country,
            meta: [country],
            x: xValues,
            y: yValues,
            customdata: avgValues,
            hovertemplate: '%{x}' + 
                            '<br><b>%{meta[0]}:</b> %{y} vaccinations<br>' +
                            '7-day average: %{customdata} <extra></extra>'
        };
    
        main_data.push(data)
        
        var layout = {
            margin: {
				l: 50,
				r: 20,
				t: 20,
				b: 50,
				pad: 0
	        },
            height: 600,
            xaxis: {
                fixedrange: true,
                showgrid: false,
                linecolor: 'black',
                range: [start_graph_date, last_date],
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
                title: {text: 'Number of New Vaccinations'},
                fixedrange: true
            },
            hovermode: 'closest',
            hoverlabel: {bgcolor: 'white'},
            legend: {text: 'country'},
        };
        var config = {responsive: true};
        Plotly.newPlot("country-new-vaccinations", main_data, layout, config);
    };

    // Drop-down button from https://plotly.com/javascript/dropdowns/
    var weeklyVaccinationContainer = document.querySelector('#weekly-vaccines'),
        countrySelector = weeklyVaccinationContainer.querySelector('.countryChoice');

    var listofCountries = Object.keys(location_vaccinations);
    listofCountries.sort();
    assignOptions(listofCountries, countrySelector);
    countrySelector.addEventListener('change', updateCountry, false);
    
    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length; i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }
    
    function updateCountry() {
        setPlot(countrySelector.value);
    }
};

function start_date_of_graph(last_date) {
    // Gets a date 6 months before last_date, to be used for start of xaxis.
    // Plotly does not allow presetting to the 6m range button, but we can set
    // default range values.
    var last_graph_date = new Date(last_date);
    last_graph_date.setMonth(last_graph_date.getMonth() - 6)
    /* https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
    For date formatting */
    var start_graph_date = last_graph_date.toLocaleDateString('en-CA');
    return start_graph_date;
};
