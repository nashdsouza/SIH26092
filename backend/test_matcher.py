import unittest

try:
    from .matcher import load_schemes, match_profile
except ImportError:
    from matcher import load_schemes, match_profile


def base_profile(**overrides):
    profile = {
        "is_indian_citizen": True,
        "age": 26,
        "social_category": "SC",
        "annual_family_income_inr": 450000,
        "state": "Maharashtra",
        "location_type": "urban",
        "education_level": 10,
        "business_stage": "new",
        "project_sector": "service",
        "business_sector": "service",
        "project_cost_inr": 600000,
        "requested_loan_amount_inr": 500000,
        "has_capital_expenditure": True,
        "has_availed_government_subsidy_for_this_unit": False,
        "is_bank_defaulter": False,
        "has_business_plan": True,
        "is_artisan_or_craftsperson": False,
        "trade": "embroidery",
        "work_type": "traditional_craft",
        "is_self_employed": True,
        "family_member_already_enrolled_in_pmv": False,
        "is_government_employee_or_family_member": False,
        "gender": "Other",
        "ownership_sc_st_pct": 100,
        "has_udyam_registration": True,
        "previous_loan_repaid_successfully": False,
        "shg_membership": False,
        "sanitation_worker_profiled": False,
        "vehicle_use": "commercial",
    }
    profile.update(overrides)
    return profile


class MatcherRegressionTests(unittest.TestCase):
    def statuses(self, profile):
        return {
            result["id"]: result
            for result in match_profile(profile)
            if result["status"] != "NOT ELIGIBLE"
        }

    def test_superseded_and_announced_rows_never_enter_live_results(self):
        results = self.statuses(base_profile())
        self.assertNotIn("stand_up_india", results)
        self.assertNotIn("first_timer_2cr", results)

    def test_sc_profile_gets_sc_routes_and_not_st_routes(self):
        results = self.statuses(base_profile())
        self.assertIn("nssh", results)
        self.assertIn("nsfdc_term_loan", results)
        self.assertIn("pm_daksh", results)
        self.assertIn("vcf_sc", results)
        self.assertNotIn("nstfdc_term_loan", results)
        self.assertNotIn("vcf_st", results)

    def test_st_profile_gets_st_routes_and_not_sc_routes(self):
        results = self.statuses(
            base_profile(
                social_category="ST",
                project_cost_inr=300000,
                shg_membership=True,
                business_sector="food",
                project_sector="manufacturing",
                location_type="rural",
            )
        )
        self.assertIn("nstfdc_term_loan", results)
        self.assertIn("nstfdc_mcs", results)
        self.assertIn("pmjvm_van_dhan", results)
        self.assertIn("vcf_st", results)
        self.assertNotIn("nsfdc_term_loan", results)
        self.assertNotIn("vcf_sc", results)

    def test_nsfdc_product_bands_do_not_overlap_incorrectly(self):
        small = self.statuses(base_profile(project_cost_inr=100000))
        large = self.statuses(base_profile(project_cost_inr=600000))
        self.assertIn("nsfdc_micro_finance", small)
        self.assertNotIn("nsfdc_term_loan", small)
        self.assertIn("nsfdc_term_loan", large)
        self.assertNotIn("nsfdc_micro_finance", large)

    def test_amsy_requires_st_woman_and_small_project(self):
        woman = self.statuses(
            base_profile(
                social_category="ST",
                gender="Woman",
                project_cost_inr=150000,
            )
        )
        man = self.statuses(
            base_profile(
                social_category="ST",
                gender="Man",
                project_cost_inr=150000,
            )
        )
        self.assertIn("nstfdc_amsy", woman)
        self.assertNotIn("nstfdc_amsy", man)

    def test_mudra_tarun_plus_requires_previous_tarun_repayment(self):
        without_repayment = self.statuses(
            base_profile(requested_loan_amount_inr=1500000)
        )
        with_repayment = self.statuses(
            base_profile(
                requested_loan_amount_inr=1500000,
                previous_loan_repaid_successfully=True,
            )
        )
        self.assertNotIn("pmmy", without_repayment)
        self.assertEqual(with_repayment["pmmy"]["status"], "ELIGIBLE")

    def test_invalid_numeric_input_is_rejected(self):
        with self.assertRaises(ValueError):
            match_profile(base_profile(project_cost_inr=-1))
        with self.assertRaises(ValueError):
            match_profile(base_profile(age="26"))

    def test_active_schemes_have_comparison_metadata(self):
        active_schemes = [
            scheme for scheme in load_schemes()["schemes"]
            if scheme.get("catalogue_status", "ACTIVE") == "ACTIVE"
        ]
        self.assertTrue(active_schemes)
        for scheme in active_schemes:
            with self.subTest(scheme=scheme["id"]):
                self.assertTrue(scheme.get("short_name"))
                self.assertTrue(scheme.get("purpose"))
                self.assertTrue(scheme.get("official_url"))


if __name__ == "__main__":
    unittest.main()
