/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: TABLE
*/
ALTER TABLE "sospensioni"
	DROP FOREIGN KEY "sosp_paziente"
GO
ALTER TABLE "sospensioni"
	DROP INDEX "sosp_data"
GO
DROP TABLE "sospensioni"
GO
CREATE TABLE "sospensioni"  ( 
	"id"                       	int(11) AUTO_INCREMENT NOT NULL,
	"id_paziente"              	int(11) NOT NULL,
	"data_sospensione"         	date NOT NULL,
	"cod_tipo_sospensione"     	char(1) NOT NULL,
	"idtipo_motivo_sospensione"	int(11) NOT NULL,
	"id_sospensione_dettaglio" 	int(11) NULL,
	"note"                     	varchar(255) NULL,
	PRIMARY KEY("id")
)
GO
ALTER TABLE "sospensioni"
	ADD CONSTRAINT "sosp_data"
	UNIQUE ("id_paziente", "data_sospensione")
GO
ALTER TABLE "sospensioni"
	ADD CONSTRAINT "sosp_paziente"
	FOREIGN KEY("id_paziente")
	REFERENCES "paziente"("idPAZIENTE")
	ON DELETE RESTRICT 
	ON UPDATE RESTRICT 
GO
