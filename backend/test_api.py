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

    def test_home_serves_comparison_ui_without_checkpoints(self):
        response = self.client.get("/")
        try:
            self.assertEqual(response.status_code, 200)
            html = response.get_data(as_text=True)
            self.assertIn('id="gps-compare-search"', html)
            self.assertIn('id="gps-compare-picker"', html)
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

    def test_non_object_body_is_rejected(self):
        response = self.client.post("/api/match", json=["not", "a", "profile"])
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
