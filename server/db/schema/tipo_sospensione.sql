/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: TABLE
*/
DROP TABLE "tipo_sospensione"
GO
CREATE TABLE "tipo_sospensione"  ( 
	"idtipo_motivo_sospensione"	int(11) AUTO_INCREMENT NOT NULL,
	"descrizione"              	varchar(35) NOT NULL,
	"tipo_famiglia_farmaco"    	int(11) NOT NULL,
	PRIMARY KEY("idtipo_motivo_sospensione")
)
GO