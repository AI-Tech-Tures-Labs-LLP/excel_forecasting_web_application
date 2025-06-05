# exportExcel.py
# Standard library imports
import os
from multiprocessing import Pool, cpu_count
from datetime import datetime
from django.conf import settings
import json
# Third-party imports
import numpy as np
import pandas as pd
import openpyxl
from openpyxl.styles import (Alignment,Border,Font,PatternFill,GradientFill,Side)
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles import Alignment
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
from openpyxl import load_workbook


# Local application imports
from .readInputExcel import readInputExcel
from forecast.service.adddatabase import save_macys_projection_receipts, save_monthly_forecasts, save_rolling_forecasts
from forecast.models import MonthlyForecast, ProductDetail, StoreForecast, ComForecast, OmniForecast, RetailInfo
from forecast.service.staticVariable import omni_rename_map, com_rename_map, store_rename_map
import calendar
from forecast.service.getretailinfo import year_of_previous_month, last_year_of_previous_month, current_month, current_month_number, previous_week_number, last_month_of_previous_month_numeric, season, rolling_method, feb_weeks, mar_weeks, apr_weeks, may_weeks, jun_weeks, jul_weeks, aug_weeks, sep_weeks, oct_weeks, nov_weeks, dec_weeks, jan_weeks
from forecast.service.createDataframe import DataFrameBuilder
from forecast.service.sales_forecasting_algorithmpartwithcom_new_log import algorithm
from forecast.service.var import VariableLoader

