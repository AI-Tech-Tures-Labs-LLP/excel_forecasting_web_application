import pandas as pd
from openpyxl import load_workbook
from multiprocessing import Pool, cpu_count
from typing import Tuple, Dict
import logging

def read_single_sheet(args: Tuple[str, str]) -> Tuple[str, pd.DataFrame]:
    """Read a single sheet from an Excel file."""
    input_path, sheet_name = args
    df = pd.read_excel(input_path, sheet_name=sheet_name, engine="openpyxl")
    return sheet_name, df

def read_input_excel(input_path: str) -> Tuple[Dict[str, pd.DataFrame], pd.DataFrame]:
    """
    Reads all sheets from the input Excel file in parallel and loads
    a fixed return QA file.

    Args:
        input_path (str): Path to the main Excel file.

    Returns:
        Tuple[Dict[str, pd.DataFrame], pd.DataFrame]: 
            - Dictionary of sheet name to DataFrame.
            - DataFrame of return QA data.
    """
    # Load sheet names quickly using openpyxl
    workbook = load_workbook(input_path, read_only=True)
    sheet_names = workbook.sheetnames

    # Prepare arguments for parallel processing
    args = [(input_path, sheet) for sheet in sheet_names]
    with Pool(processes=min(cpu_count(), len(sheet_names))) as pool:
        results = pool.map(read_single_sheet, args)

    # Create a dictionary of all sheets
    sheets = {sheet: df for sheet, df in results}

    # Load return quantity data from fixed path
    return_qty_file_path = "forecast/service/Macys returns 2025.xlsx"
    return_qty_df = pd.read_excel(return_qty_file_path, engine="openpyxl")

    # Logging sheet info
    logging.info("Sheets in the Excel file: %s", ", ".join(sheets.keys()))
    logging.info("Successfully read the input Excel file and return quantity file.")

    return sheets, return_qty_df

