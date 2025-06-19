from django.db import models
from django.conf import settings 

class SheetUpload(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, verbose_name="Sheet Name")
    file = models.FileField(upload_to='uploads/')
    summary = models.FileField(upload_to='summary/', null=True, blank=True, verbose_name="Summary File")
    is_processed = models.BooleanField(default=False)
    final_quantity_report = models.FileField(upload_to='final_quantity_report/', null=True, blank=True, verbose_name="Final Quantity Report")
    output_folder = models.CharField(max_length=255, null=True, blank=True)
    month_from = models.CharField(max_length=50, null=True, blank=True)
    month_to = models.CharField(max_length=50, null=True, blank=True)
    percentage = models.CharField(max_length=10, null=True, blank=True)
    categories = models.JSONField(null=True, blank=True) 

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),            # If filtering by uploaded_by user
            models.Index(fields=["uploaded_at"]),     # For ordering/filtering recent uploads
        ]

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class ProductDetail(models.Model):

    id = models.AutoField(primary_key=True)
    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE,null=True, blank=True, related_name="product_details")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="assigned_to")
    product_id = models.CharField(max_length=50, verbose_name="Cross Ref") #pid
    product_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="PID Desc")
    PRODUCT_TYPE_CHOICES = [
        ('store', 'Store'),
        ('com', 'Com'),
        ('omni', 'Omni'),
    ]
    product_type = models.CharField(max_length=5, choices=PRODUCT_TYPE_CHOICES, verbose_name="Product Type",null=True, blank=True)
    STATUS_CHOICES = [
        ("not_reviewed", "Not reviewed"),
        ("pending",      "Pending"),
        ("reviewed",     "Reviewed"),
    ]
    status      = models.CharField(max_length=13, choices=STATUS_CHOICES, default="not_reviewed", verbose_name="Status", null=True, blank=True)

    safe_non_safe = models.CharField(max_length=100,null=True, blank=True, verbose_name="Safe/Non-Safe") #Safe/Non-Safe
    item_code = models.CharField(max_length=100,null=True, blank=True, verbose_name="Item Code") #Item Code
    rlj = models.CharField(max_length=100,null=True, blank=True, verbose_name="Adjusted RLJ Item") #RLJ
    mkst = models.CharField(max_length=50,null=True, blank=True, verbose_name="Mkst")    #MKST
    current_door_count = models.FloatField(null=True, blank=True, verbose_name="Door Count") #Door Count
    last_store_count = models.FloatField(null=True, blank=True, verbose_name="Old Door Count") #Last Str Cnt
    door_count_updated = models.DateField(null=True, blank=True, verbose_name="Door Count Updated")    #Door Count Updated
    store_model = models.FloatField( null=True, blank=True, verbose_name="Model") #Store Model
    com_model = models.FloatField( null=True, blank=True, verbose_name="Com Model") 
    holiday_build_fc = models.FloatField(null=True, blank=True, verbose_name="HolidayBuildFC")
    macys_onhand = models.FloatField(null=True, blank=True, verbose_name="MCYOH Units")
    oo_units = models.FloatField(null=True, blank=True, verbose_name="OO Units") #OO Units
    in_transit = models.FloatField(null=True, blank=True, verbose_name="nav OO") #nav OO
    month_to_date_shipment = models.FloatField(null=True, blank=True, verbose_name="MTD SHIPMENTS") #MTD SHIPMENTS 
    last_week_shipment = models.FloatField(null=True, blank=True, verbose_name="LW Shipments") #LW Shipments
    planned_weeks_of_stock = models.FloatField(null=True, blank=True, verbose_name="Wks of Stock OH")  #Wks of Stock OH
    weeks_of_projection = models.FloatField(null=True, blank=True, verbose_name="Wks of on Proj") #Wks of on Proj
    last_4_weeks_shipment = models.FloatField(null=True, blank=True, verbose_name="Last 4 Wks Ships") #Last 4 Wks Ships
    vendor_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Vendor Name") #Vendor Name
    min_order = models.FloatField(null=True, blank=True, verbose_name="Min Order") #Min Order
    rl_total = models.FloatField(null=True, blank=True, verbose_name="Proj") #Proj	
    net_projection = models.FloatField(null=True, blank=True, verbose_name="Net Proj")  #Net Proj
    unalloc_order = models.FloatField(null=True, blank=True, verbose_name="Unalloc Orders") #Unalloc Orders
    ma_bin = models.FloatField(null=True, blank=True, verbose_name="RLJ OH")
    fldc = models.FloatField(null=True, blank=True, verbose_name="FLDC")
    wip_quantity = models.FloatField(null=True, blank=True, verbose_name="WIP")
    md_status = models.CharField(max_length=50, null=True, blank=True, verbose_name="MD Status MZ1")
    replenishment_flag = models.CharField(max_length=100, null=True, blank=True, verbose_name="Repl Flag")
    mcom_replenishment = models.CharField(max_length=100, null=True, blank=True, verbose_name="MCOM RPL")
    pool_stock = models.FloatField(null=True, blank=True, verbose_name="Pool Stock")
    first_receipt_date = models.DateField(null=True, blank=True, verbose_name="1st Rec Date")
    last_receipt_date = models.DateField(null=True, blank=True, verbose_name="Last Rec Date")
    item_age = models.FloatField(null=True, blank=True, verbose_name="Item Age")
    first_live_date = models.DateField(null=True, blank=True, verbose_name="1st Live")
    this_year_last_cost = models.FloatField(null=True, blank=True, verbose_name="TY Last Cost")
    macys_owned_retail = models.FloatField(null=True, blank=True, verbose_name="Own Retail")
    awr_first_ticket_retail = models.FloatField(null=True, blank=True, verbose_name="AWR 1st Tkt Ret")
    metal_lock = models.FloatField(null=True, blank=True, verbose_name="Metal Lock")
    mfg_policy = models.CharField(max_length=50, null=True, blank=True, verbose_name="MFG Policy")
    kpi_data_updated = models.CharField(max_length=50, null=True, blank=True, verbose_name="KPI Data Updated")
    kpi_door_count = models.FloatField(null=True, blank=True, verbose_name="KPI Door Count")
    out_of_stock_location = models.FloatField(null=True, blank=True, verbose_name="OOS Locs")
    suspended_location_count = models.FloatField(null=True, blank=True, verbose_name="Suspended Loc Count")
    live_site = models.CharField(max_length=50, null=True, blank=True, verbose_name="Live Site")
    
    masterstyle_id = models.FloatField(null=True, blank=True, verbose_name="MstrSt ID")
    masterstyle_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="Masterstyle Desc")

    department_id = models.FloatField( null=True, blank=True, verbose_name="Dpt ID")
    department_description = models.CharField(max_length=100, null=True, blank=True, verbose_name="Dpt Desc")
    
    subclass_id = models.FloatField( null=True, blank=True, verbose_name="SC ID")
    subclass_description = models.CharField(max_length=100, null=True, blank=True, verbose_name="SC Desc")

    webid_description = models.CharField(max_length=200, null=True, blank=True, verbose_name="Prod Desc")
    
    v2c = models.CharField(max_length=50, null=True, blank=True, verbose_name="V2C")
    marketing_id = models.CharField(max_length=50, null=True, blank=True, verbose_name="Mktg ID")
    std_store_return = models.FloatField(null=True, blank=True, verbose_name="STD Store Rtn %")
    
    last_projection_review_date = models.DateField(null=True, blank=True, verbose_name="Last Proj Review Date")
    macy_spring_projection_note = models.TextField(null=True, blank=True, verbose_name="Macy's Spring Proj Notes")
    planner_response = models.TextField(null=True, blank=True, verbose_name="Planner Response")
    website = models.CharField(max_length=1000, null=True, blank=True, verbose_name="Website")
    
    external_factor_note = models.CharField(max_length=300,null=True, blank=True)
    external_factor_percentage = models.FloatField(null=True, blank=True, verbose_name="External Factor Percentage")
    user_updated_final_quantity = models.FloatField(null=True, blank=True)
    recommended_total_quantity = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    
    
    #Remaining fields
    country = models.CharField(max_length=100, null=True, blank=True)
    valentine_day = models.BooleanField(default=False)
    mothers_day = models.BooleanField(default=False)
    fathers_day = models.BooleanField(default=False)
    mens_day = models.BooleanField(default=False)
    womens_day = models.BooleanField(default=False)
    selected_months=models.CharField(max_length=100, null=True, blank=True)
    forecast_month = models.CharField(max_length=10, null=True, blank=True)
    next_forecast_month = models.CharField(max_length=10, null=True, blank=True)
    current_date = models.DateField(null=True, blank=True)
    lead_time_old = models.FloatField(null=True, blank=True)
    forecast_date_old = models.DateField(null=True, blank=True)
    lead_time = models.FloatField(null=True, blank=True)
    forecast_date = models.DateField(null=True, blank=True)
    forecast_month_week=models.FloatField(null=True, blank=True)

    is_lead_guideline_in_holiday = models.BooleanField(default=False)
    is_added_quantity_using_macys_soq = models.BooleanField(default=False)
    is_below_min_order = models.BooleanField(default=False)
    is_over_macys_soq = models.BooleanField(default=False)
    is_added_only_to_balance_macys_soq = models.BooleanField(default=False)
    is_need_to_review_first = models.BooleanField(default=False)
    is_red_box_item = models.BooleanField(default=False)
    is_vdf_item = models.BooleanField(default=False)

    average_store_sale_thru = models.FloatField(null=True, blank=True)
    macys_proj_receipt_upto_forecast_month = models.FloatField(null=True, blank=True)
    macy_soq_percentage = models.FloatField(null=True, blank=True)
    qty_given_to_macys = models.FloatField(null=True, blank=True)

    birthstone = models.CharField(max_length=100, null=True, blank=True)
    birthstone_month = models.CharField(max_length=100, null=True, blank=True)
    is_considered_birthstone = models.BooleanField(default=False)

    forecast_month_required_quantity = models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity = models.FloatField(null=True, blank=True)
    forecast_month_planned_oh_before = models.FloatField(null=True, blank=True)
    next_forecast_month_planned_oh_before = models.FloatField(null=True, blank=True)
    forecast_month_planned_shipment = models.FloatField(null=True, blank=True)
    next_forecast_month_planned_shipment = models.FloatField(null=True, blank=True)

    qty_added_to_maintain_oh_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_maintain_oh_next_forecast_month = models.FloatField(null=True, blank=True)
    qty_added_to_balance_soq_forecast_month = models.FloatField(null=True, blank=True)
    
    std_index_value_original = models.FloatField(null=True, blank=True, verbose_name="STD Index Value")  # Assuming dict-like data

    rolling_method_original = models.CharField(max_length=50, null=True, blank=True, verbose_name="Rolling Method")
    std_trend_original = models.FloatField(null=True, blank=True, verbose_name="STD Trend")
    forecasting_method_original= models.CharField(max_length=50, null=True, blank=True, verbose_name="Forecasting Method")
    current_fc_index_original = models.CharField(max_length=50,null=True, blank=True, verbose_name="FC Index") #Current FC Index
    month_12_fc_index_original = models.FloatField(null=True, blank=True, verbose_name="12 Month FC Index")

 
    updated_std_trend = models.FloatField(null=True, blank=True)
    updated_12_month_fc_index = models.FloatField(null=True, blank=True)
    updated_rolling_method = models.CharField(max_length=100, null=True, blank=True)   
    updated_current_fc_index = models.CharField(max_length=100, null=True, blank=True)
    updated_forecasting_method = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["sheet"]),                  # For sheet_id filtering
            models.Index(fields=["product_type"]),           # Filtering by product_type
            models.Index(fields=["category"]),               # Filtering by category
            models.Index(fields=["birthstone"]),             # Filtering by birthstone
            models.Index(fields=["assigned_to"]),            # Filtering by assigned_to
            models.Index(fields=["product_id"]),             # Used in joins or filters
            models.Index(fields=["status"]),                 # If you're filtering by status often
            models.Index(fields=["forecast_month"]),         # If forecast_month used in filters
            models.Index(fields=["is_red_box_item"]),        # Add boolean indexes only if filtered often
            models.Index(fields=["is_considered_birthstone"]),
            models.Index(fields=["is_added_quantity_using_macys_soq"]),
            models.Index(fields=["is_added_only_to_balance_macys_soq"]),
            models.Index(fields=["is_below_min_order"]),
            models.Index(fields=["is_over_macys_soq"]),
            models.Index(fields=["is_need_to_review_first"]),
            models.Index(fields=["valentine_day"]),
            models.Index(fields=["mothers_day"]),
            models.Index(fields=["fathers_day"]),
            models.Index(fields=["mens_day"]),
            models.Index(fields=["womens_day"]),
        ]


    def __str__(self):
        return f"{self.product_id} - {self.product_description} ({self.product_type})"


