from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all routes and allow all headers
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*"}})

# Load YOLO model
model = YOLO("pothole.pt")

# # Create directory for saving images
# SAVE_DIR = "detected_potholes"
# os.makedirs(SAVE_DIR, exist_ok=True)

SAVE_DIR = "../detected_potholes"
os.makedirs(SAVE_DIR, exist_ok=True)

first_pothole_detected = False


@app.route('/detect', methods=['POST', 'OPTIONS'])
def detect_pothole():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        
        if not data or 'image_path' not in data:
            return jsonify({'error': 'No image path provided'}), 400
        
        image_path = data['image_path']
        
        if not os.path.exists(image_path):
            return jsonify({'error': f'Image file not found at path: {image_path}'}), 404
        
        # Read image
        img = cv2.imread(image_path)
        
        if img is None:
            return jsonify({'error': 'Failed to load image'}), 400
        
        # Convert to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Detect potholes
        results = model.predict(source=rgb_img, conf=0.7, imgsz=640, verbose=False)
        
        pothole_detected = False
        
        for result in results:
            if len(result.boxes) > 0:
                pothole_detected = True
                break
        
        return jsonify({"pothole_detected": pothole_detected})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/stream', methods=['GET'])
def stream_video():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    if (url == "0"):
        url = int(url)
    def generate_frames():
        global first_pothole_detected
        cap = cv2.VideoCapture(url)

        if not cap.isOpened():
            yield (b'--frame\r\n'
                   b'Content-Type: text/plain\r\n\r\n'
                   b'Error: Unable to open the video stream\r\n\r\n')
            return

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Perform inference using YOLO
            results = model.predict(source=frame, conf=0.7, imgsz=640, verbose=False)

            for result in results:
                boxes = result.boxes
                for box in boxes:
                    confidence = box.conf[0]
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    class_id = int(box.cls[0])
                    label = f"{model.names[class_id]}: {confidence:.2f}"

                    # Draw bounding boxes and labels
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                    if not first_pothole_detected:
                        # Save the first pothole frame
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        save_path = os.path.join(SAVE_DIR, f"pothole_{timestamp}.jpg")
                        cv2.imwrite(save_path, frame)
                        first_pothole_detected = True

            # Encode the frame as JPEG and yield it
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        cap.release()

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/reset', methods=['POST'])
def reset_detection():
    global first_pothole_detected
    first_pothole_detected = False
    return jsonify({"message": "Pothole detection reset."}), 200


@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    



# if __name__ == "__main__":
#     app.run(host="0.0.0.0", debug=True, port=3000)
