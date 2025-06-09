# exportExcel.py
# Standard library imports
import os
from multiprocessing import Pool, cpu_count
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from django.conf import settings
from django.db import transaction
import re
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
from datetime import datetime

# Local application imports
from .readInputExcel import read_input_excel
from forecast.service.adddatabase import save_macys_projection_receipts, save_monthly_forecasts, save_rolling_forecasts
from forecast.models import MonthlyForecast, ProductDetail, StoreForecast, ComForecast, OmniForecast, RetailInfo
from forecast.service.staticVariable import OMNI_RENAME_MAP, COM_RENAME_MAP, STORE_RENAME_MAP
import calendar
from forecast.service.getretailinfo import get_previous_retail_week
from forecast.service.createDataframe import DataFrameBuilder
from forecast.service.sales_forecasting_algorithmpartwithcom_new_log import algorithm
from forecast.service.var import VariableLoader
import logging
from forecast.service.utils import generate_std_period


def process_data(input_path, file_path, month_from, month_to, percentage, input_tuple,  sheet_object, current_date):
    current_date = datetime(2025,5,8)
    logging.info(f"Input path: {input_path}, File path: {file_path}, Month from: {month_from}, Month to: {month_to}, Percentage: {percentage}, Input tuple: {input_tuple}, Current date: {current_date}")

    sheets, return_qty_df = read_input_excel(input_path)

    std_period = generate_std_period(month_from, month_to)
    current_month_sales_percentage = float(percentage)

    logging.info(f"Current month sales percentage: {current_month_sales_percentage} , Standard period: {std_period}")

    builder = DataFrameBuilder(sheets, return_qty_df)

    builder.build()

    df_outputs = builder.get_outputs()

    logging.info("Report Grouping DataFrame: %s", df_outputs['report_grouping_df'].head())


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
    logging.info(f"Category: {category}")

    
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


    (current_month,current_month_number,rolling_method, previous_week_number, year_of_previous_month,last_year_of_previous_month, last_month_of_previous_month_numeric,season, feb_weeks, mar_weeks, apr_weeks, may_weeks,jun_weeks, jul_weeks, aug_weeks, sep_weeks, oct_weeks,nov_weeks, dec_weeks, jan_weeks) = static_data = get_previous_retail_week(current_date)

    logging.info(f"Retail info: {year_of_previous_month}, {last_year_of_previous_month}, {season}, {current_month}, {current_month_number}, {previous_week_number}, {last_month_of_previous_month_numeric}, {rolling_method}, {feb_weeks}, {mar_weeks}, {apr_weeks}, {may_weeks}, {jun_weeks}, {jul_weeks}, {aug_weeks}, {sep_weeks}, {oct_weeks}, {nov_weeks}, {dec_weeks}, {jan_weeks}")

    # Create or update RetailInfo instance
    with transaction.atomic():
        RetailInfo.objects.create(
            sheet=sheet_object,  # Add this if you have a SheetUpload instance to link
            year_of_previous_month=year_of_previous_month,
            last_year_of_previous_month=last_year_of_previous_month,
            season=season,
            # current_date=current_date,  # Add this if you have the value
            current_month=current_month,
            current_month_number=current_month_number,
            previous_week_number=previous_week_number,
            last_month_of_previous_month_numeric=last_month_of_previous_month_numeric,

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


    logging.info("RetailInfo saved successfully.")

    args_list = [
        (sheets, return_qty_df, df_outputs, category, code, num_products, static_data, file_path, std_period, current_month_sales_percentage, current_date, sheet_object)
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
    # max_workers = min(len(args_list), 4)  # Limit concurrent workers

    # try:
    #     with ThreadPoolExecutor(max_workers=max_workers) as executor:
    #         # Submit all tasks
    #         future_to_args = {executor.submit(process_category, args): args for args in args_list}
            
    #         # Collect results as they complete
    #         for future in as_completed(future_to_args):
    #             try:
    #                 result = future.result(timeout=300)  # 5 minute timeout per task
    #                 if result:
    #                     s, c, o = result
    #                     store.extend(s)
    #                     coms.extend(c)
    #                     omni.extend(o)
    #             except Exception as e:
    #                 args = future_to_args[future]
    #                 print(f"Error processing category {args[3]}{args[4]}: {e}")
    #                 continue
                    
    # except Exception as e:
    #     print(f"ThreadPoolExecutor error: {e}")
    #     # Fallback to sequential processing
    #     print("Falling back to sequential processing...")
    #     for args in args_list:
    #         try:
    #             result = process_category(args)
    #             if result:
    #                 s, c, o = result
    #                 store.extend(s)
    #                 coms.extend(c)
    #                 omni.extend(o)
    #         except Exception as e:
    #             print(f"Error in sequential processing for {args[3]}{args[4]}: {e}")
    #             continue

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
        'pid':row['pid'],        
        'loss': row['loss'],
        'new_month_12_fc_index': row['month_12_fc_index_(loss)'],
        'new_trend': row['trend'],
        'is_inventory_maintained': bool(row.get('Inventory maintained', False)),
        'trend_index_difference': row['trend index difference'],
        'average_com_oh': row['average com_oh'],
        'fldc': row['FLDC'],
        'forecasting_method': row['forecasting_method'],
    }
    for _, row in df_store.iterrows()
]
    # Similarly for ComForecast
    com_instances = [
    {
        'pid':row['pid'],  
         'new_month_12_fc_index': row['month_12_fc_index_original'],
         'is_inventory_maintained_com_sales': bool(row.get('Inventory maintained', False)),
         'forecasting_method': row['forecasting_method'],
         'minimum_required_oh_for_com': row['minimum required oh for com'],
         'fldc': row['FLDC'],
         'vdf_added_quantity': row['VDF_added_qty'],
         'month_12_fc_index_for_com_sales': row['com_month_12_fc_index']
        #   trend_of_total_sales
        #   trend_of_com_sales_for_selected_month

    }
    for _, row in df_coms.iterrows()
]

    # And for OmniForecast
    omni_instances = [
    {
            'pid':row['pid'],  
           'com_month_12_fc_index': row['Com month_12_fc_index'],
           'com_trend': row['com trend'],
           'is_com_inventory_maintained': bool(row.get('Com Inventory maintained', False)),
           'trend_index_difference_com': row['trend index difference(com)'],
           'forecasting_method_for_com': row['forecasting_method(com)'],
           'minimum_required_oh_for_com': row['minimum required oh for com'],
           'com_fldc': row['Com FLDC'],
           'store_month_12_fc_index': row['store_month_12_fc_index'],
           'loss': row['loss'],
           'store_month_12_fc_index_loss': row['store_month_12_fc_index_(loss)'],
           'store_trend': row['store_trend'],
           'trend_index_difference_store': row['trend index difference(store)'],
           'is_store_inventory_maintained': bool(row.get('store Inventory maintained', False)),
           'forecasting_method_for_store': row['forecasting_method(store)'],
           'store_fldc': row['store FLDC']


        }
    for _, row in df_omni.iterrows()
]


    # For StoreForecast

    print("Starting StoreForecast data save/update...")
    with transaction.atomic():
        for instance in store_instances:
            StoreForecast.objects.update_or_create(
                sheet=sheet_object,
                pid=instance['pid'],
                defaults={
                    'loss': instance['loss'],
                    'new_month_12_fc_index': instance['new_month_12_fc_index'],
                    'new_trend': instance['new_trend'],
                    'is_inventory_maintained': instance['is_inventory_maintained'],
                    'trend_index_difference': instance['trend_index_difference'],
                    'average_com_oh': instance['average_com_oh'],
                    'fldc': instance['fldc'],
                    'forecasting_method': instance['forecasting_method'],
                }
            )
    print("StoreForecast data saved/updated successfully.")


    # For ComForecast
    print("Starting ComForecast data save/update...")
    with transaction.atomic():
        for instance in com_instances:
            ComForecast.objects.update_or_create(
                sheet = sheet_object,
                pid=instance['pid'],
                defaults={
                    'new_month_12_fc_index': instance['new_month_12_fc_index'],
                    'is_inventory_maintained_com_sales': instance['is_inventory_maintained_com_sales'],
                    'forecasting_method': instance['forecasting_method'],
                    'minimum_required_oh_for_com': instance['minimum_required_oh_for_com'],
                    'fldc': instance['fldc'],
                    'vdf_added_quantity': instance['vdf_added_quantity'],
                    'month_12_fc_index_for_com_sales': instance['month_12_fc_index_for_com_sales'],
                }
            )
    print("ComForecast data saved/updated successfully.")


   # For OmniForecast - Updated with all the fields matching the model definition
    print("Starting OmniForecast data save/update...")
    with transaction.atomic():
        for instance in omni_instances:
            OmniForecast.objects.update_or_create(
                sheet=sheet_object,
                pid=instance['pid'],
                defaults={
                    'com_month_12_fc_index': instance['com_month_12_fc_index'],
                    'com_trend': instance['com_trend'],
                    'is_com_inventory_maintained': instance['is_com_inventory_maintained'],
                    'trend_index_difference_com': instance['trend_index_difference_com'],
                    'forecasting_method_for_com': instance['forecasting_method_for_com'],
                    'minimum_required_oh_for_com': instance['minimum_required_oh_for_com'],
                    'com_fldc': instance['com_fldc'],
                    'store_month_12_fc_index': instance['store_month_12_fc_index'],
                    'loss': instance['loss'],
                    'store_month_12_fc_index_loss': instance['store_month_12_fc_index_loss'],
                    'store_trend': instance['store_trend'],
                    'trend_index_difference_store': instance['trend_index_difference_store'],
                    'is_store_inventory_maintained': instance['is_store_inventory_maintained'],
                    'forecasting_method_for_store': instance['forecasting_method_for_store'],
                    'store_fldc': instance['store_fldc']
                }
            )
    print("OmniForecast data saved/updated successfully.")




    # Write to different sheets in one Excel file
    summary_filename = f"forecast_summary_{sheet_object.id}.xlsx"
    output_file = os.path.join(settings.MEDIA_ROOT, "summary", summary_filename)
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    df_store_renamed = df_store.rename(columns=STORE_RENAME_MAP)
    df_coms_renamed = df_coms.rename(columns=COM_RENAME_MAP)
    df_omni_renamed = df_omni.rename(columns=OMNI_RENAME_MAP)

    df_store_filtered = df_store_renamed[[col for col in STORE_RENAME_MAP.values()]]
    df_coms_filtered = df_coms_renamed[[col for col in COM_RENAME_MAP.values()]]
    df_omni_filtered = df_omni_renamed[[col for col in OMNI_RENAME_MAP.values()]]

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

    # Save the summary file path to the SheetUpload model
    relative_summary_path = f"summary/{summary_filename}"
    sheet_object.summary.name = relative_summary_path
    sheet_object.save()
    
    print("Data written to Excel file successfully.")    


