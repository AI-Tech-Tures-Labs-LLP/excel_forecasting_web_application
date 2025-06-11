
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
        self.item_status=f"{self.safe_non_safe}/{self.item_code}"
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
        self.planned_weeks_of_stock=matching_row['Wks of Stock OH'].iloc[0]
        self.weeks_of_projection=matching_row['Wks of on Proj'].iloc[0]
        self.last_4_weeks_shipment=matching_row['Last 3Wks Ships'].iloc[0]
        self.vendor_name=matching_row['Vendor Name'].iloc[0]
        self.min_order=matching_row['Min order'].iloc[0]
        self.rl_total=matching_row['Proj'].iloc[0]
        self.net_projection=matching_row['Net Proj'].iloc[0]
        self.unalloc_order=matching_row['Unalloc Orders'].iloc[0]
        self.ma_bin=matching_row['RLJ OH'].iloc[0]
        self.fldc=matching_row['FLDC'].iloc[0]
        self.wip_quantity=matching_row['WIP'].iloc[0]
        self.md_status=matching_row['MD Status MZ1'].iloc[0]
        self.replenishment_flag=matching_row['Repl Flag'].iloc[0]
        self.mcom_replenishment=matching_row['MCOM RPL'].iloc[0]
        self.pool_stock=matching_row['Pool stock'].iloc[0]
        self.first_receipt_date=matching_row['1st Rec Date'].iloc[0]
        self.last_receipt_date=matching_row['Last Rec Date'].iloc[0]
        self.item_age=matching_row['Item Age'].iloc[0]
        self.this_year_last_cost=matching_row['TY Last Cost'].iloc[0]
        self.macys_owned_retail=matching_row['Own Retail'].iloc[0]
        self.awr_first_ticket_retail=matching_row['AWR 1st Tkt Ret'].iloc[0]
        self.metal_lock=matching_row['Metal Lock'].iloc[0]
        self.mfg_policy=matching_row['MFG Policy'].iloc[0]
        self.kpi_data_updated=matching_row['KPI Data Updated'].iloc[0]
        self.kpi_door_count=matching_row['KPI Door count'].iloc[0]
        self.out_of_stock_location=matching_row['OOS Locs'].iloc[0]
        self.suspended_location_count=matching_row['Suspended Loc Count'].iloc[0]
        self.department_id=matching_row['Dpt ID'].iloc[0]  
        self.department_description=matching_row['Dpt Desc'].iloc[0]
        self.subclass_id=matching_row['SC ID'].iloc[0]
        self.subclass_description=matching_row['SC Desc'].iloc[0]
        self.masterstyle_id=matching_row['MstrSt ID'].iloc[0]
        self.masterstyle_description=matching_row['Masterstyle Desc'].iloc[0]
        self.product_description=matching_row['PID Desc'].iloc[0]
        self.first_live_site=matching_row['1st Live'].iloc[0]
        self.live_site=matching_row['Live Site'].iloc[0]
        self.v2c=matching_row['V2C'].iloc[0]
        self.marketing_id=matching_row['Mktg ID'].iloc[0]
        self.std_store_return=matching_row['STD Store Rtn %'].iloc[0]
        self.webid_description=matching_row['Prod Desc'].iloc[0]
        self.last_projection_review_date=matching_row['Last Proj Review Date'].iloc[0]
        self.macy_spring_projection_note =  f"Macy's Spring Proj Notes: {macys_receipts_matching_row['ACTION'].iloc[0]}" if not macys_receipts_matching_row.empty else "Macy's Spring Proj Notes: "
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

        self.this_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == this_year_value)]
        self.last_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == last_year_value)]
        self.this_year_mcom_data=mcom_data.loc[(mcom_data['PID'] == self.product_id) & (mcom_data['Year'] == this_year_value)]
        self.last_year_mcom_data=mcom_data.loc[(mcom_data['PID'] == self.product_id) & (mcom_data['Year'] == last_year_value)]
        # Define months in order
        # Initialize dictionaries to store results
        planned_shipments=[self.nav_feb,self.nav_mar,self.nav_apr,self.nav_may,self.nav_jun,self.nav_jul,self.nav_aug,self.nav_sep,self.nav_oct,self.nav_nov,self.nav_dec,self.nav_jan]
        self.planned_shipment={key:abs(planned_shipments[i]) for i,key in enumerate(months)}
        self.gross_projection_nav={key:abs(planned_shipments[i]) for i,key in enumerate(months)}
        self.ty_total_sales_units = {month: 0 for month in months}
        self.ly_total_sales_units = {month: 0 for month in months}
        self.ly_total_eom_oh = {month: 0 for month in months}
        self.ty_total_eom_oh = {month: 0 for month in months}
        self.ty_omni_receipts = {month: 0 for month in months}
        self.ty_com_sales_units = {month: 0 for month in months}
        self.ly_com_eom_oh={month: 0 for month in months}
        self.ty_omni_sales_usd={month: 0 for month in months}
        self.ty_com_sales_usd={month: 0 for month in months}
        self.ly_com_sales_units={month: 0 for month in months}
        self.ty_com_eom_oh = {month: 0 for month in months}
        self.ty_omni_oo_units={month: 0 for month in months}
        self.ty_com_oo_units={month: 0 for month in months}
        self.ly_omni_receipts={month: 0 for month in months}
        self.ly_omni_sales_usd={month: 0 for month in months}
        self.ly_com_sales_usd={month: 0 for month in months}
        # Sum data for each month
        for month in months:

            self.ty_total_sales_units[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.ly_total_sales_units[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.ly_total_eom_oh[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'OH LY Units'].sum()
            self.ty_total_eom_oh[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.ty_omni_receipts[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY RCVD Unit'].sum()
            self.ty_com_sales_units[month] = self.this_year_mcom_data.loc[self.this_year_mcom_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.ly_com_sales_units[month] = self.last_year_mcom_data.loc[self.last_year_mcom_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
            self.ty_com_eom_oh[month] = self.this_year_mcom_data.loc[self.this_year_mcom_data['Month'].str.upper() == month, 'OH TY Units'].sum()
            self.ty_omni_sales_usd[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.ly_omni_sales_usd[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.ty_com_sales_usd[month] = self.this_year_mcom_data.loc[self.this_year_mcom_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.ly_com_sales_usd[month] = self.last_year_mcom_data.loc[self.last_year_mcom_data['Month'].str.upper() == month, 'PTD TY $ Sales'].sum()
            self.ly_com_eom_oh[month] = self.last_year_mcom_data.loc[self.last_year_mcom_data['Month'].str.upper() == month, 'OH LY Units'].sum()
            self.ty_omni_oo_units[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'OO Total Units'].sum()
            self.ty_com_oo_units[month] = self.this_year_mcom_data.loc[self.this_year_mcom_data['Month'].str.upper() == month, 'OO Total Units'].sum()
            self.ly_omni_receipts[month] = self.last_year_data.loc[self.last_year_data['Month'].str.upper() == month, 'PTD TY RCVD Unit'].sum()

        self.std_ty_total_sales_units_list = [self.ty_total_sales_units[month] for month in std_period]
        self.std_ly_total_sales_units_list = [self.ly_total_sales_units[month] for month in std_period]

        self.macys_proj_receipts = [self.macys_proj_receipts_feb, self.macys_proj_receipts_mar, self.macys_proj_receipts_apr, self.macys_proj_receipts_may, self.macys_proj_receipts_jun, self.macys_proj_receipts_jul, self.macys_proj_receipts_aug, self.macys_proj_receipts_sep, self.macys_proj_receipts_oct, self.macys_proj_receipts_nov, self.macys_proj_receipts_dec, self.macys_proj_receipts_jan]
        self.macys_proj_receipts = {key: self.macys_proj_receipts[i] for i, key in enumerate(months)}
        target_months = {'FEB', 'MAR', 'APR'}
        
        if any(month in std_period for month in target_months):
            ac_this_year_value = year_of_previous_month
            L_this_year_value = year_of_previous_month - 1
            ac_last_year_value = last_year_of_previous_month
            L_last_year_value = last_year_of_previous_month - 1
            ac_this_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == ac_this_year_value)]
            L_this_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == L_this_year_value)]
            ac_last_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == ac_last_year_value)]
            L_last_year_data = all_data.loc[(all_data['PID'] == self.product_id) & (all_data['Year'] == L_last_year_value)]
            Ac_ty_total_sales_units = {month: 0 for month in months}
            L_ty_total_sales_units = {month: 0 for month in months}
            Ac_ly_total_sales_units = {month: 0 for month in months}
            L_ly_total_sales_units = {month: 0 for month in months}
            for month in months:
                self.ty_total_sales_units[month] = self.this_year_data.loc[self.this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                Ac_ty_total_sales_units[month] = ac_this_year_data.loc[ac_this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                L_ty_total_sales_units[month] = L_this_year_data.loc[L_this_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                Ac_ly_total_sales_units[month] = ac_last_year_data.loc[ac_last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()
                L_ly_total_sales_units[month] = L_last_year_data.loc[L_last_year_data['Month'].str.upper() == month, 'PTD TY Unit Sales'].sum()


            self.std_ty_total_sales_units_list = [
            Ac_ty_total_sales_units.get(month, L_ty_total_sales_units.get(month, 0)) if month in ['FEB', 'MAR', 'APR']
            else L_ty_total_sales_units.get(month, 0)
            for month in std_period
        ]
            self.std_ly_total_sales_units_list = [
            Ac_ly_total_sales_units.get(month, L_ly_total_sales_units.get(month, 0)) if month in ['FEB', 'MAR', 'APR']
            else L_ly_total_sales_units.get(month, 0)
            for month in std_period
        ]
        self.ly_store_sales_units = calculate_store_unit_sales_and_OH(self.ly_total_sales_units, self.ly_com_sales_units)  # correct
        self.ly_store_eom_oh = calculate_store_unit_sales_and_OH(self.ly_total_eom_oh, self.ly_com_eom_oh)  # correct
        self.ly_com_to_ttl_sales_pct = calculate_com_to_ttl_sales_and_OH(self.ly_com_sales_units, self.ly_total_sales_units)  # correct
        self.ly_com_to_ttl_eoh_pct = calculate_com_to_ttl_sales_and_OH(self.ly_com_eom_oh, self.ly_total_eom_oh)  # correct
        self.ly_omni_sell_thru_pct = calculate_omni_sell_through(self.ly_total_sales_units, self.ly_total_eom_oh)  # correct
        self.ly_store_sell_thru_pct = calculate_store_sell_through(self.ly_total_sales_units, self.ly_com_sales_units, self.ly_total_eom_oh, self.ly_com_eom_oh)
        self.ly_omni_turn = calculate_turn(self.ly_total_sales_units, self.ly_total_eom_oh)
        self.ly_store_turn = calculate_turn(self.ly_store_sales_units, self.ly_store_eom_oh)
        self.ly_omni_aur_diff_own = format_sales_data(self.ly_omni_sales_usd, self.ly_total_sales_units, self.macys_owned_retail)  # correct
        self.ty_store_sales_units = calculate_store_unit_sales_and_OH(self.ty_total_sales_units, self.ty_com_sales_units)  # correct
        self.ty_store_eom_oh = calculate_store_unit_sales_and_OH(self.ty_total_eom_oh, self.ty_com_eom_oh)  # correct
        self.ty_com_to_ttl_sales_pct = calculate_com_to_ttl_sales_and_OH(self.ty_com_sales_units, self.ty_total_sales_units)  # correct
        self.ty_com_to_ttl_eoh_pct = calculate_com_to_ttl_sales_and_OH(self.ty_com_eom_oh, self.ty_total_eom_oh)  # correct
        self.ty_omni_aur_diff_own = format_sales_data(self.ptd_ty_sales, self.ty_total_sales_units, self.macys_owned_retail)  # correct
        self.ty_omni_sell_thru_pct = calculate_omni_sell_through(self.ty_total_sales_units, self.ty_total_eom_oh)
        self.ty_store_sell_thru_pct = calculate_store_sell_through(self.ty_total_sales_units, self.ty_com_sales_units, self.ty_total_eom_oh, self.ty_com_eom_oh)
        self.ty_omni_turn = calculate_turn(self.ty_total_sales_units, self.ty_total_eom_oh)
        self.ty_store_turn = calculate_turn(self.ty_store_sales_units, self.ty_store_eom_oh)
        self.ty_store_sales_vs_ly = calculate_diff(self.ty_store_sales_units, self.ly_store_sales_units)  # correct
        self.ty_com_sales_vs_ly = calculate_diff(self.ty_com_sales_units, self.ly_com_sales_units)  # correct
        self.ty_store_eoh_vs_ly = calculate_diff(self.ty_store_eom_oh, self.ly_store_eom_oh)  # correct

        logging.info(f"succeed")

