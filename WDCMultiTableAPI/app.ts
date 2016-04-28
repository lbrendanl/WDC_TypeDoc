/**
 * This document contains the API methods for the new WDC API version 2.0
 * This is currently under interation.  This is only temporary documentation and will contain errors.s
 * @preferred
 */
module WebDataConnectorAPI {
    /** Enum for data types */
    enum DataTypeEnum { string, int, float, bool, date, date_time };

    /** Enum for phases */
    enum PhaseEnum { interactivePhase, authPhase, gatherDataPhase };

    /** Enum for auth type.  This will be used by tableau to determine auth needs.
        Basic auth will use Tableau's username/password prompt in order to get authentication.
        Custom auth will launch the WDC in auth mode in order to get authentication.
        There will be a full tutorial and guide dedicated to WDC authentication
     */
    enum AuthTypeEnum { none, basic, custom };

    /** Enum for auth purpose.  This will be used in OAuth credential management scenarios as
        a means of selecting the right app credentials. 
        There will be a full tutorial and guide dedicated to WDC authentication
    */
    enum AuthPurposeEnum { ephemeral, enduring };

    /**  Represents metadata about a field in a table */
    interface ColumnInfo {
        /** The id of this column. Column ids must be unique within a table. */
        id: string;

        /** The data type of this column. */
        dataType: DataTypeEnum;

        /** (Optional) The user friendly alias of this column. If this property is 
        omitted, the column id will be used */
        alias: string;

        /** (Optional) An optional description of the column to be shown to the 
        user on hover */
        description: string;
    }

    /** Represents metadata about a single table of data */
    interface TableInfo {
        /** A unique id for this particular table */
        id: string;

        /** (Optional) An alias for this table to be shown to the user. This alias 
        is editable by the user and must be unique across all tables used in a join */
        defaultAlias: string;

        /** (Optional) A user friendly description of the contents in this table */
        description: string;

        /** (Optional) The id of the column which can be used for incremental 
        refreshes. Must be an int, date, or datetime column */
        incrementColumnId: string;

        /** The actual columns this table contains */
        columns: Array<ColumnInfo>
    }

    /** Object which is used to actually append data when creating an extract. */
    interface Table {
        /** If this is an incremental refresh and the table supports incremental refreshes, 
        this field will contain the largest value from the incrementColumn in the current extract.
        This value will be an empty string otherwise */
        incrementValue: string;

        /** Necessary metadata about this table */
        tableInfo: TableInfo;

        /** Called to actually append rows of data to the extract. Takes either an array of 
        arrays or an array of maps which contain the actual rows of data for the extract. 
        The format for these match v1.1 of the API */
        appendRows(rows: Array<Array<any>>);
    }

    /** Callback function for reporting the tables this WDC contains. tables is 
    a list of all tables in the connection an is required. */
    interface SchemaCallback {
        (tables: Array<TableInfo>): void;
    }

    /** Callback function to tell tableau the connector's init method has finished */
    interface InitCallback {
        (): void;
    }

    /** Callback function to tell tableau the connector's shutdown method has finished */
    interface ShutdownCallback {
        (): void;
    }

    /** Indicates that the connector has finished gathering data and extraction is complete. */
    interface DataDoneCallback {
        (): void;
    }

    /** This is the actual interface a WDC will be asked to implement. init and shutdown 
    remain from old version */
    interface WebDataConnector {
        /** No changes */
        init(initCallback: InitCallback): void;

        /** Called to retrieve the schema information for this WDC.
        @param schemaCallback - Called to inform tableau about the schema. */
        getSchema(schemaCallback: SchemaCallback): void;

        /** Called to create or update the data for a particular instance of this WDC. data is 
        returned for each table in the connection. Once all data has been returned, the connector
        must call doneCallback to indicate that data gathering has finished.
        @param tables - Information about which tables are involved in this connection.
        @param doneCallback - Callback function to indicate data gathering is completed. */
        getData(table: Table, doneCallback: DataDoneCallback): void;

        /** No changes */
        shutdown(shutdownCallback: ShutdownCallback): void;
    }

    /** The tableau object we all know and love. Just one additional function added here */
    interface tableau {
        /** Throws an error within Tableau with the passed errorMsessage
        @param errorMessage - message to display to the user in Tableau */
        abortWithError(errorMessage: string): void;

        /** Called whenever the connector has invalid credentials and
        needs to reauthenticate its user */
        abortForAuth(errorMessage: string): void;

        /** Logs a message in the Tableau log system
        @param errorMessage - message to log within Tableau */
        log(logMessage: string): void;

        /** Returns a new instance of a WebDataConnector*/
        makeConnector(): WebDataConnector;

        /** Registers your connector with Tableau. You call this function after
        you have created the connector instance and attached functions to the instance*/
        registerConnector(connector: WebDataConnector): void;

        /** Tells Tableau that the connector has finished the interactive phase or the authentication
         phase. After this method is called, Tableau proceeds to the data-gathering phase.*/
        submit(): void;

        /** Object used to pass non-secret connector state between phases*/
        connectionData: Object;

        /** Name of this connection*/
        connectionName: String;

        /** You can use this property to store a password, OAuth authentication token, or other secret
        This property can be a JSON object and is not written to disk*/
        password: Object;

        /** Current phase of the web data connector */
        phase: PhaseEnum;

        /** Current type of authentication */
        authType: AuthTypeEnum;

        /** Current context of auth for OAuth credentials management, see tutorial (NEED LINK) for details*/
        authPurpose: AuthPurposeEnum;

        /** Username tied to data source, persisted in a .twb, .twbx, etc. */
        username: String;

        /** Current version of the Web Data Connector API*/
        version: String;
    }
}
