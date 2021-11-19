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
    return {
        "multi_match": {
            "query": query,
            "fields": [
                "document.name",
                "document.summary",
                "document.genres"
            ]
        }
    }

def wildCardQuery(query):
    return {
        "dis_max" : {
            "queries" : [
                {"wildcard" : { "document.name" : {"value" : query}}},
                {"wildcard" : { "document.summary" : {"value" : query}}},
                {"wildcard" : { "document.genres" : {"value" : query}}}
            ]
        } 
    }

def suggestion(query):
    return {
        "suggestions" : {
            "text" : query,
            "term" : [
                {"field" : "document.genres"},
                {"field" : "document.summary"}
            ]
        }
    }

def genreFilter(genre):
    return {
        "term" : {"document.genres": genre}
    }

def yearFilter(start, end):
    return {
        "range": {
            "document.birth": {
                "gte": start,
                "lte": end
            }
        }
    }

def generalSearch(query, page=1):
    must = preProcess(query)

    res = es.search(
        index=INDEX, body=
            {
                "from": (page-1)*MAX_COUNT+1,
                "size": MAX_COUNT,
                "query": {
                    "bool": {
                        "must": must
                    }
                },
                "suggest": suggestion(query)
            }
    )
    return postProcess(res)

def filterBy(query, genre=None, start=None, end=None, page=1):
    must = preProcess(query)

    res = es.search(
        index=INDEX, body=
            {
                "from": (page-1)*MAX_COUNT+1,
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
               "from": (page-1)*MAX_COUNT+1,
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
                "from": (page-1)*MAX_COUNT+1,
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
                "query": {
                    "match_all": {}
                },
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "document.genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return {"genres": res["aggregations"]['genres']['buckets']}

def allActiveYears():
    res = es.search(
        index=INDEX, size=0, body=
            {
                "query": {
                    "match_all": {}
                },
                "aggs": {
                    "birth": {
                        "terms": {
                            "field": "document.birth",
                            "size": 100
                        }
                    }
                }
            }
    )
    return {"active-years": res["aggregations"]['birth']['buckets']}

def postProcess(response):
    hits = response["hits"]["hits"]
    totalCount = response["hits"]["total"]["value"]
    search_results = []
    for hit in hits:
        singer = hit["_source"]["document"]
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
