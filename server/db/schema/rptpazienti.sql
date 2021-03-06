/*
Script generated by Aqua Data Studio 10.0.10_01 on apr-27-2014 04:07:00 PM
Database: artrite
Schema: <All Schemas>
Objects: VIEW
*/
DROP VIEW "rptpazienti"
GO
CREATE VIEW "rptpazienti"
AS
select `artrite`.`paziente`.`idPAZIENTE` AS `idPAZIENTE`,((year(now()) - year(`artrite`.`paziente`.`DATA_NASCITA`)) - (date_format(now(),'%m%d') < date_format(`artrite`.`paziente`.`DATA_NASCITA`,'%m%d'))) AS `eta`,`artrite`.`tipo_malattia`.`descrizione` AS `malattia`,`artrite`.`paziente`.`DATA_NASCITA` AS `DATA_NASCITA`,`artrite`.`paziente`.`sesso` AS `sesso`,`artrite`.`tipo_malattia`.`cod_tipo_malattia` AS `cod_tipo_malattia`,`artrite`.`tipo_malattia`.`idtipo_malattia` AS `idtipo_malattia`,`artrite`.`tipo_risposta`.`risposta` AS `fattore_reomatoide`,`tipo_risposta_1`.`risposta` AS `anticorpi`,count(`artrite`.`infusioni_tcz`.`data_infusione`) AS `numero_infusioni` from (((((`artrite`.`diagnosi_malattia` join `artrite`.`tipo_risposta` `tipo_risposta_1` on((`artrite`.`diagnosi_malattia`.`anticorpi` = `tipo_risposta_1`.`idtipo_risposta`))) join `artrite`.`tipo_malattia` on((`artrite`.`diagnosi_malattia`.`cod_malattia` = `artrite`.`tipo_malattia`.`idtipo_malattia`))) left join `artrite`.`tipo_risposta` on((`artrite`.`diagnosi_malattia`.`fattore_reumatoide` = `artrite`.`tipo_risposta`.`idtipo_risposta`))) join `artrite`.`paziente` on((`artrite`.`paziente`.`idPAZIENTE` = `artrite`.`diagnosi_malattia`.`id_paziente`))) left join `artrite`.`infusioni_tcz` on((`artrite`.`infusioni_tcz`.`id_paziente` = `artrite`.`paziente`.`idPAZIENTE`))) group by `artrite`.`infusioni_tcz`.`id_paziente`
GO
