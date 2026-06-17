import sys
import json
import joblib
import pandas as pd
import os
import warnings

# Suppress all UserWarnings and technical clutter to ensure clean JSON stdout
warnings.filterwarnings("ignore")

# Set base path for models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LIVER_MODEL_PATH = os.path.join(BASE_DIR, "models/liver_model.pkl")
DIABETES_MODEL_PATH = os.path.join(BASE_DIR, "models/diabetes_model.pkl")

# Load models with standard fault tolerance
try:
    liver_model = joblib.load(LIVER_MODEL_PATH)
    diabetes_model = joblib.load(DIABETES_MODEL_PATH)
except Exception as e:
    print(json.dumps({"status": "error", "message": f"Critical Model Load Failure: {str(e)}"}))
    sys.exit(1)

def predict_liver(data):
    # Feature order MUST match notebook training:
    # age, gender, total_bilirubin, direct_bilirubin, alkaline_phosphotase, alt, ast, total_proteins, albumin, albumin_globulin_ratio
    gender_map = {'male': 1, 'female': 0}
    
    features = {
        'age': float(data.get('age', 0)),
        'gender': gender_map.get(data.get('gender', 'male').lower(), 1),
        'total_bilirubin': float(data.get('totalBilirubin', 0)),
        'direct_bilirubin': float(data.get('directBilirubin', 0)),
        'alkaline_phosphotase': float(data.get('alkalinePhosphotase', 0)),
        'alt': float(data.get('alamineAminotransferase', 0)),
        'ast': float(data.get('aspartateAminotransferase', 0)),
        'total_proteins': float(data.get('totalProteins', 0)),
        'albumin': float(data.get('albumin', 0)),
        'albumin_globulin_ratio': float(data.get('albuminGlobulinRatio', 0))
    }
    
    # Using pandas to match feature names
    X = pd.DataFrame([features])
    prob = liver_model.predict_proba(X)[0][1] # Probability of disease
    prediction = int(liver_model.predict(X)[0])
    
    return {
        "status": "success",
        "prediction": "Disease" if prediction == 1 else "No Disease",
        "probability": float(prob)
    }

def predict_diabetes(data):
    # Feature order MUST match notebook training:
    # Age,Gender,Family_Diabetes,highBP,PhysicallyActive,BMI,Smoking,Alcohol,Sleep,SoundSleep,RegularMedicine,JunkFood,Stress,BPLevel,Pregnancies,Pdiabetes,UriationFreq
    
    # Mappings from diabetes_dataset_logic.ipynb
    age_map = {'less than 40': 0, '40-49': 1, '50-59': 2, '60 or older': 3}
    gender_map = {'male': 1, 'female': 0}
    binary_map = {'yes': 1, 'no': 0, True: 1, False: 0}
    active_map = {'none': 0, 'less than half an hr': 1, 'more than half an hr': 2, 'one hr or more': 3}
    junk_map = {'occasionally': 1, 'often': 2, 'very often': 3, 'always': 4}
    stress_map = {'not at all': 0, 'sometimes': 1, 'very often': 2, 'always': 3}
    bp_map = {'low': 0, 'normal': 1, 'high': 2}
    urination_map = {'quite often': 1, 'not much': 0}

    features = {
        'Age': age_map.get(data.get('ageGroup'), 0),
        'Gender': gender_map.get(data.get('gender', 'male').lower(), 1),
        'Family_Diabetes': binary_map.get(data.get('familyDiabetes'), 0),
        'highBP': binary_map.get(data.get('highBP'), 0),
        'PhysicallyActive': active_map.get(data.get('physicallyActive'), 0),
        'BMI': float(data.get('bmi', 0)),
        'Smoking': binary_map.get(data.get('smoking'), 0),
        'Alcohol': binary_map.get(data.get('alcohol'), 0),
        'Sleep': float(data.get('sleepHours', 0)),
        'SoundSleep': float(data.get('soundSleep', 0)),
        'RegularMedicine': binary_map.get(data.get('regularMedicine'), 0),
        'JunkFood': junk_map.get(data.get('junkFood', 'occasionally'), 1),
        'Stress': stress_map.get(data.get('stress', 'not at all'), 0),
        'BPLevel': bp_map.get(data.get('bpLevel', 'normal'), 1),
        'Pregnancies': float(data.get('pregnancies', 0)),
        'Pdiabetes': binary_map.get(data.get('prediabetes'), 0),
        'UriationFreq': urination_map.get(data.get('urinationFreq', 'not much'), 0)
    }
    
    # Using pandas for inference instead of numpy to ensure feature names match training
    X = pd.DataFrame([features])
    prob = diabetes_model.predict_proba(X)[0][1] # Probability of disease
    prediction = int(diabetes_model.predict(X)[0])
    
    return {
        "status": "success",
        "prediction": "Diabetic" if prediction == 1 else "Not Diabetic",
        "probability": float(prob)
    }


if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            print(json.dumps({"status": "error", "message": "Missing arguments"}))
            sys.exit(1)
            
        service_type = sys.argv[1] # 'liver' or 'diabetes'
        input_data = json.loads(sys.argv[2])
        
        if service_type == 'liver':
            sys.stdout.write(json.dumps(predict_liver(input_data)))
        elif service_type == 'diabetes':
            sys.stdout.write(json.dumps(predict_diabetes(input_data)))
        else:
            sys.stdout.write(json.dumps({"status": "error", "message": "Unknown service type"}))
            
    except Exception as e:
        sys.stdout.write(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
