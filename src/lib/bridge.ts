import * as PythonShell from "python-shell";
import * as path from "path";
import * as nodePdu from "node-pdu";

export interface Pdu {
        pdu: string;
        length: number; //length to pass to AT+CMGS
        seq: number; //part number over total
        cnt: number; //total number of parts
}

export type byte = number;

export interface Sms {
        text: string;
        pid: byte; //Protocol identifier
        dcs: byte; //data coding scheme
        csca: string; //Service center address
        number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string;
        type: TP_MTI; //2bit, pdu type
        date: Date;
        fmt: Fmt; //Encoding format
        //if SMS-STATUS-REPORT
        sr?: {
                recipient: string; //phone number
                scts: Date; //service center time tamp
                dt: Date; //discharge time
                status: TP_ST | byte;
        };
        //User Data Header present => SMS-DELIVER multipart or SMS-STATUS-REPORT
        ref?: number; //message ref returned by CMGS
        cnt?: number; //total
        seq?: number; //number over total
}


export class SmsBase {

        public _fmt: string;
        public _type: string;

        constructor(
                public type: TP_MTI,
                public text: string,
                public pid: byte,
                public dcs: byte,
                public csca: string,
                public number: "SR-OK" | "SR-UNKNOWN" | "SR-STORED" | string,
                public date: Date,
                public fmt: Fmt
        ) {
                this._fmt = Fmt[this.fmt];
                this._type = TP_MTI[this.type];
        }

}

export class SmsWithDataHeader extends SmsBase implements Sms {

        constructor(
                type: typeof SmsBase.prototype.type,
                text: typeof SmsBase.prototype.text,
                pid: typeof SmsBase.prototype.pid,
                dcs: typeof SmsBase.prototype.dcs,
                csca: typeof SmsBase.prototype.csca,
                number: typeof SmsBase.prototype.number,
                date: typeof SmsBase.prototype.date,
                fmt: typeof SmsBase.prototype.fmt,
                public ref: number,
                public cnt: number,
                public seq: number
        ) {
                super(type, text, pid, dcs, csca, number, date, fmt);
        }

}

export class SmsDeliverPart extends SmsWithDataHeader implements Sms {

        constructor(
                text: typeof SmsBase.prototype.text,
                pid: typeof SmsBase.prototype.pid,
                dcs: typeof SmsBase.prototype.dcs,
                csca: typeof SmsBase.prototype.csca,
                number: typeof SmsBase.prototype.number,
                date: typeof SmsBase.prototype.date,
                fmt: typeof SmsBase.prototype.fmt,
                ref: typeof SmsWithDataHeader.prototype.ref,
                cnt: typeof SmsWithDataHeader.prototype.cnt,
                seq: typeof SmsWithDataHeader.prototype.seq
        ) {
                super(TP_MTI.SMS_DELIVER, text, pid, dcs, csca, number, date, fmt, ref, cnt, seq);
        }
}

export class SmsDeliver extends SmsBase implements Sms {

        constructor(
                text: typeof SmsBase.prototype.text,
                pid: typeof SmsBase.prototype.pid,
                dcs: typeof SmsBase.prototype.dcs,
                csca: typeof SmsBase.prototype.csca,
                number: typeof SmsBase.prototype.number,
                date: typeof SmsBase.prototype.date,
                fmt: typeof SmsBase.prototype.fmt
        ) {
                super(TP_MTI.SMS_DELIVER, text, pid, dcs, csca, number, date, fmt);
        }

}

export class SmsStatusReport extends SmsWithDataHeader implements Sms {

        public readonly _status: string;
        public readonly _stClass: ST_CLASS;

