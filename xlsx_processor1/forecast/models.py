from django.db import models


class ProductDetail(models.Model):
    # Primary key and main identifiers
    product_id = models.CharField(max_length=50, primary_key=True, verbose_name="Cross Ref") #pid
    product_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="PID Desc")

    blu = models.CharField(max_length=100,null=True, blank=True, verbose_name="Adjusted RLJ Item") #RLJ
    mkst = models.CharField(max_length=50,null=True, blank=True, verbose_name="Mkst")    #MKST
    currect_fc_index = models.CharField(max_length=50,null=True, blank=True, verbose_name="FC Index") #Current FC Index
    
    # Item classification fields
    safe_non_safe = models.CharField(max_length=100,null=True, blank=True, verbose_name="Safe/Non-Safe") #Safe/Non-Safe
    item_code = models.CharField(max_length=100,null=True, blank=True, verbose_name="Item Code") #Item Code
    # item_status = models.CharField(max_length=50, verbose_name="Item Status") #Item Status
    
    # Store information
    current_door_count = models.FloatField(null=True, blank=True, verbose_name="Door Count") #Door Count
    last_store_count = models.FloatField(null=True, blank=True, verbose_name="Old Door Count") #Last Str Cnt
    door_count_updated = models.DateField(null=True, blank=True, verbose_name="Door Count Updated")    #Door Count Updated
    store_model = models.FloatField( null=True, blank=True, verbose_name="Model") #Store Model
    com_model = models.FloatField( null=True, blank=True, verbose_name="Com Model") 
    
    # Inventory and forecast fields
    holiday_build_fc = models.FloatField(null=True, blank=True, verbose_name="HolidayBuildFC")
    macys_onhand = models.FloatField(null=True, blank=True, verbose_name="MCYOH Units")
    oo = models.FloatField(null=True, blank=True, verbose_name="OO Units") #OO Units
    in_transit = models.FloatField(null=True, blank=True, verbose_name="nav OO") #nav OO
    month_to_date_shipment = models.FloatField(null=True, blank=True, verbose_name="MTD SHIPMENTS") #MTD SHIPMENTS 
    lastweek_shipment = models.FloatField(null=True, blank=True, verbose_name="LW Shipments") #LW Shipments
    planned_weeks_of_stock = models.FloatField(null=True, blank=True, verbose_name="Wks of Stock OH")  #Wks of Stock OH
    weeks_of_projection = models.FloatField(null=True, blank=True, verbose_name="Wks of on Proj") #Wks of on Proj
    last_4weeks_shipment = models.FloatField(null=True, blank=True, verbose_name="Last 3Wks Ships") #Last 3Wks Ships
    

    # Vendor information
    vendor_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Vendor Name") #Vendor Name
    min_order = models.FloatField(null=True, blank=True, verbose_name="Min Order") #Min Order
    
    # Projection fields
    rl_total = models.FloatField(null=True, blank=True, verbose_name="Proj") #Proj	
    net_projection = models.FloatField(null=True, blank=True, verbose_name="Net Proj")  #Net Proj
    unalloc_order = models.FloatField(null=True, blank=True, verbose_name="Unalloc Orders") #Unalloc Orders
    
    # Distribution center fields
    ma_bin = models.FloatField(null=True, blank=True, verbose_name="RLJ OH")
    fldc = models.FloatField(null=True, blank=True, verbose_name="FLDC")
    wip_quantity = models.FloatField(null=True, blank=True, verbose_name="WIP")
    
    # Status fields
    md_status = models.CharField(max_length=50, null=True, blank=True, verbose_name="MD Status MZ1")
    replanishment_flag = models.CharField(max_length=100, null=True, blank=True, verbose_name="Repl Flag")
    mcom_replanishment = models.CharField(max_length=100, null=True, blank=True, verbose_name="MCOM RPL")
    pool_stock = models.FloatField(null=True, blank=True, verbose_name="Pool Stock")
    
    # Date fields
    first_reciept_date = models.DateField(null=True, blank=True, verbose_name="1st Rec Date")
    last_reciept_date = models.DateField(null=True, blank=True, verbose_name="Last Rec Date")
    item_age = models.FloatField(null=True, blank=True, verbose_name="Item Age")
    first_live_date = models.DateField(null=True, blank=True, verbose_name="1st Live")
    
    # Cost and retail fields
    this_year_last_cost = models.FloatField(null=True, blank=True, verbose_name="TY Last Cost")
    macys_owned_retail = models.FloatField( null=True, blank=True, verbose_name="Own Retail")
    awr_first_ticket_retail = models.FloatField( null=True, blank=True, verbose_name="AWR 1st Tkt Ret")
    
    # Policy and configuration fields
    metal_lock = models.FloatField( null=True, blank=True, verbose_name="Metal Lock")
    mfg_policy = models.CharField(max_length=50, null=True, blank=True, verbose_name="MFG Policy")
    
    # KPI fields
    kpi_data_updated = models.CharField(max_length=50, null=True, blank=True, verbose_name="KPI Data Updated")
    kpi_door_count = models.FloatField(null=True, blank=True, verbose_name="KPI Door count")
    
    # Sales fields
    # standard_sale = models.DecimalField(max_digits=12, null=True, blank=True, verbose_name="STD SALES")
    # last_year_standard_sale = models.DecimalField(max_digits=12, null=True, blank=True, verbose_name="LY STD SALES")
    
    # Location fields
    out_of_stock_location = models.FloatField(null=True, blank=True, verbose_name="OOS Locs")
    suspended_location_count = models.FloatField(null=True, blank=True, verbose_name="Suspended Loc Count")
    live_site = models.CharField(max_length=50, null=True, blank=True, verbose_name="Live Site")
    
    # Product categorization fields
    masterstyle_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="Masterstyle Desc")
    masterstyle_id = models.FloatField(null=True, blank=True, verbose_name="MstrSt ID")

    department_id = models.FloatField( null=True, blank=True, verbose_name="Dpt ID")
    department_description = models.CharField(max_length=100, null=True, blank=True, verbose_name="Dpt Desc")
    
    subclass_id = models.FloatField( null=True, blank=True, verbose_name="SC ID")
    subclass_decription = models.CharField(max_length=100, null=True, blank=True, verbose_name="SC Desc")
    
    webid_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="Prod Desc")
    
    # Marketing fields
    v2c = models.CharField(max_length=50, null=True, blank=True, verbose_name="V2C")
    marketing_id = models.CharField(max_length=50, null=True, blank=True, verbose_name="Mktg ID")
    std_store_return = models.FloatField(null=True, blank=True, verbose_name="STD Store Rtn %")
    
    # Planning fields
    last_project_review_date = models.DateField(null=True, blank=True, verbose_name="Last Proj Review Date")
    macy_spring_projection_note = models.TextField(null=True, blank=True, verbose_name="Macy's Spring Proj Notes")
    planner_response = models.TextField(null=True, blank=True, verbose_name="Planner Response")
    
    def __str__(self):
        return f"{self.product_id} - {self.product_description}"



