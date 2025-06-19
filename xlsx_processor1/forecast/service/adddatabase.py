
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
    for k, v in receipts_data.items():
        try:
            receipts_data[k] = int(v) if pd.notna(v) else None
        except Exception:
            receipts_data[k] = None
    return MonthlyForecast(
        sheet=sheet,
        productdetail=product,
        variable_name='macys_proj_receipts',
        year=year,
        **receipts_data
    )
# MonthlyForecast model Operations 2
def save_monthly_forecasts(product, sheet, current_year, months, **forecast_kwargs):
    """
    Saves forecast data for all variables in MonthlyForecast, 
    updating fields: jan, feb, mar, ..., dec instead of a single month field.
    """

    month_mapping = {
        'JAN': 'jan', 'FEB': 'feb', 'MAR': 'mar', 'APR': 'apr', 'MAY': 'may', 'JUN': 'jun',
        'JUL': 'jul', 'AUG': 'aug', 'SEP': 'sep', 'OCT': 'oct', 'NOV': 'nov', 'DEC': 'dec'
    }

    variable_map = forecast_kwargs

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

    forecasts = []
    for variable_name, data_dict in variable_map.items():
        if variable_name == "ty_store_eom_oh":
            print("DEBUG ty_store_eom_oh data_dict:", data_dict)
            print("Saving month FEB value =", data_dict.get("FEB"))
        data_dict = {k.upper(): v for k, v in data_dict.items()}
        year = year_mapping.get(variable_name, current_year)
        monthly_values = {month_field: None for month_field in month_mapping.values()}
        for month_name in months:
            month_field = month_mapping.get(month_name.upper())
            if not month_field:
                continue
            value = data_dict.get(month_name)
            try:
                value = None if pd.isna(value) else round(float(value), 2)
            except:
                value = None
            monthly_values[month_field] = value
        forecasts.append(MonthlyForecast(
            sheet=sheet,
            productdetail=product,
            variable_name=variable_name,
            year=year,
            **monthly_values
        ))
    return forecasts
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

    forecasts = []
    for variable_name, monthly_data in forecast_data_dict.items():
        defaults = {}
        for month_abbr, value in monthly_data.items():
            month_field = month_map.get(month_abbr.upper())
            if not month_field:
                continue
            try:
                if value in (None, '', '-', '--'):
                    continue
                defaults[month_field] = float(value)
            except:
                continue
        if defaults:
            forecasts.append(MonthlyForecast(
                sheet=sheet,
                productdetail=product,
                variable_name=variable_name,
                year=year,
                **defaults
            ))
    return forecasts

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
    product.updated_rolling_method = updated_context.get("rolling_method", product.rolling_method_original)
    product.updated_std_trend = updated_context.get("std_trend", product.std_trend_original)
    product.updated_forecasting_method = updated_context.get("forecasting_method", product.forecasting_method_original)
    product.updated_12_month_fc_index = updated_context.get("month_12_fc_index", product.month_12_fc_index_original)
    product.updated_current_fc_index = updated_context.get("current_fc_index", product.current_fc_index_original)

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