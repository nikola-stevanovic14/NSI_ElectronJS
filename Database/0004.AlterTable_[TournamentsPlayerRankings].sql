ALTER TABLE `nsi`.`tournamentplayerrankings` 
CHANGE COLUMN `Points` `Points` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `MedianBucholz` `MedianBucholz` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `Bucholz` `Bucholz` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `Wins` `Wins` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `BlackWins` `BlackWins` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `SonnebornBerger` `SonnebornBerger` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `EloPerformance` `EloPerformance` INT NOT NULL DEFAULT 0 ;