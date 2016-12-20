declare module "node-python-messaging" {

    export interface InputsSmsSubmit {
        number: string;
        text: string;
        validity?: Date;
        csca?: string;
        klass?: number;
    }

    export interface Pdu {
        pdu: string;
        length: number;
        seq: number;
        cnt: number;
    }

    export interface Sms {
        csca: number;
        type: any;
        seq: number;
        sr: any;
        fmt: number;
        pid: number;
        cnt: number;
        number: string;
        text: string;
        date: Date;
        ref: number;
        dcs: number;
    }

    /*
    interface SmsDeliverProto {
        (pdu: string, callback: (error: Error, sms: Sms) => void):void;
    }

    export let smsDeliver: SmsDeliverProto;
    */

    export function smsDeliver(pdu: string, callback: (error: Error, sms: Sms)=>void):void;
    export function smsSubmit(params: InputsSmsSubmit, callback: (error: Error, pdus: Pdu[])=>void): void;


}