class StoreForecast(models.Model):

    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE,null=True, blank=True, related_name="store_forecasts")
    product_id=models.CharField(max_length=50, null=True, blank=True, verbose_name="Cross Ref")  # pid
    std_index_value = models.FloatField(null=True, blank=True)
    std_ty_unit_sales = models.FloatField(null=True, blank=True)
    ty_unit_sales_new_trend = models.FloatField(null=True, blank=True)
    ly_unit_sales_new_trend = models.FloatField(null=True, blank=True)
    loss = models.FloatField(null=True, blank=True)
    loss_updated=models.FloatField(null=True, blank=True)
    is_reduced_loss = models.BooleanField(default=False)
    average_eoh_oh= models.FloatField(null=True, blank=True)
    is_handle_large_trend = models.BooleanField(default=False)
    new_month_12_fc_index = models.FloatField(null=True, blank=True)
    std_trend = models.FloatField(null=True, blank=True)
    is_inventory_maintained = models.BooleanField(default=False)
    trend_index_difference = models.FloatField(null=True, blank=True)
    average_com_oh = models.FloatField(null=True, blank=True)
    fldc = models.FloatField(null=True, blank=True)
    forecasting_method = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Store Forecast for {self.sheet.name} - {self.new_month_12_fc_index} Index"


