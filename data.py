import pandas as pd 
import matplotlib.pyplot as plt 
data = pd.read_csv('C:/Users/mvpro/Desktop/salma/python/data using phones.csv')
print(data.head())
data.fillna(method='ffill', inplace=True) 
