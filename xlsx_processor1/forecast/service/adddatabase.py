
import os
import django

# Set your Django settings module - replace 'your_project_name' with your actual project name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xlsx_processor1.settings')
django.setup()

from forecast.models import MonthlyForecast, ProductDetail
from datetime import datetime
import pandas as pd
from django.db import transaction



# MonthlyForecast model Operations 1
def save_macys_projection_receipts(product, matching_row, year, sheet ):
    """
    Saves Macy's Projection Receipts data into the MonthlyForecast model.
    Updates fields: jan, feb, mar, ..., dec instead of a single month field.
    """
    receipts_data = {
        'jan': matching_row['JAN RECPT'].iloc[0],
        'feb': matching_row['FEB RECPT'].iloc[0],
        'mar': matching_row['MAR RECPT'].iloc[0],
        'apr': matching_row['APR RECPT'].iloc[0],
        'may': matching_row['May RECPT'].iloc[0],
        'jun': matching_row['JUN RECPT'].iloc[0],
        'jul': matching_row['JUL RECPT'].iloc[0],
        'aug': matching_row['AUG RECPT'].iloc[0],
        'sep': matching_row['SEP RECPT'].iloc[0],
        'oct': matching_row['OCT RECPT'].iloc[0],
        'nov': matching_row['NOV RECPT'].iloc[0],
        'dec': matching_row['DEC RECPT'].iloc[0],
    }
    
    # Convert values to integers if possible, else set to None
    for month in receipts_data:
        try:
            receipts_data[month] = int(receipts_data[month]) if pd.notna(receipts_data[month]) else None
        except (ValueError, TypeError):
            receipts_data[month] = None
    
    # Update or create the forecast entry for the entire year
    with transaction.atomic():
        MonthlyForecast.objects.update_or_create(
            sheet=sheet,
            productdetail=product,
            variable_name='macys_proj_receipts',
            year=year,
            defaults=receipts_data  # Updates all month fields at once
        )

