import os
import django

# Set your Django settings module - replace 'your_project_name' with your actual project name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xlsx_processor1.settings')
django.setup()

from collections import defaultdict, deque
from forecast.service.utils import (
    calculate_fc_by_index,
    calculate_fc_by_trend,
    calculate_fc_by_average,
    get_recommended_forecast,
    calculate_planned_fc,
    calculate_planned_oh_partial,
    calculate_index_value,
    calculate_planned_sell_through,
    calculate_fc_by_average
)

from forecast.models import RetailInfo, MonthlyForecast
from django.core.exceptions import ObjectDoesNotExist

# try:
#     retail = RetailInfo.objects.latest('id')
# except ObjectDoesNotExist:
#     retail = None

def get_forecast_variables(product_object,sheet_object, year=2025,last_year=2024):
    # List of required variable names
    variable_keys = [
        "ty_total_sales_units",
        "ty_total_eom_oh",
        "ty_omni_receipts"
    ]
    variable_keys_last_year = [
        "ly_total_sales_units",
        "ly_total_eom_oh"
    ]

    # Fetch all relevant records in a single query
    forecasts = MonthlyForecast.objects.filter(
        sheet=sheet_object,
        productdetail=product_object,
        year=year,
        variable_name__in=variable_keys
    )
    forecasts_last_year = MonthlyForecast.objects.filter(
        sheet=sheet_object,
        productdetail=product_object,
        year=last_year,
        variable_name__in=variable_keys_last_year
    )

    # Map each variable_name to its monthly data
    forecast_map = {
        fc.variable_name: {
            "FEB": fc.feb, "MAR": fc.mar, "APR": fc.apr,
            "MAY": fc.may, "JUN": fc.jun, "JUL": fc.jul, "AUG": fc.aug,
            "SEP": fc.sep, "OCT": fc.oct, "NOV": fc.nov, "DEC": fc.dec,"JAN": fc.jan
        }
        for fc in forecasts
    }
        # Map each variable_name to its monthly data
    forecast_map_last = {
        fc.variable_name: {
            "FEB": fc.feb, "MAR": fc.mar, "APR": fc.apr,
            "MAY": fc.may, "JUN": fc.jun, "JUL": fc.jul, "AUG": fc.aug,
            "SEP": fc.sep, "OCT": fc.oct, "NOV": fc.nov, "DEC": fc.dec,"JAN": fc.jan
        }
        for fc in forecasts_last_year
    }

    # Assign to individual variables
    ty_total_sales_units = forecast_map.get("ty_total_sales_units", {})
    ly_total_sales_units = forecast_map_last.get("ly_total_sales_units", {})
    ty_total_eom_oh = forecast_map.get("ty_total_eom_oh", {})
    ty_omni_receipts = forecast_map.get("ty_omni_receipts", {})
    ly_total_eom_oh = forecast_map_last.get("ly_total_eom_oh", {})

    print("ty_total_sales_units:", ty_total_sales_units)
    print("ly_total_sales_units:", ly_total_sales_units)
    print("ty_total_eom_oh:", ty_total_eom_oh)
    print("ty_omni_receipts:", ty_omni_receipts)
    print("ly_total_eom_oh:", ly_total_eom_oh)

    return ty_total_sales_units, ly_total_sales_units, ty_total_eom_oh, ty_omni_receipts, ly_total_eom_oh


def dependencies():
    return {
        "Index_value" : ["Current_FC_Index"],
        "FC_by_Index": ["Index_value", "month_12_fc_index"],
        "FC_by_Trend": ["Trend"],
        "FC_by_Average": ["FC_by_Index", "FC_by_Trend"],
        "Recommended_FC": ["Forecasting_Method", "FC_by_Index", "FC_by_Trend", "FC_by_Average"],
        "Planned_FC": ["Recommended_FC","Rolling_method"],
        "Planned_Shipments": ["Gross_Projection"],
        "Planned_EOH": ["Planned_FC", "Planned_Shipments","Rolling_method"],
        "Planned_sell_thru": ["Planned_FC", "Planned_EOH"]
 
    }
 

