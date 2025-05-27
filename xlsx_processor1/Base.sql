-- # View All tables 
SELECT table_name, table_type, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Auth Table
Select * from public.authentication_customuser;

-- Monthlt Forecast Table
Select * from public.forecast_monthlyforecast;

-- Product Details
Select * from public.forecast_productdetail;

-- Omniforecast Table
Select * from public.forecast_omniforecast;

-- Comforecast Table
Select * from public.forecast_comforecast;

-- Store Forecast Table
Select * from public.forecast_storeforecast;

-- # Delete All Data from Tables
-- Note: This will remove all data from the specified tables. Use with caution.
truncate table public.forecast_monthlyforecast, public.forecast_productdetail, public.forecast_omniforecast, public.forecast_comforecast, public.forecast_storeforecast ;