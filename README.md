# node-python-messaging

## Motivations:

There is no library available on NPM that reliably encode/decode SMS PDU.
Bad encodings, wrong Date's timezone, PDU types not supported none  
of the modules out there reliably fullfil it's duty.  
On python's ecosystem ``pmarti/python-messaging`` do quite well.
Rather than porting ``python-messaging`` to JS this node module internally
call ``garronej/python-messaging`` and pass back the parsed results.

``garronej/python-messaging`` is a fork of ``pmarti/python-messaging``  
that fix some bugs.

``node-pdu`` is also used as fallback solution in the rare cases when  
``python-messaging`` fail to decode the PDU.

## Drawbacks:

All functions are async, the library is quite long to install,  
will only work on unix systems and python and virtual env need to  
be installed.

## Features:  

This module allow to:
* Build SMS-SUBMIT pdu
* Decode SMS-DELIVER and SMS-STATUS-REPORT pdu.
* Strictly typed via Typescript definitions.

The module provide two function  ``decodePdu`` and ``buildSmsSubmitPdus``

*decodePdu* will decode any PDU originated from service center,
meaning a SMS-DELIVER or a SMS-STATUS-REPORT pdu. ( SMS-SUBMIT-REPORT not supported )

*buildSmsSubmitPdus* will create a SMS-SUBMIT pdu ready to be sent.
If the text is too long to fit in one SMS it will be split among 
multiples pdus.

All the technical specification are described in 3GPP TS 03.40

Original python project: https://github.com/pmarti/python-messaging/
NOTE: The port does not include MMS yet

SMS Features
============

 * Supports 7bit, 8bit and UCS2 encodings
 * Multipart encoding/decoding
 * Status report encoding/decoding
 * Relative validity
 * Alphanumeric address decoding

## Prerequisite:

In order for this module to be installed  
python ( 2.5 up to 3.2 ), pip and virtualenv need to be present on the host.

``npm install garronej/node-python-messaging``

#Usage: 

````javascript

var messaging= require("node-python-messaging");

//Test SMS-DELIVER pdu, 

//Simple SMS
var pdu= "07913306092031F0040B913336766883F500007110125050524002CF35";

messaging.decodePdu(pdu).then((sms)=>{

        if( error ) throw error;

        console.log(sms);

});

//This pdu is part 1 over 3 of a tree part concatenated SMS. => sms.seq===1 && sms.cnt===3
pdu= [
        "07913306091093F0400B913336766883F5000061210181925140A00500031903019",
        "86F79B90D4AC3E7F53688FC66BFE5A0799A0E0AB7CB741668FC76CFCB637A995E97",
        "83C2E4343C3D4F8FD3EE33A8CC4ED359A079990C22BF41E5747DDE7E9341F4721BF",
        "E9683D2EE719A9C26D7DD74509D0E6287C56F791954A683C86FF65B5E06B5C36777",
        "181466A7E3F5B0AB4A0795DDE936284C06B5D3EE741B642FBBD3E1360B14AFA7E7"
].join("");

messaging.decodePdu(pdu).then(sms => {

        if( error ) throw error;

        console.log(sms);

});


//This is a SMS-STATUS-REPORT pdu
pdu= "07913306092021F0066E0B913336766883F5711012505040407110125050504000";

messaging.decodePdu(pdu).then(sms=>{

        if( error ) throw error;

        console.log(sms);

});


/*
Optional parameters:
validity: Date,
csca: String, eg. "+33736786385"
klass: number (in range 0-3)
request_status: boolean (default false)
*/

//In this example the text does not exceed 160 char so you get only one pdu.

messaging.buildSmsSubmitPdus({
        "number": "+33636786385",
        "text": "Mon message é là",
        "validity": new Date(),
        "request_status": true
}).then(pdus=>{

        if( error ) throw error;

        console.log(pdus);

});

````

Output:

````bash
{ 
  csca: '+33609002130',
  sr: null,
  fmt: 0,
  pid: 0,
  number: '+33636786385',
  text: 'Ok',
  date: Sat Jan 21 2017 04:05:25 GMT+0000 (UTC),
  type: 0,
  dcs: 0 
}

{ 
  csca: '+33609001390',
  type: 0,
  seq: 1,
  sr: null,
  fmt: 0,
  pid: 0,
  cnt: 3,
  number: '+33636786385',
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis',
  date: Sat Dec 10 2016 17:29:15 GMT+0000 (UTC),
  ref: 25,
  dcs: 0 
}

{ 
  csca: '+33609002120',
  type: 2,
  seq: 0,
  sr:
   { status: 0,
     scts: Sat Jan 21 2017 05:05:04 GMT+0000 (UTC),
     dt: Sat Jan 21 2017 05:05:05 GMT+0000 (UTC),
     recipient: '+33636786385' },
  fmt: 8,
  pid: null,
  cnt: 0,
  number: 'SR-OK',
  text: '+33636786385|17/01/21 05:05:04|17/01/21 05:05:05',
  date: Sat Jan 21 2017 05:05:04 GMT+0000 (UTC),
  ref: 110,
  dcs: null 
}

[ 
    { 
        pdu: '0039000B913336766883F500007110229092330010CDB71BD42ECFE7E173195400B1FF',
        length: 34,
        seq: 1,
        cnt: 1 
    } 
 ]
````

Contact GitHub API Training Shop Blog About
© 2016 GitHub, Inc. Terms Privacy Security Status Help