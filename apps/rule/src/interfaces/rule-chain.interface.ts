export interface IRuleChain{
    rule_id : string;
    input_params? : IParam[];
    statements : IStatement[];
    status_statement : IStatus[];
}
export interface IStatus {
    statement_id : string;
    status : EStatus;
}
export interface IStatement {
    statement_id : string;
    type : EStatement;
    required? : IStatus[];
}

export interface IReturnStatement extends IStatement {
    type: EStatement.RETURN_STATEMENT;
    value?: string | IStatement;
}

export interface ISetRedisStatement extends IStatement {
    type : EStatement.SET_REDIS;
    key : string;
    value : string;
    expireAt : string;
}

export interface IPublishMessageStatement extends IStatement {
    type : EStatement.PUBLISH_MESSAGE;
    topic : string;
    broker : string;
    username : string;
    password : string;
    dataValue : string;
}

export interface IIfElseStatement extends IStatement {  
    type : EStatement.IF_ELSE;
    condition : string;
    true : IStatement[];
    false? : IStatement[];
}

export interface ICallApiStatement extends IStatement {
    type : EStatement.CALL_API;
    url : string;
    method : string;
    body : string;
    header : string;    
}

export interface ISwitchCaseStatement extends IStatement {
    type : EStatement.SWITCH_CASE;
    discriminant : string ;
    cases : [
        {
            condition : string;
            statement : IStatement[];
        }
    ]
}

export interface ISendMailStatement extends IStatement {
    type : EStatement.SEND_MAIL;
    email : string;
    code : string;
    service_name : string;
    action_by : string;
    info : string;
}

export interface IVariableDeclaration extends IStatement {
    type : EStatement.VARIABLE_DECLARATION;
    data_type : EDataType;
    key : string;
    value? : string;
}

export interface IParam {
    key : string;
    type? : string;
    required? : boolean;
    value? : string;
}   

export enum EStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXECUTING = "EXECUTING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export enum EStatement {
    IF_ELSE = "IF_ELSE",
    SWITCH_CASE = "SWITCH_CASE",
    LOOP = "LOOP",
    SEND_MAIL = "SEND_MAIL",
    CALL_API = "CALL_API",
    PUBLISH_MESSAGE = "PUBLISH_MESSAGE",
    SET_REDIS = "SET_REDIS",
    VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
    UNKNOWN = "UNKNOWN",
    RETURN_STATEMENT = "RETURN_STATEMENT",
}

export enum EDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    OBJECT = "OBJECT",
    ARRAY = "ARRAY",
    NULL = "NULL",
}