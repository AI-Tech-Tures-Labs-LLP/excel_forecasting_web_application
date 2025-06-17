import psycopg2
 
host = "database-1.cpmeym0wmmdp.ap-south-1.rds.amazonaws.com"
user = "postgres"
password = "Shrey0702"
port = 5432  # Default PostgreSQL port
# database = "your-database"
 
# Establish the connection
connection = psycopg2.connect(
    host=host,
    user=user,
    password=password,
    port=port,
    # dbname=database
)
 
# Create a cursor object
cursor = connection.cursor()
 
# Execute a query
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
""")
tables = cursor.fetchall()
print("Tables:", tables)
 
# Close the connection
cursor.close()
connection.close()