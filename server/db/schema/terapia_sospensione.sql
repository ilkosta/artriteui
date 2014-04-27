/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: TABLE
*/
ALTER TABLE "terapia_sospensione"
	DROP FOREIGN KEY "tipo_sospensione_dettaglio_terapia_sospensione"
GO
ALTER TABLE "terapia_sospensione"
	DROP FOREIGN KEY "terapia_tipo_sospensione"
GO
ALTER TABLE "terapia_sospensione"
	DROP FOREIGN KEY "terapia_terapia_sospensione"
GO
ALTER TABLE "terapia_sospensione"
	DROP FOREIGN KEY "cod_tipo_sospensione"
GO
DROP INDEX "cod_tipo_sospensione_idx" ON terapia_sospensione
GO
DROP INDEX "terapia_terapia_sospensione_idx" ON terapia_sospensione
GO
DROP INDEX "terapia_tipo_sospensione" ON terapia_sospensione
GO
DROP INDEX "tipo_sospensione_dettaglio_terapia_sospensione_idx" ON terapia_sospensione
GO
DROP TABLE "terapia_sospensione"
GO
CREATE TABLE "terapia_sospensione"  ( 
	"idterapia_sospensione"   	int(11) AUTO_INCREMENT NOT NULL,
	"id_terapia"              	int(11) NOT NULL,
	"id_sospensione_dettaglio"	int(11) NULL,
	"tipo_sospensione"        	char(1) COMMENT 'sospensione definitiva (d) oppure sospensione  temporane (t)'  NOT NULL,
	"data_inizio"             	date NOT NULL,
	"data_fine"               	date NULL,
	"note"                    	text NULL,
	"id_sospensione"          	int(11) NOT NULL,
	"num_infusioni_fatte"     	int(11) NOT NULL DEFAULT '0',
	"follow_up"               	int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY("idterapia_sospensione")
)
GO
CREATE INDEX "cod_tipo_sospensione_idx" USING BTREE 
	ON "terapia_sospensione"("tipo_sospensione")
GO
CREATE INDEX "terapia_terapia_sospensione_idx" USING BTREE 
	ON "terapia_sospensione"("id_terapia")
GO
CREATE INDEX "terapia_tipo_sospensione" USING BTREE 
	ON "terapia_sospensione"("id_sospensione")
GO
CREATE INDEX "tipo_sospensione_dettaglio_terapia_sospensione_idx" USING BTREE 
	ON "terapia_sospensione"("id_sospensione_dettaglio")
GO
ALTER TABLE "terapia_sospensione"
	ADD CONSTRAINT "tipo_sospensione_dettaglio_terapia_sospensione"
	FOREIGN KEY("id_sospensione_dettaglio")
	REFERENCES "tipo_sospensione_dettaglio"("id_sospensione_dettaglio")
	ON DELETE NO ACTION 
	ON UPDATE NO ACTION 
GO
ALTER TABLE "terapia_sospensione"
	ADD CONSTRAINT "terapia_tipo_sospensione"
	FOREIGN KEY("id_sospensione")
	REFERENCES "tipo_sospensione"("idtipo_motivo_sospensione")
	ON DELETE RESTRICT 
	ON UPDATE RESTRICT 
GO
ALTER TABLE "terapia_sospensione"
	ADD CONSTRAINT "terapia_terapia_sospensione"
	FOREIGN KEY("id_terapia")
	REFERENCES "terapia"("idterapia")
	ON DELETE NO ACTION 
	ON UPDATE NO ACTION 
GO
ALTER TABLE "terapia_sospensione"
	ADD CONSTRAINT "cod_tipo_sospensione"
	FOREIGN KEY("tipo_sospensione")
	REFERENCES "cod_tipo_sospensione"("cod_tipo_sospensione")
	ON DELETE NO ACTION 
	ON UPDATE NO ACTION 
GO
