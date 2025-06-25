-- Seed script for Holiday Tracker
-- This creates 100 sample users (10 managers, 90 employees) and demo leave requests

-- First, let's create some managers
INSERT INTO "User" (id, name, email, role, department, "startDate") VALUES
('mgr-001', 'Sarah Manager', 'sarah.manager@company.com', 'MANAGER', 'Engineering', '2020-01-15'),
('mgr-002', 'Mike Director', 'mike.director@company.com', 'MANAGER', 'Marketing', '2019-03-20'),
('mgr-003', 'Lisa Team Lead', 'lisa.lead@company.com', 'MANAGER', 'Sales', '2021-06-10'),
('mgr-004', 'David Supervisor', 'david.supervisor@company.com', 'MANAGER', 'HR', '2020-08-05'),
('mgr-005', 'Emma Manager', 'emma.manager@company.com', 'MANAGER', 'Finance', '2019-11-12'),
('mgr-006', 'James Lead', 'james.lead@company.com', 'MANAGER', 'Operations', '2021-02-28'),
('mgr-007', 'Rachel Manager', 'rachel.manager@company.com', 'MANAGER', 'Design', '2020-05-18'),
('mgr-008', 'Tom Director', 'tom.director@company.com', 'MANAGER', 'Product', '2019-09-03'),
('mgr-009', 'Anna Supervisor', 'anna.supervisor@company.com', 'MANAGER', 'Legal', '2021-01-25'),
('mgr-010', 'Chris Manager', 'chris.manager@company.com', 'MANAGER', 'IT', '2020-12-08');

-- Create admin user
INSERT INTO "User" (id, name, email, role, department, "startDate") VALUES
('admin-001', 'Admin User', 'admin@company.com', 'ADMIN', 'HR', '2019-01-01');

-- Create 90 employees distributed across managers
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
-- Engineering team (Sarah Manager)
('emp-001', 'John Doe', 'john.doe@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2022-03-15'),
('emp-002', 'Jane Smith', 'jane.smith@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2021-07-20'),
('emp-003', 'Bob Johnson', 'bob.johnson@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2022-01-10'),
('emp-004', 'Alice Brown', 'alice.brown@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2021-11-05'),
('emp-005', 'Charlie Wilson', 'charlie.wilson@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2022-05-12'),
('emp-006', 'Diana Davis', 'diana.davis@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2021-09-18'),
('emp-007', 'Frank Miller', 'frank.miller@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2022-02-28'),
('emp-008', 'Grace Taylor', 'grace.taylor@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2021-12-14'),
('emp-009', 'Henry Anderson', 'henry.anderson@company.com', 'EMPLOYEE', 'Engineering', 'mgr-001', '2022-04-07'),

-- Marketing team (Mike Director)
('emp-010', 'Ivy Thomas', 'ivy.thomas@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2022-01-20'),
('emp-011', 'Jack Jackson', 'jack.jackson@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2021-08-15'),
('emp-012', 'Kelly White', 'kelly.white@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2022-03-10'),
('emp-013', 'Liam Harris', 'liam.harris@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2021-10-25'),
('emp-014', 'Mia Martin', 'mia.martin@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2022-06-08'),
('emp-015', 'Noah Thompson', 'noah.thompson@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2021-12-03'),
('emp-016', 'Olivia Garcia', 'olivia.garcia@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2022-02-14'),
('emp-017', 'Paul Martinez', 'paul.martinez@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2021-09-30'),
('emp-018', 'Quinn Robinson', 'quinn.robinson@company.com', 'EMPLOYEE', 'Marketing', 'mgr-002', '2022-05-22'),

-- Sales team (Lisa Team Lead)
('emp-019', 'Ruby Clark', 'ruby.clark@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2022-01-12'),
('emp-020', 'Sam Rodriguez', 'sam.rodriguez@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2021-07-28'),
('emp-021', 'Tina Lewis', 'tina.lewis@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2022-04-15'),
('emp-022', 'Uma Lee', 'uma.lee@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2021-11-20'),
('emp-023', 'Victor Walker', 'victor.walker@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2022-06-05'),
('emp-024', 'Wendy Hall', 'wendy.hall@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2021-08-18'),
('emp-025', 'Xander Allen', 'xander.allen@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2022-03-25'),
('emp-026', 'Yara Young', 'yara.young@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2021-10-12'),
('emp-027', 'Zoe Hernandez', 'zoe.hernandez@company.com', 'EMPLOYEE', 'Sales', 'mgr-003', '2022-01-30');