class MonthlyForecast(models.Model):
    """Normalized model for all monthly forecast data with separate fields for each month"""

    VARIABLE_CHOICES = [
        ('MacysProjectionReciepts', 'Macys Projection Receipts'),  
        ('PlannedEOH', 'Planned EOH'),  # current plan_oh
        ('PlannedShipment', 'Planned Shipment'),
        ('PlannedForecast', 'Planned Forecast'),
        ('RecommendedForecast', 'Recommended Forecast'),
        ('ForecastByTrend', 'Forecast By Trend'),
        ('ForecastByIndex','Forecast By Index'),
        ('PlannedSellThru','Planned Sell Thru'),
        ('IndexPercentage', 'Index Percentage'),
        ('GrossProjection', 'Gross Projection'),

        # Added variables based on your dataset
        ('TY_Unit_Sales', 'This Year Unit Sales'),
        ('LY_Unit_Sales', 'Last Year Unit Sales'),
        ('LY_OH_Units', 'Last Year On-Hand Units'),
        ('TY_OH_Units', 'This Year On-Hand Units'),
        ('TY_Receipts', 'This Year Receipts'),
        ('LY_Receipts', 'Last Year Receipts'),
        ('TY_MCOM_Unit_Sales', 'This Year MCOM Unit Sales'),
        ('LY_MCOM_Unit_Sales', 'Last Year MCOM Unit Sales'),
        ('TY_OH_MCOM_Units', 'This Year MCOM On-Hand Units'),
        ('LY_MCOM_OH_Units', 'Last Year MCOM On-Hand Units'),
        ('PTD_TY_Sales', 'PTD This Year Sales'),
        ('LY_PTD_Sales', 'Last Year PTD Sales'),
        ('MCOM_PTD_TY_Sales', 'MCOM PTD This Year Sales'),
        ('MCOM_PTD_LY_Sales', 'MCOM PTD Last Year Sales'),
        ('OO_Total_Units', 'OO Total Units'),
        ('OO_MCOM_Total_Units', 'OO MCOM Total Units'),

        ('LY_store_unit_sales', 'LY Store Unit Sales'),
        ('LY_store_EOM_OH', 'LY Store EOM OH'),
        ('LY_COM_to_TTL', 'LY COM to TTL Sales'),
        ('LY_COM_to_TTL_OH', 'LY COM to TTL OH'),
        ('LY_omni_sell_through', 'LY Omni Sell Through'),
        ('LY_store_sell_through', 'LY Store Sell Through'),
        ('LY_omni_turn', 'LY Omni Turn'),
        ('LY_store_turn', 'LY Store Turn'),
        ('LY_Omni_AUR_Diff_Own', 'LY Omni AUR Diff Own'),

        ('TY_store_unit_sales', 'TY Store Unit Sales'),
        ('TY_store_EOM_OH', 'TY Store EOM OH'),
        ('TY_COM_to_TTL', 'TY COM to TTL Sales'),
        ('TY_COM_to_TTL_OH', 'TY COM to TTL OH'),
        ('TY_Omni_AUR_Diff_Own', 'TY Omni AUR Diff Own'),
        ('TY_Omni_sell_through', 'TY Omni Sell Through'),
        ('TY_store_sell_through', 'TY Store Sell Through'),
        ('TY_omni_turn', 'TY Omni Turn'),
        ('TY_store_turn', 'TY Store Turn'),
        ('TY_store_unit_sales_diff', 'TY Store Unit Sales Diff'),
        ('TY_com_unit_sales_diff', 'TY COM Unit Sales Diff'),
        ('TY_store_eom_oh_diff', 'TY Store EOM OH Diff'),


    ]

    product = models.ForeignKey(ProductDetail, on_delete=models.CASCADE, verbose_name="Product")
    variable_name = models.CharField(max_length=50, choices=VARIABLE_CHOICES, verbose_name="Variable")
    year = models.PositiveIntegerField()

    # Separate fields for each month
    jan = models.FloatField(null=True, blank=True, verbose_name="January")
    feb = models.FloatField(null=True, blank=True, verbose_name="February")
    mar = models.FloatField(null=True, blank=True, verbose_name="March")
    apr = models.FloatField(null=True, blank=True, verbose_name="April")
    may = models.FloatField(null=True, blank=True, verbose_name="May")
    jun = models.FloatField(null=True, blank=True, verbose_name="June")
    jul = models.FloatField(null=True, blank=True, verbose_name="July")
    aug = models.FloatField(null=True, blank=True, verbose_name="August")
    sep = models.FloatField(null=True, blank=True, verbose_name="September")
    oct = models.FloatField(null=True, blank=True, verbose_name="October")
    nov = models.FloatField(null=True, blank=True, verbose_name="November")
    dec = models.FloatField(null=True, blank=True, verbose_name="December")

    class Meta:
        unique_together = ['product', 'variable_name', 'year']
        indexes = [
            models.Index(fields=['product', 'variable_name']),
            models.Index(fields=['year']),
        ]

    def __str__(self):
        return f"{self.product} - {self.variable_name} - {self.year}: Jan({self.jan}), Feb({self.feb}), ... Dec({self.dec})"


  
