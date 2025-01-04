# from flask import Flask, request, jsonify
# from flask_cors import CORS , cross_origin
# import cv2
# import numpy as np
# from ultralytics import YOLO
# import os
# from datetime import datetime

# app = Flask(__name__)
# # Enable CORS for all routes
# CORS(app)

# # Load YOLO model
# model = YOLO("pothole.pt")

# # Create directory for saving images
# SAVE_DIR = "detected_potholes"
# os.makedirs(SAVE_DIR, exist_ok=True)

# @app.route('/detect', methods=['POST'])
# def detect_pothole():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400
    
#     file = request.files['image']
#     # Read image
#     nparr = np.frombuffer(file.read(), np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
#     # Convert to RGB
#     rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
#     # Detect potholes
#     results = model.predict(source=rgb_img, conf=0.7, imgsz=640, verbose=False)
    
#     pothole_detected = False
    
#     for result in results:
#         if len(result.boxes) > 0:
#             pothole_detected = True
#             timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#             save_path = os.path.join(SAVE_DIR, f"pothole_{timestamp}.jpg")
            
#             for box in result.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
#                 cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
#             cv2.imwrite(save_path, img)
#             break
    
#     return jsonify({"pothole_detected": pothole_detected})

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO
import os
from datetime import datetime

app = Flask(__name__)
CORS(app ,resources={r"/*": {"origins": "*"}})

# Load the YOLO model 
model = YOLO("pothole.pt")  # Replace with the correct model path

SAVE_DIR = "detected_potholes"
os.makedirs(SAVE_DIR, exist_ok=True)

first_pothole_detected = False

@app.route('/stream', methods=['GET'])
def stream_video():
    def generate_frames():
        global first_pothole_detected
        cap = cv2.VideoCapture("http://172.16.0.14:8080/video")  # Replace with the actual stream URL

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
    app.run(host="0.0.0.0",debug=True, port=3000)
