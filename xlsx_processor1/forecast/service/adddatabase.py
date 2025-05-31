
import os
import django

# Set your Django settings module - replace 'your_project_name' with your actual project name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xlsx_processor1.settings')
django.setup()

from forecast.models import MonthlyForecast, ProductDetail
from datetime import datetime
import pandas as pd



def save_macys_projection_receipts(product, matching_row, year):
    """
    Saves Macy's Projection Receipts data into the MonthlyForecast model.
    Updates fields: jan, feb, mar, ..., dec instead of a single month field.
    """
    # Map DataFrame columns to the corresponding month fields in the model
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
    MonthlyForecast.objects.update_or_create(
        product=product,
        variable_name='MacysProjectionReciepts',
        year=year,
        defaults=receipts_data  # Updates all month fields at once
    )


# Use this 
# from datetime import datetime
# current_year = datetime.now().year

def save_monthly_forecasts(product, current_year, months, TY_Unit_Sales, LY_Unit_Sales, LY_OH_Units, TY_OH_Units, TY_Receipts, LY_Receipts, TY_MCOM_Unit_Sales, LY_MCOM_Unit_Sales, TY_OH_MCOM_Units, LY_MCOM_OH_Units, PTD_TY_Sales, LY_PTD_Sales, MCOM_PTD_TY_Sales, MCOM_PTD_LY_Sales, OO_Total_Units, OO_MCOM_Total_Units, LY_store_unit_sales, LY_store_EOM_OH, LY_COM_to_TTL, LY_COM_to_TTL_OH, LY_omni_sell_through, LY_store_sell_through, LY_omni_turn, LY_store_turn, LY_Omni_AUR_Diff_Own, TY_store_unit_sales, TY_store_EOM_OH, TY_COM_to_TTL, TY_COM_to_TTL_OH, TY_Omni_AUR_Diff_Own, TY_Omni_sell_through, TY_store_sell_through, TY_omni_turn, TY_store_turn, TY_store_unit_sales_diff, TY_com_unit_sales_diff, TY_store_eom_oh_diff):
    """
    Saves forecast data for all variables in MonthlyForecast, 
    updating fields: jan, feb, mar, ..., dec instead of a single month field.
    """

    # Dictionary mapping month names to model fields
    month_mapping = {
        'JAN': 'jan', 'FEB': 'feb', 'MAR': 'mar', 'APR': 'apr', 'MAY': 'may', 'JUN': 'jun',
        'JUL': 'jul', 'AUG': 'aug', 'SEP': 'sep', 'OCT': 'oct', 'NOV': 'nov', 'DEC': 'dec'
    }

    # All data dictionaries
    all_variables = {
        'TY_Unit_Sales': TY_Unit_Sales,
        'LY_Unit_Sales': LY_Unit_Sales,
        'LY_OH_Units': LY_OH_Units,
        'TY_OH_Units': TY_OH_Units,
        'TY_Receipts': TY_Receipts,
        'LY_Receipts': LY_Receipts,
        'TY_MCOM_Unit_Sales': TY_MCOM_Unit_Sales,
        'LY_MCOM_Unit_Sales': LY_MCOM_Unit_Sales,
        'TY_OH_MCOM_Units': TY_OH_MCOM_Units,
        'LY_MCOM_OH_Units': LY_MCOM_OH_Units,
        'PTD_TY_Sales': PTD_TY_Sales,
        'LY_PTD_Sales': LY_PTD_Sales,
        'MCOM_PTD_TY_Sales': MCOM_PTD_TY_Sales,
        'MCOM_PTD_LY_Sales': MCOM_PTD_LY_Sales,
        'OO_Total_Units': OO_Total_Units,
        'OO_MCOM_Total_Units': OO_MCOM_Total_Units
    }

    # Define the year mapping (last year for LY_ variables, this year for TY_ variables)
    year_mapping = {
        'TY_Unit_Sales': current_year,
        'LY_Unit_Sales': current_year - 1,
        'LY_OH_Units': current_year - 1,
        'TY_OH_Units': current_year,
        'TY_Receipts': current_year,
        'LY_Receipts': current_year - 1,
        'TY_MCOM_Unit_Sales': current_year,
        'LY_MCOM_Unit_Sales': current_year - 1,
        'TY_OH_MCOM_Units': current_year,
        'LY_MCOM_OH_Units': current_year - 1,
        'PTD_TY_Sales': current_year,
        'LY_PTD_Sales': current_year - 1,
        'MCOM_PTD_TY_Sales': current_year,
        'MCOM_PTD_LY_Sales': current_year - 1,
        'OO_Total_Units': current_year,
        'OO_MCOM_Total_Units': current_year
    }

    loader_computed_variables = {
        'LY_store_unit_sales': LY_store_unit_sales,
        'LY_store_EOM_OH': LY_store_EOM_OH,
        'LY_COM_to_TTL': LY_COM_to_TTL,
        'LY_COM_to_TTL_OH': LY_COM_to_TTL_OH,
        'LY_omni_sell_through': LY_omni_sell_through,
        'LY_store_sell_through': LY_store_sell_through,
        'LY_omni_turn': LY_omni_turn,
        'LY_store_turn': LY_store_turn,
        'LY_Omni_AUR_Diff_Own': LY_Omni_AUR_Diff_Own,

        'TY_store_unit_sales': TY_store_unit_sales,
        'TY_store_EOM_OH': TY_store_EOM_OH,
        'TY_COM_to_TTL': TY_COM_to_TTL,
        'TY_COM_to_TTL_OH': TY_COM_to_TTL_OH,
        'TY_Omni_AUR_Diff_Own': TY_Omni_AUR_Diff_Own,
        'TY_Omni_sell_through': TY_Omni_sell_through,
        'TY_store_sell_through': TY_store_sell_through,
        'TY_omni_turn': TY_omni_turn,
        'TY_store_turn': TY_store_turn,
        'TY_store_unit_sales_diff': TY_store_unit_sales_diff,
        'TY_com_unit_sales_diff': TY_com_unit_sales_diff,
        'TY_store_eom_oh_diff': TY_store_eom_oh_diff
    }

    # Merge both dictionaries
    all_variables.update(loader_computed_variables)

    # Update year_mapping for these variables
    loader_year_mapping = {key: current_year if key.startswith('TY_') else current_year - 1 for key in loader_computed_variables}
    year_mapping.update(loader_year_mapping)

    # Process each variable and construct the forecast data
    for variable_name, data_dict in all_variables.items():
        year = year_mapping[variable_name]
        
        # Initialize a dictionary to store month values
        monthly_values = {month_field: None for month_field in month_mapping.values()}

        for month_name in months:
            month_field = month_mapping.get(month_name.upper())
            if month_field is None:
                continue  # Skip invalid month names

            value = data_dict.get(month_name)
            
            # Convert value to integer if valid, else None
            if pd.isna(value):
                value = None
            else:
                try:
                    value = round(value,2)
                except (ValueError, TypeError):
                    value = None
            
            # Assign value to corresponding month field
            monthly_values[month_field] = value

        # Update or create the record for the entire year
        MonthlyForecast.objects.update_or_create(
            product=product,
            variable_name=variable_name,
            year=year,
            defaults=monthly_values  # Updates all month fields at once
        )

