SELECT
  journalmaster.id AS id,
  journalmaster.date AS date,
  journalmaster.stk_Main_ID AS stk_Main_ID,
  journalmaster.voucherTypeId AS voucherTypeId,
  journalmaster.voucherNo AS voucherNo,
  journalmaster.balacingId AS balacingId,
  journalmaster.status AS status,
  journalmaster.isOpening AS isOpening,
  journalmaster.createdAt AS createdAt,
  journalmaster.updatedAt AS updatedAt,
  Journaldetail.id AS Journaldetail__id,
  Journaldetail.jmId AS Journaldetail__jmId,
  Journaldetail.lineId AS Journaldetail__lineId,
  Journaldetail.coaId AS Journaldetail__coaId,
  Journaldetail.description AS Journaldetail__description,
  Journaldetail.chqNo AS Journaldetail__chqNo,
  Journaldetail.recieptNo AS Journaldetail__recieptNo,
  Journaldetail.ownDb AS Journaldetail__ownDb,
  Journaldetail.ownCr AS Journaldetail__ownCr,
  Journaldetail.rate AS Journaldetail__rate,
  Journaldetail.amountDb AS Journaldetail__amountDb,
  Journaldetail.amountCr AS Journaldetail__amountCr,
  Journaldetail.isCost AS Journaldetail__isCost,
  Journaldetail.currencyId AS Journaldetail__currencyId,
  Journaldetail.status AS Journaldetail__status,
  Journaldetail.createdAt AS Journaldetail__createdAt,
  Journaldetail.updatedAt AS Journaldetail__updatedAt,
  Journaldetail.idCard AS Journaldetail__idCard,
  Journaldetail.bank AS Journaldetail__bank,
  Journaldetail.bankDate AS Journaldetail__bankDate,
  Zvouchertype - VoucherTypeId.id AS Zvouchertype - VoucherTypeId__id,
  Zvouchertype - VoucherTypeId.vType AS Zvouchertype - VoucherTypeId__vType,
  Zvouchertype - VoucherTypeId.createdAt AS Zvouchertype - VoucherTypeId__createdAt,
  Zvouchertype - VoucherTypeId.updatedAt AS Zvouchertype - VoucherTypeId__updatedAt,
  Zcurrencies - CurrencyId.id AS Zcurrencies - CurrencyId__id,
  Zcurrencies - CurrencyId.currencyName AS Zcurrencies - CurrencyId__currencyName,
  Zcurrencies - CurrencyId.createdAt AS Zcurrencies - CurrencyId__createdAt,
  Zcurrencies - CurrencyId.updatedAt AS Zcurrencies - CurrencyId__updatedAt,
  Zcoas - CoaId.id AS Zcoas - CoaId__id,
  Zcoas - CoaId.acName AS Zcoas - CoaId__acName,
  Zcoas - CoaId.ch1Id AS Zcoas - CoaId__ch1Id,
  Zcoas - CoaId.ch2Id AS Zcoas - CoaId__ch2Id,
  Zcoas - CoaId.coaTypeId AS Zcoas - CoaId__coaTypeId,
  Zcoas - CoaId.setupName AS Zcoas - CoaId__setupName,
  Zcoas - CoaId.adress AS Zcoas - CoaId__adress,
  Zcoas - CoaId.city AS Zcoas - CoaId__city,
  Zcoas - CoaId.personName AS Zcoas - CoaId__personName,
  Zcoas - CoaId.mobileNo AS Zcoas - CoaId__mobileNo,
  Zcoas - CoaId.taxStatus AS Zcoas - CoaId__taxStatus,
  Zcoas - CoaId.ntn AS Zcoas - CoaId__ntn,
  Zcoas - CoaId.cnic AS Zcoas - CoaId__cnic,
  Zcoas - CoaId.salesLimit AS Zcoas - CoaId__salesLimit,
  Zcoas - CoaId.credit AS Zcoas - CoaId__credit,
  Zcoas - CoaId.creditDoys AS Zcoas - CoaId__creditDoys,
  Zcoas - CoaId.salesMan AS Zcoas - CoaId__salesMan,
  Zcoas - CoaId.isJvBalance AS Zcoas - CoaId__isJvBalance,
  Zcoas - CoaId.discountA AS Zcoas - CoaId__discountA,
  Zcoas - CoaId.discountB AS Zcoas - CoaId__discountB,
  Zcoas - CoaId.discountC AS Zcoas - CoaId__discountC,
  Zcoas - CoaId.createdAt AS Zcoas - CoaId__createdAt,
  Zcoas - CoaId.updatedAt AS Zcoas - CoaId__updatedAt,
  Zcoas - CoaId.batch_no AS Zcoas - CoaId__batch_no,
  Zcoas - CoaId.Transporter_ID AS Zcoas - CoaId__Transporter_ID,
  Zcoas - CoaId.freight_crt AS Zcoas - CoaId__freight_crt,
  Zcoas - CoaId.labour_crt AS Zcoas - CoaId__labour_crt,
  Zcoas - CoaId.bility_expense AS Zcoas - CoaId__bility_expense,
  Zcoas - CoaId.other_expense AS Zcoas - CoaId__other_expense,
  Zcoas - CoaId.foreign_currency AS Zcoas - CoaId__foreign_currency,
  Zcoas - CoaId.sub_customer AS Zcoas - CoaId__sub_customer,
  Zcoas - CoaId.sub_city AS Zcoas - CoaId__sub_city,
  Zcoas - CoaId.str AS Zcoas - CoaId__str,
  Zcoas - CoaId.isPettyCash AS Zcoas - CoaId__isPettyCash,
  Ztransporter - Transporter.id AS Ztransporter - Transporter__id,
  Ztransporter - Transporter.name AS Ztransporter - Transporter__name,
  Ztransporter - Transporter.contactPerson AS Ztransporter - Transporter__contactPerson,
  Ztransporter - Transporter.phone AS Ztransporter - Transporter__phone,
  Ztransporter - Transporter.address AS Ztransporter - Transporter__address,
  Ztransporter - Transporter.isActive AS Ztransporter - Transporter__isActive,
  Ztransporter - Transporter.createdAt AS Ztransporter - Transporter__createdAt,
  Ztransporter - Transporter.updatedAt AS Ztransporter - Transporter__updatedAt
