# node-python-messaging

Port of the python-messaging library for node. 
Encode and decode SMS pdu, including multipart messages!

Require python ( 2.5 up to 3.2 ), virtualenv and pip

NOTE: The port does not include MMS yet.

Original python project: https://github.com/pmarti/python-messaging/

SMS Features
============

 * Supports 7bit, 8bit and UCS2 encodings
 * Multipart encoding/decoding
 * Status report encoding/decoding
 * Relative validity
 * Alphanumeric address decoding

Contact GitHub API Training Shop Blog About
© 2016 GitHub, Inc. Terms Privacy Security Status Help

#Usage: 

see example/test.js

````javascript

var messaging= require("../index");

/*
This is part 1 of a 3 part message
*/

var pdu= [
        "07913306091093F0400B913336766883F5000061210181925140A00500031903019",
        "86F79B90D4AC3E7F53688FC66BFE5A0799A0E0AB7CB741668FC76CFCB637A995E97",
        "83C2E4343C3D4F8FD3EE33A8CC4ED359A079990C22BF41E5747DDE7E9341F4721BF",
        "E9683D2EE719A9C26D7DD74509D0E6287C56F791954A683C86FF65B5E06B5C36777",
        "181466A7E3F5B0AB4A0795DDE936284C06B5D3EE741B642FBBD3E1360B14AFA7E7"
].join("");

messaging.smsDeliver(pdu, function(error, sms){

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

messaging.smsSubmit({
        "number": "+33636786385",
        "text": "Mon message é là",
        "validity": new Date(),
        "request_status": true
}, function(error, pdus){

        if( error ) throw error;

        console.log(pdus);

});

````

Output:

````bash

{ 
  csca: '+33609001390',
  type: null,
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

[ 
    { 
        pdu: '0039000B913336766883F500007110122045130010CDB71BD42ECFE7E173195400B1FF', 
        length: 34, 
        seq: 1, 
        cnt: 1 
     } 
]

````



