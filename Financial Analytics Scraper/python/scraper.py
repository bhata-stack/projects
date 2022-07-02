# Imports
from tracemalloc import Statistic
import numpy as np
import pandas as pd 
import sys
from bs4 import BeautifulSoup
import urllib.request as ur


stock_symbol = sys.argv[1]
statistic = sys.argv[2]
format = sys.argv[3]


