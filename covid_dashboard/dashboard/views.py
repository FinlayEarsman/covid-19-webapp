from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from clickhouse_driver import Client
from dashboard.models import FAQModel
from dashboard.forms import FAQForm, DeleteFAQForm
from django.http import HttpResponse

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


def populate_models():
    faqs = [
        {
            "question": "This is question 1...",
            "answer": "This is answer 1..."
        },
        {
            "question": "This is question 2...",
            "answer": "This is answer 2..."
        },
        {
            "question": "This is question 3...",
            "answer": "This is answer 3..."
        }
    ]

    for faq in faqs:
        f = FAQModel.objects.get_or_create(question=faq["question"])[0]
        f.answer = faq["answer"]
        f.save()


def admin_page(request):
    # To initially generate FAQs to test edit functionality.
    # Call must be removed after first run.
    # populate_models()

    form = FAQForm()
    delete_form = DeleteFAQForm()
    model_faqs = FAQModel.objects.all()
    context = {'faqs': model_faqs, 'form': form, 'delete_form': delete_form}
    return render(request, "admin-page.html", context)


def add_faq(request):
    if request.method == 'POST':
        form = FAQForm(request.POST, request.FILES)

        if form.is_valid():
            form.save(commit=True)
        else:
            print(form.errors)

    return redirect(reverse('dashboard:admin_page'))


def delete_faq(request, faq_slug):
    if request.method == 'POST':
        if 'slug' in request.POST:
            try:
                faq = FAQModel.objects.get(slug=faq_slug)
                faq.delete()
            except FAQModel.DoesNotExist:
                redirect(reverse('dashboard:admin_page'))

    return redirect(reverse('dashboard:admin_page'))


def update_faq(request):
    if request.method == 'POST':
        if ("question" not in request.POST or
                "answer" not in request.POST or
                "slug" not in request.POST):
            return HttpResponse(status=400)
        try:
            cur_faq = FAQModel.objects.get(slug=request.POST["slug"])
        except FAQModel.DoesNotExist:
            return redirect(reverse('dashboard:admin_page'))

        updated_faq = {"question": request.POST["question"],
                       "answer": request.POST["answer"]}
        update_form = FAQForm(updated_faq, instance=cur_faq)
        if update_form.is_valid():
            new_faq = update_form.save(commit=True)
            updated_faq["new_slug"] = new_faq.slug
            return JsonResponse(updated_faq)

    return HttpResponse(status=400)
