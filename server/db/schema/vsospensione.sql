/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: VIEW
*/
DROP VIEW "vsospensione"
GO
CREATE VIEW "vsospensione"
AS
select `s`.`idtipo_motivo_sospensione` AS `idtipo_motivo_sospensione`,`s`.`descrizione` AS `sospensione`,`sd`.`id_sospensione_dettaglio` AS `id_sospensione_dettaglio`,`sd`.`sospensione_dettaglio` AS `sospensione_dettaglio` from (`artrite`.`tipo_sospensione` `s` left join `artrite`.`tipo_sospensione_dettaglio` `sd` on((`sd`.`id_tipo_sospensione` = `s`.`idtipo_motivo_sospensione`))) where (`s`.`tipo_famiglia_farmaco` = 2)
GO
