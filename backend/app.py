from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from matcher import build_yojana_gps, match_profile


app = Flask(__name__)
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"


@app.get("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "service": "Yojana Disha matcher API"
    })


@app.post("/api/match")
def match_schemes():
    profile = request.get_json(silent=True)

    if not isinstance(profile, dict):
        return jsonify({
            "error": "Send a JSON entrepreneur profile in the request body."
        }), 400

    results = match_profile(profile)

    return jsonify({
        "profile_received": profile,
        "results": results
    })


@app.post("/api/gps")
def yojana_gps():
    profile = request.get_json(silent=True)

    if not isinstance(profile, dict):
        return jsonify({
            "error": "Send a JSON entrepreneur profile in the request body."
        }), 400

    return jsonify(build_yojana_gps(profile))


if __name__ == "__main__":
    app.run(debug=True, port=5001)
