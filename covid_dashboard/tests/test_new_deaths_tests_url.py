from tests import DataUrlBoilerplate

import datetime as dt

from django.test import TestCase


class CovidDataUrlTestCase(DataUrlBoilerplate, TestCase):
    ENDPOINT = "get_new_tests_data"

    def test_url_returns_valid_values(self):
        """Check whether the URL returns valid values."""

        for location, date, new_tests in self.content:
            self.assertIsInstance(location, str)
            self.assertIsInstance(date, str)
            self.assertTrue(self._is_optional(new_tests, float))
            date = dt.datetime.strptime(date, "%Y-%m-%d")

    def test_url_returns_sorted_weekly_values(self):
        """Check whether the URL returns rows sorted by week."""

        previous = None
        for _, date, *_ in self.content:
            date = dt.datetime.strptime(date, "%Y-%m-%d")
            if previous is not None:
                self.assertTrue(previous <= date)
            previous = date