def build_dependency_order(dependencies, changed_variable):
    graph = defaultdict(list)
    reverse_graph = defaultdict(list)
 
    for var, deps in dependencies.items():
        for dep in deps:
            graph[dep].append(var)
            reverse_graph[var].append(dep)
 
    queue = deque([changed_variable])
    affected = set()
 
    while queue:
        var = queue.popleft()
        if var not in affected:
            affected.add(var)
            queue.extend(graph[var])
 
    in_degree = {v: 0 for v in affected}
    for v in affected:
        for dep in reverse_graph[v]:
            if dep in affected:
                in_degree[v] += 1
 
    queue = deque([v for v in affected if in_degree[v] == 0])
    sorted_vars = []
 
    while queue:
        v = queue.popleft()
        sorted_vars.append(v)
        for nei in graph[v]:
            if nei in affected:
                in_degree[nei] -= 1
                if in_degree[nei] == 0:
                    queue.append(nei)
 
    if changed_variable in sorted_vars:
        sorted_vars.remove(changed_variable)
 
    return sorted_vars

 
def get_function_map(TY_Unit_Sales, TY_OH_Units, TY_Receipts, LY_OH_Units, LY_Unit_Sales, last_month_of_previous_month_numeric, current_month_number, current_month):

    s1 = last_month_of_previous_month_numeric
    k1 = current_month_number
    row_4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    row_17 = TY_Unit_Sales
    row_39 = LY_Unit_Sales
    row_43 = LY_OH_Units
    row_37 = TY_Receipts
    row_21 = TY_OH_Units
    print("row_43:", row_43)

    return {
        "Index_value": {
            "function": calculate_index_value,
            "params": lambda ctx: [ctx["Current_FC_Index"]]
        },
        "FC_by_Index": {
            "function": calculate_fc_by_index,
            "params": lambda ctx: [ctx["Index_value"], ctx["month_12_fc_index"]]
        },
        "FC_by_Trend": {
            "function": calculate_fc_by_trend,
            "params": lambda ctx: [s1, k1,ctx["Trend"], row_4, list(row_17.values()), list(row_39.values())]
        },
        "FC_by_Average": {
            "function": calculate_fc_by_average,
            "params": lambda ctx: [ctx["FC_by_Index"], ctx["FC_by_Trend"]]
        },
        "Recommended_FC": {
            "function": get_recommended_forecast,
            "params": lambda ctx: [ctx["Forecasting_Method"], ctx["FC_by_Index"], ctx["FC_by_Trend"], None]
        },
        "Planned_FC": {
            "function": calculate_planned_fc,
            "params": lambda ctx: [row_4, ctx["Recommended_FC"], row_17, row_43, str(ctx["Rolling_method"]).upper(), k1]
        },
        "Planned_EOH": {
            "function": calculate_planned_oh_partial,
            "params": lambda ctx: [str(ctx["Rolling_method"]).upper(), k1, ctx["Planned_FC"], ctx["Planned_Shipments"], row_21, row_37, row_43, row_17, current_month]
        },
        "Planned_sell_thru": {
            "function": calculate_planned_sell_through,
            "params": lambda ctx: [ctx["Planned_FC"], ctx["Planned_EOH"]]
        }
    }
 
# Main recalculation engine
 
def recalculate_all(changed_var, new_value, context_data, product_object, sheet_object):
    deps = dependencies()
    order = build_dependency_order(deps, changed_var)
    context_data[changed_var] = new_value
    context_data
    TY_Unit_Sales, LY_Unit_Sales, TY_OH_Units, TY_Receipts, LY_OH_Units = get_forecast_variables(product_object,sheet_object)
    retail = RetailInfo.objects.filter(sheet=sheet_object).first()
    last_month_of_previous_month_numeric = retail.last_month_of_previous_month_numeric
    current_month_number = retail.current_month_number
    current_month = retail.current_month
    print(type(context_data['Trend']))
    function_map = get_function_map(TY_Unit_Sales, TY_OH_Units, TY_Receipts, LY_OH_Units, LY_Unit_Sales, last_month_of_previous_month_numeric, current_month_number, current_month.upper())
    print("Recalculation order:", order)
    print("Current Month:",current_month)

    for var in order:
        if var not in function_map:
            continue
            
        func_info = function_map[var]
        func = func_info["function"]
        params = func_info["params"](context_data)
        context_data[var] = func(*params)
 
    return context_data
 
