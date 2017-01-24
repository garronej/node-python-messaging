import sys
import json

from datetime import datetime
import time as _time


def smsDeliver(args):

    from messaging.sms import SmsDeliver

    sms= SmsDeliver(args["pdu"]).data.copy()

    if sms["date"] != None:
        sms["date"]= str(sms["date"])

    if sms["type"] == 0b10:
        if sms["sr"]["dt"] != None:
            sms["sr"]["dt"]= str(sms["sr"]["dt"])
        if sms["sr"]["scts"] != None:
            sms["sr"]["scts"]= str(sms["sr"]["scts"])

    return sms

def smsSubmit(args):

    from messaging.sms import SmsSubmit
    from datetime import datetime

    sms= SmsSubmit(args["number"], args["text"])

    if "csca" in args:
        sms.csca= args["csca"]

    if "validity" in args:
        sms.validity= datetime.strptime(args["validity"], "%a, %d %b %Y %H:%M:%S %Z")

    if "klass" in args:
        sms.klass= args["klass"]
        
    if "request_status" in args:
        sms.request_status= args["request_status"]

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