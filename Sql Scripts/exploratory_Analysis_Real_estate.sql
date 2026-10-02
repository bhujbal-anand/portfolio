-- ====================================================================
--  Project : ESTATEWISE REALTY ANALYTICS PROJECT
 -- PURPOSE   : Basic exploration to understand the data before
--  answering business questions
-- ====================================================================

-- 1.Row Counts of Both Tables.

SELECT COUNT(*) AS Total_Rows FROM properties;
SELECT COUNT(*) AS Total_Rows FROM property_bookings;

-- 2.Preveiw of Both Tables.

SELECT  * FROM  properties LIMIT 10;
SELECT * FROM property_bookings LIMIT 10; 

-- 3.Covering the  Range of Boking date

SELECT MIN(booking_date) AS first_booking,
MAX(booking_date) AS last_booking FROM property_bookings;

 -- 4.Distinct values from categorical Columns.

SELECT DISTINCT(city) FROM properties;
SELECT DISTINCT(property_type) FROM properties;
SELECT DISTINCT(possession_status) FROM properties;
SELECT DISTINCT(builder) FROM properties;

SELECT DISTINCT(buyer_city) FROM property_bookings;
SELECT DISTINCT(agent_name) FROM property_bookings;
SELECT DISTINCT(sales_channel) FROM property_bookings;
SELECT DISTINCT(payment_mode) FROM property_bookings;

--  5.Checking missing values in Both Tables.
-- 1.Properties Table.
SELECT SUM(CASE WHEN project_name IS NULL THEN 1 ELSE 0 END) AS missing_project_name,
SUM(CASE WHEN builder IS NULL THEN 1 ELSE 0 END) AS missing_builder_name,
SUM(CASE WHEN city IS NULL THEN 1 ELSE 0 END) AS missing_city FROM properties;


-- 2.Property_bookings Table
SELECT SUM(CASE WHEN transaction_id IS NULL THEN 1 ELSE 0 END) AS missing_transaction_id,
SUM(CASE WHEN buyer_name IS NULL THEN 1 ELSE 0 END) AS missing_buyer,
SUM(CASE WHEN buyer_city IS NULL THEN 1 ELSE 0 END) AS missing_city FROM property_bookings;

-- 6.Count of Projects By Each city

SELECT city, COUNT(*) AS TOTAL_PROJECTS FROM properties
GROUP BY city
ORDER BY total_projects DESC;


-- 7.Basic Statistics on Base Price

SELECT MIN(base_price) AS Min_Price_of_property,
MAX(base_price) AS Max_Price_of_property,
ROUND(AVG(base_price),3) AS Ave_Price_of_property 
FROM properties;


-- 8.Checking Duplicates From Both Tables.
-- 1. Properties Table
SELECT 
    property_id, COUNT(*)
FROM
    properties
GROUP BY property_id
HAVING COUNT(*) > 1;

SELECT 
    transaction_id, COUNT(*)
FROM
    property_bookings
GROUP BY transaction_id
HAVING COUNT(*) > 1;