        constructor(
                text: typeof SmsBase.prototype.text,
                pid: typeof SmsBase.prototype.pid,
                dcs: typeof SmsBase.prototype.dcs,
                csca: typeof SmsBase.prototype.csca,
                number: typeof SmsBase.prototype.number,
                date: typeof SmsBase.prototype.date,
                fmt: typeof SmsBase.prototype.fmt,
                ref: typeof SmsWithDataHeader.prototype.ref,
                cnt: typeof SmsWithDataHeader.prototype.cnt,
                seq: typeof SmsWithDataHeader.prototype.seq,
                public sr: {
                        recipient: string;
                        scts: Date;
                        dt: Date;
                        status: TP_ST | byte;
                }
        ) {
                super(TP_MTI.SMS_STATUS_REPORT, text, pid, dcs, csca, number, date, fmt, ref, cnt, seq);

                this._status = (TP_ST[this.sr.status] !== undefined) ? TP_ST[this.sr.status] : "RESERVED";
                this._stClass = stClassOf(this.sr.status);

        }
}


export enum Fmt {
        GSM0338 = 0,
        EIGHT_BIT = 4,
        UCS2 = 8,
        UNKNOWN = -1
}

export enum TP_MTI {
        SMS_DELIVER = 0b00,
        SMS_STATUS_REPORT = 0b10,
        SMS_SUBMIT_REPORT = 0b01 //Not supported currently
}

//03.40.pdf p57
export enum TP_ST {
        COMPLETED_RECEIVED = 0b00000000,
        COMPLETED_UNABLE_TO_CONFIRM_DELIVERY = 0b00000001,
        COMPLETED_REPLACED = 0b00000010,

        STILL_TRYING_CONGESTION = 0b00100000,
        STILL_TRYING_SME_BUSY = 0b00100001,
        STILL_TRYING_NO_RESPONSE_FROM_SME = 0b00100010,
        STILL_TRYING_SERVICE_REJECTED = 0b00100011,
        STILL_TRYING_QOS_UNAVAILABLE = 0b00100100,
        STILL_TRYING_SME_ERROR = 0b00100101,

        PERMANENT_ERROR_REMOTE_PROCEDURE_ERROR = 0b01000000,
        PERMANENT_ERROR_INCOMPATIBLE_DESTINATION = 0b01000001,
        PERMANENT_ERROR_CONNECTION_REJECTED_BY_SME = 0b01000010,
        PERMANENT_ERROR_NOT_OBTAINABLE = 0b01000011,
        PERMANENT_ERROR_QOS_UNAVAILABLE = 0b01000100,
        PERMANENT_ERROR_NO_INTERWORKING_AVAILABLE = 0b01000101,
        PERMANENT_ERROR_SM_VALIDITY_PERIOD_EXPIRED = 0b01000110,
        PERMANENT_ERROR_SM_DELETED_BY_ORIGINATING_SME = 0b01000111,
        PERMANENT_ERROR_SM_DELETED_BY_SC_ADMINISTRATION = 0b01001000,
        PERMANENT_ERROR_SM_DOES_NOT_EXIST = 0b01001001,

        TEMPORARY_ERROR_CONGESTION = 0b01100000,
        TEMPORARY_ERROR_SME_BUSY = 0b01100001,
        TEMPORARY_ERROR_NO_RESPONSE_FROM_SME = 0b01100010,
        TEMPORARY_ERROR_SERVICE_REJECTED = 0b01100011,
        TEMPORARY_ERROR_QOS_UNAVAILABLE = 0b01100100,
        TEMPORARY_ERROR_SME_ERROR = 0b01100101
}

export type ST_CLASS = "COMPLETED" | "STILL TRYING" | "PERMANENT ERROR" | "TEMPORARY ERROR" | "RESERVED" | "SPECIFIC TO SC";

