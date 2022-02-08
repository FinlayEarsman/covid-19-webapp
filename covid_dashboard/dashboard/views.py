from django.http import JsonResponse
from django.shortcuts import render
from clickhouse_driver import Client
import os
import json
from covid_dashboard.settings import STATIC_ROOT

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
            MAX(NewCases) AS NewCases,
            MAX(TotalDeaths) AS TotalDeaths,
            MAX(NewDeaths) AS NewDeaths,
            MAX(TotalVaccinations) AS Vaccinations,
            MAX(NewVaccinations) AS NewTotalVaccinations
        FROM covid19.updates
        WHERE Continent='Africa'
        GROUP BY
            Location
        ORDER BY Location DESC;
    """)
    return JsonResponse(results, safe=False,
                        json_dumps_params={"default": str})

def admin_page(request):
    json_f = os.path.join(STATIC_ROOT, 'faqs.json')
    loaded_json = json.load(open(json_f))
    context = {'faqs':loaded_json}
    return render(request, "admin-page.html", context)


def update_faq(request):
    updated_faq = {}
    if request.method == "POST":
        updated_faq["question"] = request.POST["question"]
        updated_faq["answer"] = request.POST["answer"]
    return JsonResponse(updated_faq)