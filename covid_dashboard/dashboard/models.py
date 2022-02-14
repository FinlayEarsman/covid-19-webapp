from django.db import models
from django.template.defaultfilters import slugify


class FAQModel(models.Model):
    MAX_FIELD_LENGTH = 400

    question = models.CharField(unique=True, max_length=MAX_FIELD_LENGTH)
    answer = models.CharField(max_length=MAX_FIELD_LENGTH)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.question)
        super(FAQModel, self).save(*args, **kwargs)

    def __str__(self):
        return self.question
