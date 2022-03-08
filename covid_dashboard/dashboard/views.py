from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from clickhouse_driver import Client


def get_db_conn():
    return Client("covid-database")


def index(request):
    return render(request, "index.html")


def get_covid_data(request):
    results = get_db_conn().execute("""
        SELECT
            Location,
            toStartOfWeek(UpdateDate) AS Week,
            CEIL(AVG(NewCasesPerMil)/ 10) AS NewCasesPer100K
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
    results = get_db_conn().execute("""
        SELECT
            Location,
            CEIL(MAX(Population) / 100000) AS PopulationPer100kQuotient,
            MAX(TotalCases) AS TotalCases,
            CEIL(TotalCases / PopulationPer100kQuotient) AS CasesPer100k,
            CEIL(AVG(NewCasesPerMil) / 10) AS NewCases,
            MAX(TotalDeaths) AS TotalDeaths,
            CEIL(TotalDeaths / PopulationPer100kQuotient) AS DeathsPer100k,
            CEIL(AVG(NewDeathsPerMil) / 10) AS NewDeaths,
            MAX(TotalVaccinations) AS TotalVaccinations,
            CEIL(TotalVaccinations / PopulationPer100kQuotient) AS VaccPer100k,
            CEIL(AVG(NewVaccinationsSmoothPerMil) / 10) AS NewVaccinations
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
    results = get_db_conn().execute("""
        SELECT
            Location,
            MAX(PeopleVaccinated) AS FirstVaccine,
            MAX(PeopleFullyVaccinated) AS FullyVaccinated,
            MAX(TotalBoosters) AS BoosterVaccine,
            MAX(Population) AS Population,
            CEIL(FirstVaccine / Population * 100) AS PercentOneDose,
            CEIL(FullyVaccinated / Population * 100) AS PercentTwoDose,
            CEIL(BoosterVaccine / Population * 100) AS PercentThreeDose
        FROM covid19.updates
        WHERE Continent='Africa'
        GROUP BY
            Location
        ORDER BY Location ASC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})


def get_weekly_maxs(request):
    cases_results = get_db_conn().execute("""
        (SELECT TOP 5
            Location,
            CEIL(AVG(NewCasesPerMil) / 10) AS newCases
        FROM covid19.updates
        WHERE Continent='Africa' AND UpdateDate>=today() - 7
        GROUP BY Location
        ORDER BY newCases DESC)
    """)

    deaths_results = get_db_conn().execute("""
        SELECT TOP 5
            Location,
            CEIL(AVG(NewDeathsPerMil) / 10) AS newDeaths
        FROM covid19.updates
        WHERE Continent='Africa' AND UpdateDate>=today() - 7
        GROUP BY Location
        ORDER BY newDeaths DESC
    """)

    vacc_results = get_db_conn().execute("""
        SELECT TOP 5
            Location,
            CEIL(AVG(NewVaccinationsSmoothPerMil) / 10) AS newVacc
        FROM covid19.updates
        WHERE Continent='Africa' AND UpdateDate>=today() - 7
        GROUP BY Location
        ORDER BY newVacc DESC
    """)
    results = [cases_results, deaths_results, vacc_results]
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})


def get_new_vaccinated_data(request):
    results = get_db_conn().execute("""
        SELECT
            Location,
            toStartOfWeek(UpdateDate) AS Week,
            CEIL(SUM(NewVaccinationsSmoothPerMil)/ 10)
            AS NewVaccinationsPer100k,
            ceil(AVG(NewVaccinationsSmoothPerMil) / 10)
            AS AvgNewVaccinationsPer100k
        FROM covid19.updates
        WHERE Continent='Africa'
        GROUP BY
            Location,
            Week
        ORDER BY Week ASC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})


def get_last_update(request):
    results = get_db_conn().execute(
        "SELECT MAX(UpdateDate) FROM covid19.updates"
    )
    return HttpResponse(results[0])