class ComForecast(models.Model):
    """Model for Com Forecast data"""
    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE, null=True, blank=True, related_name="com_forecasts")
    product_id=models.CharField(max_length=50, null=True, blank=True, verbose_name="Cross Ref")  # pid
    new_month_12_fc_index = models.FloatField(null=True, blank=True)
    com_trend_for_selected_month = models.FloatField(null=True, blank=True)
    is_handle_large_trend = models.BooleanField(default=False)
    final_com_trend= models.FloatField(null=True, blank=True)
    is_com_inventory_maintained = models.BooleanField(default=False)
    ty_com_sales_unit_selected_month_sum = models.FloatField(null=True, blank=True)
    ly_com_sales_unit_selected_month_sum = models.FloatField(null=True, blank=True)
    std_index_value = models.FloatField(null=True, blank=True)
    trend_index_difference = models.FloatField(null=True, blank=True)
    forecasting_method = models.CharField(max_length=50, null=True, blank=True)
    minimum_required_oh_for_com = models.FloatField(null=True, blank=True)
    fldc = models.FloatField(null=True, blank=True)
    vdf_added_quantity = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Com Forecast for {self.sheet.name} - {self.new_month_12_fc_index} Index"


class OmniForecast(models.Model):

    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE, null=True, blank=True, related_name="omni_forecasts")
    product_id=models.CharField(max_length=50, null=True, blank=True, verbose_name="Cross Ref")  # pid
    std_index_value = models.FloatField(null=True, blank=True)
    ty_com_sales_unit_selected_month_sum=models.FloatField(null=True, blank=True)
    ly_com_sales_unit_selected_month_sum=models.FloatField(null=True, blank=True)
    com_month_12_fc_index = models.FloatField(null=True, blank=True)
    com_trend_for_selected_month= models.FloatField(null=True, blank=True)
    is_handle_large_trend_com= models.BooleanField(default=False)
    final_com_trend = models.FloatField(null=True, blank=True)
    is_com_inventory_maintained = models.BooleanField(default=False)
    trend_index_difference_com = models.FloatField(null=True, blank=True)
    forecasting_method_for_com = models.CharField(max_length=50, null=True, blank=True)
    minimum_required_oh_for_com = models.FloatField(null=True, blank=True)
    com_fldc = models.FloatField(null=True, blank=True)
    forecast_month_required_quantity_com= models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity_com= models.FloatField(null=True, blank=True)
    store_month_12_fc_index_original = models.FloatField(null=True, blank=True)
    loss = models.FloatField(null=True, blank=True)
    average_eoh_oh= models.FloatField(null=True, blank=True)
    loss_updated=models.FloatField(null=True, blank=True)
    is_reduced_loss = models.BooleanField(default=False)
    store_month_12_fc_index_loss = models.FloatField(null=True, blank=True)
    store_trend = models.FloatField(null=True, blank=True)
    is_store_inventory_maintained = models.BooleanField(default=False)
    trend_index_difference_store = models.FloatField(null=True, blank=True)
    forecasting_method_for_store = models.CharField(max_length=50, null=True, blank=True)
    store_fldc = models.FloatField(null=True, blank=True)
    is_handle_large_trend_store = models.BooleanField(default=False)
    forecast_month_required_quantity_store= models.FloatField(null=True, blank=True)
    next_forecast_month_required_quantity_store= models.FloatField(null=True, blank=True)
    ty_store_sales_unit_selected_month_sum= models.FloatField(null=True, blank=True)
    ly_store_sales_unit_selected_month_sum= models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"Omni Forecast for {self.sheet.name} - Com Index: {self.com_month_12_fc_index}, Store Index: {self.store_month_12_fc_index}"


