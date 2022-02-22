from django.http import JsonResponse
from django.shortcuts import render
from clickhouse_driver import Client

ch_client = Client("covid-database")


def index(request):
    return render(request, "index.html")


def get_covid_data(request):
    results = ch_client.execute("""
        SELECT
            Location,
            toStartOfWeek(UpdateDate) AS Week,
            ceil(avg(NewCases)) AS AvgNewCases
        FROM covid19.updates
        WHERE Continent='Africa'
        GROUP BY
            Location,
            Week
        ORDER BY Week ASC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})


def get_summary_data(request):
    results = ch_client.execute("""
        SELECT
            Location,
            MAX(TotalCases) AS Cases,
            ceil(avg(NewCasesPerMil)) AS NewCases,
            MAX(TotalDeaths) AS TotalDeaths,
            ceil(avg(NewDeathsPerMil)) AS NewDeaths,
            MAX(TotalVaccinations) AS Vaccinations,
            ceil(avg(NewVaccinationsSmoothPerMil)) AS NewVaccinations
        FROM covid19.updates
        WHERE
            Continent='Africa' AND UpdateDate>=today() - 7
        GROUP BY
            Location
        ORDER BY Location DESC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})


def get_vaccinated_percentage(request):
    results = ch_client.execute("""
        SELECT
            Location,
            MAX(PeopleVaccinated) AS FirstVaccine,
            MAX(PeopleFullyVaccinated) AS FullyVaccinated,
            MAX(TotalBoosters) AS BoosterVaccine,
            MAX(Population) AS Population,
            ceil(FirstVaccine / Population * 100) AS PercentOneDose,
            ceil(FullyVaccinated / Population * 100) AS PercentTwoDose,
            ceil(BoosterVaccine / Population * 100) AS PercentThreeDose
        FROM covid19.updates
        WHERE Continent='Africa'
        GROUP BY
            Location
        ORDER BY Location ASC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})