class StoreForecast(models.Model):
    category = models.CharField(max_length=100)
    pid = models.CharField(max_length=100)
    lead_time = models.FloatField()
    leadtime_holiday_adjustment = models.BooleanField()
    month_12_fc_index = models.FloatField()
    loss = models.FloatField()
    month_12_fc_index_loss = models.FloatField()
    selected_months = models.JSONField()
    trend = models.FloatField()
    inventory_maintained = models.BooleanField()
    trend_index_difference = models.FloatField()
    red_box_item = models.BooleanField()
    forecasting_method = models.CharField(max_length=100)
    door_count = models.FloatField()
    average_com_oh = models.FloatField()
    fldc = models.FloatField()
    birthstone = models.CharField(max_length=100)
    birthstone_month = models.CharField(max_length=100,null=True, blank=True)
    considered_birthstone_required_quantity = models.BooleanField()
    forecast_month = models.CharField(max_length=10)
    forecast_month_required_quantity = models.FloatField()
    forecast_month_planned_oh = models.FloatField()
    next_forecast_month = models.CharField(max_length=10)
    next_forecast_month_required_quantity = models.FloatField()
    next_forecast_month_planned_oh = models.FloatField()
    added_qty_macys_soq = models.FloatField()
    forecast_month_planned_shipment = models.FloatField()
    next_forecast_month_planned_shipment = models.FloatField()
    qty_added_to_maintain_OH_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_maintain_OH_next_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_balance_SOQ_forecast_month = models.FloatField(null=True, blank=True)

    total_added_qty = models.FloatField()
    vendor = models.CharField(max_length=255, null=True, blank=True)
    Valentine_day = models.BooleanField(default=False)
    Mothers_day = models.BooleanField(default=False)
    Fathers_day = models.BooleanField(default=False)
    Mens_day = models.BooleanField(default=False)
    Womens_day = models.BooleanField(default=False)
    Min_order = models.FloatField(null=True, blank=True)
    Macys_SOQ = models.FloatField(null=True, blank=True)
    average_store_sale_thru = models.FloatField(null=True, blank=True)
    macy_SOQ_percentage = models.FloatField(null=True, blank=True)
    Qty_given_to_macys = models.FloatField(null=True, blank=True)
    Added_qty_using_macys_SOQ = models.BooleanField(default=False)
    Below_min_order = models.BooleanField(default=False)
    Over_macys_SOQ = models.BooleanField(default=False)
    Added_only_to_balance_macys_SOQ = models.BooleanField(default=False)
    Need_to_review_first = models.BooleanField(default=False)
    RLJ = models.CharField(max_length=100, null=True, blank=True)
    STD_index_value_original = models.FloatField(null=True, blank=True)
    month_12_fc_index_original = models.FloatField(null=True, blank=True)
    std_trend_original = models.FloatField(null=True, blank=True)



    class Meta:
        # Define your unique fields to identify existing records
        unique_together = ('category', 'pid', 'forecast_month')


