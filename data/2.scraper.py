import requests as req
from bs4 import BeautifulSoup
import wikipedia
import json
import pandas as pd
import re
from elasticsearch import Elasticsearch
import uuid

es = Elasticsearch()

links = pd.read_csv('links.csv')['0'].values

def remove_sinhala(string):
    i=0
    for letter in string:
        if ord(letter)>=2949:
            break
        i+=1

    string = string[:i].strip()
    return string

def filter_by_char(letter):
    if ord(letter)>= 2949:
        return False
    return True

document = {}
for link in links[:]:
    res = req.get(link)
    soup = BeautifulSoup(res.text, 'lxml')

    bio = soup.find('table', {'class':'biography'}) or soup.find('table', {'class':'infobox vcard plainlist'})
    if bio!=None:
        name = soup.find('h1', {'id':'firstHeading'}).text
        name = remove_sinhala(name)
        details = {
            "name": name,
            "genres": [],
            "birth": "None",
            "summary": ""            
        }
        try:
            summary = wikipedia.page(name).summary
        except:
            summary = bio.find_next_sibling().text
        summary = ''.join(filter(filter_by_char, summary))
        details["summary"] = summary
        
        for tr in bio.find_all('tr'):
            th, td = tr.th, tr.td
            if th!=None and td!=None:
                field = th.text
                if field == 'Genres':
                    genres = td.find('div')
                    genre_list = []
                    if genres!=None:
                        genres = genres.find('ul').find_all('li')
                        for i in genres:
                            genre_list.append(i.text.strip().lower())
                    details["genres"] = genre_list

                elif field=='Birth' or field=='Born':
                    year = re.findall(r'\b\d+\b', td.text)
                    year = list(map(int, year))
                    year = max(year) if (len(year)>0 and len(year)<3000) else None
                    details["birth"] = year

        
        document[str(uuid.uuid4())] = details
        print(name)

with open('english.json', 'w') as outfile:
    json.dump(document, outfile)