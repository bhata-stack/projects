# Imports
import numpy as np
import pandas as pd 
import sys
from bs4 import BeautifulSoup
import requests


stock_symbol = str(sys.argv[1]).upper()
statistic = str(sys.argv[2])
data_format = str(sys.argv[3])

valid_symbols = np.loadtxt("python/constituents_symbols.txt", dtype="str", delimiter="\n")

def fin_scraper(symbol, stat, data_format):
    link_fin = "https://finance.yahoo.com/quote/" + symbol + "/financials?p=" + symbol
    headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' }
   
    raw_data = requests.get(link_fin, headers=headers).text
    soup_fin= BeautifulSoup(raw_data, "html.parser")

    storage = []
    for i in soup_fin.find_all('div'):
        storage.append(i.string)

    # Data cleaning
    storage = list(filter(None, storage))
    storage = storage[15:]
    storage[0] = ""
    storage.insert(6, "Total Revenue")

    for i in range(len(storage)):
        storage[i] = storage[i].replace(",", "")
    
    for i in range(0, len(storage), 6):
        abs_storage = storage[i].replace("-", "")
        if abs_storage.isnumeric():
            print(storage[i])
            storage.insert(i, str(i))

    storage = list(zip(*[iter(storage)]*6))


    # Data output

    fin_statement = pd.DataFrame(storage[0:])
    print(fin_statement)
    fin_statement = fin_statement[statistic]
    fin_statement = fin_statement.to_csv()


    return fin_statement

if stock_symbol not in valid_symbols:
    print("Not a valid stock symbol")
    quit()

output = fin_scraper(stock_symbol, statistic, data_format)
print(output)
