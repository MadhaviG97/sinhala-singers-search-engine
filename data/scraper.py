from math import sin
import requests as req
from bs4 import BeautifulSoup
from googletrans import Translator
from google.transliteration import transliterate_word
import wikipedia
import json
import pandas as pd
import re

translator = Translator()

links = pd.read_csv('links.csv')['0'].values

def remove_sinhala(string):
    i=0
    for letter in string:
        if ord(letter)>3000:
            break
        i+=1

    string = string[:i].strip()
    return string
document = {}
for link in links[:5]:
    res = req.get(link)
    soup = BeautifulSoup(res.text, 'lxml')

    bio = soup.find('table', {'class':'biography'}) or soup.find('table', {'class':'infobox vcard plainlist'})
    if bio!=None:
        name = soup.find('h1', {'id':'firstHeading'}).text
        name = remove_sinhala(name)
        print(name)
        
        summary = bio.find_next_sibling().text
        if summary.strip() == 'Musical artist':
            summary = wikipedia.page(name).summary

        name = transliterate_word(name, lang_code='si')[0]
        details = {'name': name}

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
                    details[field] = genre_list

                elif field=='Birth' or field=='Born':
                    year = re.findall(r'\b\d+\b', td.text)
                    year = list(map(int, year))
                    year = max(year) if len(year)>0 else '-'
                    details['Birth'] = year

        summary = translator.translate(summary, dest='si', src='en').text
        details['summary'] = summary
        document[name] = details

with open('data.json', 'w') as outfile:
    json.dump(document, outfile)