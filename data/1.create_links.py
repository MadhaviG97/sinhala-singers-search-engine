from math import sin
import requests as req
from bs4 import BeautifulSoup
import pandas as pd
import wikipedia

singers = []
links = []

'''
FMDearana singers
'''
FM_DEARANA_ULR = 'http://www.fmderana.lk/sri-lankan-artists'
WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'
res = req.get(FM_DEARANA_ULR)
soup = BeautifulSoup(res.text, 'lxml')
derana_singers_list = soup.find_all('img', {'class':'img-fluid w-100'})[1:]
count = 0
for singer in derana_singers_list:
    name = singer['alt'].strip()
    res_API = wikipedia.search(name)
    if len(res_API)!=0:    
        if res_API[0]==name:
            URL = WIKIPEDIA_URL+name
            res_singer = req.get(URL)
            soup = BeautifulSoup(res_singer.text, 'lxml')
            isExist = soup.find('div', {'class':'toc'})
            if isExist != None:
                singers.append(name)
                links.append(URL)
        else:
            count+=1
    else:
        count+=1

print(len(singers), len(links))

'''
Wikipedia singers
'''
Wikipedia_singers_URL = 'https://en.wikipedia.org/wiki/List_of_Sri_Lankan_musicians'
res = req.get(Wikipedia_singers_URL)
soup = BeautifulSoup(res.text, 'lxml')
derana_wikipedia_list = soup.find_all('h2')
WIKIPEDIA_HOME_URL = 'https://en.wikipedia.org'

for letter in derana_wikipedia_list:
    list_items = letter.find_next_sibling().findChildren()
    for li in list_items:
        link = li.find('a')
        if link!=None:
            if link['href'] == '/wiki/Special:MyTalk':
                break
            
            singers.append(link['title'])
            links.append(WIKIPEDIA_HOME_URL+link['href'])

singers = set(singers)
singers = pd.DataFrame(singers)
singers.to_csv('singers.csv')

links = set(links)
links = pd.DataFrame(links)
links.to_csv('links.csv')
print(len(singers), len(links))