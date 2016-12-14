import sys
import json


def smsDeliver(args):

    from messaging.sms import SmsDeliver

    sms= SmsDeliver(args["pdu"]).data.copy()

    sms["date"]= str(sms["date"]) 

    return sms

def smsSubmit(args):

    from messaging.sms import SmsSubmit
    from datetime import datetime

    sms= SmsSubmit(args["number"], args["text"])

    if "csca" in args:
        sms._set_csca(args["csca"])

    if "validity" in args:
        sms._set_validity(datetime.strptime(args["validity"], "%a, %d %b %Y %H:%M:%S %Z"))

    if "klass" in args:
        sms._set_klass(args["klass"])

    out= []

    for pdu in sms.to_pdu():
        out.append(pdu.__dict__)

    return out

    
    

method= sys.argv[1]
args= json.loads(sys.argv[2])
out= {}

if method == "smsDeliver":
    out= smsDeliver(args)
elif method == "smsSubmit":
    out= smsSubmit(args)
else:
    out= {}


print json.dumps(out)

