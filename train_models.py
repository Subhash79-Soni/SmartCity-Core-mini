import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression

# Folder setup
if not os.path.exists('datasets'):
    os.makedirs('datasets')

print("🚀 Starting AI Model Training Process...")

# ==========================================
# 1. TRAFFIC MODEL (Pattern: Office Hours = High Traffic)
# ==========================================
print("\n[1/3] Training Traffic Model...")

# Generate Data
data_size = 1000
hours = np.random.randint(0, 24, data_size)
days = np.random.randint(0, 7, data_size) # 0=Mon, 6=Sun

traffic_volume = []
for h, d in zip(hours, days):
    base = 500
    # Peak hours: 8-10 AM and 5-8 PM
    if (8 <= h <= 10) or (17 <= h <= 20):
        base += 1500
    # Day effect: Weekends (5,6) have less traffic
    if d >= 5:
        base -= 400
    
    # Random noise
    traffic_volume.append(base + np.random.randint(-200, 200))

df_traffic = pd.DataFrame({'hour': hours, 'day_of_week': days, 'traffic': traffic_volume})
df_traffic.to_csv('datasets/traffic_data.csv', index=False) # CSV Save

# Train Model
X = df_traffic[['hour', 'day_of_week']]
y = df_traffic['traffic']
traffic_model = RandomForestRegressor(n_estimators=100)
traffic_model.fit(X, y)

# Save Model
with open('traffic_model.pkl', 'wb') as f:
    pickle.dump(traffic_model, f)
print("✅ Traffic Model Saved!")


# ==========================================
# 2. AQI MODEL (Pattern: Temp/Wind affect Air Quality)
# ==========================================
print("\n[2/3] Training AQI Model...")

# Generate Data
temps = np.random.uniform(20, 45, data_size)
humidity = np.random.uniform(30, 90, data_size)
wind = np.random.uniform(0, 20, data_size)

aqi_values = []
for t, h, w in zip(temps, humidity, wind):
    # Logic: High Temp + Low Wind = High Pollution (AQI)
    base_aqi = 100 + (t * 2) - (w * 3)
    aqi_values.append(base_aqi + np.random.randint(-20, 20))

df_aqi = pd.DataFrame({'Temp': temps, 'Humi': humidity, 'Wind': wind, 'AQI': aqi_values})
df_aqi.to_csv('datasets/aqi_data.csv', index=False)

# Train Model
X_aqi = df_aqi[['Temp', 'Humi', 'Wind']]
y_aqi = df_aqi['AQI']
aqi_model = LinearRegression()
aqi_model.fit(X_aqi, y_aqi)

# Save Model
with open('aqi_model.pkl', 'wb') as f:
    pickle.dump(aqi_model, f)
print("✅ AQI Model Saved!")


# ==========================================
# 3. ENERGY MODEL (Pattern: Night = Low, Day = High)
# ==========================================
print("\n[3/3] Training Energy Model...")

# Generate Data
energy_consumption = []
for h in hours:
    # Logic: More energy used during day (ACs, Factories)
    base_load = 50
    if 9 <= h <= 18:
        base_load += 60
    energy_consumption.append(base_load + np.random.randint(-10, 10))

df_energy = pd.DataFrame({'hour': hours, 'consumption': energy_consumption})
df_energy.to_csv('datasets/energy_data.csv', index=False)

# Train Model
X_energy = df_energy[['hour']]
y_energy = df_energy['consumption']
energy_model = RandomForestRegressor(n_estimators=50)
energy_model.fit(X_energy, y_energy)

# Save Model
with open('energy_model.pkl', 'wb') as f:
    pickle.dump(energy_model, f)
print("✅ Energy Model Saved!")

print("\n🎉 All Models & Datasets Ready! Ab app.py run karo.")