# MonthlyForecast model Operations 2
def save_monthly_forecasts(
    product, sheet, current_year, months,
    ty_total_sales_units, ly_total_sales_units,
    ly_total_eom_oh, ty_total_eom_oh,
    ty_omni_receipts, ly_omni_receipts,
    ty_com_sales_units, ly_com_sales_units,
    ty_com_eom_oh, ly_com_eom_oh,
    ly_store_sales_units, ly_store_eom_oh,
    ly_com_to_ttl_sales_pct, ly_com_to_ttl_eoh_pct,
    ly_omni_sell_thru_pct, ly_store_sell_thru_pct,
    ly_omni_turn, ly_store_turn,
    ly_omni_aur_diff_own,
    ty_store_sales_units, ty_store_eom_oh,
    ty_com_to_ttl_sales_pct, ty_com_to_ttl_eoh_pct,
    ty_omni_aur_diff_own, ty_omni_sell_thru_pct,
    ty_store_sell_thru_pct, ty_omni_turn, ty_store_turn,
    ty_store_sales_vs_ly, ty_com_sales_vs_ly, ty_store_eoh_vs_ly,
    ty_omni_oo_units, ty_com_oo_units,
    ty_omni_sales_usd, ly_omni_sales_usd,
    ty_com_sales_usd, ly_com_sales_usd
):
    """
    Saves forecast data for all variables in MonthlyForecast, 
    updating fields: jan, feb, mar, ..., dec instead of a single month field.
    """

    month_mapping = {
        'JAN': 'jan', 'FEB': 'feb', 'MAR': 'mar', 'APR': 'apr', 'MAY': 'may', 'JUN': 'jun',
        'JUL': 'jul', 'AUG': 'aug', 'SEP': 'sep', 'OCT': 'oct', 'NOV': 'nov', 'DEC': 'dec'
    }

    variable_map = {
        'ty_total_sales_units': ty_total_sales_units,
        'ly_total_sales_units': ly_total_sales_units,
        'ly_total_eom_oh': ly_total_eom_oh,
        'ty_total_eom_oh': ty_total_eom_oh,
        'ty_omni_receipts': ty_omni_receipts,
        'ly_omni_receipts': ly_omni_receipts,
        'ty_com_sales_units': ty_com_sales_units,
        'ly_com_sales_units': ly_com_sales_units,
        'ty_com_eom_oh': ty_com_eom_oh,
        'ly_com_eom_oh': ly_com_eom_oh,
        'ly_store_sales_units': ly_store_sales_units,
        'ly_store_eom_oh': ly_store_eom_oh,
        'ly_com_to_ttl_sales_pct': ly_com_to_ttl_sales_pct,
        'ly_com_to_ttl_eoh_pct': ly_com_to_ttl_eoh_pct,
        'ly_omni_sell_thru_pct': ly_omni_sell_thru_pct,
        'ly_store_sell_thru_pct': ly_store_sell_thru_pct,
        'ly_omni_turn': ly_omni_turn,
        'ly_store_turn': ly_store_turn,
        'ly_omni_aur_diff_own': ly_omni_aur_diff_own,
        'ty_store_sales_units': ty_store_sales_units,
        'ty_store_eom_oh': ty_store_eom_oh,
        'ty_com_to_ttl_sales_pct': ty_com_to_ttl_sales_pct,
        'ty_com_to_ttl_eoh_pct': ty_com_to_ttl_eoh_pct,
        'ty_omni_aur_diff_own': ty_omni_aur_diff_own,
        'ty_omni_sell_thru_pct': ty_omni_sell_thru_pct,
        'ty_store_sell_thru_pct': ty_store_sell_thru_pct,
        'ty_omni_turn': ty_omni_turn,
        'ty_store_turn': ty_store_turn,
        'ty_store_sales_vs_ly': ty_store_sales_vs_ly,
        'ty_com_sales_vs_ly': ty_com_sales_vs_ly,
        'ty_store_eoh_vs_ly': ty_store_eoh_vs_ly,
        'ty_omni_oo_units': ty_omni_oo_units,
        'ty_com_oo_units': ty_com_oo_units,
        'ty_omni_sales_usd': ty_omni_sales_usd,
        'ly_omni_sales_usd': ly_omni_sales_usd,
        'ty_com_sales_usd': ty_com_sales_usd,
        'ly_com_sales_usd': ly_com_sales_usd,
    }

    year_mapping = {
        'ty_total_sales_units': current_year,
        'ly_total_sales_units': current_year - 1,
        'ly_total_eom_oh': current_year - 1,
        'ty_total_eom_oh': current_year,
        'ty_omni_receipts': current_year,
        'ly_omni_receipts': current_year - 1,
        'ty_com_sales_units': current_year,
        'ly_com_sales_units': current_year - 1,
        'ty_com_eom_oh': current_year,
        'ly_com_eom_oh': current_year - 1,
        'ly_store_sales_units': current_year - 1,
        'ly_store_eom_oh': current_year - 1,
        'ly_com_to_ttl_sales_pct': current_year - 1,
        'ly_com_to_ttl_eoh_pct': current_year - 1,
        'ly_omni_sell_thru_pct': current_year - 1,
        'ly_store_sell_thru_pct': current_year - 1,
        'ly_omni_turn': current_year - 1,
        'ly_store_turn': current_year - 1,
        'ly_omni_aur_diff_own': current_year - 1,
        'ty_store_sales_units': current_year,
        'ty_store_eom_oh': current_year,
        'ty_com_to_ttl_sales_pct': current_year,
        'ty_com_to_ttl_eoh_pct': current_year,
        'ty_omni_aur_diff_own': current_year,
        'ty_omni_sell_thru_pct': current_year,
        'ty_store_sell_thru_pct': current_year,
        'ty_omni_turn': current_year,
        'ty_store_turn': current_year,
        'ty_store_sales_vs_ly': current_year,
        'ty_com_sales_vs_ly': current_year,
        'ty_store_eoh_vs_ly': current_year,
        'ty_omni_oo_units': current_year,
        'ty_com_oo_units': current_year,
        'ty_omni_sales_usd': current_year,
        'ly_omni_sales_usd': current_year - 1,
        'ty_com_sales_usd': current_year,
        'ly_com_sales_usd': current_year - 1,
    }


    for variable_name, data_dict in variable_map.items():
        year = year_mapping[variable_name]
        monthly_values = {month_field: None for month_field in month_mapping.values()}

        for month_name in months:
            month_field = month_mapping.get(month_name.upper())
            if month_field is None:
                continue
            value = data_dict.get(month_name)
            if pd.isna(value):
                value = None
            else:
                try:
                    value = round(float(value), 2)
                except (ValueError, TypeError):
                    value = None
            monthly_values[month_field] = value

        with transaction.atomic():
            MonthlyForecast.objects.update_or_create(
                sheet=sheet,
                productdetail=product,
                variable_name=variable_name,
                year=year,
                defaults=monthly_values
            )

