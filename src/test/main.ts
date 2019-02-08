process.once("unhandledRejection", error => { throw error; });

import { 
        decodePdu, 
        buildSmsSubmitPdus, 
        SmsDeliver,
        SmsDeliverPart,
        SmsStatusReport
} from "../lib/index";

{

//Simple SMS

let pdu_1= "07913306092031F0040B913336766883F500007110125050524002CF35";

let expect= String.raw
`{
  "type": 0,
  "text": "Ok",
  "pid": 0,
  "dcs": 0,
  "csca": "+33609002130",
  "number": "+33636786385",
  "date": "2017-01-21T04:05:25.000Z",
  "fmt": 0,
  "_fmt": "GSM0338",
  "_type": "SMS_DELIVER"
}`;

decodePdu(pdu_1).then(sms=> {

        if( !(sms instanceof SmsDeliver) ) 
                throw new Error("FAIL");


        console.assert(JSON.stringify(sms, null, 2) === expect);

        console.log("PASS_1");

});

}

{

//This pdu is part 1 over 3 of a tree part concatenated SMS. => sms.seq===1 && sms.cnt===3
let pdu= [
        "07913306091093F0400B913336766883F5000061210181925140A00500031903019",
        "86F79B90D4AC3E7F53688FC66BFE5A0799A0E0AB7CB741668FC76CFCB637A995E97",
        "83C2E4343C3D4F8FD3EE33A8CC4ED359A079990C22BF41E5747DDE7E9341F4721BF",
        "E9683D2EE719A9C26D7DD74509D0E6287C56F791954A683C86FF65B5E06B5C36777",
        "181466A7E3F5B0AB4A0795DDE936284C06B5D3EE741B642FBBD3E1360B14AFA7E7"
].join("");

//cSpell: disable
let expect= String.raw
`{
  "type": 0,
  "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis",
  "pid": 0,
  "dcs": 0,
  "csca": "+33609001390",
  "number": "+33636786385",
  "date": "2016-12-10T17:29:15.000Z",
  "fmt": 0,
  "_fmt": "GSM0338",
  "_type": "SMS_DELIVER",
  "ref": 25,
  "cnt": 3,
  "seq": 1
}`;
//cSpell: enable

decodePdu(pdu).then( sms=> {

        if( !(sms instanceof SmsDeliverPart) )
                throw new Error("FAIL");

        console.assert(JSON.stringify(sms, null, 2) === expect);

        console.log("PASS_2");

});

}

{

//This is a SMS-STATUS-REPORT pdu
let pdu= "07913306092021F0066E0B913336766883F5711012505040407110125050504000";

let expect= String.raw
`{
  "type": 2,
  "text": "+33636786385|17/01/21 05:05:04|17/01/21 05:05:05",
  "pid": null,
  "dcs": null,
  "csca": "+33609002120",
  "number": "SR-OK",
  "date": "2017-01-21T04:05:04.000Z",
  "fmt": 8,
  "_fmt": "UCS2",
  "_type": "SMS_STATUS_REPORT",
  "ref": 110,
  "cnt": 0,
  "seq": 0,
  "sr": {
    "status": 0,
    "scts": "2017-01-21T04:05:04.000Z",
    "dt": "2017-01-21T04:05:05.000Z",
    "recipient": "+33636786385"
  },
  "_status": "COMPLETED_RECEIVED",
  "_stClass": "COMPLETED"
}`;

decodePdu(pdu).then(sms=>{

        if( !(sms instanceof SmsStatusReport) )
                throw new Error("FAIL");

        console.assert(JSON.stringify(sms, null, 2) === expect);

        console.log("PASS_3");

});

}

{

//This is a pdu that python-messaging fail to decode.
const pdu = "07913396050066F00403E166F600C8817022607590803ACDF27C1E3E97E5E932C8FE1E87D96590515E2E37DFE234BBAC5358DFF539286C2FEB413190FB5DB797C37550BB3C9F87CF6517";

const expect = String.raw
`{
  "type": 0,
  "text": "Messagerie vocale FreeMobile:\nVous avez 1 nouveau message.",
  "pid": 0,
  "dcs": 200,
  "csca": "+33695000660",
  "number": "666",
  "date": "2018-07-22T06:57:09.000Z",
  "fmt": -1,
  "_fmt": "UNKNOWN",
  "_type": "SMS_DELIVER"
}`;


decodePdu(pdu).then((sms) => {

        if (!(sms instanceof SmsDeliver)) {
                throw new Error("FAIL");
        }

        console.assert(JSON.stringify(sms, null, 2) === expect);

        console.log("PASS_4");

});

}

{

/*
Optional parameters:
validity: Date,
csca: String, eg. "+33736786385"
klass: number (in range 0-3)
request_status: boolean (default false)
*/

//In this example the text does not exceed 160 char so you get only one pdu.

buildSmsSubmitPdus({
        "number": "+33636786385",
        "text": "Mon message é là",
        "validity": new Date(),
        "request_status": true
}).then(pdus=> {

        console.assert(
                pdus.length === 1 &&
                pdus[0].pdu.match(/^[a-zA-Z0-9]*$/) &&
                pdus[0].length === 34 &&
                pdus[0].seq === 1 &&
                pdus[0].cnt === 1
        );

        console.log("PASS_5");

});

}


(async () => {

        /*
        Optional parameters:
        validity: Date,
        csca: String, eg. "+33736786385"
        klass: number (in range 0-3)
        request_status: boolean (default false)
        */

        //In this example the text does not exceed 160 char so you get only one pdu.

        let pdus_4 = await buildSmsSubmitPdus({
                "number": "+33636786385",
                "text": "=>un emoji 🤕!<=",
                "validity": new Date(),
                "request_status": true
        });

        console.assert(
                pdus_4.length === 1 &&
                pdus_4[0].pdu.match(/^[a-zA-Z0-9]*$/) &&
                pdus_4[0].length === 52 &&
                pdus_4[0].seq === 1 &&
                pdus_4[0].cnt === 1
        );

        console.log("PASS_6");

})();
