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
truncate table public.forecast_monthlyforecast, public.forecast_productdetail, public.forecast_omniforecast, public.forecast_comforecast, public.forecast_storeforecast,public.forecast_forecastnote ;


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




WITH category_assignees AS (
    SELECT *
    FROM (
        VALUES
            ('Bridal739&267&263', 'Alice'),
            ('Bridge Gem742', 'Carol'),
            ('Diamond734&737&748', 'Eva'),
            ('Fine Pearl265&271', 'George'),
            ('Gold262&270', 'Ian'),
            ('Gold746', 'Kevin'),
            ('Men''s768&771', 'Mark'),  -- Escaped apostrophe
            ('Precious264&268', 'Oliver'),
            ('Semi272&733', 'Quinn'),
            ('Womens Silver260&404', 'Steve'),
            ('', 'Default_User1')  -- Fallback
    ) AS t(category_name, assignee)
),

-- Step 2: Map each product's category to its fixed assignee
assignments AS (
    SELECT
        fn.pid,
        ca.assignee
    FROM forecast_forecastnote fn
    JOIN forecast_productdetail pd ON fn.pid = pd.product_id
    LEFT JOIN category_assignees ca ON pd.category = ca.category_name
)

-- Step 3: Update product_assigned_to instead of assigned_to

UPDATE forecast_forecastnote fn
SET product_assigned_to = a.assignee
FROM assignments a
WHERE fn.pid = a.pid;