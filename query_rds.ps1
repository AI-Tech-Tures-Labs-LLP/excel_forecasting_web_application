# Set RDS credentials (safe for dev only)
$env:PGPASSWORD = "Shrey0702"

# Run a non-SELECT query (e.g. insert, update, create, etc.)
psql -h "database-1.cpmeym0wmmdp.ap-south-1.rds.amazonaws.com" `
     -U "postgres" `
     -d "postgres" `
     -p 5432 