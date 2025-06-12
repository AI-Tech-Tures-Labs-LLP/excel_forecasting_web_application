import pandas as pd
from forecast.service.staticVariable import VENDOR_DATA, BIRTHSTONE_DATA


class DataFrameBuilder:
    def __init__(self, sheets, return_qty_df,holidays_df):
        self.sheets = sheets
        self.return_qty_df = return_qty_df
        self.index_df = None
        self.report_grouping_df = None
        self.planning_df = None
        self.master_sheet = None
        self.vendor_sheet = None
        self.planning_vertical_report_tbl = None
        self.macys_receipts = None
        self.all_data = None
        self.mcom_data = None
        self.birthstone_sheet = None
        self.df_filtered = None
        self.holidays_df = holidays_df

    def build(self):
        self._prepare_return_qty_df()
        self._prepare_index_df()
        self._prepare_report_grouping()
        self._prepare_planning_df()
        self._prepare_additional_sheets()
        self._build_master_sheet()
        self._build_vendor_sheet()
        self._build_birthstone_sheet()

    def get_outputs(self):
        return {
            "index_df": self.index_df,
            "report_grouping_df": self.report_grouping_df,
            "planning_df": self.planning_df,
            "master_sheet": self.master_sheet,
            "vendor_sheet": self.vendor_sheet,
            "planning_vertical_report_tbl": self.planning_vertical_report_tbl,
            "macys_receipts": self.macys_receipts,
            "all_data": self.all_data,
            "mcom_data": self.mcom_data,
            "birthstone_sheet": self.birthstone_sheet,
            "return_qty_df": self.return_qty_df,
            "holidays_df": self.holidays_df
        }

    def _prepare_return_qty_df(self):
        self.return_qty_df = self.return_qty_df.rename(columns={
            'Item #': 'PID',
            'Expected Return Period': 'Expected Return',
            'Total Qty to Return': 'Quantity'
        })

        def extract_month(value):
            try:
                return pd.to_datetime(value).strftime('%b').upper()
            except Exception:
                return str(value)[:3]

        self.return_qty_df['Month'] = self.return_qty_df['Expected Return'].apply(extract_month)
        self.return_qty_df = self.return_qty_df.groupby(['PID', 'Month'], as_index=False)['Quantity'].sum()

    def _prepare_index_df(self):
        raw = self.sheets["Index"]
        index_df = raw.iloc[1:43, :16]
        index_df.columns = raw.iloc[1]
        index_df = index_df.reset_index(drop=True).drop(index_df.index[0]).reset_index(drop=True)
        self.index_df = index_df

    def _prepare_report_grouping(self):
        sheet = self.sheets["report grouping"]
        self.report_grouping_df = pd.DataFrame(sheet.values[2:], columns=sheet.iloc[1].values)

    def _prepare_planning_df(self):
        sheet = self.sheets["Repln Items"]
        self.planning_df = pd.DataFrame(sheet.values[2:], columns=sheet.iloc[1].values)

    def _prepare_additional_sheets(self):
        self.planning_vertical_report_tbl = pd.DataFrame(
            self.sheets["Setup Sales -L3M & Future"].values[9:],
            columns=self.sheets["Setup Sales -L3M & Future"].iloc[8].values
        )
        self.macys_receipts = pd.DataFrame(
            self.sheets["Macys Recpts"].values[1:],
            columns=self.sheets["Macys Recpts"].iloc[0].values
        )
        self.all_data = self.sheets["All_DATA"]
        self.mcom_data = self.sheets["MCOM_Data"]

    def _build_master_sheet(self):
        df = self.planning_df.copy()

        df['Gender'] = 'Women'
        df.loc[df['Dpt ID'].isin([768, 771]), 'Gender'] = 'Men'
        df.loc[df['CL ID'] == 86, 'Gender'] = 'Children'

        birthstones = [
            'GARNET', 'AMETHYST', 'AQUAMARINE', 'DIAMOND', 'EMERALD', 'PEARL',
            'RUBY', 'PERIDOT', 'SAPPHIRE', 'OPAL', 'CITRINE', 'TANZANITE'
        ]

        def find_birthstone(text):
            if isinstance(text, str):
                for stone in birthstones:
                    if stone in text.upper():
                        return stone
            return ''

        df['Birthstone'] = df['Class Desc'].apply(find_birthstone)
        df['BSP_or_not'] = df['MstrSt ID'].apply(lambda x: 'BSP' if x in [26481, 74692] else '')

        def categorize_product(text):
            if isinstance(text, str):
                text = text.upper()
                if 'EARRINGS' in text or 'EARS' in text:
                    return 'Earrings'
                if 'PENDANTS' in text or 'PENDS' in text:
                    return 'Pendants'
                if ' RING' in text:
                    return 'Rings'
                if 'BRACELETS' in text:
                    return 'Bracelets'
                if any(kw in text for kw in ['CHAIN', 'NECKS', 'NECKLACE']):
                    return 'Necklace'
                if 'SET' in text:
                    return 'Set'
                if 'BAND' in text:
                    return 'Band'
            return ''

        df['category'] = df['Class Desc'].apply(categorize_product)

        def update_category(row):
            if not row['category']:
                desc = str(row['Prod Desc']).lower()
                found = []
                if 'earring' in desc or 'stud' in desc:
                    found.append('Earrings')
                if ' ring' in desc:
                    found.append('Rings')
                if 'pendant' in desc or 'necklace' in desc:
                    found.append('Pendants' if 'pendant' in desc else 'Necklace')
                if 'bracelet' in desc:
                    found.append('Bracelets')
                if 'band' in desc:
                    found.append('Band')
                if 'locket' in desc:
                    found.append('Locket')
                return 'Set' if len(found) > 1 else (found[0] if found else '')
            return row['category']

        df['category'] = df.apply(update_category, axis=1)

        def determine_type(text):
            if isinstance(text, str):
                text = text.lower()
                if 'heart' in text:
                    return 'Heart'
                if 'stud' in text:
                    return 'Studs'
                if 'drop' in text:
                    return 'Drop'
            return ''

        df['type'] = df['Prod Desc'].apply(determine_type)

        self.master_sheet = df[[
            'PID', 'category', 'Birthstone', 'BSP_or_not', 'type', 'Gender',
            'Vendor', 'Vendor Name', 'Own Retail', 'FC Index', 'FLDC',
            'Safe/Non-Safe', 'Item Code'
        ]]

        self.df_filtered = df

    def _build_birthstone_sheet(self):
        self.birthstone_sheet = pd.DataFrame(BIRTHSTONE_DATA, columns=['Month', 'Month Name', 'Birthstone'])

    def _build_vendor_sheet(self):
        df_vendor = self.df_filtered[['Vendor', 'Vendor Name']].drop_duplicates().dropna()
        df_coo = pd.DataFrame(VENDOR_DATA)
        self.vendor_sheet = pd.merge(df_vendor, df_coo, on='Vendor Name', how='left')
