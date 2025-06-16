import copy
import logging
from forecast.service.utils import *
from forecast.service.staticVariable import HOLIDAYS_DATA, MONTHS, VDF_ITEMS
logging.basicConfig(filename=r'log_file_all1.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s',
                    filemode='w')

def algorithm(vendor,master_sheet_row, vendor_sheet, birthstone_sheet, return_QA_df_row, loader, category, store, coms, omni, code,current_month_sales_percentage,std_period, current_date,static_data,holidays_df):

    (current_month,current_month_number,rolling_method, previous_week_number, year_of_previous_month,last_year_of_previous_month, last_month_of_previous_month_numeric,season, feb_weeks, mar_weeks, apr_weeks, may_weeks,jun_weeks, jul_weeks, aug_weeks, sep_weeks, oct_weeks,nov_weeks, dec_weeks, jan_weeks) = static_data
    print("****************************************************************************************************************", current_month_sales_percentage)
    row = holidays_df[holidays_df['PID'] == loader.product_id]
    print("row_holiday", row)

    if not row.empty:
        first_row = row.iloc[0]
        valentine_day = first_row.get('Valentine Day') or False
        mothers_day = first_row.get('Mothers Day') or False
        fathers_day = first_row.get('Fathers Day') or False
        womens_day = first_row.get('Womens Day') or False
    else:
        valentine_day = mothers_day = fathers_day = womens_day = False

    print(f'category: {category}')
    country, lead_time = get_vendor_details(vendor, vendor_sheet)
    lead_time_old = copy.deepcopy(lead_time)
    logging.info(f'pid: {loader.product_id}')
    logging.info(f'rlj: {loader.rlj}')
    logging.info(f'country: {country}')
    print(f'country: {country}')
    print(f'lead_time: {lead_time}')

    print("current_date: ", current_date)
    forecast_date = calculate_forecast_date_basic(current_date, lead_time, country)
    forecast_date_old=copy.deepcopy(forecast_date)
    logging.info(f'current_month: {current_month}')
    logging.info(f'forecast_date: {forecast_date}')
    logging.info(f'current_date: {current_date}')
    lead_time,is_lead_guideline_in_holiday = adjust_lead_time(country, current_date, forecast_date, lead_time)
    logging.info(f'previous_week_number: {is_lead_guideline_in_holiday}')
    print("done adjusting lead time")
    print(f'lead_time: {lead_time}')
    
    if is_lead_guideline_in_holiday:
        forecast_date = calculate_forecast_date(current_date, lead_time, country)
    print(f'forecast_date after lead time adjustment: {forecast_date}')
    forecast_month = get_forecast_info(forecast_date)
    week_of_forecast_month = get_week_of_month(forecast_date)
    actual_weeks=[feb_weeks, mar_weeks, apr_weeks, may_weeks,jun_weeks, jul_weeks, aug_weeks, sep_weeks, oct_weeks,nov_weeks, dec_weeks, jan_weeks ]
    actual_weeks_dict={key:actual_weeks[i] for i,key in enumerate(MONTHS)}
    logging.info(f'actual_weeks_dict[forecast_month]: {actual_weeks_dict[forecast_month]}')
    logging.info(f'week_of_forecast_month: {week_of_forecast_month}')
    logging.info(f'forecast_month: {forecast_month}')

    logging.info(f'forecast_date: {forecast_date}')
    logging.info(f'loader.safe_non_safe: {loader.safe_non_safe}')
    current_month=current_month.upper()
    current_month_weeks = previous_week_number
    logging.info(f'current_month_weeks: {current_month_weeks}')
    pid_type=find_pid_type(loader.safe_non_safe,loader.product_id,loader.ly_total_sales_units,loader.ly_com_sales_units,loader.kpi_door_count)
    logging.info(f'lead_time: {lead_time}')
    logging.info(f'forecast_month: {forecast_month}')
    logging.info(f'pid_type: {pid_type}')
    logging.info(f'index_value: {loader.index_value}')
    print(f'pid_type: {pid_type}')
    next_forecast_month=find_next_month_after_forecast_month(forecast_month)
    forecast_month_next_next_month=find_next_month_after_forecast_month(next_forecast_month)
    rank =loader.item_code
    row4_values=[i+1 for i in range(12)]
    row17_values=[loader.ty_total_sales_units[month] for month in MONTHS]
    row39_values=[loader.ly_total_sales_units[month] for month in MONTHS]
    row41_values=[loader.ly_com_sales_units[month] for month in MONTHS]
    return_quantity_dict, return_quantity_dict_80_percent = get_return_quantity_dict(loader.product_id, return_QA_df_row)
    return_quantity_dict_80_percent=clean_return_dict(return_quantity_dict_80_percent,current_month)
    forecast_season=get_forecast_month_season(forecast_month)
    logging.info(f'forecast_season: {forecast_season}')
    logging.info(f'season: {season}')
    logging.info(f'Door count: {loader.kpi_door_count}')
    print(f'forecast_season: {forecast_season}')
    season='SPRING' if season == 'SP' else 'FALL'
    forecast_season_month=find_season_list(forecast_season)
    season_month=find_season_list(season)
    logging.info(f'season_month: {season_month}')
    in_transit = calculate_in_transit_qty(loader.oo_units, loader.nav_oo)
    logging.info(f'in_transit: {in_transit}')
    planned_shp = loader.planned_shipment
    planned_shp[current_month] += in_transit
    planned_shp=handle_return_qty(planned_shp,return_quantity_dict_80_percent,forecast_month)
    logging.info(f'return_quantity_dict_80_percent: {return_quantity_dict_80_percent}')
    planned_shp_original = copy.deepcopy(planned_shp)
    logging.info(f'planned_shp: {planned_shp}')
    is_red_box_item = contains_no_longer_red_box(loader.planner_response)
    ttl_com_sale = count_ttl_com_sale(loader.ly_total_sales_units,loader.ly_com_sales_units)
    logging.info(f'count_ttl_com_sale: {ttl_com_sale}')
    std_index_value_original=calculate_std_index_value(loader.index_value,std_period)
    logging.info(f'std_index_value_original: {std_index_value_original}')
    month_12_fc_index_original=calculate_12th_month_forecast(loader.std_ty_total_sales_units_list, std_index_value_original)
    logging.info(f'month_12_fc_index_original: {month_12_fc_index_original}')
    std_trend_original=calculate_std_trend(loader.std_ty_total_sales_units_list, loader.std_ly_total_sales_units_list)
    fc_by_index=[]
    fc_by_trend=[]
    recommended_fc=[]
    planned_fc=[]
    planned_oh=[]
    planned_sell_thru=[]
            # Initialize common_variable_dict with default values for not_forecast case
    common_variable_dict ={}
    store_dict = {}
    com_dict = {}
    omni_dict = {}

    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    selected_months=None 
    pid_omni_status=False
    is_vdf_item=False
    is_considered_birthstone=False
    selected_months=std_period
    average_eoh_oh=0
    loss_updated=0
    loss=0
    is_reduced_loss=False
    is_handle_large_trend = False
    ty_com_sales_unit_selected_month=[]
    ly_com_sales_unit_selected_month=[]
    ty_total_sales_units_list_new_trend=[]
    ly_total_sales_units_list_new_trend=[]
    fc_by_index ={}
    fc_by_trend ={}
    recommended_fc={}
    planned_oh={}
    planned_sell_thru={}
    std_index_value = 0
    com_std_trend=0
    is_com_inventory_maintained=False
    is_considered_birthstone = False
    birthstone = None
    birthstone_month = None
    minimum_required_oh_for_com=0
    print(pid_type)
    if pid_type=='store':
        std_index_value=calculate_std_index_value(loader.index_value,std_period)
        logging.info(f'std_index_value: {std_index_value}')
        month_12_fc_index=calculate_12th_month_forecast(loader.std_ty_total_sales_units_list, std_index_value)
        logging.info(f'month_12_fc_index: {month_12_fc_index}')
        month_12_fc_index_original=copy.deepcopy(month_12_fc_index)
        std_trend=calculate_std_trend(loader.std_ty_total_sales_units_list, loader.std_ly_total_sales_units_list)
        logging.info(f'std_trend: {std_trend}')
        fc_by_index=calculate_fc_by_index(loader.index_value, month_12_fc_index)
        fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,std_trend, row4_values, row17_values, row39_values)
        logging.info(f'fc_by_index: {fc_by_index}')
        logging.info(f'fc_by_trend: {fc_by_trend}')
        last_year_store_eom_oh_for_inventory_check=last_year_eom_oh_season(loader.ly_total_eom_oh,loader.ly_com_eom_oh,season_month)
        logging.info(f'last_year_store_eom_oh_for_inventory_check: {last_year_store_eom_oh_for_inventory_check}')
        is_inventory_maintained=is_maintained(last_year_store_eom_oh_for_inventory_check, 0.95, loader.kpi_door_count)
        logging.info(f'is_inventory_maintained: {is_inventory_maintained}')
        forecasting_method=decide_forecasting_method(is_inventory_maintained)
        logging.info(f'is_red_box_item: {is_red_box_item}')
        if is_red_box_item:
            forecasting_method = "FC By Index"
            logging.info(f'updated_forecasting_method: {forecasting_method}')
        logging.info(f'forecasting_method: {forecasting_method}')
        if forecasting_method =='FC By Index':
            average_eoh_oh = sum(last_year_store_eom_oh_for_inventory_check) / len(last_year_store_eom_oh_for_inventory_check)
            logging.info(f'average_eoh_oh: {average_eoh_oh}')
            loss=calculate_loss(loader.kpi_door_count, average_eoh_oh)
            logging.info(f'loss: {loss}')
            is_reduced_loss,loss_updated =determine_loss_updated(loss,rank, loader.macys_owned_retail)
            logging.info(f'loss_updated: {loss_updated}')
            month_12_fc_index=update_12_month_forecast_by_loss(month_12_fc_index, loss_updated)
            logging.info(f'Updated_month_12_fc_index: {month_12_fc_index}')
            fc_by_index=calculate_fc_by_index(loader.index_value, month_12_fc_index)
            logging.info(f'fc_by_index_updated: {fc_by_index}')

        elif forecasting_method =='FC By Trend':
            if current_month!='FEB' or current_month!='AUG':
                selected_months=new_trend_month_selection(current_month_weeks,current_month,season_month)
                logging.info(f'selected_months: {selected_months}')
                ty_total_sales_units_list_new_trend = [loader.ty_total_sales_units[month] for month in selected_months]
                if current_month_weeks > 2:
                    ty_total_sales_units_list_new_trend[-1] = round(ty_total_sales_units_list_new_trend[-1] / (current_month_sales_percentage/100))
                ly_total_sales_units_list_new_trend=[loader.ly_total_sales_units[month] for month in selected_months]
                logging.info(f'ty_total_sales_units_list_new_trend: {ty_total_sales_units_list_new_trend}')
                logging.info(f'ly_total_sales_units_list_new_trend: {ly_total_sales_units_list_new_trend}')
                logging.info(f'std_trend: {std_trend}')
                new_std_trend=calculate_std_trend(ty_total_sales_units_list_new_trend,ly_total_sales_units_list_new_trend)  
                logging.info(f'new_std_trend: {new_std_trend}')
                std_trend,is_handle_large_trend=adjust_std_trend_minimum(std_trend, new_std_trend)
                logging.info(f'minimum_new_std_trend: {std_trend}')
                result = is_same_sales(ty_total_sales_units_list_new_trend, ly_total_sales_units_list_new_trend)
                logging.info(f'is_same_sales: {result}')
                if result:
                    std_trend = 0
                    forecasting_method = "Average"
                fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,std_trend, row4_values, row17_values, row39_values)
                logging.info(f'fc_by_trend: {fc_by_trend}')
                logging.info(f'updated_std_trend: {std_trend}')
                logging.info(f'updated_forecasting_method: {forecasting_method}')
        trend_index_difference=compare_seasonal_forecasts_by_method(fc_by_index, fc_by_trend,forecast_season)
        logging.info(f'trend_index_difference: {trend_index_difference}')
        if trend_index_difference < 15:
            forecasting_method = "Average"
            logging.info(f'updated_forecasting_method: {forecasting_method}')


        logging.info(f'fc_by_trend: {fc_by_trend}')
        fc_by_average=calculate_fc_by_average(fc_by_index, fc_by_trend)
        logging.info(f'fc_by_average: {fc_by_average}')
        recommended_fc=get_recommended_forecast(forecasting_method, fc_by_index, fc_by_trend, fc_by_average)
        logging.info(f'recommended_fc: {recommended_fc}')
        planned_fc=calculate_planned_fc(row4_values, recommended_fc, loader.ty_total_sales_units, loader.ly_total_eom_oh,rolling_method, current_month_number)
        logging.info(f'rolling_method: {rolling_method}')
        logging.info(f'planned_fc: {planned_fc}')
        current_month_fc=calculate_current_month_fc(current_month, loader.ty_total_sales_units,current_month_sales_percentage)
        logging.info(f'current_month_fc: {current_month_fc}')
        actual_sale_unit= loader.ty_total_sales_units[current_month]
        planned_fc=update_planned_fc_for_current_month(loader.ly_total_sales_units,recommended_fc,fc_by_trend,planned_fc,current_month,current_month_fc,current_month_weeks,previous_week_number,is_inventory_maintained,std_trend,is_red_box_item,actual_sale_unit)
        logging.info(f'updated_planned_fc: {planned_fc}')

        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month, override_value=None)
        logging.info(f'planned_oh: {planned_oh}')
        planned_oh_before = copy.deepcopy(planned_oh)
        required_quantity ,is_considered_birthstone,birthstone,birthstone_month= calculate_required_quantity(master_sheet_row, loader.product_id, birthstone_sheet, forecast_month, loader.kpi_door_count)
        logging.info(f'required_quantity: {required_quantity}')
        average_com_oh = calculate_average_com_oh(loader.ty_com_eom_oh)
        logging.info(f'average_com_oh: {average_com_oh}')
        required_quantity,fldc = update_required_quantity_for_forecast_month(forecast_month, planned_fc, required_quantity, average_com_oh, loader.kpi_door_count,country,week_of_forecast_month)
        logging.info(f'updated required_quantity for forecast_month: {required_quantity}')
        planned_shp = update_projection_for_month(forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
        logging.info(f'planned_shp after update_projection_for_month: {planned_shp}')
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh after update: {planned_oh}')
        check = is_late_forecast_week(forecast_date)
        logging.info(f'is_late_forecast_week: {check}')
        next_month_planned_oh_before = copy.deepcopy(planned_oh)
        if check:
            planned_shp = update_projection_for_month(next_forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
            logging.info(f'planned_shp after late forecast month update: {planned_shp}')
        
        
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        
        planned_oh_before_next_to_next_month = copy.deepcopy(planned_oh)
        logging.info(f'planned_oh {planned_oh}')
        if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
           
            planned_shp = update_projection_for_month(forecast_month_next_next_month, required_quantity, planned_oh, planned_shp, loader.product_id)
            if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
                is_lead_guideline_in_holiday=True
                
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        
        logging.info(f'final planned_oh before holiday check: {planned_oh}')


        # Add the dictionary key-values as new columns
    elif pid_type=='com':
        # if loader.safe_non_safe in ['FB','COM ONLY','COM REPLEN','VDF REPLEN'] or loader.product_id in VDF_item or (loader.safe_non_safe in ['OMNI'] and count_ttl_com_sale(loader.ly_total_sales_units,loader.ly_com_sales_units)>=70 ) :

        std_index_value=calculate_std_index_value(loader.index_value,std_period)
        logging.info(f'std_index_value: {std_index_value}')
        month_12_fc_index=calculate_12th_month_forecast(loader.std_ty_total_sales_units_list, std_index_value)
        logging.info(f'month_12_fc_index: {month_12_fc_index}')
        std_trend=calculate_std_trend(loader.std_ty_total_sales_units_list, loader.std_ly_total_sales_units_list)
        logging.info(f'std_trend: {std_trend}')
        if current_month!='FEB' or current_month!='AUG':
            logging.info(f'current_month_weeks: {current_month_weeks}')
            selected_months=new_trend_month_selection(current_month_weeks,current_month,season_month)
            logging.info(f'selected_months: {selected_months}')
            ty_com_sales_unit_selected_month= [loader.ty_com_sales_units[month] for month in selected_months]
            if current_month_weeks > 2:
                ty_com_sales_unit_selected_month[-1] = round(ty_com_sales_unit_selected_month[-1] / (current_month_sales_percentage/100))
            logging.info(f'current month com: {ty_com_sales_unit_selected_month[-1]}')
            ly_com_sales_unit_selected_month=[loader.ly_com_sales_units[month] for month in selected_months]

            com_std_trend=calculate_std_trend(ty_com_sales_unit_selected_month,ly_com_sales_unit_selected_month)  
            new_com_std_trend,is_handle_large_trend=handle_large_trend(com_std_trend)
            std_trend=new_com_std_trend
            logging.info(f'std_trend: {std_trend}')

            std_index_value=calculate_std_index_value(loader.index_value,selected_months)
            com_month_12_fc_index=calculate_12th_month_forecast(ty_com_sales_unit_selected_month, std_index_value)
            month_12_fc_index=com_month_12_fc_index
        ly_com_eom_oh_new= [loader.ly_com_eom_oh[month] for month in selected_months]
        is_com_inventory_maintained=is_maintained_for_com(ly_com_eom_oh_new, threshold=2, ratio=0.2)
        forecasting_method=decide_forecasting_method(is_com_inventory_maintained)
        if is_red_box_item:
            forecasting_method = "FC By Index"
            logging.info(f'updated_forecasting_method: {forecasting_method}')
        fc_by_index=calculate_fc_by_index(loader.index_value, month_12_fc_index)
        logging.info(f'fc_by_index_updated: {fc_by_index}')  
        if ttl_com_sale <=70:
            fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,std_trend, row4_values, row17_values, row39_values)
        else:
            fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,std_trend, row4_values, row17_values, row41_values)
        trend_index_difference=compare_seasonal_forecasts_by_method(fc_by_index, fc_by_trend,forecast_season)
        logging.info(f'trend_index_difference: {trend_index_difference}')
        if trend_index_difference < 15:
            forecasting_method = "Average"
            logging.info(f'updated_forecasting_method: {forecasting_method}')


        logging.info(f'fc_by_trend: {fc_by_trend}')
        fc_by_average=calculate_fc_by_average(fc_by_index, fc_by_trend)
        logging.info(f'fc_by_average: {fc_by_average}')
        recommended_fc=get_recommended_forecast(forecasting_method, fc_by_index, fc_by_trend, fc_by_average)
        planned_fc=calculate_planned_fc(row4_values, recommended_fc, loader.ty_total_sales_units, loader.ly_total_eom_oh,rolling_method, current_month_number)
        current_month_fc=calculate_current_month_fc(current_month, loader.ty_com_sales_units,current_month_sales_percentage)
        logging.info(f'current_month_fc: {current_month_fc}')
        actual_com_sale_unit= loader.ty_com_sales_units[current_month]
        planned_fc=update_planned_fc_for_current_month(loader.ly_total_sales_units,recommended_fc,fc_by_trend,planned_fc,current_month,current_month_fc,current_month_weeks,previous_week_number,is_com_inventory_maintained,std_trend,is_red_box_item,actual_com_sale_unit)
        logging.info(f'planned_fc: {planned_fc}')
        TY_COM_OH_Units_List= [loader.ty_com_eom_oh[month] for month in selected_months]     
        LY_COM_OH_Units_List= [loader.ly_com_eom_oh[month] for month in selected_months]
        TY_average_COM_OH = sum(TY_COM_OH_Units_List) / len(TY_COM_OH_Units_List)
        LY_average_COM_OH = sum(LY_COM_OH_Units_List) / len(LY_COM_OH_Units_List)
        logging.info(f'loader.ly_com_sales_units : {loader.ly_com_sales_units}')
        if is_com_inventory_maintained:
            minimum_required_oh_for_com=round(find_average_com_oh(TY_average_COM_OH,LY_average_COM_OH,std_trend),0)
            logging.info(f'minimum_required_oh_for_com inventory maintain: {minimum_required_oh_for_com}')
        else:
            minimum_required_oh_for_com =round( (sum(ty_com_sales_unit_selected_month) / len(ty_com_sales_unit_selected_month)),0)
            logging.info(f'minimum_required_oh_for_com inventory not maintain: {minimum_required_oh_for_com}')
        required_quantity,fldc=required_quantity_for_com(forecast_month, planned_fc,minimum_required_oh_for_com)
        logging.info(f'required_quantity: {required_quantity}')
        override_value=loader.ty_com_eom_oh[current_month]+planned_shp[current_month]-planned_fc[current_month]
        logging.info(f'override_value: {override_value}')
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=override_value)
        logging.info(f'planned_oh: {planned_oh}')
        planned_oh_before = copy.deepcopy(planned_oh)
        planned_shp = update_projection_for_month(forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
        logging.info(f'planned_shp after update_projection_for_month: {planned_shp}')

        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=override_value)
        logging.info(f'planned_oh after update: {planned_oh}')

        check = is_late_forecast_week(forecast_date)
        logging.info(f'is_late_forecast_week: {check}')
        next_month_planned_oh_before = copy.deepcopy(planned_oh)
        if check:
            planned_shp = update_projection_for_month(next_forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
            logging.info(f'planned_shp after late forecast month update: {planned_shp}')
        
        
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh {planned_oh}')

        planned_oh_before_com_next_to_next_month = copy.deepcopy(planned_oh)
        if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
            if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
                is_lead_guideline_in_holiday=True
            forecast_month_next_next_month=find_next_month_after_forecast_month(next_forecast_month)
            planned_shp = update_projection_for_month(forecast_month_next_next_month, required_quantity, planned_oh, planned_shp, loader.product_id)

        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh last {planned_oh}')
        vdf_added_quantity=0

        if loader.product_id in VDF_ITEMS or loader.safe_non_safe in ['VDF REPLEN'] :
            is_vdf_item=True
            logging.info(f'This is VDF item')
            sell_base_min_value=10 if ttl_com_sale >70 else 5
            logging.info(f'sell_base_min_value: {sell_base_min_value}')
            logging.info(f'loader.rlj_OH: {loader.ma_bin}')
            logging.info(f'loader.FLDC: {loader.fldc}')
            logging.info(f'loader.WIP: {loader.wip_quantity}')
            VDFqty=sum([loader.ma_bin, loader.fldc , loader.wip_quantity])
            if VDFqty<sell_base_min_value:
                vdf_added_quantity=sell_base_min_value - VDFqty
                planned_shp[forecast_month]+=vdf_added_quantity
            logging.info(f'planned_shp: {planned_shp}')

    elif pid_type=='omni':
        pid_omni_status=True
        ###########com calculation#####################
        logging.info(f'com calculation for omni')
        std_index_value=calculate_std_index_value(loader.index_value,std_period)
        logging.info(f'std_index_value: {std_index_value}')
        month_12_fc_index=calculate_12th_month_forecast(loader.std_ty_total_sales_units_list, std_index_value)
        logging.info(f'month_12_fc_index: {month_12_fc_index}')
        std_trend=calculate_std_trend(loader.std_ty_total_sales_units_list, loader.std_ly_total_sales_units_list)
        logging.info(f'std_trend: {std_trend}')
        ty_com_sales_unit_selected_month = 0
        if current_month!='FEB' or current_month!='AUG':
            logging.info(f'current_month_weeks: {current_month_weeks}')
            selected_months=new_trend_month_selection(current_month_weeks,current_month,season_month)
            logging.info(f'selected_months: {selected_months}')
            ty_com_sales_unit_selected_month= [loader.ty_com_sales_units[month] for month in selected_months]
            if current_month_weeks > 2:
                ty_com_sales_unit_selected_month[-1] = round(ty_com_sales_unit_selected_month[-1] / (current_month_sales_percentage/100))
            logging.info(f'current month com: {ty_com_sales_unit_selected_month[-1]}')
            ly_com_sales_unit_selected_month=[loader.ly_com_sales_units[month] for month in selected_months]

            com_std_trend=calculate_std_trend(ty_com_sales_unit_selected_month,ly_com_sales_unit_selected_month)  
            logging.info(f'new_std_trend: {com_std_trend}')
            new_com_std_trend,is_handle_large_trend_com=handle_large_trend(com_std_trend)


            std_index_value=calculate_std_index_value(loader.index_value,selected_months)
            com_month_12_fc_index=calculate_12th_month_forecast(ty_com_sales_unit_selected_month, std_index_value)
        ly_com_eom_oh_new= [loader.ly_com_eom_oh[month] for month in selected_months]
        is_com_inventory_maintained=is_maintained_for_com(ly_com_eom_oh_new, threshold=2, ratio=0.2)
        forecasting_method_for_com=decide_forecasting_method(is_com_inventory_maintained)
        logging.info(f'is_red_box_item: {is_red_box_item}')
        if is_red_box_item:
            forecasting_method_for_com = "FC By Index"
        fc_by_index=calculate_fc_by_index(loader.index_value, com_month_12_fc_index)
        logging.info(f'fc_by_index_updated: {fc_by_index}')   
        fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,new_com_std_trend, row4_values, row17_values, row41_values)
        trend_index_difference_com=compare_seasonal_forecasts_by_method(fc_by_index, fc_by_trend,forecast_season)
        logging.info(f'trend_index_difference: {trend_index_difference_com}')
        if trend_index_difference_com < 15:
            forecasting_method_for_com = "Average"

        logging.info(f'updated_forecasting_method: {forecasting_method_for_com}')
        logging.info(f'fc_by_trend: {fc_by_trend}')
        fc_by_average=calculate_fc_by_average(fc_by_index, fc_by_trend)
        logging.info(f'fc_by_average: {fc_by_average}')
        recommended_fc_com=get_recommended_forecast(forecasting_method_for_com, fc_by_index, fc_by_trend, fc_by_average)
        planned_fc_com=calculate_planned_fc(row4_values, recommended_fc_com, loader.ty_total_sales_units, loader.ly_total_eom_oh,rolling_method, current_month_number)
        current_month_fc=calculate_current_month_fc(current_month, loader.ty_com_sales_units,current_month_sales_percentage)
        logging.info(f'current_month_fc: {current_month_fc}')
        actual_com_sale_unit= loader.ty_com_sales_units[current_month]
        planned_fc_com=update_planned_fc_for_current_month(loader.ly_total_sales_units,recommended_fc_com,fc_by_trend,planned_fc_com,current_month,current_month_fc,current_month_weeks,previous_week_number,is_com_inventory_maintained,std_trend,is_red_box_item,actual_com_sale_unit)
        TY_COM_OH_Units_List= [loader.ty_com_eom_oh[month] for month in selected_months]     
        LY_COM_OH_Units_List= [loader.ly_com_eom_oh[month] for month in selected_months]
        TY_average_COM_OH = sum(TY_COM_OH_Units_List) / len(TY_COM_OH_Units_List)
        LY_average_COM_OH = sum(LY_COM_OH_Units_List) / len(LY_COM_OH_Units_List)
        logging.info(f'loader.ly_com_sales_units : {loader.ly_com_sales_units}')
        ly_com_sales_units_List= [loader.ly_com_sales_units[month] for month in MONTHS]
        if is_com_inventory_maintained:
            minimum_required_oh_for_com=round(find_average_com_oh(TY_average_COM_OH,LY_average_COM_OH,std_trend),0)
            logging.info(f'minimum_required_oh_for_com inventory maintain: {minimum_required_oh_for_com}')
        else:
            minimum_required_oh_for_com =round( (sum(ty_com_sales_unit_selected_month) / len(ty_com_sales_unit_selected_month)),0)
            logging.info(f'minimum_required_oh_for_com inventory not maintain: {minimum_required_oh_for_com}')
        required_quantity_com,com_fldc=required_quantity_for_com(forecast_month, planned_fc_com,minimum_required_oh_for_com)
        logging.info(f'required_quantity_com: {required_quantity_com}')
        

        ###########store calculation#####################
        logging.info(f'store calculation for omni')
        ty_store_sales_unit = {
            month: loader.ty_total_sales_units[month] - loader.ty_com_sales_units[month]
            for month in loader.ty_total_sales_units
        }
        ly_store_sales_unit = {
            month: loader.ly_total_sales_units[month] - loader.ly_com_sales_units[month]
            for month in loader.ly_total_sales_units
        }
        if current_month!='FEB' or current_month!='AUG':
            logging.info(f'current_month_weeks: {current_month_weeks}')
            selected_months=new_trend_month_selection(current_month_weeks,current_month,season_month)
            logging.info(f'selected_months: {selected_months}')
            ty_store_sales_unit_selected_month= [ty_store_sales_unit[month] for month in selected_months]
            if current_month_weeks > 2:
                ty_store_sales_unit_selected_month[-1] = round(ty_store_sales_unit_selected_month[-1] / (current_month_sales_percentage/100))
            logging.info(f'current store com: {ty_store_sales_unit_selected_month[-1]}')
            ly_store_sales_unit_selected_month=[ly_store_sales_unit[month] for month in selected_months]
            store_std_trend=calculate_std_trend(ty_store_sales_unit_selected_month,ly_store_sales_unit_selected_month)  
            logging.info(f'new_std_trend: {store_std_trend}')
            new_store_std_trend,is_handle_large_trend_store=handle_large_trend(store_std_trend)
            logging.info(f'new_std_trend: {new_store_std_trend}')

            std_index_value=calculate_std_index_value(loader.index_value,selected_months)
            store_month_12_fc_index=calculate_12th_month_forecast(ty_store_sales_unit_selected_month, std_index_value)
            store_month_12_fc_index_original=copy.deepcopy(store_month_12_fc_index)
            logging.info(f'com_month_12_fc_index: {com_month_12_fc_index}')

        last_year_store_eom_oh_for_inventory_check=last_year_eom_oh_season(loader.ly_total_eom_oh,loader.ly_com_eom_oh,season_month)
        logging.info(f'last_year_store_eom_oh_for_inventory_check: {last_year_store_eom_oh_for_inventory_check}')
        is_store_inventory_maintained=is_maintained(last_year_store_eom_oh_for_inventory_check, 0.95, loader.kpi_door_count)
        logging.info(f'is_inventory_maintained: {is_store_inventory_maintained}')
        forecasting_method=decide_forecasting_method(is_store_inventory_maintained)

        if forecasting_method =='FC By Index':
            average_eoh_oh = sum(last_year_store_eom_oh_for_inventory_check) / len(last_year_store_eom_oh_for_inventory_check)
            logging.info(f'average_eoh_oh: {average_eoh_oh}')
            loss=calculate_loss(loader.kpi_door_count, average_eoh_oh)
            logging.info(f'loss: {loss}')
            is_reduced_loss,loss_updated =determine_loss_updated(loss,rank, loader.macys_owned_retail)
            logging.info(f'loss_updated: {loss_updated}')
            store_month_12_fc_index_=update_12_month_forecast_by_loss(store_month_12_fc_index, loss_updated)
        fc_by_index=calculate_fc_by_index(loader.index_value, store_month_12_fc_index)
        logging.info(f'fc_by_index_updated: {fc_by_index}')   
        row40_values=[ly_store_sales_unit[month] for month in MONTHS]
        fc_by_trend=calculate_fc_by_trend(last_month_of_previous_month_numeric, current_month_number,new_store_std_trend, row4_values, row17_values, row40_values)
        trend_index_difference_store=compare_seasonal_forecasts_by_method(fc_by_index, fc_by_trend,forecast_season)
        logging.info(f'trend_index_difference: {trend_index_difference_store}')
        if trend_index_difference_store < 15:
            forecasting_method = "Average"
            logging.info(f'updated_forecasting_method: {forecasting_method}')
        logging.info(f'is_red_box_item: {is_red_box_item}')
        if is_red_box_item:
            forecasting_method = "FC By Index"
        logging.info(f'updated_forecasting_method: {forecasting_method}')
        logging.info(f'fc_by_trend: {fc_by_trend}')
        fc_by_average=calculate_fc_by_average(fc_by_index, fc_by_trend)
        logging.info(f'fc_by_average: {fc_by_average}')
        recommended_fc_store=get_recommended_forecast(forecasting_method, fc_by_index, fc_by_trend, fc_by_average)
        planned_fc_store=calculate_planned_fc(row4_values, recommended_fc_store, loader.ty_total_sales_units, loader.ly_total_eom_oh,rolling_method, current_month_number)
        current_month_fc=calculate_current_month_fc(current_month, loader.ty_com_sales_units,current_month_sales_percentage)
        logging.info(f'current_month_fc: {current_month_fc}')
        actual_store_sale_unit= ty_store_sales_unit[current_month]
        planned_fc_store=update_planned_fc_for_current_month(loader.ly_total_sales_units,recommended_fc_store,fc_by_trend,planned_fc_store,current_month,current_month_fc,current_month_weeks,previous_week_number,is_store_inventory_maintained,std_trend,is_red_box_item,actual_store_sale_unit)
        required_quantity_store ,is_considered_birthstone,birthstone,birthstone_month= calculate_required_quantity(master_sheet_row, loader.product_id, birthstone_sheet, forecast_month, loader.kpi_door_count)
        average_com_oh=0
        required_quantity_store,store_fldc = update_required_quantity_for_forecast_month(forecast_month, planned_fc_store, required_quantity_store, average_com_oh, loader.kpi_door_count,country,week_of_forecast_month)
        logging.info(f'required_quantity_store: {required_quantity_store}')
        recommended_fc={month: recommended_fc_store.get(month, 0) + recommended_fc_com.get(month, 0) for month in recommended_fc_store}
        planned_fc=calculate_planned_fc(row4_values, recommended_fc, loader.ty_total_sales_units, loader.ly_total_eom_oh,rolling_method, current_month_number)
        actual_sale_unit=loader.ty_total_sales_units[current_month]
        planned_fc=update_planned_fc_for_current_month(loader.ly_total_sales_units,recommended_fc,fc_by_trend,planned_fc,current_month,current_month_fc,current_month_weeks,previous_week_number,is_store_inventory_maintained,std_trend,is_red_box_item,actual_sale_unit)
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        planned_oh_before = copy.deepcopy(planned_oh)
        required_quantity={month: required_quantity_store.get(month, 0) + required_quantity_com.get(month, 0) for month in required_quantity_store}
        logging.info(f'required_quantity: {required_quantity}')
        planned_shp = update_projection_for_month(forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
        logging.info(f'planned_shp: {planned_shp}')
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh: {planned_oh}')
        next_month_planned_oh_before= copy.deepcopy(planned_oh)
        check = is_late_forecast_week(forecast_date)
        logging.info(f'is_late_forecast_week: {check}')
        if check:
            planned_shp = update_projection_for_month(next_forecast_month, required_quantity, planned_oh, planned_shp, loader.product_id)
            logging.info(f'planned_shp after late forecast month update: {planned_shp}')
        
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'2 planned_oh before holiday check: {planned_oh}')

        planned_oh_before_next_to_next_month= copy.deepcopy(planned_oh)
        if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
            if (country=='Italy' and forecast_month=='JUL' and week_of_forecast_month > 2):
                is_lead_guideline_in_holiday=True
            forecast_month_next_next_month=find_next_month_after_forecast_month(next_forecast_month)
            planned_shp = update_projection_for_month(forecast_month_next_next_month, required_quantity, planned_oh, planned_shp, loader.product_id)

        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'final planned_oh before holiday check: {planned_oh}')
        std_trend=std_trend_original
        month_12_fc_index=month_12_fc_index_original
    else:
        pid_type='not_forecast'

    if pid_type!='not_forecast':
        week_of_forecast_month = get_week_of_month(forecast_date)
        logging.info(f'week_of_forecast_month: {week_of_forecast_month}')

        target_month_abbr, target_week = calculate_week_and_month(forecast_month, week_of_forecast_month, year_of_previous_month, WEEK_TO_ADD_FOR_HOLIDAY)
        logging.info(f'target_month_abbr: {target_month_abbr}, target_week: {target_week}')

        holiday_name, is_holiday = check_holiday(target_month_abbr, target_week, HOLIDAYS_DATA)
        logging.info(f'holiday_name: {holiday_name}, is_holiday: {is_holiday}')

        planned_shp, is_considered_valentine_day, is_considered_mothers_day, is_considered_fathers_day, is_considered_womens_day = adjust_planned_shp_for_holiday(is_holiday, holiday_name, forecast_month, required_quantity, planned_shp, valentine_day, mothers_day, fathers_day, womens_day)
        logging.info(f'planned_shp after holiday adjustment: {planned_shp}')

        forecast_season_month = find_season_list(forecast_season)
        logging.info(f'forecast_season_month: {forecast_season_month}')

        planned_season_sum = season_sum(planned_shp, forecast_season_month)
        logging.info(f'planned_season_sum: {planned_season_sum}')

        macys_season_sum = season_sum(loader.macys_proj_receipts, forecast_season_month)
        logging.info(f'macys_season_sum: {macys_season_sum}')

        qty_given_to_macys, macys_proj_receipt_upto_forecast_month = calculate_seasonwise_projection(
            forecast_month, planned_shp, loader.macys_proj_receipts, loader.ty_omni_receipts, forecast_season_month
        )
        logging.info(f'sum_of_omni_and_planned_upto_next_month: {qty_given_to_macys}')
        logging.info(f'macys_proj_receipt_upto_next_month: {macys_proj_receipt_upto_forecast_month}')

        average_store_sale_thru = calculate_store_sale_thru(loader.ly_total_sales_units, loader.ly_com_sales_units, loader.ly_total_eom_oh, loader.ly_com_eom_oh)
        logging.info(f'average_store_sale_thru: {average_store_sale_thru}')
        if pid_type=='store':
            macy_soq_percentage = determine_percentage_to_add_quantity(average_store_sale_thru, loader.macys_owned_retail)
        else:
            macy_soq_percentage = 0.75
        logging.info(f'macy_soq_percentage: {macy_soq_percentage}')
        

        # qty_to_maintain_planned_oh=planned_shp[forecast_month]-planned_shp_original[]
        qty_to_maintain_planned_oh={month: planned_shp.get(month, 0) - planned_shp_original.get(month, 0) for month in planned_shp}
        logging.info(f'qty_to_maintain_planned_oh************* {qty_to_maintain_planned_oh}')
        planned_shp,macy_additional_units = adjust_planned_shipments_based_on_macys(
            forecast_month, macys_proj_receipt_upto_forecast_month,
            qty_given_to_macys,
            macy_soq_percentage, planned_shp, planned_oh, loader.kpi_door_count, category         
        )
        logging.info(f'planned_shp after macys adjustment: {planned_shp}')
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh {planned_oh}')
        logging.info(f'kpi_door_count {loader.kpi_door_count}')
        if (planned_oh[forecast_month]>(3*loader.kpi_door_count)) and (pid_type=='store'or pid_omni_status) and macy_additional_units :
            extra_oh_qty=planned_oh[forecast_month]-(3*loader.kpi_door_count)
            logging.info(f'extra_oh_qty {extra_oh_qty}')
            if macy_additional_units>extra_oh_qty:
                extra_oh_qty=extra_oh_qty
            else:
                extra_oh_qty=macy_additional_units
            logging.info(f'extra_oh_qty {extra_oh_qty}')
            planned_shp[forecast_month]=planned_shp[forecast_month] - extra_oh_qty

        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_oh after macys adjustment: {planned_oh}')
        
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month,override_value=None)
        logging.info(f'planned_shp after return qty adjustment: {planned_shp}')
        total_gross_projection = sum([
            loader.nav_feb, loader.nav_mar, loader.nav_apr, loader.nav_may, loader.nav_jun,
            loader.nav_jul, loader.nav_aug, loader.nav_sep, loader.nav_oct, loader.nav_nov,
            loader.nav_dec, loader.nav_jan
        ])
        logging.info(f'total_gross_projection: {total_gross_projection}')
        logging.info(f'original shp: {planned_shp_original}')
        logging.info(f'updated shp: {planned_shp}')
    
        recommended_total_quantity = calculate_total_added_qty(total_gross_projection,in_transit, planned_shp)

        logging.info(f'recommended_total_quantity: {recommended_total_quantity}')
        planned_oh = calculate_planned_oh_partial(rolling_method, current_month_number, planned_fc, planned_shp, loader.ty_total_eom_oh, loader.ty_omni_receipts, loader.ly_total_eom_oh, loader.ty_total_sales_units, current_month, override_value=None)
        planned_sell_thru = calculate_planned_sell_through(planned_fc, planned_oh)
        is_added_quantity_using_macys_soq = True if macy_additional_units > 0 else False
        is_below_min_order = True if recommended_total_quantity < loader.min_order else False
        is_over_macys_soq = True if macys_proj_receipt_upto_forecast_month < qty_given_to_macys else False
        is_need_to_review_first = True if recommended_total_quantity > macy_additional_units else False 
        is_added_only_to_balance_macys_soq = True if recommended_total_quantity == macy_additional_units else False
        logging.info(f'is_added_quantity_using_macys_soq: {is_added_quantity_using_macys_soq}')
        logging.info(f'is_below_min_order: {is_below_min_order}')
        logging.info(f'is_over_macys_soq: {is_over_macys_soq}')
        
        common_variable_dict = {
            "pid_type":pid_type,
            "selected_months": str(selected_months),
            "std_trend_original": std_trend_original,
            "forecasting_method": forecasting_method,
            "std_index_value_original": std_index_value_original,
            "month_12_fc_index_original": month_12_fc_index_original,
            "recommended_total_quantity": recommended_total_quantity,
            "category": category,
            "country": country,
            "valentine_day": valentine_day,
            "mothers_day": mothers_day,
            "fathers_day": fathers_day,
            "womens_day": womens_day,
            "forecast_month": forecast_month,
            "next_forecast_month": next_forecast_month,
            "current_date": current_date,
            "lead_time_old": lead_time_old,
            "forecast_date_old": forecast_date_old,
            "lead_time": lead_time,
            "forecast_date": forecast_date,
            "is_lead_guideline_in_holiday": is_lead_guideline_in_holiday,
            "is_added_quantity_using_macys_soq": is_added_quantity_using_macys_soq,
            "is_below_min_order": is_below_min_order,
            "is_over_macys_soq": is_over_macys_soq,
            "is_added_only_to_balance_macys_soq": is_added_only_to_balance_macys_soq,
            "is_need_to_review_first": is_need_to_review_first,
            "is_red_box_item": is_red_box_item,
            "is_vdf_item": is_vdf_item,
            "average_store_sale_thru": average_store_sale_thru,
            "macys_proj_receipt_upto_forecast_month": macys_proj_receipt_upto_forecast_month,
            "macy_soq_percentage": macy_soq_percentage,
            "qty_given_to_macys": qty_given_to_macys,
            "birthstone": birthstone,
            "birthstone_month": birthstone_month,
            "is_considered_birthstone": is_considered_birthstone,
            "forecast_month_required_quantity": required_quantity[forecast_month],
            "next_forecast_month_required_quantity":required_quantity[next_forecast_month],
            "forecast_month_planned_oh_before": planned_oh_before[forecast_month],
            "next_forecast_month_planned_oh_before": next_month_planned_oh_before[next_forecast_month],
            "forecast_month_planned_shipment": planned_shp[forecast_month],
            "next_forecast_month_planned_shipment": planned_shp[next_forecast_month],
            "qty_added_to_maintain_oh_forecast_month": qty_to_maintain_planned_oh[forecast_month],
            "qty_added_to_maintain_oh_next_forecast_month": qty_to_maintain_planned_oh[next_forecast_month],
            "qty_added_to_balance_soq_forecast_month": planned_shp[forecast_month] - qty_to_maintain_planned_oh[forecast_month]-planned_shp_original[forecast_month],
        }
        print("common done")
        if pid_type=='store':
            store_dict = {
                "loss": loss,
                "std_index_value": std_index_value,
                "std_ty_unit_sales": sum(loader.std_ty_total_sales_units_list),
                "ty_unit_sales_new_trend": sum(ty_total_sales_units_list_new_trend),
                "ly_unit_sales_new_trend": sum(ly_total_sales_units_list_new_trend),
                "new_month_12_fc_index": month_12_fc_index,
                "average_eoh_oh": average_eoh_oh,
                "loss_updated": loss_updated,
                "is_reduced_loss": is_reduced_loss,
                "is_handle_large_trend": is_handle_large_trend,
                "std_trend": std_trend,
                "is_inventory_maintained": is_inventory_maintained,
                "trend_index_difference": trend_index_difference,
                "average_com_oh": average_com_oh,
                "fldc": fldc,
                "forecasting_method": forecasting_method,
            }
            print("store done")
        elif pid_type=='com':
            com_dict = {
                "ty_com_sales_unit_selected_month_sum": sum(ty_com_sales_unit_selected_month),
                "ly_com_sales_unit_selected_month_sum": sum(ly_com_sales_unit_selected_month),
                "std_index_value": std_index_value,
                "new_month_12_fc_index": month_12_fc_index,
                "com_trend_for_selected_month": com_std_trend,
                "is_handle_large_trend": is_handle_large_trend,
                "final_com_trend": std_trend,
                "is_com_inventory_maintained": is_com_inventory_maintained,
                "trend_index_difference": trend_index_difference,
                "forecasting_method": forecasting_method,
                "minimum_required_oh_for_com": minimum_required_oh_for_com,
                "fldc": fldc,
                "vdf_added_quantity": vdf_added_quantity,
            }
            print("com done")
        else:
            omni_dict = {
                "std_index_value": std_index_value,
                "ty_store_sales_unit_selected_month_sum": sum(ty_store_sales_unit_selected_month),
                "ly_store_sales_unit_selected_month_sum": sum(ly_store_sales_unit_selected_month),
                "store_month_12_fc_index_original":store_month_12_fc_index_original,
                "average_eoh_oh": average_eoh_oh,
                "loss": loss,
                "store_month_12_fc_index_loss": store_month_12_fc_index,
                "loss_updated": loss_updated,
                "is_reduced_loss": is_reduced_loss,
                "is_handle_large_trend_store": is_handle_large_trend_store,
                "store_trend": std_trend,
                "is_store_inventory_maintained": is_store_inventory_maintained,
                "trend_index_difference_store": trend_index_difference_store,
                "store_fldc": store_fldc,
                "forecasting_method_for_store": forecasting_method,
                "forecast_month_required_quantity_store": required_quantity_store[forecast_month],
                "next_forecast_month_required_quantity_store": loader.kpi_door_count,
                "ty_com_sales_unit_selected_month_sum": sum(ty_com_sales_unit_selected_month),
                "ly_com_sales_unit_selected_month_sum": sum(ly_com_sales_unit_selected_month),
                "com_month_12_fc_index": com_month_12_fc_index,
                "com_trend_for_selected_month": com_std_trend,
                "is_handle_large_trend_com": is_handle_large_trend_com,
                "final_com_trend": new_com_std_trend,
                "is_com_inventory_maintained": is_com_inventory_maintained,
                "trend_index_difference_com": trend_index_difference_com,
                "forecasting_method_for_com": forecasting_method_for_com,
                "minimum_required_oh_for_com": minimum_required_oh_for_com,
                "com_fldc": com_fldc,
                "forecast_month_required_quantity_com": required_quantity_com[forecast_month],
                "next_forecast_month_required_quantity_com": minimum_required_oh_for_com,

            }
            print("omni done")

    if pid_type=='not_forecast':
        std_trend=0
        std_index_value=0
        month_12_fc_index=0
        forecasting_method='Average'
        planned_shp={'FEB':0, 'MAR': 0, 'APR':0, 'MAY':0, 'JUN':0, 'JUL': 0, 'AUG': 0, 'SEP':0, 'OCT':0, 'NOV': 0, 'DEC':0, 'JAN':0}
        planned_fc={'FEB':0, 'MAR': 0, 'APR':0, 'MAY':0, 'JUN':0, 'JUL': 0, 'AUG': 0, 'SEP':0, 'OCT':0, 'NOV': 0, 'DEC':0, 'JAN':0}
        

    print("done....algorithm ................................")
    print(pid_type)
    return pid_type,forecasting_method,std_trend,std_index_value,month_12_fc_index,common_variable_dict,store_dict,com_dict,omni_dict,fc_by_index,fc_by_trend,recommended_fc,planned_fc,planned_shp,planned_oh,planned_sell_thru

