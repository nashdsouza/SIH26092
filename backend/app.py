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

    # Only return actionable matches to the client. The matcher still evaluates
    # every active catalogue entry internally so GPS simulations can discover
    # honest ways to improve a profile.
    try:
        results = [
            result for result in match_profile(profile)
            if result["status"] != "NOT ELIGIBLE"
        ]
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Some profile values are invalid. Check age, income, project cost and loan amount."
        }), 400

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

    try:
        return jsonify(build_yojana_gps(profile))
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Some profile values are invalid. Check age, income, project cost and loan amount."
        }), 400


if __name__ == "__main__":
    app.run(debug=True, port=5001)
