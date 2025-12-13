-- =====================================================
-- FIX INCOMPLETE AND MISSING SEATS
-- =====================================================

-- ❌ Hall 2 - Cinema 1 (100 seats = 10 rows x 10 seats)
-- ID: 478a0b90-4c55-4802-87f3-676d9d16db3a
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    '478a0b90-4c55-4802-87f3-676d9d16db3a'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (4, 5, 6, 7) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 10) as seat_num;

-- ❌ Hall 3 - Cinema 1 (80 seats = 10 rows x 8 seats)
-- ID: 446c4723-509e-42c5-a29d-06de96ac2c82
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    '446c4723-509e-42c5-a29d-06de96ac2c82'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (3, 4, 5, 6) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 8) as seat_num;

-- ⚠️ Hall 1 - Cinema 2 (150 seats, has 100, needs 50 more)
-- ID: 315f05cd-684c-4f47-a1ce-6dd549e45dc5
-- First, delete existing incomplete seats
DELETE FROM seats WHERE hall_id = '315f05cd-684c-4f47-a1ce-6dd549e45dc5';

-- Then insert complete 150 seats (10 rows x 15 seats)
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    '315f05cd-684c-4f47-a1ce-6dd549e45dc5'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (6, 7, 8, 9) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 15) as seat_num;

-- ⚠️ Hall 1 - Cinema 3 (200 seats, has 100, needs 100 more)
-- ID: 4f47ec76-2de1-426e-868b-ea42ab082c28
-- First, delete existing incomplete seats
DELETE FROM seats WHERE hall_id = '4f47ec76-2de1-426e-868b-ea42ab082c28';

-- Then insert complete 200 seats (10 rows x 20 seats)
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    '4f47ec76-2de1-426e-868b-ea42ab082c28'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (8, 9, 10, 11, 12, 13) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 20) as seat_num;

-- ❌ Hall 2 - Cinema 3 (120 seats = 10 rows x 12 seats)
-- ID: bd91c96e-431a-4fd3-92e1-8b789cbec8f3
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    'bd91c96e-431a-4fd3-92e1-8b789cbec8f3'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (5, 6, 7, 8) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 12) as seat_num;

-- ❌ Hall 3 - Cinema 3 (100 seats = 10 rows x 10 seats)
-- ID: 74fdc146-9636-454c-b813-28187646f38a
INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
SELECT 
    '74fdc146-9636-454c-b813-28187646f38a'::uuid,
    chr(64 + row_num) as row_label,
    seat_num,
    CASE 
        WHEN row_num <= 2 THEN 'vip'::varchar
        WHEN seat_num IN (4, 5, 6, 7) AND row_num >= 8 THEN 'couple'::varchar
        ELSE 'standard'::varchar
    END as seat_type
FROM 
    generate_series(1, 10) as row_num,
    generate_series(1, 10) as seat_num;

-- =====================================================
-- VERIFY: All halls should now be complete
-- =====================================================
-- Run this to verify:
SELECT 
    h.name,
    h.total_seats,
    COUNT(s.id) as actual_seats,
    CASE 
        WHEN COUNT(s.id) = h.total_seats THEN '✅ COMPLETE'
        ELSE '❌ ERROR'
    END as status
FROM halls h
LEFT JOIN seats s ON h.id = s.hall_id
GROUP BY h.id, h.name, h.total_seats
ORDER BY h.name;
