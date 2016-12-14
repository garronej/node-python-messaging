var PythonShell = require('python-shell');

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

                out.date= new Date(out.date);

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
        "smsSubmit": smsSubmit
};


