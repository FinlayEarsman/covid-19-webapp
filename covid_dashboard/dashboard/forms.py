from django import forms
from dashboard.models import FAQModel

class FAQForm(forms.ModelForm):
    MAX_INPUT_LENGTH = 400

    question = forms.CharField(max_length=MAX_INPUT_LENGTH)
    answer = forms.CharField(max_length=MAX_INPUT_LENGTH)
    slug = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = FAQModel
        fields = ('question', 'answer', )