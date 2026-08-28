import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.exceptions import RequestEntityTooLarge

from assistant import answer_assistant
from matcher import build_yojana_gps, match_profile


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1_000_000
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"


@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.errorhandler(RequestEntityTooLarge)
def payload_too_large(_error):
    return jsonify({"error": "Request is too large. Send only the profile fields needed for this check."}), 413


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


@app.post("/api/assistant")
def assistant_chat():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "error": "Send a JSON assistant request in the request body."
        }), 400

    message = payload.get("message", "")
    profile = payload.get("profile")
    language = payload.get("language", "en")
    selected_scheme_id = payload.get("selected_scheme_id")
    if not isinstance(message, str) or len(message) > 1000:
        return jsonify({
            "error": "The assistant message must be text up to 1000 characters."
        }), 400
    if profile is not None and not isinstance(profile, dict):
        return jsonify({
            "error": "The assistant profile must be a JSON object."
        }), 400
    if not isinstance(language, str):
        return jsonify({
            "error": "The assistant language must be text."
        }), 400
    if selected_scheme_id is not None and not isinstance(selected_scheme_id, str):
        return jsonify({
            "error": "The selected scheme identifier must be text."
        }), 400

    try:
        return jsonify(answer_assistant(
            message,
            language=language,
            profile=profile,
            has_matches=bool(payload.get("has_matches", False)),
            selected_scheme_id=selected_scheme_id,
        ))
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "The saved profile contains invalid values. Review it in Scheme Finder."
        }), 400


if __name__ == "__main__":
    debug_enabled = os.environ.get("FLASK_DEBUG", "").strip().lower() in {"1", "true", "yes"}
    app.run(host="127.0.0.1", port=5001, debug=debug_enabled, use_reloader=debug_enabled)