class MonthlyForecast(models.Model):
    """Normalized model for all monthly forecast data with separate fields for each month"""

    VARIABLE_CHOICES = [

    ("index", "Index"),
    ("fc_by_index", "FC by Index"),
    ("fc_by_trend", "FC by Trend"),
    ("recommended_fc", "Recommended FC"),
    ("planned_fc", "Planned FC"),
    ("planned_shipments", "Planned Shipments"),
    ("planned_eoh_cal", "Planned EOH (Cal)"),
    ("gross_projection_nav", "Gross Projection (Nav)"),
    ("macys_proj_receipts", "Macys Proj Receipts"),
    ("planned_sell_thru_pct", "Planned Sell thru %"),

    ("ty_total_sales_units", "Total Sales Units (TY)"),
    ("ty_store_sales_units", "Store Sales Units (TY)"),
    ("ty_com_sales_units", "Com Sales Units (TY)"),
    ("ty_com_to_ttl_sales_pct", "COM % to TTL (Sales) (TY)"),
    ("ty_total_eom_oh", "TOTAL EOM OH (TY)"),
    ("ty_store_eom_oh", "Store EOM OH (TY)"),
    ("ty_com_eom_oh", "COM EOM OH (TY)"),
    ("ty_com_to_ttl_eoh_pct", "COM % to TTL (EOH) (TY)"),
    ("ty_omni_sales_usd", "Omni Sales $ (TY)"),
    ("ty_com_sales_usd", "COM Sales $ (TY)"),
    ("ty_omni_aur_diff_own", "Omni AUR/% Diff Own (TY)"),
    ("ty_omni_sell_thru_pct", "Omni Sell Thru % (TY)"),
    ("ty_store_sell_thru_pct", "Store SellThru % (TY)"),
    ("ty_omni_turn", "Omni Turn (TY)"),
    ("ty_store_turn", "Store Turn (TY)"),
    ("ty_store_sales_vs_ly", "Store Sales U vs LY"),
    ("ty_com_sales_vs_ly", "COM Sales U vs LY"),
    ("ty_store_eoh_vs_ly", "Store EOH vs LY"),
    ("ty_omni_oo_units", "Omni OO Units"),
    ("ty_com_oo_units", "COM OO Units"),
    ("ty_omni_receipts", "Omni Receipts (TY)"),

    ("ly_total_sales_units", "Total Sales Units (LY)"),
    ("ly_store_sales_units", "Store Sales Units (LY)"),
    ("ly_com_sales_units", "Com Sales Units (LY)"),
    ("ly_com_to_ttl_sales_pct", "COM % to TTL (Sales) (LY)"),
    ("ly_total_eom_oh", "TOTAL EOM OH (LY)"),
    ("ly_store_eom_oh", "Store EOM OH (LY)"),
    ("ly_com_eom_oh", "COM EOM OH (LY)"),
    ("ly_com_to_ttl_eoh_pct", "COM % to TTL (EOH) (LY)"),
    ("ly_omni_receipts", "Omni Receipts (LY)"),
    ("ly_omni_sell_thru_pct", "Omni Sell Thru % (LY)"),
    ("ly_store_sell_thru_pct", "Store SellThru % (LY)"),
    ("ly_omni_turn", "Omni Turn (LY)"),
    ("ly_store_turn", "Store Turn (LY)"),
    ("ly_omni_sales_usd", "Omni Sales $ (LY)"),
    ("ly_com_sales_usd", "COM Sales $ (LY)"),
    ("ly_omni_aur_diff_own", "Omni AUR/% Diff Own (LY)"),
]
 

    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE, null=True, blank=True, related_name="monthly_forecasts")
    productdetail = models.ForeignKey(ProductDetail, on_delete=models.CASCADE, verbose_name="Product")
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
        indexes = [
            models.Index(fields=["productdetail"]),   # Joins/filters by product
            models.Index(fields=["sheet"]),           # Filters by sheet
            models.Index(fields=["variable_name", "year"]),  # Optimized combo for time series
        ]


    def __str__(self):
        return f"{self.productdetail} - {self.variable_name} - {self.year}: Jan({self.jan}), Feb({self.feb}), ... Dec({self.dec})"


