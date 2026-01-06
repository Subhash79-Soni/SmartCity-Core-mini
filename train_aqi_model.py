import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import numpy as np

# 1. Dummy Data Banana (AQI Training ke liye)
# AQI (Output) in cheezon par depend karta hai:
# - Temperature (Temp): Garmi zyada toh pollution kam (gases upar uth jaati hain)
# - Humidity (Humi): Zyada humidity pollution ko ground level par rakhti hai
# - Wind Speed (Wind): Hawa tez toh pollution kam
data = {
    'Temp': [35, 25, 15, 30, 20],  # Temperature in Celsius
    'Humi': [30, 80, 50, 60, 40],  # Humidity %
    'Wind': [15, 5, 8, 10, 12],    # Wind Speed km/h
    'AQI': [80, 150, 100, 120, 90] # Target AQI Value
}
df = pd.DataFrame(data)

# 2. Features aur Target alag karna
X_aqi = df[['Temp', 'Humi', 'Wind']]
y_aqi = df['AQI']

# 3. Model Train karna (Linear Regression)
aqi_model = LinearRegression()
aqi_model.fit(X_aqi, y_aqi)
print("AQI Model Train ho gaya! ✅")

# 4. Model ko save karna
with open('aqi_model.pkl', 'wb') as file:
    pickle.dump(aqi_model, file)
print("AQI Model save ho gaya 'aqi_model.pkl' naam se! 💾")