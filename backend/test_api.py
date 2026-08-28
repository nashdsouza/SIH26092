import unittest

try:
    from .app import app
    from .test_matcher import base_profile
except ImportError:
    from app import app
    from test_matcher import base_profile


class ApiSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(TESTING=True)
        cls.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "ok")
        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response.headers["X-Frame-Options"], "DENY")

    def test_home_serves_comparison_ui_without_checkpoints(self):
        response = self.client.get("/")
        try:
            self.assertEqual(response.status_code, 200)
            html = response.get_data(as_text=True)
            self.assertIn('id="gps-compare-search"', html)
            self.assertIn('id="gps-compare-picker"', html)
            self.assertIn('id="assistant-launcher"', html)
            self.assertIn('id="assistant-panel"', html)
            self.assertIn('id="assistant-form"', html)
            self.assertIn('id="load-demo-profile"', html)
            self.assertIn('id="how-it-works"', html)
            self.assertIn('class="result-explanation"', html)
            self.assertIn('function runAssistantAutopilot()', html)
            self.assertIn('action: "autopilot"', html)
            self.assertIn('function safeOfficialUrl(value)', html)
            self.assertIn('reducedSummary', html)
            self.assertIn('const comparedResults', html)
            self.assertIn('previousSelectedSchemeId', html)
            self.assertIn('₹20,00,000 loan request', html)
            self.assertNotIn('₹10,00,000 loan request', html)
            self.assertNotIn("gps-checkpoint", html)
            self.assertNotIn("Human checkpoints", html)
        finally:
            response.close()

    def test_match_endpoint_returns_only_actionable_live_results(self):
        response = self.client.post("/api/match", json=base_profile())
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        result_ids = {result["id"] for result in payload["results"]}
        self.assertIn("nssh", result_ids)
        self.assertIn("nsfdc_term_loan", result_ids)
        self.assertNotIn("stand_up_india", result_ids)
        self.assertTrue(all(result["status"] != "NOT ELIGIBLE" for result in payload["results"]))

    def test_gps_endpoint_returns_guidance(self):
        response = self.client.post("/api/gps", json=base_profile(has_business_plan=False))
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertIn("readiness_score", payload)
        self.assertIn("routes", payload)
        self.assertNotIn("checkpoints", payload)

    def test_invalid_json_profile_is_rejected(self):
        response = self.client.post("/api/match", json=base_profile(age="26"))
        self.assertEqual(response.status_code, 400)
        self.assertIn("invalid", response.get_json()["error"].lower())

    def test_out_of_range_profile_values_are_rejected(self):
        for changes in ({"age": 17}, {"age": 121}, {"ownership_sc_st_pct": 101}):
            with self.subTest(changes=changes):
                response = self.client.post("/api/match", json=base_profile(**changes))
                self.assertEqual(response.status_code, 400)

    def test_non_object_body_is_rejected(self):
        response = self.client.post("/api/match", json=["not", "a", "profile"])
        self.assertEqual(response.status_code, 400)

    def test_oversized_payload_is_rejected_as_json(self):
        response = self.client.post(
            "/api/assistant",
            data='{"message":"' + ("x" * 1_100_000) + '"}',
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 413)
        self.assertIn("too large", response.get_json()["error"].lower())

    def test_empty_and_unsupported_profiles_are_rejected(self):
        self.assertEqual(self.client.post("/api/match", json={}).status_code, 400)
        response = self.client.post(
            "/api/match", json=base_profile(business_stage="unknown")
        )
        self.assertEqual(response.status_code, 400)

    def test_assistant_routes_new_users_to_scheme_finder(self):
        response = self.client.post("/api/assistant", json={
            "message": "Which scheme is right for me?",
            "language": "en",
            "has_matches": False,
        })
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(payload["action"]["view"], "matcher")
        self.assertIn("profile", payload["reply"].lower())

    def test_assistant_summarises_grounded_matcher_results(self):
        response = self.client.post("/api/assistant", json={
            "message": "Explain my top scheme matches",
            "profile": base_profile(),
            "has_matches": True,
        })
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertIn("strongest current matches", payload["reply"])
        self.assertIn("PMMY", payload["reply"])
        self.assertIn("official portal", payload["reply"])

    def test_assistant_opens_scheme_comparison_after_matching(self):
        response = self.client.post("/api/assistant", json={
            "message": "Compare my matches",
            "has_matches": True,
        })
        self.assertEqual(response.status_code, 200)
        action = response.get_json()["action"]
        self.assertEqual(action["view"], "gps")
        self.assertEqual(action["target"], "gps-compare-search")

    def test_assistant_understands_localised_match_request(self):
        response = self.client.post("/api/assistant", json={
            "message": "मेरे अच्छे मैच समझाएँ",
            "language": "hi",
            "profile": base_profile(),
            "has_matches": True,
        })
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertIn("सबसे मजबूत मैच", payload["reply"])
        self.assertIn("PMMY", payload["reply"])

    def test_assistant_explains_selected_scheme_from_matcher_output(self):
        response = self.client.post("/api/assistant", json={
            "message": "Why is this a near match?",
            "profile": base_profile(),
            "has_matches": True,
            "selected_scheme_id": "nssh",
        })
        self.assertEqual(response.status_code, 200)
        reply = response.get_json()["reply"]
        self.assertIn("structured eligibility check", reply)
        self.assertIn("National SC-ST Hub", reply)
        self.assertIn("not official approval", reply)

    def test_assistant_uses_selected_scheme_document_checklist(self):
        response = self.client.post("/api/assistant", json={
            "message": "What documents do I need?",
            "profile": base_profile(),
            "has_matches": True,
            "selected_scheme_id": "pmegp",
        })
        self.assertEqual(response.status_code, 200)
        reply = response.get_json()["reply"]
        self.assertIn("Prime Minister's Employment Generation Programme", reply)
        self.assertIn("Aadhaar", reply)
        self.assertIn("stay in your browser", reply)

    def test_assistant_rejects_invalid_payloads(self):
        response = self.client.post("/api/assistant", json={"message": ["not text"]})
        self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/assistant", json={"message": "hello", "profile": []})
        self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/assistant", json={"message": "hello", "language": []})
        self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/assistant", json={"message": "hello", "selected_scheme_id": []})
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
