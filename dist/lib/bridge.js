"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var PythonShell = require("python-shell");
var path = require("path");
var SmsBase = (function () {
    function SmsBase(type, text, pid, dcs, csca, number, date, fmt) {
        this.type = type;
        this.text = text;
        this.pid = pid;
        this.dcs = dcs;
        this.csca = csca;
        this.number = number;
        this.date = date;
        this.fmt = fmt;
        this._fmt = Fmt[this.fmt];
        this._type = TP_MTI[this.type];
    }
    return SmsBase;
}());
exports.SmsBase = SmsBase;
var SmsWithDataHeader = (function (_super) {
    __extends(SmsWithDataHeader, _super);
    function SmsWithDataHeader(type, text, pid, dcs, csca, number, date, fmt, ref, cnt, seq) {
        var _this = _super.call(this, type, text, pid, dcs, csca, number, date, fmt) || this;
        _this.ref = ref;
        _this.cnt = cnt;
        _this.seq = seq;
        return _this;
    }
    return SmsWithDataHeader;
}(SmsBase));
exports.SmsWithDataHeader = SmsWithDataHeader;
var SmsDeliverPart = (function (_super) {
    __extends(SmsDeliverPart, _super);
    function SmsDeliverPart(text, pid, dcs, csca, number, date, fmt, ref, cnt, seq) {
        return _super.call(this, TP_MTI.SMS_DELIVER, text, pid, dcs, csca, number, date, fmt, ref, cnt, seq) || this;
    }
    return SmsDeliverPart;
}(SmsWithDataHeader));
exports.SmsDeliverPart = SmsDeliverPart;
var SmsDeliver = (function (_super) {
    __extends(SmsDeliver, _super);
    function SmsDeliver(text, pid, dcs, csca, number, date, fmt) {
        return _super.call(this, TP_MTI.SMS_DELIVER, text, pid, dcs, csca, number, date, fmt) || this;
    }
    return SmsDeliver;
}(SmsBase));
exports.SmsDeliver = SmsDeliver;
var SmsStatusReport = (function (_super) {
    __extends(SmsStatusReport, _super);
    function SmsStatusReport(text, pid, dcs, csca, number, date, fmt, ref, cnt, seq, sr) {
        var _this = _super.call(this, TP_MTI.SMS_STATUS_REPORT, text, pid, dcs, csca, number, date, fmt, ref, cnt, seq) || this;
        _this.sr = sr;
        _this._status = (TP_ST[_this.sr.status] !== undefined) ? TP_ST[_this.sr.status] : "RESERVED";
        _this._stClass = stClassOf(_this.sr.status);
        return _this;
    }
    return SmsStatusReport;
}(SmsWithDataHeader));
exports.SmsStatusReport = SmsStatusReport;
var Fmt;
(function (Fmt) {
    Fmt[Fmt["GSM0338"] = 0] = "GSM0338";
    Fmt[Fmt["EIGHT_BIT"] = 4] = "EIGHT_BIT";
    Fmt[Fmt["UCS2"] = 8] = "UCS2";
})(Fmt = exports.Fmt || (exports.Fmt = {}));
var TP_MTI;
(function (TP_MTI) {
    TP_MTI[TP_MTI["SMS_DELIVER"] = 0] = "SMS_DELIVER";
    TP_MTI[TP_MTI["SMS_STATUS_REPORT"] = 2] = "SMS_STATUS_REPORT";
    TP_MTI[TP_MTI["SMS_SUBMIT_REPORT"] = 1] = "SMS_SUBMIT_REPORT"; //Not supported currently
})(TP_MTI = exports.TP_MTI || (exports.TP_MTI = {}));
//03.40.pdf p57
var TP_ST;
(function (TP_ST) {
    TP_ST[TP_ST["COMPLETED_RECEIVED"] = 0] = "COMPLETED_RECEIVED";
    TP_ST[TP_ST["COMPLETED_UNABLE_TO_CONFIRM_DELIVERY"] = 1] = "COMPLETED_UNABLE_TO_CONFIRM_DELIVERY";
    TP_ST[TP_ST["COMPLETED_REPLACED"] = 2] = "COMPLETED_REPLACED";
    TP_ST[TP_ST["STILL_TRYING_CONGESTION"] = 32] = "STILL_TRYING_CONGESTION";
    TP_ST[TP_ST["STILL_TRYING_SME_BUSY"] = 33] = "STILL_TRYING_SME_BUSY";
    TP_ST[TP_ST["STILL_TRYING_NO_RESPONSE_FROM_SME"] = 34] = "STILL_TRYING_NO_RESPONSE_FROM_SME";
    TP_ST[TP_ST["STILL_TRYING_SERVICE_REJECTED"] = 35] = "STILL_TRYING_SERVICE_REJECTED";
    TP_ST[TP_ST["STILL_TRYING_QOS_UNAVAILABLE"] = 36] = "STILL_TRYING_QOS_UNAVAILABLE";
    TP_ST[TP_ST["STILL_TRYING_SME_ERROR"] = 37] = "STILL_TRYING_SME_ERROR";
    TP_ST[TP_ST["PERMANENT_ERROR_REMOTE_PROCEDURE_ERROR"] = 64] = "PERMANENT_ERROR_REMOTE_PROCEDURE_ERROR";
    TP_ST[TP_ST["PERMANENT_ERROR_INCOMPATIBLE_DESTINATION"] = 65] = "PERMANENT_ERROR_INCOMPATIBLE_DESTINATION";
    TP_ST[TP_ST["PERMANENT_ERROR_CONNECTION_REJECTED_BY_SME"] = 66] = "PERMANENT_ERROR_CONNECTION_REJECTED_BY_SME";
    TP_ST[TP_ST["PERMANENT_ERROR_NOT_OBTAINABLE"] = 67] = "PERMANENT_ERROR_NOT_OBTAINABLE";
    TP_ST[TP_ST["PERMANENT_ERROR_QOS_UNAVAILABLE"] = 68] = "PERMANENT_ERROR_QOS_UNAVAILABLE";
    TP_ST[TP_ST["PERMANENT_ERROR_NO_INTERWORKING_AVAILABLE"] = 69] = "PERMANENT_ERROR_NO_INTERWORKING_AVAILABLE";
    TP_ST[TP_ST["PERMANENT_ERROR_SM_VALIDITY_PERIOD_EXPIRED"] = 70] = "PERMANENT_ERROR_SM_VALIDITY_PERIOD_EXPIRED";
    TP_ST[TP_ST["PERMANENT_ERROR_SM_DELETED_BY_ORIGINATING_SME"] = 71] = "PERMANENT_ERROR_SM_DELETED_BY_ORIGINATING_SME";
    TP_ST[TP_ST["PERMANENT_ERROR_SM_DELETED_BY_SC_ADMINISTRATION"] = 72] = "PERMANENT_ERROR_SM_DELETED_BY_SC_ADMINISTRATION";
    TP_ST[TP_ST["PERMANENT_ERROR_SM_DOES_NOT_EXIST"] = 73] = "PERMANENT_ERROR_SM_DOES_NOT_EXIST";
    TP_ST[TP_ST["TEMPORARY_ERROR_CONGESTION"] = 96] = "TEMPORARY_ERROR_CONGESTION";
    TP_ST[TP_ST["TEMPORARY_ERROR_SME_BUSY"] = 97] = "TEMPORARY_ERROR_SME_BUSY";
    TP_ST[TP_ST["TEMPORARY_ERROR_NO_RESPONSE_FROM_SME"] = 98] = "TEMPORARY_ERROR_NO_RESPONSE_FROM_SME";
    TP_ST[TP_ST["TEMPORARY_ERROR_SERVICE_REJECTED"] = 99] = "TEMPORARY_ERROR_SERVICE_REJECTED";
    TP_ST[TP_ST["TEMPORARY_ERROR_QOS_UNAVAILABLE"] = 100] = "TEMPORARY_ERROR_QOS_UNAVAILABLE";
    TP_ST[TP_ST["TEMPORARY_ERROR_SME_ERROR"] = 101] = "TEMPORARY_ERROR_SME_ERROR";
})(TP_ST = exports.TP_ST || (exports.TP_ST = {}));
//All reserved should be interpreted as STILL_TRYING_SERVICE_REJECTED
function stClassOf(st) {
    if (0 <= st && st <= 2)
        return "COMPLETED";
    if (32 <= st && st <= 37)
        return "STILL TRYING";
    if (64 <= st && st <= 73)
        return "PERMANENT ERROR";
    if (96 <= st && st <= 101)
        return "TEMPORARY ERROR";
    if ((128 <= st && st <= 255) ||
        (3 <= st && st <= 15) ||
        (38 <= st && st <= 47) ||
        (74 <= st && st <= 79) ||
        (102 <= st && st <= 105) ||
        (106 <= st && st <= 111))
        return "RESERVED";
    return "SPECIFIC TO SC";
}
function descriptorToInstance(descriptor) {
    switch (descriptor.type) {
        case TP_MTI.SMS_STATUS_REPORT:
            return new SmsStatusReport(descriptor.text, descriptor.pid, descriptor.dcs, descriptor.csca, descriptor.number, descriptor.date, descriptor.fmt, descriptor.ref, descriptor.cnt, descriptor.seq, descriptor.sr);
        case TP_MTI.SMS_DELIVER:
            if (descriptor.hasOwnProperty("ref"))
                return new SmsDeliverPart(descriptor.text, descriptor.pid, descriptor.dcs, descriptor.csca, descriptor.number, descriptor.date, descriptor.fmt, descriptor.ref, descriptor.cnt, descriptor.seq);
            else
                return new SmsDeliver(descriptor.text, descriptor.pid, descriptor.dcs, descriptor.csca, descriptor.number, descriptor.date, descriptor.fmt);
        case TP_MTI.SMS_SUBMIT_REPORT:
            throw new Error("SUBMIT REPORT not supported");
    }
}
//DECODE service center ( SC ) to MS ( mobile station switched on with SIM module )
function decodePdu(pdu, callback) {
    return new Promise(function (resolve, reject) {
        bridge("smsDeliver", { "pdu": pdu }, function (error, obj) {
            if (error) {
                if (callback)
                    callback(error, null);
                else
                    reject(error);
                return;
            }
            ;
            var smsDescriptor = (function parseDate(obj) {
                if (obj.date)
                    obj.date = new Date(obj.date);
                if (obj.type === 2) {
                    if (obj.sr.dt)
                        obj.sr.dt = new Date(obj.sr.dt);
                    if (obj.sr.scts)
                        obj.sr.scts = new Date(obj.sr.scts);
                }
                return obj;
            })(obj);
            var smsInstance = descriptorToInstance(smsDescriptor);
            if (callback)
                callback(null, smsInstance);
            else
                resolve(smsInstance);
        });
    });
}
exports.decodePdu = decodePdu;
function buildSmsSubmitPdus(params, callback) {
    return new Promise(function (resolve, reject) {
        var _a = params, text = _a.text, args = __rest(_a, ["text"]);
        args["text_as_char_code_arr"] = (function strToCodesArray(str) {
            var out = [];
            for (var index = 0; index < str.length; index++)
                out.push(str.charCodeAt(index));
            return out;
        })(text);
        if (params.validity instanceof Date)
            args.validity = params.validity.toUTCString();
        bridge("smsSubmit", args, function (error, pdus) {
            if (callback)
                callback(error, pdus);
            else
                error ? reject(error) : resolve(pdus);
        });
    });
}
exports.buildSmsSubmitPdus = buildSmsSubmitPdus;
var options = {
    "mode": "text",
    "pythonPath": path.join(__dirname, "..", "..", "dist", "virtual", "bin", "python"),
    "pythonOptions": ['-u'],
    "scriptPath": path.join(__dirname, "..", "..", "src", "lib")
};
function bridge(method, args, callback) {
    PythonShell.run("bridge.py", __assign({}, options, { "args": [method, JSON.stringify(args)] }), function (error, out) {
        if (error)
            return callback(error, null);
        callback(null, JSON.parse(out[0]));
    });
}
//# sourceMappingURL=bridge.js.map