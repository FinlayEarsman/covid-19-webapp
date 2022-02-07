#!/usr/bin/env python3
import sys
import datetime as dt


def to_date(string):
    return dt.datetime.strptime(string, "%Y-%m-%d")


# A positional argument containing a "YYYY-MM-DD" timestamp
# represents the most recent batch of data in the database.
if len(sys.argv) > 1 and sys.argv[1] != "NO_PREVIOUS_DATA":
    LAST_UPDATE = to_date(sys.argv[1])
else:
    LAST_UPDATE = None

stdin_it = iter(sys.stdin)
_headers = next(stdin_it)

for line in stdin_it:
    cols = line.split(",")

    wanted = cols[:4]

    def make_float(index):
        # convert the value into a float or leave as NULL
        wanted.append(float(cols[index]) if cols[index] else '')

    def make_int(index):
        # convert the value into an integer from a float or leave as NULL
        wanted.append(int(float(cols[index])) if cols[index] else '')

    # ignore all pseudo-entries prefixed with OWID ISO codes
    if cols[0].startswith("OWID"):
        continue

    if LAST_UPDATE is not None:
        # only add new dates that we have not processed before
        if LAST_UPDATE >= to_date(cols[3]):
            continue

    make_int(4)     # total cases
    make_int(5)     # new cases
    make_int(7)     # total deaths
    make_int(8)     # new deaths
    make_float(10)  # total cases per million
    make_float(11)  # new cases per million
    make_float(14)  # new deaths per million
    make_float(16)  # reproduction rate
    make_int(19)    # hospital patients
    make_float(20)  # hospital patients per million
    make_int(25)    # new tests
    make_int(26)    # total tests
    make_int(31)    # positive rate
    make_int(34)    # total vaccinations
    make_int(35)    # people vaccinated
    make_int(36)    # people fully vaccinated
    make_int(37)    # total boosters
    make_int(38)    # new vaccinations
    make_float(39)  # total boosters per hundred
    make_float(43)  # people fully vaccinated per hundred
    make_float(44)  # new vaccinations smoothed per million
    make_int(48)    # population
    make_float(50)  # median age
    make_float(53)  # GDP per capita
    make_float(61)  # life expectancy

    print(",".join(map(str, wanted)))
