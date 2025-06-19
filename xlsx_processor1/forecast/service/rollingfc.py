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
            "JAN": fc.jan, "FEB": fc.feb, "MAR": fc.mar, "APR": fc.apr,
            "MAY": fc.may, "JUN": fc.jun, "JUL": fc.jul, "AUG": fc.aug,
            "SEP": fc.sep, "OCT": fc.oct, "NOV": fc.nov, "DEC": fc.dec
        }
        for fc in forecasts
    }
        # Map each variable_name to its monthly data
    forecast_map_last = {
        fc.variable_name: {
            "JAN": fc.jan, "FEB": fc.feb, "MAR": fc.mar, "APR": fc.apr,
            "MAY": fc.may, "JUN": fc.jun, "JUL": fc.jul, "AUG": fc.aug,
            "SEP": fc.sep, "OCT": fc.oct, "NOV": fc.nov, "DEC": fc.dec
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
        "index" : ["current_fc_index"],
        "fc_by_index": ["index", "month_12_fc_index"],
        "fc_by_trend": ["std_trend"],
        "fc_by_average": ["fc_by_index", "fc_by_trend"],
        "recommended_fc": ["forecasting_method", "fc_by_index", "fc_by_trend", "fc_by_average"],
        "planned_fc": ["recommended_fc","rolling_method"],
        "planned_shipments": ["gross_projection_nav"],
        "planned_eoh_cal": ["planned_fc", "planned_shipments","rolling_method"],
        "planned_sell_thru_pct": ["planned_fc", "planned_eoh_cal"]
 
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

 
def get_function_map(ty_total_sales_units, ty_total_eom_oh, ty_omni_receipts, ly_total_eom_oh, ly_total_sales_units, last_month_of_previous_month_numeric, current_month_number, current_month):

    s1 = last_month_of_previous_month_numeric
    k1 = current_month_number
    row_4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    row_17 = ty_total_sales_units
    row_39 = ly_total_sales_units
    row_43 = ly_total_eom_oh
    row_37 = ty_omni_receipts
    row_21 = ty_total_eom_oh
    print("row_43:", row_43)

    return {
        "index": {
            "function": calculate_index_value,
            "params": lambda ctx: [ctx["current_fc_index"]]
        },
        "fc_by_index": {
            "function": calculate_fc_by_index,
            "params": lambda ctx: [ctx["index"], ctx["month_12_fc_index"]]
        },
        "fc_by_trend": {
            "function": calculate_fc_by_trend,
            "params": lambda ctx: [s1, k1,ctx["std_trend"], row_4, list(row_17.values()), list(row_39.values())]
        },
        "fc_by_average": {
            "function": calculate_fc_by_average,
            "params": lambda ctx: [ctx["fc_by_index"], ctx["fc_by_trend"]]
        },
        "recommended_fc": {
            "function": get_recommended_forecast,
            "params": lambda ctx: [ctx["forecasting_method"], ctx["fc_by_index"], ctx["fc_by_trend"], None]
        },
        "planned_fc": {
            "function": calculate_planned_fc,
            "params": lambda ctx: [row_4, ctx["recommended_fc"], row_17, row_43, str(ctx["rolling_method"]).upper(), k1]
        },
        "planned_eoh_cal": {
            "function": calculate_planned_oh_partial,
            "params": lambda ctx: [str(ctx["rolling_method"]).upper(), k1, ctx["planned_fc"], ctx["planned_shipments"], row_21, row_37, row_43, row_17, current_month]
        },
        "planned_sell_thru_pct": {
            "function": calculate_planned_sell_through,
            "params": lambda ctx: [ctx["planned_fc"], ctx["planned_eoh_cal"]]
        }
    }
 
# Main recalculation engine
 
def recalculate_all(changed_var, new_value, context_data, product_object, sheet_object):
    deps = dependencies()
    order = build_dependency_order(deps, changed_var)
    context_data[changed_var] = new_value
    context_data
    ty_total_sales_units, ly_total_sales_units, ty_total_eom_oh, ty_omni_receipts, ly_total_eom_oh = get_forecast_variables(product_object,sheet_object)
    retail = RetailInfo.objects.filter(sheet=sheet_object).first()
    last_month_of_previous_month_numeric = retail.last_month_of_previous_month_numeric
    current_month_number = retail.current_month_number
    current_month = retail.current_month
    print(type(context_data['std_trend']))
    function_map = get_function_map(ty_total_sales_units, ty_total_eom_oh, ty_omni_receipts, ly_total_eom_oh, ly_total_sales_units, last_month_of_previous_month_numeric, current_month_number, current_month.upper())
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
 