//All reserved should be interpreted as STILL_TRYING_SERVICE_REJECTED
function stClassOf(st: TP_ST): ST_CLASS {

        if (0b00000000 <= st && st <= 0b00000010) return "COMPLETED";
        if (0b00100000 <= st && st <= 0b00100101) return "STILL TRYING";
        if (0b01000000 <= st && st <= 0b01001001) return "PERMANENT ERROR";
        if (0b01100000 <= st && st <= 0b01100101) return "TEMPORARY ERROR";

        if (
                (0b10000000 <= st && st <= 0b11111111) ||
                (0b00000011 <= st && st <= 0b00001111) ||
                (0b00100110 <= st && st <= 0b00101111) ||
                (0b01001010 <= st && st <= 0b01001111) ||
                (0b01100110 <= st && st <= 0b01101001) ||
                (0b01101010 <= st && st <= 0b01101111)
        ) return "RESERVED";

        return "SPECIFIC TO SC";

}

function descriptorToInstance(descriptor: Sms): SmsDeliver | SmsDeliverPart | SmsStatusReport {

        switch (descriptor.type) {
                case TP_MTI.SMS_STATUS_REPORT:
                        return new SmsStatusReport(
                                descriptor.text,
                                descriptor.pid,
                                descriptor.dcs,
                                descriptor.csca,
                                descriptor.number,
                                descriptor.date,
                                descriptor.fmt,
                                descriptor.ref as any,
                                descriptor.cnt as any,
                                descriptor.seq as any,
                                descriptor.sr as any
                        );
                case TP_MTI.SMS_DELIVER:
                        if (descriptor.hasOwnProperty("ref"))
                                return new SmsDeliverPart(
                                        descriptor.text,
                                        descriptor.pid,
                                        descriptor.dcs,
                                        descriptor.csca,
                                        descriptor.number,
                                        descriptor.date,
                                        descriptor.fmt,
                                        descriptor.ref as any,
                                        descriptor.cnt as any,
                                        descriptor.seq as any
                                );
                        else
                                return new SmsDeliver(
                                        descriptor.text,
                                        descriptor.pid,
                                        descriptor.dcs,
                                        descriptor.csca,
                                        descriptor.number,
                                        descriptor.date,
                                        descriptor.fmt
                                );
                case TP_MTI.SMS_SUBMIT_REPORT:
                        throw new Error("SUBMIT REPORT not supported");
        }


}


function decodePduWithNodePdu(pdu: string): SmsDeliver {

        const obj = nodePdu.parse(pdu);

        if (obj._type._mti !== TP_MTI.SMS_DELIVER) {

                throw new Error("Fallback to node-pdu only for SMS DELIVER");

        }

        const getNumber = (sca: any): string => {

                let number = sca._encoded;

                if (typeof number !== "string" || number.length === 0) {

                        throw new Error("No number");

                }

                if (sca._type.getValue() === 145) {

                        number = `+${number}`;

                }

                return number;

        };


        const sms: Sms = {
                "text": (() => {

                        let text = obj._ud._data;

                        if (typeof text !== "string") {

                                throw new Error("node-pdu text is not a string");

                        }

                        return text;

                })(),
                "pid": (() => {

                        try {

                                let pid = obj._pid._pid;

                                if (typeof pid !== "number") {

                                        throw Error();

                                }

                                return pid;

                        } catch{
                                return 0;
                        }


                })(),
                "dcs": (() => {

                        try {

                                let dcs = obj._dcs.getValue();

                                if (typeof dcs !== "number") {

                                        throw new Error();

                                }

                                return dcs;

                        } catch{

                                return 0;
                        }


                })(),
                "csca": (() => {


                        try {

                                return getNumber(obj._sca);

                        } catch{

                                return "";

                        }


                })(),
                "number": getNumber(obj._address),
                "type": TP_MTI.SMS_DELIVER,
                "date": new Date((() => {

                        const timestamp = obj._scts._time;

                        if (typeof timestamp !== "number" || !timestamp) {

                                return Date.now();

                        }

                        return timestamp * 1000;

                })()),
                "fmt": Fmt.UNKNOWN
        };

        return descriptorToInstance(sms) as SmsDeliver;

}


