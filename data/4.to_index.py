from elasticsearch import Elasticsearch
from elasticsearch import helpers
import json

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

f = open('sinhala.json')
sinhala = json.load(f)
f.close()

actions = []
for key in sinhala:
    try:
        actions.append(
        {
            "_index": "singers",
            "_id": key,
            "_source": {
                "body": sinhala[key]}
        }
        )
    except:
        pass

helpers.bulk(es, actions)