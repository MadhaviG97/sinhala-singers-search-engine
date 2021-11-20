from elasticsearch import Elasticsearch
from elasticsearch import helpers
import json
import os
from dotenv import load_dotenv

load_dotenv()
INDEX = os.getenv('INDEX')

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

with open("data/sinhala.json") as f:
   sinhala = json.load(f)

with open("configs/mapping.json") as f:
   mapping = json.load(f)

with open("configs/stopwords.txt") as f:
   stopwords = f.read().strip().split("\n")

def create_index():
    mapping["settings"]["analysis"]["filter"]["stop_filter"]["stopwords"] = stopwords
    try:
        if not es.indices.exists(INDEX):
            es.indices.create(index = INDEX, body = mapping)
    except:
        pass

def upload_data():
    actions = []
    for key in sinhala:
        try:
            actions.append(
            {
                "_index": INDEX,
                "_id": key,
                "_source": sinhala[key]
            }
            )
        except:
            pass
    helpers.bulk(es, actions)

if __name__ == "__main__":
    create_index()
    upload_data()
