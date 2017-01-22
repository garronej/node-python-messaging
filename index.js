var PythonShell = require("python-shell");

var bridge= (function(){

        var options = {
                "mode": 'text',
                "pythonPath": __dirname + "/virtual/bin/python",
                "pythonOptions": ['-u'],
                "scriptPath": __dirname
        };

        return function(method, args, callback){

                PythonShell.run("bridge.py", Object.assign({ 
                        "args": [ method, JSON.stringify(args) ] 
                }, options), function(error, out){

                        if( error ) return callback( error );

                        callback(null, JSON.parse(out[0]));

                });
        };

})();

function smsDeliver(pdu, callback){

        bridge(smsDeliver.name, { "pdu": pdu }, function(error, out){

                if( error ) return callback(error);

                if( out.date ) out.date= new Date(out.date);

                if( out.type === 0b10 ){
                        if( out.sr.dt ) out.sr.dt= new Date(out.sr.dt);
                        if( out.sr.scts ) out.sr.scts= new Date(out.sr.scts);
                }

                callback(null, out);

        });

}

function smsSubmit( args, callback){

        if( args.validity instanceof Date ){

                args.validity= args.validity.toUTCString();

        }


        bridge(smsSubmit.name, args, callback);

}

module.exports= { 
        "smsDeliver": smsDeliver,
        "decodePdu": smsDeliver,
        "smsSubmit": smsSubmit,
        "buildSmsSubmitPdus": smsSubmit
};


