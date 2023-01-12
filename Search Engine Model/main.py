import json
from elasticsearch import Elasticsearch
from flask import Flask, request

app = Flask(__name__)
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

@app.route('/indexDB', methods = ['PUT'])
def getRequest():
    data = request.json
    try:
        result = es.search(index="sw", body={"query": {"match": {'description': data["description"]}}})
        # print(result)
        val = result["hits"]["hits"]
        if(not(len(val))):
            return ("",204)
        print(val)
        val.sort(key=lambda x : x["_score"], reverse=True)
        output = []
        for line in val:
            output.append({"description": line["_source"]["description"],"heading": line["_source"]["heading"], "username": line["_source"]["username"]})
        return (json.dumps(output),200)
    except:
        return ("",204)


@app.route('/indexDB',methods = ['POST'])
def postRequest():
    data = request.json
    es.index(index='sw', doc_type='people', id=data['id'], body=data)
    return ""

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)