/**
* This document contains the API methods for the new WDC API version 2.0
* This is currently under interation.  This is only temporary documentation and will contain errors.s
* @preferred
*/
var WebDataConnectorAPI;
(function (WebDataConnectorAPI) {
    /** Enum for data types */
    var DataTypeEnum;
    (function (DataTypeEnum) {
        DataTypeEnum[DataTypeEnum["string"] = 0] = "string";
        DataTypeEnum[DataTypeEnum["int"] = 1] = "int";
        DataTypeEnum[DataTypeEnum["float"] = 2] = "float";
        DataTypeEnum[DataTypeEnum["bool"] = 3] = "bool";
        DataTypeEnum[DataTypeEnum["date"] = 4] = "date";
        DataTypeEnum[DataTypeEnum["date_time"] = 5] = "date_time";
    })(DataTypeEnum || (DataTypeEnum = {}));
    ;

    /** Enum for phases */
    var PhaseEnum;
    (function (PhaseEnum) {
        PhaseEnum[PhaseEnum["interactivePhase"] = 0] = "interactivePhase";
        PhaseEnum[PhaseEnum["authPhase"] = 1] = "authPhase";
        PhaseEnum[PhaseEnum["gatherDataPhase"] = 2] = "gatherDataPhase";
    })(PhaseEnum || (PhaseEnum = {}));
    ;

    /** Enum for auth type.  This will be used by tableau to determine auth needs.
    Basic auth will use Tableau's username/password prompt in order to get authentication.
    Custom auth will launch the WDC in auth mode in order to get authentication.
    There will be a full tutorial and guide dedicated to WDC authentication
    */
    var AuthTypeEnum;
    (function (AuthTypeEnum) {
        AuthTypeEnum[AuthTypeEnum["none"] = 0] = "none";
        AuthTypeEnum[AuthTypeEnum["basic"] = 1] = "basic";
        AuthTypeEnum[AuthTypeEnum["custom"] = 2] = "custom";
    })(AuthTypeEnum || (AuthTypeEnum = {}));
    ;

    /** Enum for auth purpose.  This will be used in OAuth credential management scenarios as
    a means of selecting the right app credentials.
    There will be a full tutorial and guide dedicated to WDC authentication
    */
    var AuthPurposeEnum;
    (function (AuthPurposeEnum) {
        AuthPurposeEnum[AuthPurposeEnum["ephemeral"] = 0] = "ephemeral";
        AuthPurposeEnum[AuthPurposeEnum["enduring"] = 1] = "enduring";
    })(AuthPurposeEnum || (AuthPurposeEnum = {}));
    ;

    

    

    

    

    

    

    

    

    
})(WebDataConnectorAPI || (WebDataConnectorAPI = {}));
//# sourceMappingURL=app.js.map