# MonthlyForecast model Operations 3
def save_rolling_forecasts(product, sheet, year, forecast_data_dict):
    """
    Save or update MonthlyForecast records for a given product and year.
    Handles invalid numeric entries like '-' gracefully.

    Args:
        product (ProductDetail): ProductDetail instance
        year (int): Forecast year
        forecast_data_dict (dict): {
            "planned_eoh_cal": {"JAN": "100", "FEB": "-", ...},
            ...
        }
    """
    month_map = {
        'JAN': 'jan', 'FEB': 'feb', 'MAR': 'mar', 'APR': 'apr',
        'MAY': 'may', 'JUN': 'jun', 'JUL': 'jul', 'AUG': 'aug',
        'SEP': 'sep', 'OCT': 'oct', 'NOV': 'nov', 'DEC': 'dec',
    }

    for variable_name, monthly_data in forecast_data_dict.items():
        defaults = {}
        for month_abbr, value in monthly_data.items():
            month_field = month_map.get(month_abbr.upper())
            if not month_field:
                continue
            try:
                # Convert to float; skip if value is not a number
                if value in (None, '', '-', '--'):
                    continue
                defaults[month_field] = float(value)
            except (ValueError, TypeError):
                continue

        # Only create/update if there's at least one valid month value
        if defaults:
            with transaction.atomic():
                MonthlyForecast.objects.update_or_create(
                    sheet=sheet,
                    productdetail=product,
                    variable_name=variable_name,
                    year=year,
                    defaults=defaults
                )

# MonthlyForecast & ProductDetail model Operations
def save_forecast_data(pid, updated_context, sheet_object):
    """
    Updates ProductDetail fields and saves rolling forecast data to MonthlyForecast.
    Expects updated_context to have keys matching MonthlyForecast.variable_name and
    values as dicts of month abbreviations to values.
    """

    product = ProductDetail.objects.get(product_id=pid, sheet=sheet_object)
    year = datetime.now().year  # You can change this if needed

    # Update ProductDetail fields
    product.rolling_method = updated_context.get("rolling_method", product.rolling_method)
    product.std_trend_original = updated_context.get("std_trend_original", product.std_trend_original)
    product.forecasting_method_original = updated_context.get("forecasting_method_original", product.forecasting_method_original)
    product.month_12_fc_index_original = updated_context.get("month_12_fc_index_original", product.month_12_fc_index_original)
    product.current_fc_index = updated_context.get("current_fc_index", product.current_fc_index)

    with transaction.atomic():
        product.save()
    print("Product Updated Values Saved Successfully ")

    month_keys = {
        "JAN": "jan", "FEB": "feb", "MAR": "mar", "APR": "apr",
        "MAY": "may", "JUN": "jun", "JUL": "jul", "AUG": "aug",
        "SEP": "sep", "OCT": "oct", "NOV": "nov", "DEC": "dec"
    }

    # Save rolling forecast data for each variable_name present in updated_context
    with transaction.atomic():
        for variable_name, data in updated_context.items():
            # Only process keys that are valid variable_names for MonthlyForecast
            if variable_name not in [
                "planned_eoh_cal", "planned_shipments", "planned_fc", "recommended_fc",
                "fc_by_trend", "fc_by_index", "planned_sell_thru_pct", "index",
                "gross_projection_nav", "macys_proj_receipts"
            ]:
                continue
            if not isinstance(data, dict):
                continue

            # Map month values
            forecast_data = {}
            for mon, val in data.items():
                mon_key = month_keys.get(mon.upper())
                if mon_key and val not in (None, '', '-', '--'):
                    try:
                        forecast_data[mon_key] = float(val)
                    except (ValueError, TypeError):
                        forecast_data[mon_key] = None

            if forecast_data:
                MonthlyForecast.objects.update_or_create(
                    sheet=sheet_object,
                    productdetail=product,
                    variable_name=variable_name,
                    year=year,
                    defaults=forecast_data
                )

                print("Rolling Forecast Data Saved Successfully")