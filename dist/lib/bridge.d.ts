export interface Pdu {
    pdu: string;
    length: number;
    seq: number;
    cnt: number;
}
export declare type byte = number;
export interface Sms {
    text: string;
    pid: byte;
    dcs: byte;
    csca: string;
    number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string;
    type: TP_MTI;
    date: Date;
    fmt: Fmt;
    sr?: {
        recipient: string;
        scts: Date;
        dt: Date;
        status: TP_ST | byte;
    };
    ref?: number;
    cnt?: number;
    seq?: number;
}
export declare class SmsBase {
    type: TP_MTI;
    text: string;
    pid: byte;
    dcs: byte;
    csca: string;
    number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string;
    date: Date;
    fmt: Fmt;
    _fmt: string;
    _type: string;
    constructor(type: TP_MTI, text: string, pid: byte, dcs: byte, csca: string, number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string, date: Date, fmt: Fmt);
}
export declare class SmsWithDataHeader extends SmsBase implements Sms {
    ref: number;
    cnt: number;
    seq: number;
    constructor(type: typeof SmsBase.prototype.type, text: typeof SmsBase.prototype.text, pid: typeof SmsBase.prototype.pid, dcs: typeof SmsBase.prototype.dcs, csca: typeof SmsBase.prototype.csca, number: typeof SmsBase.prototype.number, date: typeof SmsBase.prototype.date, fmt: typeof SmsBase.prototype.fmt, ref: number, cnt: number, seq: number);
}
export declare class SmsDeliverPart extends SmsWithDataHeader implements Sms {
    constructor(text: typeof SmsBase.prototype.text, pid: typeof SmsBase.prototype.pid, dcs: typeof SmsBase.prototype.dcs, csca: typeof SmsBase.prototype.csca, number: typeof SmsBase.prototype.number, date: typeof SmsBase.prototype.date, fmt: typeof SmsBase.prototype.fmt, ref: typeof SmsWithDataHeader.prototype.ref, cnt: typeof SmsWithDataHeader.prototype.cnt, seq: typeof SmsWithDataHeader.prototype.seq);
}
export declare class SmsDeliver extends SmsBase implements Sms {
    constructor(text: typeof SmsBase.prototype.text, pid: typeof SmsBase.prototype.pid, dcs: typeof SmsBase.prototype.dcs, csca: typeof SmsBase.prototype.csca, number: typeof SmsBase.prototype.number, date: typeof SmsBase.prototype.date, fmt: typeof SmsBase.prototype.fmt);
}
export declare class SmsStatusReport extends SmsWithDataHeader implements Sms {
    sr: {
        recipient: string;
        scts: Date;
        dt: Date;
        status: TP_ST | byte;
    };
    readonly _status: string;
    readonly _stClass: ST_CLASS;
    constructor(text: typeof SmsBase.prototype.text, pid: typeof SmsBase.prototype.pid, dcs: typeof SmsBase.prototype.dcs, csca: typeof SmsBase.prototype.csca, number: typeof SmsBase.prototype.number, date: typeof SmsBase.prototype.date, fmt: typeof SmsBase.prototype.fmt, ref: typeof SmsWithDataHeader.prototype.ref, cnt: typeof SmsWithDataHeader.prototype.cnt, seq: typeof SmsWithDataHeader.prototype.seq, sr: {
        recipient: string;
        scts: Date;
        dt: Date;
        status: TP_ST | byte;
    });
}
export declare enum Fmt {
    GSM0338 = 0,
    EIGHT_BIT = 4,
    UCS2 = 8,
    UNKNOWN = -1
}
export declare enum TP_MTI {
    SMS_DELIVER = 0,
    SMS_STATUS_REPORT = 2,
    SMS_SUBMIT_REPORT = 1
}
export declare enum TP_ST {
    COMPLETED_RECEIVED = 0,
    COMPLETED_UNABLE_TO_CONFIRM_DELIVERY = 1,
    COMPLETED_REPLACED = 2,
    STILL_TRYING_CONGESTION = 32,
    STILL_TRYING_SME_BUSY = 33,
    STILL_TRYING_NO_RESPONSE_FROM_SME = 34,
    STILL_TRYING_SERVICE_REJECTED = 35,
    STILL_TRYING_QOS_UNAVAILABLE = 36,
    STILL_TRYING_SME_ERROR = 37,
    PERMANENT_ERROR_REMOTE_PROCEDURE_ERROR = 64,
    PERMANENT_ERROR_INCOMPATIBLE_DESTINATION = 65,
    PERMANENT_ERROR_CONNECTION_REJECTED_BY_SME = 66,
    PERMANENT_ERROR_NOT_OBTAINABLE = 67,
    PERMANENT_ERROR_QOS_UNAVAILABLE = 68,
    PERMANENT_ERROR_NO_INTERWORKING_AVAILABLE = 69,
    PERMANENT_ERROR_SM_VALIDITY_PERIOD_EXPIRED = 70,
    PERMANENT_ERROR_SM_DELETED_BY_ORIGINATING_SME = 71,
    PERMANENT_ERROR_SM_DELETED_BY_SC_ADMINISTRATION = 72,
    PERMANENT_ERROR_SM_DOES_NOT_EXIST = 73,
    TEMPORARY_ERROR_CONGESTION = 96,
    TEMPORARY_ERROR_SME_BUSY = 97,
    TEMPORARY_ERROR_NO_RESPONSE_FROM_SME = 98,
    TEMPORARY_ERROR_SERVICE_REJECTED = 99,
    TEMPORARY_ERROR_QOS_UNAVAILABLE = 100,
    TEMPORARY_ERROR_SME_ERROR = 101
}
export declare type ST_CLASS = "COMPLETED" | "STILL TRYING" | "PERMANENT ERROR" | "TEMPORARY ERROR" | "RESERVED" | "SPECIFIC TO SC";
export declare function decodePdu(pdu: string, callback?: (error: null | Error, sms: Sms) => void): Promise<Sms>;
export declare function buildSmsSubmitPdus(params: {
    number: string;
    text: string;
    validity?: Date;
    csca?: string;
    klass?: number;
    request_status?: boolean;
}, callback?: (error: null | Error, pdus: Pdu[]) => void): Promise<Pdu[]>;
