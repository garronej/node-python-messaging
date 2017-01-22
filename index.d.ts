declare module "node-python-messaging" {

    export interface InputsSmsSubmit {
        number: string;
        text: string;
        validity?: Date;
        csca?: string;
        klass?: number;
        request_status?: boolean;
    }

    export interface Pdu {
        pdu: string;
        length: number;
        seq: number;
        cnt: number;
    }

    export type byte = number;

    export interface Sms {
        text: string;
        pid: byte;
        dcs: byte;
        csca: string;
        number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string;
        type: TP_MTI;
        date: Date;
        fmt: Fmt;
        //if SMS-STATUS-REPORT
        sr?: {
            recipient: string;
            scts: Date;
            dt: Date;
            status: number;
        };
        //if SMS-DELIVER and User Data Header present
        ref?: number;
        cnt?: number;
        seq?: number;

    }

    export enum Fmt {
        GSM0338= 0,
        EIGHT_BIT= 4,
        UCS2= 8
    }

    export enum TP_MTI {
        SMS_DELIVER= 0b00,
        SMS_STATUS_REPORT = 0b10,
        SMS_SUBMIT_REPORT = 0b01 //Not supported currently
    }

    //03.40.pdf p57
    export enum TP_ST {
        COMPLETED_RECEIVED=                                 0b00000000,
        COMPLETED_UNABLE_TO_CONFIRM_DELIVERY=               0b00000001,
        COMPLETED_REPLACED=                                 0b00000010,

        TEMPORARY_ERROR_CONGESTION=                         0b00100000,
        TEMPORARY_ERROR_SME_BUSY=                           0b00100001,
        TEMPORARY_ERROR_NO_RESPONSE_FROM_SME=               0b00100010,
        TEMPORARY_ERROR_SERVICE_REJECTED=                   0b00100011,
        TEMPORARY_QOS_UNAVAILABLE=                          0b00100100,
        TEMPORARY_ERROR_SME_ERROR=                          0b00100100,

        PERMANENT_ERROR_REMOTE_PROCEDURE_ERROR=             0b01000000,
        PERMANENT_ERROR_INCOMPATIBLE_DESTINATION=           0b01000001,
        PERMANENT_ERROR_CONNECTION_REJECTED_BY_SME=         0b01000010,
        PERMANENT_ERROR_NOT_OBTAINABLE=                     0b01000011,
        PERMANENT_ERROR_QOS_UNAVAILABLE=                    0b01000100,
        PERMANENT_ERROR_NO_INTERWORKING_AVAILABLE=          0b01000101,
        PERMANENT_ERROR_SM_VALIDITY_PERIOD_EXPIRED=         0b01000110,
        PERMANENT_ERROR_SM_DELETED_BY_ORIGINATING_SME=      0b01000111,
        PERMANENT_ERROR_SM_DELETED_BY_SC_ADMINISTRATION=    0b01001000,
        PERMANENT_ERROR_SM_DOES_NOT_EXIST=                  0b01001001
    }

    //DECODE service center ( SC ) to MS ( mobile station switched on with SIM module )
    export function decodePdu(pdu: string, callback: (error: Error, sms: Sms) => void): void;
    export function smsDeliver(pdu: string, callback: (error: Error, sms: Sms) => void): void;

    export function buildSmsSubmitPdus(params: InputsSmsSubmit, callback: (error: Error, pdus: Pdu[]) => void): void;
    export function smsSubmit(params: InputsSmsSubmit, callback: (error: Error, pdus: Pdu[]) => void): void;

}
