from flask import Flask, render_template, jsonify, send_from_directory, request, session, redirect, url_for
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt 
import pandas as pd
import numpy as np
import pickle
from datetime import datetime
import random
import os

app = Flask(__name__)

# --- CONFIGURATION ---
app.secret_key = "secret_key_bana_lo_koi_bhi" 
# Ensure MongoDB Compass/Server is running on port 27017
app.config["MONGO_URI"] = "mongodb://localhost:27017/wavespsai" 

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
DATASET_FOLDER = 'datasets'

# Folder check (Create datasets folder if not exists)
if not os.path.exists(DATASET_FOLDER):
    os.makedirs(DATASET_FOLDER)

# --- MONGODB CONNECTION CHECK ---
try:
    # Ek dummy command run karke check karte hain
    mongo.cx.server_info()
    print("✅ MongoDB Connected Successfully to 'wavespsai' database!")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    print("Make sure MongoDB Community Server is running!")

# --- LOAD ML MODELS ---
print("Loading ML Models...")
try:
    with open('traffic_model.pkl', 'rb') as f:
        traffic_model = pickle.load(f)
    with open('aqi_model.pkl', 'rb') as f:
        aqi_model = pickle.load(f)
    with open('energy_model.pkl', 'rb') as f:
        energy_model = pickle.load(f)
    print("✅ All Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Some models could not be loaded. Running in Demo Mode. Error: {e}")
    traffic_model, aqi_model, energy_model = None, None, None

# ==========================================
#  MAIN ROUTES
# ==========================================
@app.route('/')
def home():
    # Make sure 'index.html' is inside 'templates' folder
    return render_template('index.html') 

@app.route('/indexing')
def premium_page():
    # Make sure 'indexing.html' is inside 'templates' folder
    return render_template('indexing.html')

# ==========================================
#  API ROUTES (Backend Logic)
# ==========================================

# 1. LIVE PREDICTION
@app.route('/api/live-prediction')
def predict_live():
    now = datetime.now()
    current_hour = now.hour
    current_day = now.weekday()

    # Traffic Prediction
    if traffic_model:
        try:
            input_data = pd.DataFrame({'hour': [current_hour], 'day_of_week': [current_day]})
            pred_traffic = traffic_model.predict(input_data)[0]
        except:
            pred_traffic = 1200 # Fallback
    else:
        pred_traffic = 1200 

    # AQI Prediction
    mock_temp = 30 + random.uniform(-5, 5)
    mock_humi = 50 + random.uniform(-10, 10)
    mock_wind = 10 + random.uniform(-2, 2)
    
    if aqi_model:
        try:
            # Note: Ensure columns match exactly what model was trained on
            input_aqi = pd.DataFrame([[mock_temp, mock_humi, mock_wind]], columns=['Temp', 'Humi', 'Wind'])
            pred_aqi = aqi_model.predict(input_aqi)[0]
        except:
            pred_aqi = 150
    else:
        pred_aqi = 150 

    # Energy Prediction
    if energy_model:
        try:
            input_energy = pd.DataFrame({'hour': [current_hour]})
            pred_energy = energy_model.predict(input_energy)[0]
        except:
            pred_energy = 85.5
    else:
        pred_energy = 85.5 

    return jsonify({
        'traffic': int(pred_traffic),
        'aqi': int(pred_aqi),
        'energy': round(float(pred_energy), 2),
        'hour': current_hour,
        'status': 'AI Live'
    })

# 2. SIGNUP (MongoDB Logic)
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    users = mongo.db.users 
    
    existing_user = users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'message': 'Email already exists!', 'status': 'error'})

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    users.insert_one({
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password,
        'created_at': datetime.now()
    })

    return jsonify({'message': 'Account created successfully!', 'status': 'success'})

# 3. LOGIN (MongoDB Logic)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    users = mongo.db.users
    
    login_user = users.find_one({'email': data['email']})

    if login_user and bcrypt.check_password_hash(login_user['password'], data['password']):
        session['user'] = login_user['name']
        return jsonify({'message': 'Login Successful!', 'status': 'success', 'redirect': '/indexing'})
    
    return jsonify({'message': 'Invalid Email or Password', 'status': 'error'})

# 4. CONTACT
@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    messages = mongo.db.messages 

    messages.insert_one({
        'name': data['name'],
        'email': data['email'],
        'message': data['message'],
        'date': datetime.now()
    })

    return jsonify({'message': 'Message Sent to Command Center!', 'status': 'success'})

# 5. DATA DOWNLOAD
@app.route('/download/<filename>')
def download_file(filename):
    try:
        return send_from_directory(DATASET_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        return "File not found!", 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)