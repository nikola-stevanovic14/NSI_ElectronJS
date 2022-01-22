ALTER TABLE `nsi`.`tournaments` 
ADD COLUMN `MaxNumberOfPlayers` INT NOT NULL AFTER `Bonification`,
ADD COLUMN `NumberOfPlaters` INT NOT NULL AFTER `MaxNumberOfPlayers`,
CHANGE COLUMN `NumberOfRounds` `NumberOfRounds` INT UNSIGNED NOT NULL ,
CHANGE COLUMN `EndDate` `EndDate` DATETIME NOT NULL ;

ALTER TABLE `nsi`.`tournaments` 
CHANGE COLUMN `NumberOfPlaters` `NumberOfPlayers` INT NOT NULL ;