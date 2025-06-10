
import pandas as pd
from forecast.service.utils import calculate_store_unit_sales_and_OH,calculate_com_to_ttl_sales_and_OH,format_sales_data,calculate_omni_sell_through,calculate_store_sell_through,calculate_turn,calculate_diff
import logging
class VariableLoader:

    def __init__(self,cross_ref,matching_row,macys_receipts_matching_row,index_df,all_data,mcom_data,std_period,year_of_previous_month,last_year_of_previous_month):
        # Find the matching row based on cross_ref
        logging.info(f"matching row for cross_ref: {cross_ref}")
        logging.info(f"matching row for macys_receipts_matching_row: {macys_receipts_matching_row}")
        logging.info(f"matching row for index_df: {index_df}")
        logging.info(f"matching row for all_data: {all_data}")
        logging.info(f"matching row for mcom_data: {mcom_data}")

        if matching_row.empty:
            raise ValueError(f"Cross ref '{cross_ref}' not found in 'planning_df'.")       
        self.matched_row = matching_row # Store the matched row for later use in Database    
        self.product_id = matching_row['PID'].iloc[0]
        self.rlj = matching_row['Adjusted RLJ Item'].iloc[0] 
        self.mkst = matching_row['Mkst'].iloc[0] # Get the first matching PID
        self.current_fc_index = matching_row['FC Index'].iloc[0] # Get the first matching PID
        self.safe_non_safe=matching_row['Safe/Non-Safe'].iloc[0]
        self.item_code=matching_row['Item Code'].iloc[0]
        self.current_door_count=matching_row['Door Count'].iloc[0]
        self.last_store_count=matching_row['Old Door count'].iloc[0]
        self.door_count_updated=matching_row['Door count Updated'].iloc[0]
        self.store_model=matching_row['Model'].iloc[0]
        self.com_model=matching_row['Com Model'].iloc[0]
        self.holiday_build_fc=matching_row['HolidayBuildFC'].iloc[0]
        self.macys_onhand=matching_row['OH Units'].iloc[0]
        self.oo_units=matching_row['OO Units'].iloc[0]
        self.nav_oo=matching_row['nav OO'].iloc[0]
        self.month_to_date_shipment=matching_row['MTD SHIPMENTS'].iloc[0]
        self.last_week_shipment=matching_row['LW Shipments'].iloc[0]
        self.wks_of_stock_oh=matching_row['Wks of Stock OH'].iloc[0]
        self.wks_of_on_proj=matching_row['Wks of on Proj'].iloc[0]
        self.last_3wks_ships=matching_row['Last 3Wks Ships'].iloc[0]
        self.vendor_name=matching_row['Vendor Name'].iloc[0]
        self.min_order=matching_row['Min order'].iloc[0]
        self.proj=matching_row['Proj'].iloc[0]
        self.net_proj=matching_row['Net Proj'].iloc[0]
        self.unalloc_orders=matching_row['Unalloc Orders'].iloc[0]
        self.rlj_oh=matching_row['RLJ OH'].iloc[0]
        self.fldc=matching_row['FLDC'].iloc[0]
        self.wip=matching_row['WIP'].iloc[0]
        self.md_status_mz1=matching_row['MD Status MZ1'].iloc[0]
        self.repl_flag=matching_row['Repl Flag'].iloc[0]
        self.mcom_rpl=matching_row['MCOM RPL'].iloc[0]
        self.pool_stock=matching_row['Pool stock'].iloc[0]
        self.st_rec_date=matching_row['1st Rec Date'].iloc[0]
        self.last_rec_date=matching_row['Last Rec Date'].iloc[0]
        self.item_age=matching_row['Item Age'].iloc[0]
        self.ty_last_cost=matching_row['TY Last Cost'].iloc[0]
        self.own_retail=matching_row['Own Retail'].iloc[0]
        self.awr_1st_tkt_ret=matching_row['AWR 1st Tkt Ret'].iloc[0]
        self.metal_lock=matching_row['Metal Lock'].iloc[0]
        self.mfg_policy=matching_row['MFG Policy'].iloc[0]
        self.kpi_data_updated=matching_row['KPI Data Updated'].iloc[0]
        self.kpi_door_count=matching_row['KPI Door count'].iloc[0]
        self.oos_locs=matching_row['OOS Locs'].iloc[0]
        self.suspended_loc_count=matching_row['Suspended Loc Count'].iloc[0]
        self.masterstyle_desc=matching_row['Masterstyle Desc'].iloc[0]
        self.dpt_id=matching_row['Dpt ID'].iloc[0]  
        self.dpt_desc=matching_row['Dpt Desc'].iloc[0]
        self.sc_id=matching_row['SC ID'].iloc[0]
        self.sc_desc=matching_row['SC Desc'].iloc[0]
        self.mstrst_id=matching_row['MstrSt ID'].iloc[0]
        self.masterstyle_desc=matching_row['Masterstyle Desc'].iloc[0]
        self.pid_desc=matching_row['PID Desc'].iloc[0]
        self.st_live=matching_row['1st Live'].iloc[0]
        self.live_site=matching_row['Live Site'].iloc[0]
        self.v2c=matching_row['V2C'].iloc[0]
        self.mktg_id=matching_row['Mktg ID'].iloc[0]
        self.std_store_rtn=matching_row['STD Store Rtn %'].iloc[0]
        self.prod_desc=matching_row['Prod Desc'].iloc[0]
        self.last_proj_review_date=matching_row['Last Proj Review Date'].iloc[0]
        self.macys_spring_proj_notes =  f"Macy's Spring Proj Notes: {macys_receipts_matching_row['ACTION'].iloc[0]}" if not macys_receipts_matching_row.empty else "Macy's Spring Proj Notes: "
        self.planner_response=matching_row['Planner Response'].iloc[0]

        self.nav_feb=matching_row['Feb'].iloc[0]
        self.nav_mar=matching_row['Mar'].iloc[0]
        self.nav_apr=matching_row['Apr'].iloc[0]
        self.nav_may=matching_row['May'].iloc[0]
        self.nav_jun=matching_row['Jun'].iloc[0]
        self.nav_jul=matching_row['Jul'].iloc[0]
        self.nav_aug=matching_row['Aug'].iloc[0]
        self.nav_sep=matching_row['Sep'].iloc[0]
        self.nav_oct=matching_row['Oct'].iloc[0]
        self.nav_nov=matching_row['Nov'].iloc[0]
        self.nav_dec=matching_row['Dec'].iloc[0]
        self.nav_jan=matching_row['Jan'].iloc[0]

        self.macys_proj_receipts_feb=matching_row['FEB RECPT'].iloc[0]
        self.macys_proj_receipts_mar=matching_row['MAR RECPT'].iloc[0]
        self.macys_proj_receipts_apr=matching_row['APR RECPT'].iloc[0]
        self.macys_proj_receipts_may=matching_row['May RECPT'].iloc[0]
        self.macys_proj_receipts_jun=matching_row['JUN RECPT'].iloc[0]
        self.macys_proj_receipts_jul=matching_row['JUL RECPT'].iloc[0]
        self.macys_proj_receipts_aug=matching_row['AUG RECPT'].iloc[0]
        self.macys_proj_receipts_sep=matching_row['SEP RECPT'].iloc[0]
        self.macys_proj_receipts_oct=matching_row['OCT RECPT'].iloc[0]
        self.macys_proj_receipts_nov=matching_row['NOV RECPT'].iloc[0]
        self.macys_proj_receipts_dec=matching_row['DEC RECPT'].iloc[0]
        self.macys_proj_receipts_jan=matching_row['JAN RECPT'].iloc[0]
        index_df.columns = index_df.columns.str.strip().str.upper()
        if pd.isna(self.current_fc_index):
            self.current_fc_index = "Dia"

        index_row_data = index_df.loc[index_df['INDEX'].astype(str).str.lower() == self.current_fc_index.lower()]
        months = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC','JAN']

        self.index_value = {}
        # Loop through each month and fetch its value
        for month in months:
            self.index_value[month] = index_row_data[month].iloc[0] if not index_row_data.empty else 0
            
        this_year_value=year_of_previous_month
        last_year_value=last_year_of_previous_month
        self.this_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == this_year_value)]
        self.last_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == last_year_value)]
        self.this_year_mcom = mcom_data.loc[(mcom_data['PID'] == self.pid_value) & (mcom_data['Year'] == this_year_value)]
        self.last_year_mcom = mcom_data.loc[(mcom_data['PID'] == self.pid_value) & (mcom_data['Year'] == last_year_value)]
        # Define months in order
        # Initialize dictionaries to store results
        planned_shp=[self.nav_feb,self.nav_mar,self.nav_apr,self.nav_may,self.nav_jun,self.nav_jul,self.nav_aug,self.nav_sep,self.nav_oct,self.nav_nov,self.nav_dec,self.nav_jan]
        self.planned_shp={key:abs(planned_shp[i]) for i,key in enumerate(months)}
        self.gross_proj={key:abs(planned_shp[i]) for i,key in enumerate(months)}
        self.TY_Unit_Sales = {month: 0 for month in months}
        self.LY_Unit_Sales = {month: 0 for month in months}
        self.LY_OH_Units = {month: 0 for month in months}
        self.TY_OH_Units = {month: 0 for month in months}
        self.TY_Receipts = {month: 0 for month in months}
        self.TY_MCOM_Unit_Sales = {month: 0 for month in months}
        self.TY_MCOM_OH_Units={month: 0 for month in months}
        self.PTD_TY_Sales={month: 0 for month in months}
        self.MCOM_PTD_TY_Sales={month: 0 for month in months}
        self.LY_MCOM_Unit_Sales={month: 0 for month in months}
        self.LY_MCOM_OH_Units = {month: 0 for month in months}
        self.OO_Total_Units={month: 0 for month in months}
        self.OO_MCOM_Total_Units={month: 0 for month in months}
        self.LY_Receipts={month: 0 for month in months}
        self.LY_PTD_Sales={month: 0 for month in months}
        self.MCOM_PTD_LY_Sales={month: 0 for month in months}
        # Sum data for each month
        for month in months:

            self.TY_Unit_Sales[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.LY_Unit_Sales[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.LY_OH_Units[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.TY_OH_Units[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.TY_Receipts[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY RCVD Unit'].sum()
            self.TY_MCOM_Unit_Sales[month] = self.this_year_MCOM.loc[self.this_year_MCOM['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.LY_MCOM_Unit_Sales[month] = self.last_year_MCOM.loc[self.last_year_MCOM['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.TY_MCOM_OH_Units[month] = self.this_year_MCOM.loc[self.this_year_MCOM['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.PTD_TY_Sales[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.LY_PTD_Sales[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.MCOM_PTD_TY_Sales[month] = self.this_year_MCOM.loc[self.this_year_MCOM['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.MCOM_PTD_LY_Sales[month] = self.last_year_MCOM.loc[self.last_year_MCOM['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.LY_MCOM_OH_Units[month] = self.last_year_MCOM.loc[self.last_year_MCOM['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.OO_Total_Units[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'OO Total Units'].sum()
            self.OO_MCOM_Total_Units[month] = self.this_year_MCOM.loc[self.this_year_MCOM['Month'].str.upper() == month, 'OO Total Units'].sum()
            self.LY_Receipts[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY RCVD Unit'].sum()

        self.STD_TY_Unit_Sales_list = [self.TY_Unit_Sales[month] for month in std_period]

        self.STD_LY_Unit_Sales_list=[self.LY_Unit_Sales[month] for month in std_period]
        self.macys_proj_receipt=[self.Macys_Proj_Receipts_Feb,self.Macys_Proj_Receipts_Mar,self.Macys_Proj_Receipts_Apr,self.Macys_Proj_Receipts_May,self.Macys_Proj_Receipts_Jun,self.Macys_Proj_Receipts_Jul,self.Macys_Proj_Receipts_Aug,self.Macys_Proj_Receipts_Sep,self.Macys_Proj_Receipts_oct,self.Macys_Proj_Receipts_Nov,self.Macys_Proj_Receipts_Dec,self.Macys_Proj_Receipts_Jan]
        self.macys_proj_receipt={key:self.macys_proj_receipt[i] for i,key in enumerate(months)}
        target_months={'FEB', 'MAR', 'APR'}
        if any(month in std_period for month in target_months):
            ac_this_year_value=year_of_previous_month
            L_this_year_value=year_of_previous_month-1
            ac_last_year_value=last_year_of_previous_month
            L_last_year_value=last_year_of_previous_month-1
            ac_this_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == ac_this_year_value)]
            L_this_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == L_this_year_value)]
            ac_last_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == ac_last_year_value)]
            L_last_year_data = all_data.loc[(all_data['PID'] == self.pid_value) & (all_data['Year'] == L_last_year_value)]
            Ac_TY_Unit_Sales = {month: 0 for month in months}
            L_TY_Unit_Sales = {month: 0 for month in months}
            Ac_LY_Unit_Sales = {month: 0 for month in months}
            L_LY_Unit_Sales = {month: 0 for month in months}
            for month in months:
                self.TY_Unit_Sales[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                Ac_TY_Unit_Sales[month] = ac_this_year_data.loc[ac_this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                L_TY_Unit_Sales[month] = L_this_year_data.loc[L_this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                Ac_LY_Unit_Sales[month] = ac_last_year_data.loc[ac_last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                L_LY_Unit_Sales[month] = L_last_year_data.loc[L_last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()


            self.std_ty_unit_sales_list = [
            Ac_TY_Unit_Sales.get(month, L_TY_Unit_Sales.get(month, 0)) if month in ['FEB', 'MAR', 'APR']
            else L_TY_Unit_Sales.get(month, 0)
            for month in std_period
        ]
            self.std_ly_unit_sales_list=[
            Ac_LY_Unit_Sales.get(month, L_LY_Unit_Sales.get(month, 0)) if month in ['FEB', 'MAR', 'APR']
            else L_LY_Unit_Sales.get(month, 0)
            for month in std_period
        ]
        self.LY_store_unit_sales=calculate_store_unit_sales_and_OH(self.LY_Unit_Sales, self.LY_MCOM_Unit_Sales)#correct
        self.LY_store_EOM_OH = calculate_store_unit_sales_and_OH(self.LY_OH_Units, self.LY_MCOM_OH_Units)#correct
        self.LY_COM_to_TTL= calculate_com_to_ttl_sales_and_OH(self.LY_MCOM_Unit_Sales, self.LY_Unit_Sales)#correct
        self.LY_COM_to_TTL_OH = calculate_com_to_ttl_sales_and_OH(self.LY_MCOM_OH_Units, self.LY_OH_Units)#correct
        self.LY_omni_sell_through = calculate_omni_sell_through(self.LY_Unit_Sales, self.LY_OH_Units)#correct
        self.LY_store_sell_through = calculate_store_sell_through(self.LY_Unit_Sales, self.LY_MCOM_Unit_Sales, self.LY_OH_Units, self.LY_MCOM_OH_Units)
        self.LY_omni_turn = calculate_turn(self.LY_Unit_Sales, self.LY_OH_Units)
        self.LY_store_turn = calculate_turn(self.LY_store_unit_sales, self.LY_store_EOM_OH)
        self.LY_Omni_AUR_Diff_Own = format_sales_data(self.LY_PTD_Sales,self.LY_Unit_Sales, self.Own_Retail)#correct
        self.TY_store_unit_sales = calculate_store_unit_sales_and_OH(self.TY_Unit_Sales, self.TY_MCOM_Unit_Sales)#correct
        self.TY_store_EOM_OH = calculate_store_unit_sales_and_OH(self.TY_OH_Units, self.TY_MCOM_OH_Units)#correct
        self.TY_COM_to_TTL= calculate_com_to_ttl_sales_and_OH(self.TY_MCOM_Unit_Sales, self.TY_Unit_Sales)#correct
        self.TY_COM_to_TTL_OH = calculate_com_to_ttl_sales_and_OH(self.TY_MCOM_OH_Units, self.TY_OH_Units)#correct
        self.TY_Omni_AUR_Diff_Own = format_sales_data(self.PTD_TY_Sales,self.TY_Unit_Sales, self.Own_Retail)#correct
        self.TY_Omni_sell_through = calculate_omni_sell_through(self.TY_Unit_Sales, self.TY_OH_Units)
        self.TY_store_sell_through = calculate_store_sell_through(self.TY_Unit_Sales, self.TY_MCOM_Unit_Sales, self.TY_OH_Units, self.TY_MCOM_OH_Units)
        self.TY_omni_turn = calculate_turn(self.TY_Unit_Sales, self.TY_OH_Units)
        self.TY_store_turn = calculate_turn(self.TY_store_unit_sales, self.TY_store_EOM_OH)
        self.TY_store_unit_sales_diff = calculate_diff(self.TY_store_unit_sales, self.LY_store_unit_sales)#correct
        self.TY_com_unit_sales_diff = calculate_diff(self.TY_MCOM_Unit_Sales, self.LY_MCOM_Unit_Sales)#correct
        self.TY_store_eom_oh_diff = calculate_diff(self.TY_store_EOM_OH, self.LY_store_EOM_OH)#correct

        logging.info(f"succeed")