class ComForecast(models.Model):
    category = models.CharField(max_length=100)
    pid = models.CharField(max_length=100)
    lead_time = models.FloatField()
    leadtime_holiday_adjustment = models.BooleanField()
    selected_months = models.JSONField()
    com_month_12_fc_index = models.FloatField()
    com_trend = models.FloatField()
    trend = models.FloatField()
    inventory_maintained = models.BooleanField()
    trend_index_difference = models.FloatField()
    red_box_item = models.BooleanField()
    forecasting_method = models.CharField(max_length=100)
    minimum_required_oh_for_com = models.FloatField()
    fldc = models.FloatField()
    forecast_month = models.CharField(max_length=10)
    forecast_month_required_quantity = models.FloatField()
    forecast_month_planned_oh = models.FloatField()
    next_forecast_month = models.CharField(max_length=10)
    next_forecast_month_required_quantity = models.FloatField()
    next_forecast_month_planned_oh = models.FloatField()
    added_qty_macys_soq = models.FloatField()
    vdf_status = models.BooleanField()
    vdf_added_qty = models.FloatField()
    forecast_month_planned_shipment = models.FloatField()
    next_forecast_month_planned_shipment = models.IntegerField()
    qty_added_to_maintain_OH_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_maintain_OH_next_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_balance_SOQ_forecast_month = models.FloatField(null=True, blank=True)
    total_added_qty = models.IntegerField()
    vendor = models.CharField(max_length=255, null=True, blank=True)
    Valentine_day = models.BooleanField(default=False)
    Mothers_day = models.BooleanField(default=False)
    Fathers_day = models.BooleanField(default=False)
    Mens_day = models.BooleanField(default=False)
    Womens_day = models.BooleanField(default=False)
    Min_order = models.FloatField(null=True, blank=True)
    Macys_SOQ = models.FloatField(null=True, blank=True)
    average_store_sale_thru = models.FloatField(null=True, blank=True)
    macy_SOQ_percentage = models.FloatField(null=True, blank=True)
    Qty_given_to_macys = models.FloatField(null=True, blank=True)
    Added_qty_using_macys_SOQ = models.BooleanField(default=False)
    Below_min_order = models.BooleanField(default=False)
    Over_macys_SOQ = models.BooleanField(default=False)
    Added_only_to_balance_macys_SOQ = models.BooleanField(default=False)
    Need_to_review_first = models.BooleanField(default=False)
    RLJ = models.CharField(max_length=100, null=True, blank=True)
    STD_index_value_original = models.FloatField(null=True, blank=True)
    month_12_fc_index_original = models.FloatField(null=True, blank=True)
    std_trend_original = models.FloatField(null=True, blank=True)


    
    class Meta:
        unique_together = ('category', 'pid', 'forecast_month')


