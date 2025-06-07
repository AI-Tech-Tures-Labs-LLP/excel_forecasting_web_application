from datetime import datetime, timedelta
from calendar import monthrange
from typing import Tuple

def get_retail_weeks(year: int, month: int) -> int:
    """
    Calculate the number of retail weeks in a given month.
    Retail weeks run Sunday to Saturday and are attributed to the month they start in.
    """
    first_day = datetime(year, month, 1)
    last_day = datetime(year, month, monthrange(year, month)[1])

    first_sunday = first_day + timedelta(days=(6 - first_day.weekday()) % 7)
    last_saturday = last_day - timedelta(days=last_day.weekday() + 1)

    week_count = 0
    current_week_start = first_sunday

    while current_week_start <= last_saturday:
        week_count += 1
        current_week_start += timedelta(days=7)

    if current_week_start <= last_day:
        week_count += 1

    return week_count


def get_previous_retail_week(current_date: datetime) -> Tuple:
    """
    Calculate retail calendar details for the week before the given date.
    Returns current month, rolling method, retail week info, and retail week counts for all months.
    """
    current_sunday = current_date - timedelta(days=current_date.weekday() + 1)
    previous_sunday = current_sunday - timedelta(days=7)
    previous_week_number = (previous_sunday.day - 1) // 7 + 1
    current_month = previous_sunday.strftime('%b')

    retail_year = previous_sunday.year if previous_sunday.month >= 2 else previous_sunday.year - 1
    last_retail_year = retail_year - 1

    last_month_date = previous_sunday.replace(day=1) - timedelta(days=1)
    last_month_abbr = last_month_date.strftime('%b').upper()

    month_map = {
        'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5, 'JUL': 6,
        'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11, 'JAN': 12
    }
    last_month_number = month_map[last_month_abbr]

    season = "SP" if current_month.upper() in {'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'} else "FA"

    months = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN']
    retail_weeks = {
        month.lower(): get_retail_weeks(retail_year + (1 if month == 'JAN' else 0), month_map[month])
        for month in months
    }

    month_dict = {month: i + 1 for i, month in enumerate(['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'])}
    current_month_number = month_dict.get(current_month, 0)
    rolling_method = "Current MTH" if current_month in {'Oct', 'Nov', 'Dec', 'Jan'} else "YTD"

    return (
        current_month,
        current_month_number,
        rolling_method,
        previous_week_number,
        retail_year,
        last_retail_year,
        last_month_number,
        season,
        retail_weeks['feb'],
        retail_weeks['mar'],
        retail_weeks['apr'],
        retail_weeks['may'],
        retail_weeks['jun'],
        retail_weeks['jul'],
        retail_weeks['aug'],
        retail_weeks['sep'],
        retail_weeks['oct'],
        retail_weeks['nov'],
        retail_weeks['dec'],
        retail_weeks['jan']
    )
