import re
from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()
INDEX = os.getenv('INDEX')
MAX_COUNT = 20

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

def mustQuery(query):
    if query[0]=="\"" and query[-1]=="\"":
        query = query[1:-1]
        
        return {
            "multi_match": {
                "query": query.strip(),
                "fields": [
                    "name",
                    "summary",
                    "genres"
                ],
                "type": "phrase"
            }
        }

    return {
        "multi_match": {
            "query": query.strip(),
            "fields": [
                "name",
                "summary",
                "genres"
            ]
        }
    }

def wildCardQuery(query):
    return {
        "dis_max" : {
            "queries" : [
                {"wildcard" : { "name" : {"value" : query}}},
                {"wildcard" : { "summary" : {"value" : query}}},
                {"wildcard" : { "genres" : {"value" : query}}}
            ]
        } 
    }

def suggestion(query):
    return {
        "suggestions" : {
            "text" : query,
            "term" : [
                {"field" : "genres"},
                {"field" : "summary"}
            ]
        }
    }

def genreFilter(genre):
    return {
        "term" : {"genres": genre}
    }

def yearFilter(start, end):
    return {
        "range": {
            "birth": {
                "gte": start,
                "lte": end
            }
        }
    }

def generalSearch(query, page=1):
    must = preProcess(query)

    body = {
                "from": (page-1)*MAX_COUNT,
                "size": MAX_COUNT,
                "query": {
                    "bool": {
                        "must": [must]
                    }
                },
                "suggest": suggestion(query)
            }
    print(body)

    res = es.search(
        index=INDEX, body=body
    )
    return postProcess(res)

def filterBy(query, genre=None, start=None, end=None, page=1):
    must = preProcess(query)

    res = es.search(
        index=INDEX, body=
            {
                "from": (page-1)*MAX_COUNT,
                "size": MAX_COUNT,
                "query": {
                    "bool": {
                        "must": must,
                        "filter": [
                            genreFilter(genre=genre), 
                            yearFilter(start=start, end=end)
                        ]
                    }
                },
                "suggest": suggestion(query)
            }
    )
    return postProcess(res)

def filterByGenre(query, genre=None, page=1):
    must = preProcess(query)

    res = es.search(
        index=INDEX, body=
            {
               "from": (page-1)*MAX_COUNT,
                "size": MAX_COUNT,
                "query": {
                    "bool": {
                        "must": must,
                        "filter": genreFilter(genre=genre)
                    }
                },
                "suggest": suggestion(query)
            }
    )
    return postProcess(res)

def filterByActiveYear(query, start=None, end=None, page=1):
    must = preProcess(query)
    res = es.search(
        index=INDEX, body=
            {
                "from": (page-1)*MAX_COUNT,
                "size": MAX_COUNT,
                "query": {
                    "bool": {
                        "must": must,
                        "filter": yearFilter(start, end)
                    }
                },
                "suggest": suggestion(query)
            }
    )
    return postProcess(res)

def allGenres():
    res = es.search(
        index=INDEX, size=0, body=
            {
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return {"genres": res["aggregations"]['genres']['buckets']}

def postProcess(response):

    hits = response["hits"]["hits"]
    totalCount = response["hits"]["total"]["value"]
    search_results = []
    for hit in hits:
        singer = hit["_source"]
        search_results.append(singer)

    suggest = ""
    if totalCount==0:
        if len(response["suggest"]["suggestions"][0]["options"])!=0:
            suggest = response["suggest"]["suggestions"][0]["options"][0]["text"]

    return {"totalCount": totalCount, "documents": search_results, "suggest": suggest}

def preProcess(request):
    if isWildCardQuery(request):
        return wildCardQuery(request)
    else:
        return mustQuery(query=request)

def isWildCardQuery(request):
    if "*" in request:
        return True
    return False