def process_data(input_path, file_path, month_from, month_to, percentage, input_tuple):

    print("Input path:", input_path)
    sheets, return_QA_df = readInputExcel(input_path)

    # Map full month name to 3-letter uppercase abbreviation
    def get_month_abbr(month_name):
        try:
            month_index = list(calendar.month_name).index(month_name.capitalize())
            return calendar.month_abbr[month_index].upper()  # e.g., "November" → "NOV"
        except ValueError:
            raise ValueError(f"Invalid month name: {month_name}")

    # Convert input to abbreviations
    month_from_abbr = get_month_abbr(month_from)
    month_to_abbr = get_month_abbr(month_to)

    # Generate STD_PERIOD from month_from_abbr to month_to_abbr
    all_months = list(calendar.month_abbr)[1:]  # ['Jan', ..., 'Dec']
    month_map = {m.upper(): i+1 for i, m in enumerate(all_months)}  # 'JAN' -> 1

    start_idx = month_map[month_from_abbr]
    end_idx = month_map[month_to_abbr]

    # Handle wrap-around (e.g., NOV to FEB)
    if start_idx <= end_idx:
        selected_months = all_months[start_idx-1:end_idx]
    else:
        selected_months = all_months[start_idx-1:] + all_months[:end_idx]

    std_period = [m.upper() for m in selected_months]

    CURRENT_MONTH_SALES_PERCENTAGES = float(percentage)
    STD_PERIOD = std_period


    # Step 3: Create instance
    builder = DataFrameBuilder(sheets, return_QA_df)

    # Step 4: Run all logic
    builder.build()

    # Step 5: Access outputs
    df_outputs = builder.get_outputs()

    print("Report Grouping DataFrame:", df_outputs['report_grouping_df'].head())

    print("Processing data...")
    print(df_outputs['report_grouping_df'])

    # category = [
    #     ('Bridge Gem', '742'),
    #     ('Gold', '746'),
    #     ('Gold', '262&270'),
    #     ('Womens Silver', '260&404'),
    #     ('Precious', '264&268'),
    #     ('Fine Pearl', '265&271'),
    #     ('Semi', '272&733'),
    #     ('Diamond', '734&737&748'),
    #     ('Bridal', '739&267&263'),
    #     ("Men's", '768&771'),
    #     ("Pearl",'740')
    # ]

    category = input_tuple
    print("Category:", category)
    dynamic_categories = []
    for category_name, code in category:
        try:
            match_key = f"{category_name.upper()}{code}".upper()
            filtered = df_outputs['report_grouping_df'].loc[
                df_outputs['report_grouping_df']["Cross ref"].str.upper() == match_key, "Count of PID"
            ]
            
            if not filtered.empty:
                # If multiple values returned (e.g., [187, NaN]), get the first valid number
                if isinstance(filtered.values[0], (np.ndarray, list, pd.Series)):
                    num_products = next((x for x in filtered.values[0] if pd.notna(x)), None)
                else:
                    num_products = filtered.values[0] if pd.notna(filtered.values[0]) else None
            else:
                num_products = None

            dynamic_categories.append((category_name, code, num_products))
        except Exception as e:
            print(f"Error processing {category_name} {code}: {e}")
            dynamic_categories.append((category_name, code, None))

    # Shared static data
    static_data = (
        year_of_previous_month, last_year_of_previous_month, season,
        current_month, current_month_number, previous_week_number,
        last_month_of_previous_month_numeric, rolling_method,
        feb_weeks, mar_weeks, apr_weeks, may_weeks, jun_weeks,
        jul_weeks, aug_weeks, sep_weeks, oct_weeks, nov_weeks,
        dec_weeks, jan_weeks
    )

    RetailInfo.objects.create(
    year_of_previous_month=year_of_previous_month,
    last_year_of_previous_month=last_year_of_previous_month,
    season=season,
    current_month=current_month,
    current_month_number=current_month_number,
    previous_week_number=previous_week_number,
    last_month_of_previous_month_numeric=last_month_of_previous_month_numeric,
    rolling_method=rolling_method,

    feb_weeks=feb_weeks,
    mar_weeks=mar_weeks,
    apr_weeks=apr_weeks,
    may_weeks=may_weeks,
    jun_weeks=jun_weeks,
    jul_weeks=jul_weeks,
    aug_weeks=aug_weeks,
    sep_weeks=sep_weeks,
    oct_weeks=oct_weeks,
    nov_weeks=nov_weeks,
    dec_weeks=dec_weeks,
    jan_weeks=jan_weeks

    )

    args_list = [
        (df_outputs,sheets,return_QA_df,category, code, num_products, static_data, file_path,STD_PERIOD,CURRENT_MONTH_SALES_PERCENTAGES)
        for category, code, num_products in dynamic_categories
    ]

    store, coms, omni = [], [], []

    with Pool(processes=cpu_count()) as pool:
        results = pool.map(process_category, args_list)

    for result in results:
        if result:
            s, c, o = result
            store.extend(s)
            coms.extend(c)
            omni.extend(o)

    df_store = pd.DataFrame(store)
    df_coms = pd.DataFrame(coms)
    df_omni = pd.DataFrame(omni)

    def parse_selected_months(value):
        if isinstance(value, (list, tuple)):
            # Already a list or tuple, return as is
            return value
        elif isinstance(value, str):
            try:
                # Try to evaluate it as a string representation of a list
                return eval(value)
            except:
                # If eval fails, try json.loads
                
                try:
                    return json.loads(value)
                except:
                    # If all parsing fails, return an empty list as fallback
                    return []
        else:
            # Not a string or list, return empty list
            return []
        
    print("DataFrames created successfully.")
    print()
    # Create dictionaries for each record
    store_instances = [
    {
        'category': row['category'],
        'pid': row['pid'],
        'forecast_month': row['forecast_month'],
        'lead_time': int(row['lead time']),
        'leadtime_holiday_adjustment': bool(row.get('leadtime holiday adjustment', False)),
        'month_12_fc_index': row['month_12_fc_index'],
        'loss': row['loss'],
        'month_12_fc_index_loss': row['month_12_fc_index_(loss)'],
        'selected_months': parse_selected_months(row['selected_months']),
        'trend': row['trend'],
        'inventory_maintained': bool(row.get('Inventory maintained', False)),
        'trend_index_difference': row['trend index difference'],
        'red_box_item': bool(row.get('red_box item', False)),
        'forecasting_method': row['forecasting_method'],
        'door_count': row['Door Count'],
        'average_com_oh': row['average com_oh'],
        'fldc': row['FLDC'],
        'birthstone': row['birthstone'],
        'birthstone_month': row['birthstone_month'],
        'considered_birthstone_required_quantity': bool(row.get('considered birthstone', False)),
        'forecast_month_required_quantity': row['forecast_month_required_quantity'],
        'forecast_month_planned_oh': row['forecast_month_planned_oh_before_adding_qty'],
        'next_forecast_month': row['Next_forecast_month'],
        'next_forecast_month_required_quantity': row['Next_forecast_month_required_quantity'],
        'next_forecast_month_planned_oh': row['Next_forecast_month_planned_oh_before_adding_qty'],
        'added_qty_macys_soq': row['Added qtys by Macys SOQ'],
        'forecast_month_planned_shipment': row['forecast_month_planned_shipment'],
        'next_forecast_month_planned_shipment': row['Next_forecast_month_planned_shipment'],
        'total_added_qty': row['Total added qty']  if row['Total added qty'] > 0 else 0,
        'vendor': row.get('vendor', ''),
        'Valentine_day': bool(row.get('Valentine_day', False)),
        'Mothers_day': bool(row.get('Mothers_day', False)),
        'Fathers_day': bool(row.get('Fathers_day', False)),
        'Mens_day': bool(row.get('Mens_day', False)),
        'Womens_day': bool(row.get('Womens_day', False)),
        'Min_order': float(row.get('Min_order', 0)),
        'Macys_SOQ': float(row.get('Macys_SOQ', 0)),
        'Qty_given_to_macys': float(row.get('Qty_given_to_macys', 0)),
        'Added_qty_using_macys_SOQ': bool(row.get('Added qty using macys_SOQ', False)),
        'Below_min_order': bool(row.get('Below_min_order', False)),
        'Over_macys_SOQ': bool(row.get('Over_macys_SOQ', False)),
        'Added_only_to_balance_macys_SOQ': bool(row.get('Added_only_to_balance_macys_SOQ', False)),
        'Need_to_review_first': bool(row.get('Need_to_review_first', False)),
        'qty_added_to_maintain_OH_forecast_month': row['Qty_added_to_maintain_OH_forecast_month'],
        'qty_added_to_maintain_OH_next_forecast_month': row['Qty_added_to_maintain_OH_next_forecast_month'],
        'qty_added_to_balance_SOQ_forecast_month': row['Qty_added_to_balance_SOQ_forecast_month'],
        'average_store_sale_thru': row['average_store_sale_thru'],
        'macy_SOQ_percentage': row['Macy_SOQ_percentage'],
        'STD_index_value_original': row['STD_index_value_original'],
        'month_12_fc_index_original': row['month_12_fc_index_original'],
        'std_trend_original': row['std_trend_original']
    }
    for _, row in df_store.iterrows()
]
    # Similarly for ComForecast
    com_instances = [
    {
        'category': row['category'],
        'pid': row['pid'],
        'forecast_month': row['forecast_month'],
        'lead_time': int(row['lead time']),
        'leadtime_holiday_adjustment': bool(row.get('leadtime holiday adjustment', False)),
        'selected_months': parse_selected_months(row['selected_months']),
        'com_month_12_fc_index': row['com_month_12_fc_index'],
        'com_trend': row['com trend'],
        'trend': row['trend'],
        'inventory_maintained': bool(row.get('Inventory maintained', False)),
        'trend_index_difference': row['trend index difference'],
        'red_box_item': bool(row.get('red_box item', False)),
        'forecasting_method': row['forecasting_method'],
        'minimum_required_oh_for_com': row['minimum required oh for com'],
        'fldc': row['FLDC'],
        'forecast_month_required_quantity': row['forecast_month_required_quantity'],
        'forecast_month_planned_oh': row['forecast_month_planned_oh_before_adding_qty'],
        'next_forecast_month': row['Next_forecast_month'],
        'next_forecast_month_required_quantity': row['Next_forecast_month_required_quantity'],
        'next_forecast_month_planned_oh': row['Next_forecast_month_planned_oh_before_adding_qty'],
        'added_qty_macys_soq': row['Added qtys by Macys SOQ'],
        'vdf_status': bool(row.get('VDF_status', False)),
        'vdf_added_qty': row['VDF_added_qty'],
        'forecast_month_planned_shipment': row['forecast_month_planned_shipment'],
        'next_forecast_month_planned_shipment': row['Next_forecast_month_planned_shipment'],
        'total_added_qty': row['Total added qty'] if row['Total added qty'] > 0 else 0,
        'vendor': row.get('vendor', ''),
        'Valentine_day': bool(row.get('Valentine_day', False)),
        'Mothers_day': bool(row.get('Mothers_day', False)),
        'Fathers_day': bool(row.get('Fathers_day', False)),
        'Mens_day': bool(row.get('Mens_day', False)),
        'Womens_day': bool(row.get('Womens_day', False)),
        'Min_order': float(row.get('Min_order', 0)),
        'Macys_SOQ': float(row.get('Macys_SOQ', 0)),
        'Qty_given_to_macys': float(row.get('Qty_given_to_macys', 0)),
        'Added_qty_using_macys_SOQ': bool(row.get('Added_qty_using_macys_SOQ', False)),
        'Below_min_order': bool(row.get('Below_min_order', False)),
        'Over_macys_SOQ': bool(row.get('Over_macys_SOQ', False)),
        'Added_only_to_balance_macys_SOQ': bool(row.get('Added_only_to_balance_macys_SOQ', False)),
        'Need_to_review_first': bool(row.get('Need_to_review_first', False)),
        'qty_added_to_maintain_OH_forecast_month': row['Qty_added_to_maintain_OH_forecast_month'],
        'qty_added_to_maintain_OH_next_forecast_month': row['Qty_added_to_maintain_OH_next_forecast_month'],
        'qty_added_to_balance_SOQ_forecast_month': row['Qty_added_to_balance_SOQ_forecast_month'],
        'average_store_sale_thru': row['average_store_sale_thru'],
        'macy_SOQ_percentage': row['Macy_SOQ_percentage'],
        'STD_index_value_original': row['STD_index_value_original'],
        'month_12_fc_index_original': row['month_12_fc_index_original'],
        'std_trend_original': row['std_trend_original']
    }
    for _, row in df_coms.iterrows()
]

    # And for OmniForecast
    omni_instances = [
    {
        'category': row['category'],
        'pid': row['pid'],
        'forecast_month': row['forecast_month'],
        'lead_time': int(row['lead time']),
        'leadtime_holiday_adjustment': bool(row.get('leadtime holiday adjustment', False)),
        'selected_months': parse_selected_months(row['selected_months']),
        'com_month_12_fc_index': row['Com month_12_fc_index'],
        'com_trend': row['com trend'],
        'com_inventory_maintained': bool(row.get('Com Inventory maintained', False)),
        'trend_index_difference_com': row['trend index difference(com)'],
        'red_box_item': bool(row.get('red_box item', False)),
        'forecasting_method_com': row['forecasting_method(com)'],
        'minimum_required_oh_for_com': row['minimum required oh for com'],
        'com_fldc': row['Com FLDC'],
        'forecast_month_required_quantity_com': row['forecast_month_required_quantity_com'],
        'next_forecast_month': row['Next_forecast_month'],
        'next_forecast_month_required_quantity_com': row['Next_forecast_month_required_quantity_com'],
        'store_month_12_fc_index': row['store_month_12_fc_index'],
        'loss': row['loss'],
        'store_month_12_fc_index_loss': row['store_month_12_fc_index_(loss)'],
        'store_trend': row['store_trend'],
        'store_trend_index_difference': row['trend index difference(store)'],
        'store_inventory_maintained': bool(row.get('store Inventory maintained', False)),
        'forecasting_method_store': row['forecasting_method(store)'],
        'door_count': row['Door Count'],
        'store_fldc': row['store FLDC'],
        'birthstone': row['birthstone'],
        'birthstone_month': row['birthstone_month'],
        'considered_birthstone_required_quantity': bool(row.get('considered birthstone for requried quantity', False)),
        'forecast_month_required_quantity_store': row['forecast_month_required_quantity_store'],
        'next_forecast_month_required_quantity_store': row['Next_forecast_month_required_quantity_store'],
        'forecast_month_required_quantity_total': row['forecast_month_required_quantity_combined'],
        'forecast_month_planned_oh': row['forecast_month_planned_oh_before_adding_qty'],
        'next_forecast_month_required_quantity_total': row['Next_forecast_month_required_quantity_combined'],
        'next_forecast_month_planned_oh': row['Next_forecast_month_planned_oh_before_adding_qty'],
        'added_qty_macys_soq': row['Added qtys by Macys SOQ'],
        'forecast_month_planned_shipment': row['forecast_month_planned_shipment'],
        'next_forecast_month_planned_shipment': row['Next_forecast_month_planned_shipment'],
        'total_added_qty': row['Total added qty']  if row['Total added qty'] > 0 else 0,
        'vendor': row.get('vendor', ''),
        'Valentine_day': bool(row.get('Valentine_day', False)),
        'Mothers_day': bool(row.get('Mothers_day', False)),
        'Fathers_day': bool(row.get('Fathers_day', False)),
        'Mens_day': bool(row.get('Mens_day', False)),
        'Womens_day': bool(row.get('Womens_day', False)),
        'Min_order': float(row.get('Min_order', 0)),
        'Macys_SOQ': float(row.get('Macys_SOQ', 0)),
        'Qty_given_to_macys': float(row.get('Qty_given_to_macys', 0)),
        'Added_qty_using_macys_SOQ': bool(row.get('Added_qty_using_macys_SOQ', False)),
        'Below_min_order': bool(row.get('Below_min_order', False)),
        'Over_macys_SOQ': bool(row.get('Over_macys_SOQ', False)),
        'Added_only_to_balance_macys_SOQ': bool(row.get('Added_only_to_balance_macys_SOQ', False)),
        'Need_to_review_first': bool(row.get('Need_to_review_first', False)),
        'qty_added_to_maintain_OH_forecast_month': row['Qty_added_to_maintain_OH_forecast_month'],
        'qty_added_to_maintain_OH_next_forecast_month': row['Qty_added_to_maintain_OH_next_forecast_month'],
        'qty_added_to_balance_SOQ_forecast_month': row['Qty_added_to_balance_SOQ_forecast_month'],
        'average_store_sale_thru': row['average_store_sale_thru'],
        'macy_SOQ_percentage': row['Macy_SOQ_percentage'],
        'STD_index_value_original': row['STD_index_value_original'],
        'month_12_fc_index_original': row['month_12_fc_index_original'],
        'std_trend_original': row['std_trend_original']
    }
    for _, row in df_omni.iterrows()
]


    # For StoreForecast

    print("Starting StoreForecast data save/update...")
    for instance in store_instances:
        StoreForecast.objects.update_or_create(
            category=instance['category'],
            pid=instance['pid'],
            forecast_month=instance['forecast_month'],
            defaults={
                'lead_time': instance['lead_time'],
                'leadtime_holiday_adjustment': instance['leadtime_holiday_adjustment'],
                'month_12_fc_index': instance['month_12_fc_index'],
                'loss': instance['loss'],
                'month_12_fc_index_loss': instance['month_12_fc_index_loss'],
                'selected_months': instance['selected_months'],
                'trend': instance['trend'],
                'inventory_maintained': instance['inventory_maintained'],
                'trend_index_difference': instance['trend_index_difference'],
                'red_box_item': instance['red_box_item'],
                'forecasting_method': instance['forecasting_method'],
                'door_count': instance['door_count'],
                'average_com_oh': instance['average_com_oh'],
                'fldc': instance['fldc'],
                'birthstone': instance['birthstone'],
                'birthstone_month': instance['birthstone_month'],
                'considered_birthstone_required_quantity': instance['considered_birthstone_required_quantity'],
                'forecast_month_required_quantity': instance['forecast_month_required_quantity'],
                'forecast_month_planned_oh': instance['forecast_month_planned_oh'],
                'next_forecast_month': instance['next_forecast_month'],
                'next_forecast_month_required_quantity': instance['next_forecast_month_required_quantity'],
                'next_forecast_month_planned_oh': instance['next_forecast_month_planned_oh'],
                'added_qty_macys_soq': instance['added_qty_macys_soq'],
                'forecast_month_planned_shipment': instance['forecast_month_planned_shipment'],
                'next_forecast_month_planned_shipment': instance['next_forecast_month_planned_shipment'],
                'total_added_qty': instance['total_added_qty'],
                'vendor': instance['vendor'],
                'Valentine_day': instance['Valentine_day'],
                'Mothers_day': instance['Mothers_day'],
                'Fathers_day': instance['Fathers_day'],
                'Mens_day': instance['Mens_day'],
                'Womens_day': instance['Womens_day'],
                'Min_order': instance['Min_order'],
                'Macys_SOQ': instance['Macys_SOQ'],
                'Qty_given_to_macys': instance['Qty_given_to_macys'],
                'Added_qty_using_macys_SOQ': instance['Added_qty_using_macys_SOQ'],
                'Below_min_order': instance['Below_min_order'],
                'Over_macys_SOQ': instance['Over_macys_SOQ'],
                'Added_only_to_balance_macys_SOQ': instance['Added_only_to_balance_macys_SOQ'],
                'Need_to_review_first': instance['Need_to_review_first'],
                'qty_added_to_maintain_OH_forecast_month' : instance['qty_added_to_maintain_OH_forecast_month'],
                'qty_added_to_maintain_OH_next_forecast_month' : instance['qty_added_to_maintain_OH_next_forecast_month'],
                'qty_added_to_balance_SOQ_forecast_month' : instance['qty_added_to_balance_SOQ_forecast_month'],
                'average_store_sale_thru' : instance['average_store_sale_thru'],
                'macy_SOQ_percentage' : instance['macy_SOQ_percentage'],
                'STD_index_value_original': instance['STD_index_value_original'],
                'month_12_fc_index_original': instance['month_12_fc_index_original'],
                'std_trend_original': instance['std_trend_original']
            }
        )
    print("StoreForecast data saved/updated successfully.")

    # For ComForecast
    print("Starting ComForecast data save/update...")
    for instance in com_instances:
        ComForecast.objects.update_or_create(
            category=instance['category'],
            pid=instance['pid'],
            forecast_month=instance['forecast_month'],
            defaults={
                'lead_time': instance['lead_time'],
                'leadtime_holiday_adjustment': instance['leadtime_holiday_adjustment'],
                'selected_months': instance['selected_months'],
                'com_month_12_fc_index': instance['com_month_12_fc_index'],
                'com_trend': instance['com_trend'],
                'trend': instance['trend'],
                'inventory_maintained': instance['inventory_maintained'],
                'trend_index_difference': instance['trend_index_difference'],
                'red_box_item': instance['red_box_item'],
                'forecasting_method': instance['forecasting_method'],
                'minimum_required_oh_for_com': instance['minimum_required_oh_for_com'],
                'fldc': instance['fldc'],
                'forecast_month_required_quantity': instance['forecast_month_required_quantity'],
                'forecast_month_planned_oh': instance['forecast_month_planned_oh'],
                'next_forecast_month': instance['next_forecast_month'],
                'next_forecast_month_required_quantity': instance['next_forecast_month_required_quantity'],
                'next_forecast_month_planned_oh': instance['next_forecast_month_planned_oh'],
                'added_qty_macys_soq': instance['added_qty_macys_soq'],
                'vdf_status': instance['vdf_status'],
                'vdf_added_qty': instance['vdf_added_qty'],
                'forecast_month_planned_shipment': instance['forecast_month_planned_shipment'],
                'next_forecast_month_planned_shipment': instance['next_forecast_month_planned_shipment'],
                'total_added_qty': instance['total_added_qty'],
                'vendor': instance['vendor'],
                'Valentine_day': instance['Valentine_day'],
                'Mothers_day': instance['Mothers_day'],
                'Fathers_day': instance['Fathers_day'],
                'Mens_day': instance['Mens_day'],
                'Womens_day': instance['Womens_day'],
                'Min_order': instance['Min_order'],
                'Macys_SOQ': instance['Macys_SOQ'],
                'Qty_given_to_macys': instance['Qty_given_to_macys'],
                'Added_qty_using_macys_SOQ': instance['Added_qty_using_macys_SOQ'],
                'Below_min_order': instance['Below_min_order'],
                'Over_macys_SOQ': instance['Over_macys_SOQ'],
                'Added_only_to_balance_macys_SOQ': instance['Added_only_to_balance_macys_SOQ'],
                'Need_to_review_first': instance['Need_to_review_first'],
                'qty_added_to_maintain_OH_forecast_month' : instance['qty_added_to_maintain_OH_forecast_month'],
                'qty_added_to_maintain_OH_next_forecast_month' : instance['qty_added_to_maintain_OH_next_forecast_month'],
                'qty_added_to_balance_SOQ_forecast_month' : instance['qty_added_to_balance_SOQ_forecast_month'],
                'average_store_sale_thru' : instance['average_store_sale_thru'],
                'macy_SOQ_percentage' : instance['macy_SOQ_percentage'],
                'STD_index_value_original': instance['STD_index_value_original'],
                'month_12_fc_index_original': instance['month_12_fc_index_original'],
                'std_trend_original': instance['std_trend_original']
            }
        )
    print("ComForecast data saved/updated successfully.")

   # For OmniForecast - Updated with all the fields matching the model definition
    print("Starting OmniForecast data save/update...")
    for instance in omni_instances:
        OmniForecast.objects.update_or_create(
            category=instance['category'],
            pid=instance['pid'],
            forecast_month=instance['forecast_month'],
            defaults={
                'lead_time': instance['lead_time'],
                'leadtime_holiday_adjustment': instance['leadtime_holiday_adjustment'],
                'selected_months': instance['selected_months'],
                'com_month_12_fc_index': instance['com_month_12_fc_index'],
                'com_trend': instance['com_trend'],
                'com_inventory_maintained': instance['com_inventory_maintained'],
                'red_box_item': instance['red_box_item'],
                'minimum_required_oh_for_com': instance['minimum_required_oh_for_com'],
                'com_fldc': instance['com_fldc'],
                'next_forecast_month': instance['next_forecast_month'],
                'store_month_12_fc_index': instance['store_month_12_fc_index'],
                'loss': instance['loss'],
                'store_month_12_fc_index_loss': instance['store_month_12_fc_index_loss'],
                'store_trend': instance['store_trend'],
                'store_inventory_maintained': instance['store_inventory_maintained'],
                'door_count': instance['door_count'],
                'store_fldc': instance['store_fldc'],
                'birthstone': instance['birthstone'],
                'birthstone_month': instance['birthstone_month'],
                'considered_birthstone_required_quantity': instance['considered_birthstone_required_quantity'],
                'forecast_month_planned_oh': instance['forecast_month_planned_oh'],
                'next_forecast_month_planned_oh': instance['next_forecast_month_planned_oh'],
                'added_qty_macys_soq': instance['added_qty_macys_soq'],
                'forecast_month_planned_shipment': instance['forecast_month_planned_shipment'],
                'next_forecast_month_planned_shipment': instance['next_forecast_month_planned_shipment'],
                'total_added_qty': instance['total_added_qty'],
                'vendor': instance['vendor'],
                'Valentine_day': instance['Valentine_day'],
                'Mothers_day': instance['Mothers_day'],
                'Fathers_day': instance['Fathers_day'],
                'Mens_day': instance['Mens_day'],
                'Womens_day': instance['Womens_day'],
                'Min_order': instance['Min_order'],
                'Macys_SOQ': instance['Macys_SOQ'],
                'Qty_given_to_macys': instance['Qty_given_to_macys'],
                'Added_qty_using_macys_SOQ': instance['Added_qty_using_macys_SOQ'],
                'Below_min_order': instance['Below_min_order'],
                'Over_macys_SOQ': instance['Over_macys_SOQ'],
                'Added_only_to_balance_macys_SOQ': instance['Added_only_to_balance_macys_SOQ'],
                'Need_to_review_first': instance['Need_to_review_first'],
                # New fields from the model
                'RLJ': instance.get('RLJ', None),  # Including the RLJ field, defaulting to None if not in instance
                'trend_index_difference_com': instance['trend_index_difference_com'],
                'trend_index_difference_store': instance['store_trend_index_difference'],
                'forecasting_method_com': instance['forecasting_method_com'],
                'forecasting_method_store': instance['forecasting_method_store'],
                'forecast_month_required_quantity_com': instance['forecast_month_required_quantity_com'],
                'next_forecast_month_required_quantity_com': instance['next_forecast_month_required_quantity_com'],
                'forecast_month_required_quantity_store': instance['forecast_month_required_quantity_store'],
                'next_forecast_month_required_quantity_store': instance['next_forecast_month_required_quantity_store'],
                'forecast_month_required_quantity_total': instance['forecast_month_required_quantity_total'],
                'next_forecast_month_required_quantity_total': instance['next_forecast_month_required_quantity_total'],
                'qty_added_to_maintain_OH_forecast_month' : instance['qty_added_to_maintain_OH_forecast_month'],
                'qty_added_to_maintain_OH_next_forecast_month' : instance['qty_added_to_maintain_OH_next_forecast_month'],
                'qty_added_to_balance_SOQ_forecast_month' : instance['qty_added_to_balance_SOQ_forecast_month'],
                'average_store_sale_thru' : instance['average_store_sale_thru'],
                'macy_SOQ_percentage' : instance['macy_SOQ_percentage'],
                'STD_index_value_original': instance['STD_index_value_original'],
                'month_12_fc_index_original': instance['month_12_fc_index_original'],
                'std_trend_original': instance['std_trend_original']
            }
        )
    print("OmniForecast data saved/updated successfully.")
    # Write to different sheets in one Excel file
    file_path = os.path.join(settings.MEDIA_ROOT, "forecast_summaryfor_april_4.xlsx")
    df_store_renamed = df_store.rename(columns=store_rename_map)
    df_coms_renamed = df_coms.rename(columns=com_rename_map)
    df_omni_renamed = df_omni.rename(columns=omni_rename_map)
    # df_omni_renamed = df_omni.rename(columns=omni_rename_map)  # Optional if needed
 
    # ---------------------------------------
    # 3. Now filter the columns as in previous answer
    # ---------------------------------------
    df_store_filtered = df_store_renamed[[col for col in store_rename_map.values()]]
    df_coms_filtered = df_coms_renamed[[col for col in com_rename_map.values()]]
    df_omni_filtered = df_omni_renamed[[col for col in omni_rename_map.values()]]
   
    output_file = file_path

    # Reopen and format
    wb = load_workbook(output_file)
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
 
        # --- Fix header row ---
        for cell in ws[1]:
            cell.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
 
        ws.row_dimensions[1].height = 30  # Set this to 25–35 for good look
 
        # --- Adjust column width ---
        for col in ws.columns:
            max_length = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                if cell.value:
                    max_length = max(max_length, len(str(cell.value)))
            ws.column_dimensions[col_letter].width = max_length + 2
        # Save changes
    with pd.ExcelWriter(output_file, engine="xlsxwriter") as writer:
        for sheet_name, df in [
            ("store", df_store_filtered),
            ("coms", df_coms_filtered),
            ("omni", df_omni_filtered)
        ]:
            df.to_excel(writer, sheet_name=sheet_name, index=False, startrow=1, header=False)

            workbook = writer.book
            worksheet = writer.sheets[sheet_name]

            # Write header manually
            for col_num, column_title in enumerate(df.columns):
                worksheet.write(0, col_num, column_title)

            # Add Excel table
            worksheet.add_table(
                0, 0, len(df), len(df.columns) - 1,
                {
                    "name": f"{sheet_name}_table",
                    "columns": [{"header": col} for col in df.columns],
                    "style": "Table Style Medium 9"
                }
            )
 

    
    print("Data written to Excel file successfully.")    


