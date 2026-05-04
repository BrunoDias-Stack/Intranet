import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./backend/data.db');

const run = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function (err) { err ? reject(err) : resolve(this); }));
const get = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));

export const all = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));

export async function initDb() {
  await run(`CREATE TABLE IF NOT EXISTS investors (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT,phone TEXT,documentNumber TEXT,address TEXT,notes TEXT,createdAt TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,propertyAddress TEXT,city TEXT,state TEXT,country TEXT,type TEXT,purchasePrice REAL,estimatedRenovationCost REAL,operationalCost REAL,estimatedSalePrice REAL,actualSalePrice REAL DEFAULT 0,estimatedRentalIncome REAL,contingencyReserve REAL,status TEXT,startDate TEXT,targetEndDate TEXT,actualEndDate TEXT,notes TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY AUTOINCREMENT,investorId INTEGER,projectId INTEGER,amount REAL,date TEXT,ownershipPercentage REAL DEFAULT 0,notes TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,stageId INTEGER,category TEXT,description TEXT,estimatedAmount REAL,actualAmount REAL,paidDate TEXT,status TEXT,receiptFileId INTEGER)`);
  await run(`CREATE TABLE IF NOT EXISTS stages (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,name TEXT,estimatedCost REAL,actualCost REAL,startDate TEXT,endDate TEXT,status TEXT,progressPercentage REAL,notes TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS risks (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,category TEXT,description TEXT,probability TEXT,impact TEXT,estimatedLoss REAL,mitigationPlan TEXT,status TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,fileName TEXT,fileType TEXT,category TEXT,uploadDate TEXT,notes TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS scenarios (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,name TEXT,expectedSalePrice REAL,sellingCostPercentage REAL,estimatedTotalCost REAL,estimatedDelayMonths INTEGER,contingencyUsed REAL,expectedProfit REAL,roi REAL,adminFee REAL,investorReturn REAL)`);
  await run(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT,adminFeePercentage REAL,fixedMonthlyFee REAL,projectSetupFee REAL)`);

  const seed = await get('SELECT COUNT(*) count FROM investors');
  if (seed.count === 0) {
    await run(`INSERT INTO settings (adminFeePercentage,fixedMonthlyFee,projectSetupFee) VALUES (20,0,0)`);
    await run(`INSERT INTO investors (name,email,phone,documentNumber,address,notes,createdAt) VALUES
      ('Ana Costa','ana@email.com','+55 11 99999-1111','12345678900','São Paulo','Conservative investor',date('now')),
      ('Bruno Lima','bruno@email.com','+55 21 99999-2222','23456789011','Rio de Janeiro','Prefers flips',date('now')),
      ('Carla Nunes','carla@email.com','+55 31 99999-3333','34567890122','Belo Horizonte','Long-term rental strategy',date('now'))`);
    await run(`INSERT INTO projects (name,propertyAddress,city,state,country,type,purchasePrice,estimatedRenovationCost,operationalCost,estimatedSalePrice,estimatedRentalIncome,contingencyReserve,status,startDate,targetEndDate,notes) VALUES
      ('Vila Mariana Flip','Rua A, 120','São Paulo','SP','Brazil','fix and flip',450000,180000,40000,850000,0,50000,'in_progress','2026-01-10','2026-09-10','High potential area'),
      ('Campinas Rental Build','Av B, 98','Campinas','SP','Brazil','construction',300000,260000,50000,0,12000,60000,'fundraising','2026-02-15','2027-02-15','Duplex rental target')`);
    await run(`INSERT INTO investments (investorId,projectId,amount,date,notes) VALUES (1,1,200000,'2026-01-20','Initial round'),(2,1,250000,'2026-01-22','Main capital'),(3,2,180000,'2026-03-01','First tranche')`);
    await run(`INSERT INTO expenses (projectId,category,description,estimatedAmount,actualAmount,paidDate,status) VALUES
      (1,'material','Electrical supplies',35000,38000,'2026-03-10','paid'),(1,'labor','Demolition team',22000,20000,'2026-02-12','paid'),(2,'license','Municipal permit',15000,0,NULL,'pending')`);
    await run(`INSERT INTO stages (projectId,name,estimatedCost,actualCost,startDate,endDate,status,progressPercentage,notes) VALUES
      (1,'demolition / cleaning',25000,20000,'2026-02-01','2026-02-20','completed',100,'Done'),
      (1,'electrical',40000,38000,'2026-03-01',NULL,'in_progress',70,'On track'),
      (2,'planning / permits',30000,5000,'2026-03-01',NULL,'delayed',25,'Awaiting city approval')`);
    await run(`INSERT INTO risks (projectId,category,description,probability,impact,estimatedLoss,mitigationPlan,status) VALUES
      (1,'market','Price softening risk','medium','medium',30000,'Price adjustment strategy','monitoring'),
      (2,'permitting','Permit approval delay','high','high',50000,'Dedicated consultant','open')`);
    await run(`INSERT INTO documents (projectId,fileName,fileType,category,uploadDate,notes) VALUES
      (1,'before-front.jpg','image/jpeg','before photo','2026-01-20','Facade before renovation'),
      (1,'purchase-contract.pdf','application/pdf','contract','2026-01-22','Signed purchase contract')`);
    await run(`INSERT INTO scenarios (projectId,name,expectedSalePrice,sellingCostPercentage,estimatedTotalCost,estimatedDelayMonths,contingencyUsed,expectedProfit,roi,adminFee,investorReturn) VALUES
      (1,'pessimistic',790000,8,760000,3,45000, -33200,-7.38,0,416800),
      (1,'realistic',850000,8,720000,1,25000,62000,13.78,12400,549600),
      (1,'optimistic',920000,7,700000,0,12000,155600,34.58,31120,624480)`);
  }
}

export async function recalcOwnership(projectId) {
  const rows = await all('SELECT id, amount FROM investments WHERE projectId=?', [projectId]);
  const total = rows.reduce((a, r) => a + (r.amount || 0), 0);
  for (const r of rows) {
    const pct = total ? (r.amount / total) * 100 : 0;
    await run('UPDATE investments SET ownershipPercentage=? WHERE id=?', [pct, r.id]);
  }
}

export { run, get };