-- Continue with remaining employees for other departments...
-- HR team (David Supervisor)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-028', 'Aaron King', 'aaron.king@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2022-02-10'),
('emp-029', 'Bella Wright', 'bella.wright@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2021-09-15'),
('emp-030', 'Carlos Lopez', 'carlos.lopez@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2022-05-20'),
('emp-031', 'Delia Hill', 'delia.hill@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2021-12-08'),
('emp-032', 'Ethan Scott', 'ethan.scott@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2022-03-18'),
('emp-033', 'Fiona Green', 'fiona.green@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2021-08-25'),
('emp-034', 'George Adams', 'george.adams@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2022-06-12'),
('emp-035', 'Hannah Baker', 'hannah.baker@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2021-11-28'),
('emp-036', 'Ian Gonzalez', 'ian.gonzalez@company.com', 'EMPLOYEE', 'HR', 'mgr-004', '2022-04-05');

-- Finance team (Emma Manager)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-037', 'Julia Nelson', 'julia.nelson@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2022-01-25'),
('emp-038', 'Kevin Carter', 'kevin.carter@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2021-08-10'),
('emp-039', 'Luna Mitchell', 'luna.mitchell@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2022-04-28'),
('emp-040', 'Mason Perez', 'mason.perez@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2021-10-15'),
('emp-041', 'Nora Roberts', 'nora.roberts@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2022-06-20'),
('emp-042', 'Oscar Turner', 'oscar.turner@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2021-12-05'),
('emp-043', 'Penny Phillips', 'penny.phillips@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2022-02-18'),
('emp-044', 'Quincy Campbell', 'quincy.campbell@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2021-09-22'),
('emp-045', 'Rosa Parker', 'rosa.parker@company.com', 'EMPLOYEE', 'Finance', 'mgr-005', '2022-05-08');

-- Operations team (James Lead)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-046', 'Steve Evans', 'steve.evans@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2022-03-12'),
('emp-047', 'Tara Edwards', 'tara.edwards@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2021-07-18'),
('emp-048', 'Ulysses Collins', 'ulysses.collins@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2022-01-08'),
('emp-049', 'Vera Stewart', 'vera.stewart@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2021-11-15'),
('emp-050', 'Wade Sanchez', 'wade.sanchez@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2022-04-22'),
('emp-051', 'Xenia Morris', 'xenia.morris@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2021-08-30'),
('emp-052', 'Yale Rogers', 'yale.rogers@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2022-06-15'),
('emp-053', 'Zara Reed', 'zara.reed@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2021-10-28'),
('emp-054', 'Adam Cook', 'adam.cook@company.com', 'EMPLOYEE', 'Operations', 'mgr-006', '2022-02-05');

-- Design team (Rachel Manager)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-055', 'Beth Morgan', 'beth.morgan@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2022-01-18'),
('emp-056', 'Caleb Bailey', 'caleb.bailey@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2021-09-25'),
('emp-057', 'Dana Rivera', 'dana.rivera@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2022-05-10'),
('emp-058', 'Eli Cooper', 'eli.cooper@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2021-12-20'),
('emp-059', 'Faith Richardson', 'faith.richardson@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2022-03-28'),
('emp-060', 'Gabe Cox', 'gabe.cox@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2021-08-12'),
('emp-061', 'Hope Howard', 'hope.howard@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2022-06-25'),
('emp-062', 'Ivan Ward', 'ivan.ward@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2021-11-08'),
('emp-063', 'Joy Torres', 'joy.torres@company.com', 'EMPLOYEE', 'Design', 'mgr-007', '2022-04-15');

-- Product team (Tom Director)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-064', 'Kyle Peterson', 'kyle.peterson@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2022-02-22'),
('emp-065', 'Leah Gray', 'leah.gray@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2021-07-05'),
('emp-066', 'Max Ramirez', 'max.ramirez@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2022-05-18'),
('emp-067', 'Nina James', 'nina.james@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2021-10-30'),
('emp-068', 'Owen Watson', 'owen.watson@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2022-01-15'),
('emp-069', 'Paige Brooks', 'paige.brooks@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2021-09-08'),
('emp-070', 'Quentin Kelly', 'quentin.kelly@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2022-06-30'),
('emp-071', 'Rita Sanders', 'rita.sanders@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2021-12-18'),
('emp-072', 'Sean Price', 'sean.price@company.com', 'EMPLOYEE', 'Product', 'mgr-008', '2022-03-05');

-- Legal team (Anna Supervisor)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-073', 'Tess Bennett', 'tess.bennett@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2022-04-12'),
('emp-074', 'Uri Wood', 'uri.wood@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2021-08-28'),
('emp-075', 'Vicky Barnes', 'vicky.barnes@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2022-01-22'),
('emp-076', 'Will Ross', 'will.ross@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2021-11-10'),
('emp-077', 'Xara Henderson', 'xara.henderson@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2022-05-25'),
('emp-078', 'York Coleman', 'york.coleman@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2021-09-15'),
('emp-079', 'Zina Jenkins', 'zina.jenkins@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2022-06-08'),
('emp-080', 'Alex Perry', 'alex.perry@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2021-12-25'),
('emp-081', 'Blake Powell', 'blake.powell@company.com', 'EMPLOYEE', 'Legal', 'mgr-009', '2022-02-12');

