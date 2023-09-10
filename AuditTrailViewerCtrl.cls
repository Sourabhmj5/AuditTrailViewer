/**
 * @description       : 
 * @author            : Sourabh Bhattacharjee
 * @group             : 
 * @last modified on  : 09-04-2023
 * @last modified by  : Sourabh Bhattacharjee 
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   09-04-2023   Sourabh Bhattacharjee   Initial Version
**/
public class AuditTrailViewerCtrl {

    @AuraEnabled(cacheable = true)
    public static SetupAuditTrailInfo getRecords(Integer queryLimit, Integer queryOffset) {
        return new SetupAuditTrailInfo([SELECT count() FROM SetupAuditTrail],
        [SELECT Action, CreatedBy.Name, Display, Section, CreatedDate
                FROM SetupAuditTrail
                ORDER BY CreatedDate DESC
                LIMIT :queryLimit
                OFFSET :queryOffset]);
    }

    public class SetupAuditTrailInfo{

        @AuraEnabled
        public Integer totalRecordCount {get;set;}

        @AuraEnabled
        public List<SetupAuditTrail> auditTrailRecords{get;set;}

        public SetupAuditTrailInfo(Integer totalRecordCount, List<SetupAuditTrail> auditTrailRecords){
            this.totalRecordCount = totalRecordCount;
            this.auditTrailRecords = auditTrailRecords;
        }
    }

}