class OmniForecast(models.Model):
    category = models.CharField(max_length=100)
    pid = models.CharField(max_length=100)
    lead_time = models.FloatField()
    leadtime_holiday_adjustment = models.BooleanField()
    selected_months = models.JSONField()
    com_month_12_fc_index = models.FloatField()
    com_trend = models.FloatField()
    com_inventory_maintained = models.BooleanField()
    red_box_item = models.BooleanField()
    
    minimum_required_oh_for_com = models.FloatField()
    com_fldc = models.FloatField()
    forecast_month = models.CharField(max_length=10)
    
    next_forecast_month = models.CharField(max_length=10)
    
    store_month_12_fc_index = models.FloatField()
    loss = models.FloatField()
    store_month_12_fc_index_loss = models.FloatField()
    store_trend = models.FloatField(null=True, blank=True)
    store_inventory_maintained = models.BooleanField()
    door_count = models.FloatField()
    store_fldc = models.FloatField()
    birthstone = models.CharField(max_length=100)
    birthstone_month = models.CharField(max_length=100,null=True, blank=True)
    considered_birthstone_required_quantity = models.BooleanField()
    forecast_month_planned_oh = models.FloatField()
    next_forecast_month_planned_oh = models.FloatField()
    added_qty_macys_soq = models.FloatField()
    forecast_month_planned_shipment = models.FloatField()
    next_forecast_month_planned_shipment = models.FloatField()
    qty_added_to_maintain_OH_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_maintain_OH_next_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_balance_SOQ_forecast_month = models.FloatField(null=True, blank=True)
    total_added_qty = models.FloatField()
    vendor = models.CharField(max_length=255, null=True, blank=True)
    Valentine_day = models.BooleanField(default=False)
    Mothers_day = models.BooleanField(default=False)
    Fathers_day = models.BooleanField(default=False)
    Mens_day = models.BooleanField(default=False)
    Womens_day = models.BooleanField(default=False)
    Min_order = models.FloatField(null=True, blank=True)
    Macys_SOQ = models.FloatField(null=True, blank=True)
    average_store_sale_thru = models.FloatField(null=True, blank=True)
    macy_SOQ_percentage = models.FloatField(null=True, blank=True)
    Qty_given_to_macys = models.FloatField(null=True, blank=True)
    Added_qty_using_macys_SOQ = models.BooleanField(default=False)
    Below_min_order = models.BooleanField(default=False)
    Over_macys_SOQ = models.BooleanField(default=False)
    Added_only_to_balance_macys_SOQ = models.BooleanField(default=False)
    Need_to_review_first = models.BooleanField(default=False)
    RLJ = models.CharField(max_length=100,null=True, blank=True)
    trend_index_difference_com = models.FloatField(null=True, blank=True)
    trend_index_difference_store = models.FloatField(null=True, blank=True)
    forecasting_method_com = models.CharField(max_length=100)
    forecasting_method_store = models.CharField(max_length=100,null=True, blank=True)
    forecast_month_required_quantity_com = models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity_com = models.FloatField(null=True, blank=True)
    forecast_month_required_quantity_store = models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity_store = models.FloatField(null=True, blank=True)
    forecast_month_required_quantity_total = models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity_total = models.FloatField(null=True, blank=True)
    STD_index_value_original = models.FloatField(null=True, blank=True)
    month_12_fc_index_original = models.FloatField(null=True, blank=True)
    std_trend_original = models.FloatField(null=True, blank=True)
    class Meta:
        unique_together = ('category', 'pid', 'forecast_month')


