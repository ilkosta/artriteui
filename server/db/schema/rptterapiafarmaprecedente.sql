/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: VIEW
*/
DROP VIEW "rptterapiafarmaprecedente"
GO
CREATE VIEW "rptterapiafarmaprecedente"
AS
select `artrite`.`paziente`.`sesso` AS `sesso`,`artrite`.`paziente`.`idPAZIENTE` AS `idPAZIENTE`,`artrite`.`tipo_farmaco`.`nome` AS `nome`,`artrite`.`tipo_famiglia_farmaco`.`famiglia_farmacocol` AS `famiglia_farmacocol` from (((`artrite`.`tipo_famiglia_farmaco` join `artrite`.`tipo_farmaco` on((`artrite`.`tipo_famiglia_farmaco`.`idtipo_famiglia_farmaco` = `artrite`.`tipo_farmaco`.`tipo_famiglia_farmaco`))) join `artrite`.`terapia_farmacologica_pre` on((`artrite`.`terapia_farmacologica_pre`.`cod_tipo_farmaco` = `artrite`.`tipo_farmaco`.`idtipo_farmaco`))) join `artrite`.`paziente` on((`artrite`.`paziente`.`idPAZIENTE` = `artrite`.`terapia_farmacologica_pre`.`id_paziente`)))
GO