def process_category(args):    

    sheets, return_qty_df, df_outputs, category, code, num_products, static_data, file_path, std_period, current_month_sales_percentage, current_date, sheet_object = args

    logging.info(f"[DEBUG] category: {category}, code: {code}, num_products: {num_products}")

    (current_month,current_month_number,rolling_method, previous_week_number, year_of_previous_month,last_year_of_previous_month, last_month_of_previous_month_numeric,season, feb_weeks, mar_weeks, apr_weeks, may_weeks,jun_weeks, jul_weeks, aug_weeks, sep_weeks, oct_weeks,nov_weeks, dec_weeks, jan_weeks) = static_data
    store = []
    coms = []
    omni = []

    logging.info(f'num_products: {num_products}')

    for loop in range(num_products):
        g_value = loop + 1
        cross_ref = f"{g_value}{category.upper()}{code}"  # Ensure no spaces in category
        matching_row = df_outputs['planning_df'].loc[df_outputs['planning_df']['Cross ref'].str.upper() == cross_ref]
        pid_value = matching_row['PID'].iloc[0]
        Macys_Recpts_matching_row=df_outputs['macys_receipts'].loc[df_outputs['macys_receipts']['PID'].str.upper() == pid_value]
        # Find the matching rows
        logging.info(f"pid_value: {pid_value}")
        loader = VariableLoader(cross_ref,matching_row,Macys_Recpts_matching_row,df_outputs['index_df'],df_outputs['all_data'],df_outputs['mcom_data'],std_period,year_of_previous_month,last_year_of_previous_month)
        logging.info(f"Processing PID: {pid_value}")
        logging.info(f"Loader object created successfully.")
        logging.info(f"df_outputs['master_sheet']: {df_outputs['master_sheet']}")
        logging.info(f"df_outputs['vendor_sheet']: {df_outputs['vendor_sheet']}")
        logging.info(f"df_outputs['birthstone_sheet']: {df_outputs['birthstone_sheet']}")
        logging.info(f"df_outputs['return_qty_df']: {df_outputs['return_qty_df']}")
        vendor = df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value, 'Vendor Name'].values[0] if not df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value, 'Vendor Name'].empty else None
        logging.info(f"Vendor: {vendor}")
        return_qty_df_row = df_outputs['return_qty_df'][df_outputs['return_qty_df']['PID'] == pid_value]
        logging.info(f"Return Quantity DataFrame row: {return_qty_df_row}")
        master_sheet_row = df_outputs['master_sheet'].loc[df_outputs['master_sheet']['PID'] == pid_value]
        print("Master sheet row:", master_sheet_row)
        current_month,pid_type,std_trend,STD_index_value ,month_12_fc_index,forecasting_method,planned_shp,planned_fc,pid_omni_status,store,coms,omni,fc_by_index, fc_by_trend, recommended_fc, planned_oh, planned_sell_thru,total_added_quantity = algorithm(vendor,master_sheet_row, df_outputs['vendor_sheet'],df_outputs['birthstone_sheet'], return_qty_df_row, loader, category, store, coms, omni, code,current_month_sales_percentage,std_period, current_date,static_data )
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

        def extract_product_type(pid_type):
            match = re.match(r"(store|com|omni)", str(pid_type).lower())
            if match:
                return match.group(1)
            return None
        with transaction.atomic():

            ProductDetail.objects.update_or_create(
                sheet=sheet_object,
                product_id=loader.pid_value,
                defaults={
                    "product_description": safe_str(loader.PID_Desc),
                    "product_type": extract_product_type(pid_type),
                    "safe_non_safe": safe_str(loader.Safe_Non_Safe),
                    "item_code": safe_str(loader.Item_Code),
                    "blu": safe_str(loader.RLJ),
                    "mkst": safe_str(loader.MKST),
                    "current_door_count": safe_int(loader.Door_Count),
                    "last_store_count": safe_int(loader.Last_Str_Cnt),
                    "door_count_updated": parse_date(loader.Door_count_Updated),
                    "store_model": safe_int(loader.Store_Model),
                    "com_model": safe_int(loader.Com_Model),
                    "holiday_build_fc": safe_int(loader.Holiday_Bld_FC),
                    "macys_onhand": safe_int(loader.MCYOH),
                    "oo_units": safe_int(loader.OO),
                    "in_transit": safe_int(loader.nav_OO),
                    "month_to_date_shipment": safe_int(loader.MTD_SHIPMENTS),
                    "last_week_shipment": safe_int(loader.LW_Shipments),
                    "planned_weeks_of_stock": safe_int(loader.Wks_of_Stock_OH),
                    "weeks_of_projection": safe_int(loader.Wks_of_on_Proj),
                    "last_4_weeks_shipment": safe_int(loader.Last_3Wks_Ships),
                    "vendor_name": safe_str(loader.Vendor_Name),
                    "min_order": safe_int(loader.Min_order),
                    "rl_total": safe_int(loader.Proj),
                    "net_projection": safe_int(loader.Net_Proj),
                    "unalloc_order": safe_int(loader.Unalloc_Orders),
                    "ma_bin": safe_int(loader.RLJ_OH),
                    "fldc": safe_int(loader.FLDC),
                    "wip_quantity": safe_int(loader.WIP),
                    "md_status": safe_str(loader.MD_Status_MZ1),
                    "replenishment_flag": safe_str(loader.Repl_Flag),
                    "mcom_replenishment": safe_str(loader.MCOM_RPL),
                    "pool_stock": safe_int(loader.Pool_stock),
                    "first_receipt_date": parse_date(loader.st_Rec_Date),
                    "last_receipt_date": parse_date(loader.Last_Rec_Date),
                    "item_age": safe_int(loader.Item_Age),
                    "first_live_date": parse_date(loader.st_Live),
                    "this_year_last_cost": safe_float(loader.TY_Last_Cost),
                    "macys_owned_retail": safe_float(loader.Own_Retail),
                    "awr_first_ticket_retail": safe_float(loader.AWR_1st_Tkt_Ret),
                    "metal_lock": safe_float(loader.Metal_Lock),
                    "mfg_policy": safe_str(loader.MFG_Policy),
                    "kpi_data_updated": safe_str(loader.KPI_Data_Updated),
                    "kpi_door_count": safe_int(loader.KPI_Door_count),
                    "out_of_stock_location": safe_int(loader.OOS_Locs),
                    "suspended_location_count": safe_int(loader.Suspended_Loc_Count),
                    "live_site": safe_str(loader.Live_Site),
                    "masterstyle_description": safe_float(loader.Masterstyle_Desc),
                    "masterstyle_id": safe_str(loader.MstrSt_ID),
                    "department_id": safe_int(loader.Dpt_ID),
                    "department_description": safe_str(loader.Dpt_Desc),
                    "subclass_id": safe_int(loader.SC_ID),
                    "subclass_description": safe_str(loader.SC_Desc),
                    "webid_description": safe_str(loader.Prod_Desc),
                    "v2c": safe_str(loader.V2C),
                    "marketing_id": safe_str(loader.Mktg_ID),
                    "std_store_return": safe_float(loader.STD_Store_Rtn),
                    "last_project_review_date": parse_date(loader.Last_Proj_Review_Date),
                    "macy_spring_projection_note": safe_str(loader.Macys_Spring_Proj_Notes),
                    "planner_response": safe_str(loader.Planner_Response),
                    "website": website_link,

                    "rolling_method" : rolling_method,
                    "std_trend_original" : std_trend,
                    "std_index_value_original" : STD_index_value,
                    "current_fc_index": safe_str(loader.Current_FC_Index),                    
                    "month_12_fc_index_original" : month_12_fc_index,
                    "forecasting_method_original" : forecasting_method,

                    "algorithm_generated_final_quantity" : total_added_quantity if total_added_quantity > 0 else 0,
                    "category": f"{category}{code}",
                    "user_updated_final_quantity": total_added_quantity if total_added_quantity > 0 else 0,
                }
            )


        productmain = ProductDetail.objects.get(product_id=str(loader.pid_value),sheet=sheet_object)

        
        save_macys_projection_receipts(productmain, loader.matched_row, current_year, sheet_object)
        print(f"Macys projection receipts saved for product {loader.pid_value}")
        
        save_monthly_forecasts(productmain, sheet_object, current_year, months, loader.TY_Unit_Sales, loader.LY_Unit_Sales, loader.LY_OH_Units, loader.TY_OH_Units, loader.TY_Receipts, loader.LY_Receipts, loader.TY_MCOM_Unit_Sales, loader.LY_MCOM_Unit_Sales, loader.TY_MCOM_OH_Units, loader.LY_MCOM_OH_Units, loader.PTD_TY_Sales, loader.LY_PTD_Sales, loader.MCOM_PTD_TY_Sales, loader.MCOM_PTD_LY_Sales, loader.OO_Total_Units, loader.OO_MCOM_Total_Units, loader.LY_store_unit_sales, loader.LY_store_EOM_OH, loader.LY_COM_to_TTL, loader.LY_COM_to_TTL_OH, loader.LY_omni_sell_through, loader.LY_store_sell_through, loader.LY_omni_turn, loader.LY_store_turn, loader.LY_Omni_AUR_Diff_Own, loader.TY_store_unit_sales, loader.TY_store_EOM_OH, loader.TY_COM_to_TTL, loader.TY_COM_to_TTL_OH, loader.TY_Omni_AUR_Diff_Own, loader.TY_Omni_sell_through, loader.TY_store_sell_through, loader.TY_omni_turn, loader.TY_store_turn, loader.TY_store_unit_sales_diff, loader.TY_com_unit_sales_diff, loader.TY_store_eom_oh_diff)
        print(f"Monthly forecasts saved for product {loader.pid_value}")
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
        save_rolling_forecasts(productmain, sheet_object, current_year, forecast_data)
        print(f"Product {loader.pid_value} saved successfully")

    # At the end of this function, return a tuple of (output_file, final_data, store, coms, omni)
    return  store, coms, omni
    