class ForecastNote(models.Model):
    pid = models.CharField(max_length=100, verbose_name="Product ID")
    note = models.TextField(null=True, blank=True, verbose_name="Note Description")
    assigned_to = models.CharField(max_length=100, null=True, blank=True, verbose_name="Assigned To")
    reviewed = models.BooleanField(default=False, verbose_name="Reviewed")  # New field

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['pid']),
        ]

    def __str__(self):
        return f"{self.pid} - {self.assigned_to} - {'Reviewed' if self.reviewed else 'Not Reviewed'}"

class RetailInfo(models.Model):
    year_of_previous_month = models.CharField(max_length=100, null=True, blank=True)
    last_year_of_previous_month = models.CharField(max_length=100, null=True, blank=True)
    season = models.CharField(max_length=100, null=True, blank=True)
    current_month = models.CharField(max_length=20, null=True, blank=True)
    current_month_number = models.IntegerField(null=True, blank=True)
    previous_week_number = models.IntegerField(null=True, blank=True)
    last_month_of_previous_month_numeric = models.IntegerField(null=True, blank=True)
    rolling_method = models.CharField(max_length=50, null=True, blank=True)

    # Weekly distribution fields
    feb_weeks = models.IntegerField(null=True, blank=True)
    mar_weeks = models.IntegerField(null=True, blank=True)
    apr_weeks = models.IntegerField(null=True, blank=True)
    may_weeks = models.IntegerField(null=True, blank=True)
    jun_weeks = models.IntegerField(null=True, blank=True)
    jul_weeks = models.IntegerField(null=True, blank=True)
    aug_weeks = models.IntegerField(null=True, blank=True)
    sep_weeks = models.IntegerField(null=True, blank=True)
    oct_weeks = models.IntegerField(null=True, blank=True)
    nov_weeks = models.IntegerField(null=True, blank=True)
    dec_weeks = models.IntegerField(null=True, blank=True)
    jan_weeks = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"RetailInfo ({self.current_month} - {self.year_of_previous_month})"