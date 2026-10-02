--  -- =====================================================================
-- ESTATEWISE REALTY ANALYTICS PROJECT
-- Schema creation + CSV load script (MySQL Workbench)
-- Prepared by: Anand Bhujbal
-- =====================================================================

DROP DATABASE IF EXISTS estatewise_realty;
CREATE DATABASE estatewise_realty;
USE estatewise_realty;

-- ---------------------------------------------------------------------
-- 1. PROPERTIES TABLE (property master)
-- ---------------------------------------------------------------------
CREATE TABLE properties (
    property_id        VARCHAR(10)     PRIMARY KEY,
    project_name        VARCHAR(100)    NOT NULL,
    builder             VARCHAR(100)    NOT NULL,
    city                VARCHAR(50)     NOT NULL,
    locality            VARCHAR(50)     NOT NULL,
    property_type       VARCHAR(30)     NOT NULL,
    bhk                 INT             NOT NULL,
    area_sqft           INT             NOT NULL,
    price_per_sqft      INT             NOT NULL,
    base_price          BIGINT          NOT NULL,
    floor_number        INT             DEFAULT 0,
    total_floors        INT             DEFAULT 0,
    possession_status   VARCHAR(30)     NOT NULL,
    amenities_score      INT             NOT NULL,
    year_built           INT             NOT NULL
); 



-- ---------------------------------------------------------------------
-- 2. PROPERTY_BOOKINGS TABLE (sale/booking transactions)
-- ---------------------------------------------------------------------
CREATE TABLE property_bookings (
    transaction_id      VARCHAR(10)     PRIMARY KEY,
    booking_date         DATE            NOT NULL,
    property_id          VARCHAR(10)     NOT NULL,
    buyer_id             VARCHAR(10)     NOT NULL,
    buyer_name           VARCHAR(100)    NOT NULL,
    buyer_city           VARCHAR(50),
    agent_name           VARCHAR(100),
    sales_channel        VARCHAR(30),
    base_price            BIGINT          NOT NULL,
    discount_pct          INT             DEFAULT 0,
    discount_amount      BIGINT          DEFAULT 0,
    sale_price            BIGINT          NOT NULL,
    payment_mode          VARCHAR(30),
    loan_amount           BIGINT          DEFAULT 0,
    down_payment          BIGINT          DEFAULT 0,
    CONSTRAINT fk_booking_property FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- Helpful indexes for the analysis tasks
CREATE INDEX idx_booking_date ON property_bookings(booking_date);
CREATE INDEX idx_booking_agent ON property_bookings(agent_name);
CREATE INDEX idx_properties_city ON properties(city);
