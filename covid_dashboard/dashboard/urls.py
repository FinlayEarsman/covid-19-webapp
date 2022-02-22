"""covid_dashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from dashboard import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.index, name='index'),
    path('covid_data', views.get_covid_data, name='get_covid_data'),
    path('summary_data', views.get_summary_data, name='get_summary_data'),
    path('vaccination_data/', views.get_vaccinated_percentage,
         name='get_vaccinated_percentage'),
]
