# Generated by Django 5.1.5 on 2025-05-29 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forecast', '0013_merge_20250527_1858'),
    ]

    operations = [
        migrations.CreateModel(
            name='RetailInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year_of_previous_month', models.CharField(blank=True, max_length=100, null=True)),
                ('last_year_of_previous_month', models.CharField(blank=True, max_length=100, null=True)),
                ('season', models.CharField(blank=True, max_length=100, null=True)),
                ('current_month', models.CharField(blank=True, max_length=20, null=True)),
                ('current_month_number', models.IntegerField(blank=True, null=True)),
                ('previous_week_number', models.IntegerField(blank=True, null=True)),
                ('last_month_of_previous_month_numeric', models.IntegerField(blank=True, null=True)),
                ('rolling_method', models.CharField(blank=True, max_length=50, null=True)),
                ('feb_weeks', models.IntegerField(blank=True, null=True)),
                ('mar_weeks', models.IntegerField(blank=True, null=True)),
                ('apr_weeks', models.IntegerField(blank=True, null=True)),
                ('may_weeks', models.IntegerField(blank=True, null=True)),
                ('jun_weeks', models.IntegerField(blank=True, null=True)),
                ('jul_weeks', models.IntegerField(blank=True, null=True)),
                ('aug_weeks', models.IntegerField(blank=True, null=True)),
                ('sep_weeks', models.IntegerField(blank=True, null=True)),
                ('oct_weeks', models.IntegerField(blank=True, null=True)),
                ('nov_weeks', models.IntegerField(blank=True, null=True)),
                ('dec_weeks', models.IntegerField(blank=True, null=True)),
                ('jan_weeks', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='comforecast',
            name='next_forecast_month_planned_shipment',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='comforecast',
            name='total_added_qty',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='monthlyforecast',
            name='variable_name',
            field=models.CharField(choices=[('MacysProjectionReciepts', 'Macys Projection Receipts'), ('PlannedEOH', 'Planned EOH'), ('PlannedShipment', 'Planned Shipment'), ('PlannedForecast', 'Planned Forecast'), ('RecommendedForecast', 'Recommended Forecast'), ('ForecastByTrend', 'Forecast By Trend'), ('ForecastByIndex', 'Forecast By Index'), ('PlannedSellThru', 'Planned Sell Thru'), ('IndexPercentage', 'Index Percentage'), ('GrossProjection', 'Gross Projection'), ('TY_Unit_Sales', 'This Year Unit Sales'), ('LY_Unit_Sales', 'Last Year Unit Sales'), ('LY_OH_Units', 'Last Year On-Hand Units'), ('TY_OH_Units', 'This Year On-Hand Units'), ('TY_Receipts', 'This Year Receipts'), ('LY_Receipts', 'Last Year Receipts'), ('TY_MCOM_Unit_Sales', 'This Year MCOM Unit Sales'), ('LY_MCOM_Unit_Sales', 'Last Year MCOM Unit Sales'), ('TY_OH_MCOM_Units', 'This Year MCOM On-Hand Units'), ('LY_MCOM_OH_Units', 'Last Year MCOM On-Hand Units'), ('PTD_TY_Sales', 'PTD This Year Sales'), ('LY_PTD_Sales', 'Last Year PTD Sales'), ('MCOM_PTD_TY_Sales', 'MCOM PTD This Year Sales'), ('MCOM_PTD_LY_Sales', 'MCOM PTD Last Year Sales'), ('OO_Total_Units', 'OO Total Units'), ('OO_MCOM_Total_Units', 'OO MCOM Total Units'), ('LY_store_unit_sales', 'LY Store Unit Sales'), ('LY_store_EOM_OH', 'LY Store EOM OH'), ('LY_COM_to_TTL', 'LY COM to TTL Sales'), ('LY_COM_to_TTL_OH', 'LY COM to TTL OH'), ('LY_omni_sell_through', 'LY Omni Sell Through'), ('LY_store_sell_through', 'LY Store Sell Through'), ('LY_omni_turn', 'LY Omni Turn'), ('LY_store_turn', 'LY Store Turn'), ('LY_Omni_AUR_Diff_Own', 'LY Omni AUR Diff Own'), ('TY_store_unit_sales', 'TY Store Unit Sales'), ('TY_store_EOM_OH', 'TY Store EOM OH'), ('TY_COM_to_TTL', 'TY COM to TTL Sales'), ('TY_COM_to_TTL_OH', 'TY COM to TTL OH'), ('TY_Omni_AUR_Diff_Own', 'TY Omni AUR Diff Own'), ('TY_Omni_sell_through', 'TY Omni Sell Through'), ('TY_store_sell_through', 'TY Store Sell Through'), ('TY_omni_turn', 'TY Omni Turn'), ('TY_store_turn', 'TY Store Turn'), ('TY_store_unit_sales_diff', 'TY Store Unit Sales Diff'), ('TY_com_unit_sales_diff', 'TY COM Unit Sales Diff'), ('TY_store_eom_oh_diff', 'TY Store EOM OH Diff')], max_length=50, verbose_name='Variable'),
        ),
    ]