def process_category(args):    

    df_outputs,sheets,return_QA_df,category, code, num_products, static_data, file_path,STD_PERIOD,CURRENT_MONTH_SALES_PERCENTAGES= args
    print(f"[DEBUG] category: {category}, code: {code}, num_products: {num_products}")

    (year_of_previous_month, last_year_of_previous_month, season,
    current_month, current_month_number, previous_week_number,
    last_month_of_previous_month_numeric, rolling_method,
    feb_weeks, mar_weeks, apr_weeks, may_weeks, jun_weeks,
    jul_weeks, aug_weeks, sep_weeks, oct_weeks, nov_weeks,
    dec_weeks, jan_weeks ) = static_data
    store = []
    coms = []
    omni = []
    print('num_products',num_products)
   
   
    for loop in range(num_products):
        g_value = loop + 1
        cross_ref = f"{g_value}{category.upper()}{code}"  # Ensure no spaces in category
        matching_row = df_outputs['planning_df'].loc[df_outputs['planning_df']['Cross ref'].str.upper() == cross_ref]
        pid_value = matching_row['PID'].iloc[0]
        Macys_Recpts_matching_row=df_outputs['Macys_Recpts'].loc[df_outputs['Macys_Recpts']['PID'].str.upper() == pid_value]
        # Find the matching rows
        print("pid_value:", pid_value)
        loader = VariableLoader(cross_ref,matching_row,Macys_Recpts_matching_row,df_outputs['index_df'],df_outputs['All_DATA'],df_outputs['MCOM_Data'],STD_PERIOD)
        print("Processing PID:", pid_value)
        print("Loader object created successfully.")
        print("df_outputs['master_sheet']:", df_outputs['master_sheet'])
        print("df_outputs['vendor_sheet']:", df_outputs['vendor_sheet'])
        print("df_outputs['birthstone_sheet']:", df_outputs['birthstone_sheet'])
        print("df_outputs['return_QA_df']:", df_outputs['return_QA_df'])
        
        vendor = df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value, 'Vendor Name'].values[0] if not df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value, 'Vendor Name'].empty else None
        print("Vendor:", vendor)
        return_QA_df_row = df_outputs['return_QA_df'][df_outputs['return_QA_df']['PID'] == pid_value]
        print("Return QA DataFrame row:", return_QA_df_row)
        master_sheet_row = df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value]
        print("Master sheet row:", master_sheet_row)
        current_month,pid_type,std_trend,STD_index_value ,month_12_fc_index,forecasting_method,planned_shp,planned_fc,pid_omni_status,store,coms,omni,fc_by_index, fc_by_trend, recommended_fc, planned_oh, planned_sell_thru,total_added_quantity = algorithm(current_month,year_of_previous_month,season,previous_week_number,vendor,master_sheet_row, df_outputs['vendor_sheet'],df_outputs['birthstone_sheet'], return_QA_df_row, loader, category, store, coms, omni, code,CURRENT_MONTH_SALES_PERCENTAGES,STD_PERIOD)
        print("################################################################3",total_added_quantity)

        def safe_int(value):
            """Convert value to int or return None if conversion fails"""
            if pd.isna(value):
                return None
            try:
                return int(value)
            except (ValueError, TypeError):
                return None
                
        def safe_float(value):
            """Convert value to float or return None if conversion fails"""
            if pd.isna(value):
                return None
            try:
                return float(value)
            except (ValueError, TypeError):
                return None
                
        def safe_str(value, max_length=None):
            """Convert value to string, respecting max_length if provided"""
            if pd.isna(value):
                return None
            try:
                result = str(value).strip()
                if max_length and len(result) > max_length:
                    result = result[:max_length]
                return result
            except:
                return None
        
        def parse_date(date_value):
            """
            Parses a date value (string or pandas Timestamp) into a datetime.date object.
            Handles multiple formats and NaT (Not a Time) values.
            """
            if pd.isna(date_value) or date_value in ["NaT", None, ""]:
                return None  # Handle missing or NaT values

            # If the value is already a pandas Timestamp, convert it to date
            if isinstance(date_value, pd.Timestamp):
                return date_value.date()

            # Ensure the value is a string for parsing
            date_str = str(date_value).strip()

            try:
                # Try to parse "M/D/YYYY" or "MM/DD/YYYY" format
                return datetime.strptime(date_str.split()[0], "%m/%d/%Y").date()
            except ValueError:
                try:
                    # Try to parse "M/D/YYYY H:MM:SS AM/PM" format
                    return datetime.strptime(date_str.split(' ', 1)[0], "%m/%d/%Y").date()
                except ValueError:
                    try:
                        # Try parsing "YYYY-MM-DD HH:MM:SS" format (e.g., "2022-02-26 00:00:00")
                        return datetime.strptime(date_str.split()[0], "%Y-%m-%d").date()
                    except ValueError:
                        # Try various other possible formats
                        date_formats = ["%Y-%m-%d", "%d-%m-%Y", "%m-%d-%Y"]
                        for fmt in date_formats:
                            try:
                                return datetime.strptime(date_str.split()[0], fmt).date()
                            except ValueError:
                                continue
                        
                        # If all parsing attempts fail, print a warning and return None
                        print(f"Could not parse date: {date_value}")
                        return None
                    except Exception as e:
                        print(f"Error parsing date {date_value}: {e}")
                        return None

        months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        current_year = datetime.now().year 
        website_link = f"http://www.macys.com/shop/product/{loader.Prod_Desc}?ID={loader.Mktg_ID}"
        
        ProductDetail.objects.update_or_create(
            product_id=loader.pid_value,
            defaults={
                "product_description": safe_str(loader.PID_Desc),

                # Main identifiers
                "blu": safe_str(loader.RLJ),
                "mkst": safe_str(loader.MKST),
                "currect_fc_index": safe_str(loader.Current_FC_Index),

                # Classification fields
                "safe_non_safe": safe_str(loader.Safe_Non_Safe),
                "item_code": safe_str(loader.Item_Code),

                # Store information
                "current_door_count": safe_int(loader.Door_Count),
                "last_store_count": safe_int(loader.Last_Str_Cnt),
                "door_count_updated": parse_date(loader.Door_count_Updated),
                "store_model": safe_int(loader.Store_Model),
                "com_model": safe_int(loader.Com_Model),

                # Inventory and forecast fields
                "holiday_build_fc": safe_int(loader.Holiday_Bld_FC),
                "macys_onhand": safe_int(loader.MCYOH),
                "oo": safe_int(loader.OO),
                "in_transit": safe_int(loader.nav_OO),
                "month_to_date_shipment": safe_int(loader.MTD_SHIPMENTS),
                "lastweek_shipment": safe_int(loader.LW_Shipments),
                "planned_weeks_of_stock": safe_int(loader.Wks_of_Stock_OH),
                "weeks_of_projection": safe_int(loader.Wks_of_on_Proj),
                "last_4weeks_shipment": safe_int(loader.Last_3Wks_Ships),

                # Vendor information
                "vendor_name": safe_str(loader.Vendor_Name),
                "min_order": safe_int(loader.Min_order),

                # Projection fields
                "rl_total": safe_int(loader.Proj),
                "net_projection": safe_int(loader.Net_Proj),
                "unalloc_order": safe_int(loader.Unalloc_Orders),

                # Distribution center fields
                "ma_bin": safe_int(loader.RLJ_OH),
                "fldc": safe_int(loader.FLDC),
                "wip_quantity": safe_int(loader.WIP),

                # Status fields
                "md_status": safe_str(loader.MD_Status_MZ1),
                "replanishment_flag": safe_str(loader.Repl_Flag),
                "mcom_replanishment": safe_str(loader.MCOM_RPL),
                "pool_stock": safe_int(loader.Pool_stock),

                # Date fields
                "first_reciept_date": parse_date(loader.st_Rec_Date),
                "last_reciept_date": parse_date(loader.Last_Rec_Date),
                "item_age": safe_int(loader.Item_Age),
                "first_live_date": parse_date(loader.st_Live),

                # Cost and retail fields
                "this_year_last_cost": safe_float(loader.TY_Last_Cost),
                "macys_owned_retail": safe_float(loader.Own_Retail),
                "awr_first_ticket_retail": safe_float(loader.AWR_1st_Tkt_Ret),

                # Policy and configuration fields
                "metal_lock": safe_float(loader.Metal_Lock),
                "mfg_policy": safe_str(loader.MFG_Policy),

                # KPI fields
                "kpi_data_updated": safe_str(loader.KPI_Data_Updated),
                "kpi_door_count": safe_int(loader.KPI_Door_count),

                # Location fields
                "out_of_stock_location": safe_int(loader.OOS_Locs),
                "suspended_location_count": safe_int(loader.Suspended_Loc_Count),
                "live_site": safe_str(loader.Live_Site),

                # Product categorization fields
                "masterstyle_description": safe_str(loader.Masterstyle_Desc),
                "masterstyle_id": safe_str(loader.MstrSt_ID),

                "department_id": safe_int(loader.Dpt_ID),
                "department_description": safe_str(loader.Dpt_Desc),

                "subclass_id": safe_int(loader.SC_ID),
                "subclass_decription": safe_str(loader.SC_Desc),
                "webid_description": safe_str(loader.Prod_Desc),

                # Marketing fields
                "v2c": safe_str(loader.V2C),
                "marketing_id": safe_str(loader.Mktg_ID),
                

                "std_store_return": safe_float(loader.STD_Store_Rtn),

                # Planning fields
                "last_project_review_date": parse_date(loader.Last_Proj_Review_Date),
                "macy_spring_projection_note": safe_str(loader.Macys_Spring_Proj_Notes),
                "planner_response": safe_str(loader.Planner_Response),
                "website": website_link,

                "rolling_method" : rolling_method,
                "std_trend" : std_trend,
                "STD_index_value" : STD_index_value,
                "month_12_fc_index" : month_12_fc_index,
                "forecasting_method" : forecasting_method,

                "total_added_qty" : total_added_quantity if total_added_quantity > 0 else 0,
                "category": f"{category}{code}",
                "user_added_quantity": total_added_quantity if total_added_quantity > 0 else 0,
            }
        )


        productmain = ProductDetail.objects.get(product_id=loader.pid_value)

        
        save_macys_projection_receipts(productmain, loader.matched_row, current_year)
        save_monthly_forecasts(productmain, current_year, months, loader.TY_Unit_Sales, loader.LY_Unit_Sales, loader.LY_OH_Units, loader.TY_OH_Units, loader.TY_Receipts, loader.LY_Receipts, loader.TY_MCOM_Unit_Sales, loader.LY_MCOM_Unit_Sales, loader.TY_MCOM_OH_Units, loader.LY_MCOM_OH_Units, loader.PTD_TY_Sales, loader.LY_PTD_Sales, loader.MCOM_PTD_TY_Sales, loader.MCOM_PTD_LY_Sales, loader.OO_Total_Units, loader.OO_MCOM_Total_Units, loader.LY_store_unit_sales, loader.LY_store_EOM_OH, loader.LY_COM_to_TTL, loader.LY_COM_to_TTL_OH, loader.LY_omni_sell_through, loader.LY_store_sell_through, loader.LY_omni_turn, loader.LY_store_turn, loader.LY_Omni_AUR_Diff_Own, loader.TY_store_unit_sales, loader.TY_store_EOM_OH, loader.TY_COM_to_TTL, loader.TY_COM_to_TTL_OH, loader.TY_Omni_AUR_Diff_Own, loader.TY_Omni_sell_through, loader.TY_store_sell_through, loader.TY_omni_turn, loader.TY_store_turn, loader.TY_store_unit_sales_diff, loader.TY_com_unit_sales_diff, loader.TY_store_eom_oh_diff)
        
        forecast_data = { 
            'IndexPercentage':loader.index_value,
            'ForecastByIndex':fc_by_index,
            'ForecastByTrend': fc_by_trend,
            'RecommendedForecast': recommended_fc,
            'PlannedForecast': planned_fc,
            'PlannedShipment': planned_shp,
            "PlannedEOH": planned_oh,
            'GrossProjection' : loader.gross_proj,
            "MacysProjectionReciepts":loader.macys_proj_receipt,
            'PlannedSellThru': planned_sell_thru
            
            
        }
        save_rolling_forecasts(productmain, current_year, forecast_data)
        print(f"Product {loader.pid_value} saved successfully")

    # At the end of this function, return a tuple of (output_file, final_data, store, coms, omni)
    return  store, coms, omni
    