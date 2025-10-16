import json, urllib.request, urllib.error
url='http://127.0.0.1:8000/api/auth/register/'
data={'email':'failtest2@example.com','password':'password123','name':'Fail Test','phone':'1234567890'}
body=json.dumps(data).encode('utf-8')
req=urllib.request.Request(url, data=body, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req) as r:
        print('STATUS', r.status)
        print(r.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    try:
        print(e.read().decode('utf-8'))
    except Exception as ex:
        print('Could not read error body:', ex)
except Exception as ex:
    print('Request failed:', ex)