class ForecastNote(models.Model):
    sheet = models.ForeignKey("SheetUpload", on_delete=models.CASCADE, null=True, blank=True, related_name="forecast_notes")
    productdetail = models.ForeignKey("ProductDetail", on_delete=models.CASCADE, null=True, blank=True, related_name="notes")
    note = models.TextField(blank=True, null=True, verbose_name="Note Description")
    tagged_to = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="tagged_notes")  # Changed to ManyToManyField
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["productdetail"]),   # ForeignKey index for joining with ProductDetail
            models.Index(fields=["sheet"]),           # If you filter by sheet
            models.Index(fields=["created_at"]),      # Useful for date sorting or filtering
        ]
 

    def __str__(self):
        return f"{self.product} - {self.note[:50]}..."  # Display first 50 characters of the note


class RetailInfo(models.Model):

    sheet = models.ForeignKey(SheetUpload, on_delete=models.CASCADE, null=True, blank=True, related_name="retail_info")
    year_of_previous_month = models.CharField(max_length=100, null=True, blank=True)
    last_year_of_previous_month = models.CharField(max_length=100, null=True, blank=True)
    season = models.CharField(max_length=100, null=True, blank=True)
    current_date = models.DateField(null=True, blank=True)
    current_month = models.CharField(max_length=20, null=True, blank=True)
    current_month_number = models.IntegerField(null=True, blank=True)
    previous_week_number = models.IntegerField(null=True, blank=True)
    last_month_of_previous_month_numeric = models.IntegerField(null=True, blank=True)

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

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['sheet'])
        ]

    def __str__(self):
        return f"RetailInfo ({self.current_month} - {self.year_of_previous_month})"
