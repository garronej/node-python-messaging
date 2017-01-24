var messaging= require("../../out/lib/index");

//Test SMS-DELIVER pdu, 

//Set timezone
messaging.setTimeZone("Europe/Paris");

//Simple SMS
pdu= "07913306092031F0040B913336766883F500007110125050524002CF35";

messaging.decodePdu(pdu, function(error, sms){

        if( error ) throw error;

        console.log(sms);

});

//This pdu is part 1 over 3 of a tree part concatenated SMS. => sms.seq===1 && sms.cnt===3
var pdu= [
        "07913306091093F0400B913336766883F5000061210181925140A00500031903019",
        "86F79B90D4AC3E7F53688FC66BFE5A0799A0E0AB7CB741668FC76CFCB637A995E97",
        "83C2E4343C3D4F8FD3EE33A8CC4ED359A079990C22BF41E5747DDE7E9341F4721BF",
        "E9683D2EE719A9C26D7DD74509D0E6287C56F791954A683C86FF65B5E06B5C36777",
        "181466A7E3F5B0AB4A0795DDE936284C06B5D3EE741B642FBBD3E1360B14AFA7E7"
].join("");

messaging.decodePdu(pdu, function(error, sms){

        if( error ) throw error;

        console.log(sms);

});


//This is a SMS-STATUS-REPORT pdu
pdu= "07913306092021F0066E0B913336766883F5711012505040407110125050504000";

messaging.decodePdu(pdu, function(error, sms){

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
}, function(error, pdus){

        if( error ) throw error;

        console.log(pdus);

});