//DECODE service center ( SC ) to MS ( mobile station switched on with SIM module )
export function decodePdu(
        pdu: string,
        callback?: (error: null | Error, sms: Sms) => void
): Promise<Sms> {

        return new Promise<Sms>((resolve, reject) => {

                (() => {

                        const resolve_src = resolve;

                        resolve = _sms => {

                                const sms: Sms = _sms as any;

                                if (sms.type === TP_MTI.SMS_DELIVER && sms.text === "") {

                                        let sms_alt: SmsDeliver | undefined;

                                        try {

                                                sms_alt = decodePduWithNodePdu(pdu);

                                        } catch{

                                                sms_alt = undefined;

                                        }

                                        if (!!sms_alt && !sms_alt.text.match(/�/g)) {

                                                sms.text = sms_alt.text;

                                        }

                                }

                                if (!!callback) {
                                        callback(null, sms);
                                }

                                resolve_src(sms);

                        };


                })();

                (() => {

                        const reject_src = reject;

                        reject = (error: Error) => {

                                try {

                                        resolve(decodePduWithNodePdu(pdu));

                                        return;

                                } catch{ }

                                if (!!callback) {

                                        callback(error, null as any);

                                }

                                reject_src(error);

                        };

                })();

                bridge("smsDeliver", { "pdu": pdu }, (error, obj: any | null) => {

                        if (!!error) {

                                reject(error);

                                return;
                        };

                        let smsDescriptor: Sms = (function parseDate(obj: any): Sms {

                                if (obj.date) obj.date = new Date(obj.date);

                                if (obj.type === 0b10) {
                                        if (obj.sr.dt) obj.sr.dt = new Date(obj.sr.dt);
                                        if (obj.sr.scts) obj.sr.scts = new Date(obj.sr.scts);
                                }

                                return obj;

                        })(obj);

                        const smsInstance = descriptorToInstance(smsDescriptor);

                        resolve(smsInstance);

                });

        });

}

export function buildSmsSubmitPdus(
        params: {
                number: string;
                text: string;
                validity?: Date;
                csca?: string;
                klass?: number;
                request_status?: boolean;
        },
        callback?: (error: null | Error, pdus: Pdu[]) => void
): Promise<Pdu[]> {

        return new Promise<Pdu[]>((resolve, reject) => {

                (() => {

                        const resolve_src = resolve;

                        resolve = _pdus => {

                                const pdus: Pdu[] = _pdus as any;

                                if (!!callback) {
                                        callback(null, pdus);
                                }

                                resolve_src(pdus);

                        };


                })();

                (() => {

                        const reject_src = reject;

                        reject = (error: Error) => {

                                if (!!callback) {

                                        callback(error, null as any);

                                }

                                reject_src(error);

                        };

                })();


                let { text, ...args } = params as any;

                args["text_as_char_code_arr"] = (function strToCodesArray(str: string): number[] {

                        let out: number[] = [];

                        for (let index = 0; index < str.length; index++)
                                out.push(str.charCodeAt(index));

                        return out;

                })(text);

                if (params.validity instanceof Date)
                        args.validity = params.validity.toUTCString();

                bridge("smsSubmit", args, (error: null | Error, pdus: Pdu[] | null) => {

                        if (!!error) {
                                reject(error);
                        } else {
                                resolve(pdus!);
                        }

                });
        });

}


const options = {
        "mode": "text",
        "pythonPath": path.join(__dirname, "..", "..", "dist", "virtual", "bin", "python"),
        "pythonOptions": ['-u'],
        "scriptPath": path.join(__dirname, "..", "..", "src", "lib")
};

function bridge(method: string, args: any, callback: (error: null | Error, out: any) => void): void {

        PythonShell.run(
                "bridge.py",
                { ...options, "args": [method, JSON.stringify(args)] },
                (error, out) => {

                        if (error) return callback(error, null);

                        callback(null, JSON.parse(out[0]));

                }
        );

}