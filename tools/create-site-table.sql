CREATE TABLE sites (
  index INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  frequency DECIMAL(6, 3) DEFAULT 151.775,
  repeater_rx DECIMAL(7, 4),
  repeater_tx DECIMAL(7, 4),
  plcode TEXT
);