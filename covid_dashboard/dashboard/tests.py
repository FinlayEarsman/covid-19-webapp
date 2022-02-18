from django.test import TestCase
from dashboard.models import FAQModel
from django.urls import reverse


# Helper function to create a FAQ
def add_faq(question, answer):
    faq = FAQModel.objects.get_or_create(question=question,
                                         answer=answer)[0]
    faq.save()


class AdminPageViewTests(TestCase):
    def test_admin_page_view_with_no_faqs(self):
        '''
        If no FAQs exist, there should only be an add button present for FAQs
        and there should be no FAQModel objects.
        '''
        response = self.client.get(reverse('dashboard:admin_page'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Add')
        self.assertQuerysetEqual(response.context['faqs'], [])

    def test_admin_page_faqs_display(self):
        '''
        FAQs should display on the admin page
        '''

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
            add_faq(faq["question"], faq["answer"])

        response = self.client.get(reverse('dashboard:admin_page'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "This is question 1...")
        self.assertContains(response, "This is question 2...")
        self.assertContains(response, "This is question 3...")

        num_faqs = len(response.context['faqs'])
        self.assertEquals(num_faqs, 3)