FROM
  journalmaster
 
LEFT JOIN (
    SELECT
      journaldetail.id AS id,
      journaldetail.jmId AS jmId,
      journaldetail.lineId AS lineId,
      journaldetail.coaId AS coaId,
      journaldetail.description AS description,
      journaldetail.chqNo AS chqNo,
      journaldetail.recieptNo AS recieptNo,
      journaldetail.ownDb AS ownDb,
      journaldetail.ownCr AS ownCr,
      journaldetail.rate AS rate,
      journaldetail.amountDb AS amountDb,
      journaldetail.amountCr AS amountCr,
      journaldetail.isCost AS isCost,
      journaldetail.currencyId AS currencyId,
      journaldetail.status AS status,
      journaldetail.createdAt AS createdAt,
      journaldetail.updatedAt AS updatedAt,
      journaldetail.idCard AS idCard,
      journaldetail.bank AS bank,
      journaldetail.bankDate AS bankDate
    FROM
      journaldetail
  ) AS Journaldetail ON journalmaster.id = Journaldetail.jmId
  LEFT JOIN (
    SELECT
      zvouchertype.id AS id,
      zvouchertype.vType AS vType,
      zvouchertype.createdAt AS createdAt,
      zvouchertype.updatedAt AS updatedAt
    FROM
      zvouchertype
  ) AS Zvouchertype - VoucherTypeId ON journalmaster.voucherTypeId = Zvouchertype - VoucherTypeId.id
  LEFT JOIN (
    SELECT
      zcurrencies.id AS id,
      zcurrencies.currencyName AS currencyName,
      zcurrencies.createdAt AS createdAt,
      zcurrencies.updatedAt AS updatedAt
    FROM
      zcurrencies
  ) AS Zcurrencies - CurrencyId ON Journaldetail.currencyId = Zcurrencies - CurrencyId.id
  LEFT JOIN (
    SELECT
      zcoas.id AS id,
      zcoas.acName AS acName,
      zcoas.ch1Id AS ch1Id,
      zcoas.ch2Id AS ch2Id,
      zcoas.coaTypeId AS coaTypeId,
      zcoas.setupName AS setupName,
      zcoas.adress AS adress,
      zcoas.city AS city,
      zcoas.personName AS personName,
      zcoas.mobileNo AS mobileNo,
      zcoas.taxStatus AS taxStatus,
      zcoas.ntn AS ntn,
      zcoas.cnic AS cnic,
      zcoas.salesLimit AS salesLimit,
      zcoas.credit AS credit,
      zcoas.creditDoys AS creditDoys,
      zcoas.salesMan AS salesMan,
      zcoas.isJvBalance AS isJvBalance,
      zcoas.discountA AS discountA,
      zcoas.discountB AS discountB,
      zcoas.discountC AS discountC,
      zcoas.createdAt AS createdAt,
      zcoas.updatedAt AS updatedAt,
      zcoas.batch_no AS batch_no,
      zcoas.Transporter_ID AS Transporter_ID,
      zcoas.freight_crt AS freight_crt,
      zcoas.labour_crt AS labour_crt,
      zcoas.bility_expense AS bility_expense,
      zcoas.other_expense AS other_expense,
      zcoas.foreign_currency AS foreign_currency,
      zcoas.sub_customer AS sub_customer,
      zcoas.sub_city AS sub_city,
      zcoas.str AS str,
      zcoas.isPettyCash AS isPettyCash
    FROM
      zcoas
  ) AS Zcoas - CoaId ON Journaldetail.coaId = Zcoas - CoaId.id
  LEFT JOIN (
    SELECT
      ztransporter.id AS id,
      ztransporter.name AS name,
      ztransporter.contactPerson AS contactPerson,
      ztransporter.phone AS phone,
      ztransporter.address AS address,
      ztransporter.isActive AS isActive,
      ztransporter.createdAt AS createdAt,
      ztransporter.updatedAt AS updatedAt
    FROM
      ztransporter
  ) AS Ztransporter - Transporter ON Zcoas - CoaId.Transporter_ID = Ztransporter - Transporter.id
LIMIT
  1048575

