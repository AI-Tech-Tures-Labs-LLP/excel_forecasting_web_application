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


-- Replace with actual PIDs or categories as needed
-- Update StoreForecast
UPDATE forecast_storeforecast
SET
  "Valentine_day" = TRUE,
  "Mothers_day" = TRUE,
  "Mens_day" = TRUE,
  "Womens_day" = TRUE
WHERE pid IN ('CA5032H1A8SG0', 'LE7379MIE', 'VSE078620Y30');

-- Update ComForecast
UPDATE forecast_comforecast
SET
  "Valentine_day" = TRUE,
  "Mothers_day" = TRUE,
  "Mens_day" = TRUE,
  "Womens_day" = TRUE
WHERE pid IN ('CJ6284H5H9YG0', 'DA7175ZZA8AZ0', 'TRB073147T775');

-- Update OmniForecast
UPDATE forecast_omniforecast
SET
  "Valentine_day" = TRUE,
  "Mothers_day" = TRUE,
  "Mens_day" = TRUE,
  "Womens_day" = TRUE
WHERE pid IN ('RAX4713A8FE1PKCH', 'TRF043734Y18', 'VSC067102Y18');