-- IT team (Chris Manager)
INSERT INTO "User" (id, name, email, role, department, "managerId", "startDate") VALUES
('emp-082', 'Cora Long', 'cora.long@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2022-03-20'),
('emp-083', 'Drew Hughes', 'drew.hughes@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2021-07-12'),
('emp-084', 'Eve Flores', 'eve.flores@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2022-05-05'),
('emp-085', 'Ford Washington', 'ford.washington@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2021-10-18'),
('emp-086', 'Gina Butler', 'gina.butler@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2022-01-28'),
('emp-087', 'Hugo Simmons', 'hugo.simmons@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2021-08-15'),
('emp-088', 'Iris Foster', 'iris.foster@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2022-06-22'),
('emp-089', 'Jake Gonzales', 'jake.gonzales@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2021-11-30'),
('emp-090', 'Kate Bryant', 'kate.bryant@company.com', 'EMPLOYEE', 'IT', 'mgr-010', '2022-04-08');

-- Insert some company holidays
INSERT INTO "Holiday" (id, name, date, "isRecurring", description) VALUES
('hol-001', 'New Year''s Day', '2024-01-01', true, 'New Year''s Day holiday'),
('hol-002', 'Martin Luther King Jr. Day', '2024-01-15', true, 'MLK Day'),
('hol-003', 'Presidents Day', '2024-02-19', true, 'Presidents Day'),
('hol-004', 'Memorial Day', '2024-05-27', true, 'Memorial Day'),
('hol-005', 'Independence Day', '2024-07-04', true, 'Independence Day'),
('hol-006', 'Labor Day', '2024-09-02', true, 'Labor Day'),
('hol-007', 'Columbus Day', '2024-10-14', true, 'Columbus Day'),
('hol-008', 'Veterans Day', '2024-11-11', true, 'Veterans Day'),
('hol-009', 'Thanksgiving', '2024-11-28', true, 'Thanksgiving Day'),
('hol-010', 'Christmas Day', '2024-12-25', true, 'Christmas Day');

-- Insert some sample leave requests with various statuses
INSERT INTO "LeaveRequest" (id, "userId", "startDate", "endDate", "leaveType", status, note, "approvedById", "approverComment") VALUES
-- Approved requests
('req-001', 'emp-001', '2024-07-15', '2024-07-19', 'VACATION', 'APPROVED', 'Summer vacation with family', 'mgr-001', 'Enjoy your vacation!'),
('req-002', 'emp-010', '2024-08-05', '2024-08-09', 'VACATION', 'APPROVED', 'Beach vacation', 'mgr-002', 'Have a great time!'),
('req-003', 'emp-019', '2024-06-20', '2024-06-21', 'PERSONAL', 'APPROVED', 'Personal matters', 'mgr-003', 'Approved'),

-- Pending requests (these will show up in approvals)
('req-004', 'emp-002', '2024-08-12', '2024-08-16', 'VACATION', 'PENDING', 'Anniversary trip', null, null),
('req-005', 'emp-011', '2024-07-22', '2024-07-26', 'VACATION', 'PENDING', 'Family reunion', null, null),
('req-006', 'emp-020', '2024-09-02', '2024-09-06', 'VACATION', 'PENDING', 'Labor Day extended weekend', null, null),
('req-007', 'emp-003', '2024-08-01', '2024-08-02', 'SICK', 'PENDING', 'Medical appointment', null, null),

-- Rejected requests
('req-008', 'emp-004', '2024-12-23', '2024-12-30', 'VACATION', 'REJECTED', 'Christmas vacation', 'mgr-001', 'Too many people already off during this period'),

-- More approved requests for calendar display
('req-009', 'emp-005', '2024-07-01', '2024-07-05', 'VACATION', 'APPROVED', 'July 4th vacation', 'mgr-001', 'Approved'),
('req-010', 'emp-012', '2024-08-19', '2024-08-23', 'VACATION', 'APPROVED', 'Summer break', 'mgr-002', 'Enjoy!'),
('req-011', 'emp-021', '2024-09-16', '2024-09-20', 'VACATION', 'APPROVED', 'Fall vacation', 'mgr-003', 'Have fun!'),
('req-012', 'emp-028', '2024-07-08', '2024-07-12', 'VACATION', 'APPROVED', 'Mid-summer break', 'mgr-004', 'Approved'),
('req-013', 'emp-037', '2024-08-26', '2024-08-30', 'VACATION', 'APPROVED', 'End of summer vacation', 'mgr-005', 'Enjoy your time off!');