def save_rolling_forecasts(product, year, forecast_data_dict):
    """
    Save or update MonthlyForecast records for a given product and year.
    Handles invalid numeric entries like '-' gracefully.
    
    Args:
        product (ProductDetail): ProductDetail instance
        year (int): Forecast year
        forecast_data_dict (dict): {
            "MacysProjectionReciepts": {"JAN": "100", "FEB": "-", ...},
            ...
        }
    """
    allowed_vars = {
        'MacysProjectionReciepts',
        'PlannedEOH',
        'PlannedShipment',
        'PlannedForecast',
        'RecommendedForecast',
        'ForecastByTrend',
        'ForecastByIndex',
        'PlannedSellThru',
        'IndexPercentage',
        'GrossProjection'
    }

    month_map = {
        'JAN': 'jan', 'FEB': 'feb', 'MAR': 'mar', 'APR': 'apr',
        'MAY': 'may', 'JUN': 'jun', 'JUL': 'jul', 'AUG': 'aug',
        'SEP': 'sep', 'OCT': 'oct', 'NOV': 'nov', 'DEC': 'dec',
    }

    for variable, monthly_data in forecast_data_dict.items():
        if variable not in allowed_vars:
            continue

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
                # Log or skip invalid numeric entry
                continue

        # Only create/update if there's at least one valid month value
        if defaults:
            MonthlyForecast.objects.update_or_create(
                product=product,
                variable_name=variable,
                year=year,
                defaults=defaults
            )


def save_forecast_data(pid, updated_context):
        # Fetch related product
        product = ProductDetail.objects.get(product_id=pid)
        year = datetime.now().year  # You can change this if needed
        # print("Updated Context",updated_context)

        # Update ProductDetail fields
        product.rolling_method = updated_context.get("Rolling_method", product.rolling_method)
        product.std_trend = updated_context.get("Trend", product.std_trend)
        product.forecasting_method = updated_context.get("Forecasting_Method", product.forecasting_method)
        product.month_12_fc_index = updated_context.get("month_12_fc_index", product.month_12_fc_index)
        product.currect_fc_index = updated_context.get("Current_FC_Index", product.currect_fc_index)
        product.save()
        print("Product Updated Values Saved Successfully ")

        month_keys = {
            "JAN": "jan", "FEB": "feb", "MAR": "mar", "APR": "apr",
            "MAY": "may", "JUN": "jun", "JUL": "jul", "AUG": "aug",
            "SEP": "sep", "OCT": "oct", "NOV": "nov", "DEC": "dec"
        }

        field_map = {
            "Planned_EOH": "PlannedEOH",
            "Planned_Shipments": "PlannedShipment",
            "Planned_FC": "PlannedForecast",
            "Recommended_FC": "RecommendedForecast",
            "FC_by_Trend": "ForecastByTrend",
            "FC_by_Index": "ForecastByIndex",
            "Planned_sell_thru": "PlannedSellThru",
            "Index_value": "IndexPercentage",
        }

        for key, var_name in field_map.items():
            data = updated_context.get(key)
            if not data:
                continue

            # Map month values
            forecast_data = {month_keys[mon]: val for mon, val in data.items() if mon in month_keys}
            
            # Create or update the entry
            MonthlyForecast.objects.update_or_create(
                product=product,
                variable_name=var_name,
                year=year,
                defaults=forecast_data
            )

            