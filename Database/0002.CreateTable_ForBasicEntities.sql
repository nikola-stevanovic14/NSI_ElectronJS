-- Tournaments

CREATE TABLE `nsi`.`tournaments` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `PairingSystem` INT NOT NULL,
  `NumberOfRounds` INT UNSIGNED NULL,
  `Name` VARCHAR(45) NOT NULL,
  `CreatedDate` DATETIME NOT NULL,
  `StartDate` DATETIME NOT NULL,
  `EndDate` VARCHAR(45) NOT NULL,
  `Open` TINYINT NULL,
  `Closed` TINYINT NULL,
  `Finished` TINYINT NULL,
  `Tempo` INT NOT NULL,
  `Bonification` INT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `FK_TOURNAMENTS_PAIRINGSYSTEMS_idx` (`PairingSystem` ASC) VISIBLE,
  CONSTRAINT `FK_TOURNAMENTS_PAIRINGSYSTEMS`
    FOREIGN KEY (`PairingSystem`)
    REFERENCES `nsi`.`pairingsystems` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
-- Players

CREATE TABLE `nsi`.`players` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(255) NOT NULL,
  `LastName` VARCHAR(255) NOT NULL,
  `Fide_Id` VARCHAR(45) NULL,
  `EloRating` INT NULL,
  `Coefficient` INT NULL,
  `Title` INT NULL,
  `Category` INT NULL,
  `Country` VARCHAR(45) NULL,
  `Sex` VARCHAR(10) NULL,
  `Birth` DATETIME NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_PLAYERS_TITLES_idx` (`Title` ASC) VISIBLE,
  INDEX `FK_PLAYERS_PLAYERINFORMALCATEGORIES_idx` (`Category` ASC) VISIBLE,
  CONSTRAINT `FK_PLAYERS_TITLES`
    FOREIGN KEY (`Title`)
    REFERENCES `nsi`.`titles` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_PLAYERS_PLAYERINFORMALCATEGORIES`
    FOREIGN KEY (`Category`)
    REFERENCES `nsi`.`playerinformalcategories` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
-- Rounds

CREATE TABLE `nsi`.`rounds` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `RoundNumber` INT NULL,
  `WhitePlayer` INT NOT NULL,
  `BlackPlayer` INT NOT NULL,
  `Tournament` INT NOT NULL,
  `WhitePoints` INT NULL,
  `BlackPoints` INT NULL,
  `Result` VARCHAR(45) NULL,
  `Started` TINYINT NULL,
  `Finished` TINYINT NULL,
  `WhiteEloGain` INT NULL,
  `BlackEloGain` INT NULL,
  `WhiteTitle` INT NULL,
  `BlackTitle` INT NULL,
  `Info` VARCHAR(255) NULL,
  `Name` VARCHAR(45) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `FK_ROUND_WHITEPLAYER_idx` (`WhitePlayer` ASC) VISIBLE,
  INDEX `FK_ROUND_BLACKPLAYER_idx` (`BlackPlayer` ASC) VISIBLE,
  INDEX `FK_ROUND_TOURNAMENT_idx` (`Tournament` ASC) VISIBLE,
  INDEX `FK_ROUND_WHITETITLE_idx` (`WhiteTitle` ASC) VISIBLE,
  INDEX `FK_ROUND_BLACKTITLE_idx` (`BlackTitle` ASC) VISIBLE,
  CONSTRAINT `FK_ROUND_WHITEPLAYER`
    FOREIGN KEY (`WhitePlayer`)
    REFERENCES `nsi`.`players` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ROUND_BLACKPLAYER`
    FOREIGN KEY (`BlackPlayer`)
    REFERENCES `nsi`.`players` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ROUND_TOURNAMENT`
    FOREIGN KEY (`Tournament`)
    REFERENCES `nsi`.`tournaments` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ROUND_WHITETITLE`
    FOREIGN KEY (`WhiteTitle`)
    REFERENCES `nsi`.`titles` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ROUND_BLACKTITLE`
    FOREIGN KEY (`BlackTitle`)
    REFERENCES `nsi`.`titles` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);

-- TournamentPlayerRankings

CREATE TABLE `nsi`.`tournamentplayerrankings` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `PlayerId` INT NOT NULL,
  `TournamentId` INT NOT NULL,
  `StartingPosition` INT NULL,
  `StartingElo` INT NULL,
  `StartingTitle` INT NULL,
  `Points` INT NOT NULL,
  `MedianBucholz` INT NOT NULL,
  `Bucholz` INT NOT NULL,
  `Wins` INT NOT NULL,
  `BlackWins` INT NOT NULL,
  `SonnebornBerger` INT NOT NULL,
  `EloPerformance` INT NOT NULL,
  `Luck` INT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `FK_TournamentPlayerRankings_PLAYER_idx` (`PlayerId` ASC) VISIBLE,
  INDEX `FK_TournamentPlayerRankings_TOURNAMENT_idx` (`TournamentId` ASC) VISIBLE,
  CONSTRAINT `FK_TournamentPlayerRankings_PLAYER`
    FOREIGN KEY (`PlayerId`)
    REFERENCES `nsi`.`players` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_TournamentPlayerRankings_TOURNAMENT`
    FOREIGN KEY (`TournamentId`)
    REFERENCES `nsi`.`tournaments` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);


------------------ HELP TABLES -----------------------

-- PairingSystems

CREATE TABLE `nsi`.`pairingsystems` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `PairingSystem` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  UNIQUE INDEX `PairingSystem_UNIQUE` (`PairingSystem` ASC) VISIBLE);
  
-- Titles

CREATE TABLE `nsi`.`titles` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(10) NOT NULL,
  `FullName` VARCHAR(45) NOT NULL,
  `FIDE` TINYINT NOT NULL,
  `Prestige` INT NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  UNIQUE INDEX `Title_UNIQUE` (`Title` ASC) VISIBLE,
  UNIQUE INDEX `FullName_UNIQUE` (`FullName` ASC) VISIBLE,
  UNIQUE INDEX `Prestige_UNIQUE` (`Prestige` ASC) VISIBLE);
  