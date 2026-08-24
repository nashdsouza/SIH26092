import json
from pathlib import Path


SCHEMES_PATH = Path(__file__).with_name("schemes.json")


def load_schemes():
    """Load the scheme catalogue from schemes.json."""
    with open(SCHEMES_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def evaluate_rule(profile, rule):
    """Check whether one rule passes for a user profile."""
    actual = profile.get(rule["field"])
    expected = rule["value"]
    operator = rule["op"]

    if actual is None:
        return False

    if operator == "eq":
        return actual == expected
    if operator == "in":
        return actual in expected
    if operator == "gt":
        return actual > expected
    if operator == "gte":
        return actual >= expected
    if operator == "lte":
        return actual <= expected

    raise ValueError(f"Unsupported operator: {operator}")


def evaluate_condition(profile, condition):
    """Evaluate an all/any group used by a conditional rule."""
    if "all" in condition:
        return all(evaluate_rule(profile, rule) for rule in condition["all"])

    if "any" in condition:
        return any(evaluate_rule(profile, rule) for rule in condition["any"])

    raise ValueError("Condition must contain 'all' or 'any'.")


def evaluate_scheme(profile, scheme):
    """Return one scheme's status and human-readable explanation."""
    hard_failures = []

    for rule in scheme.get("hard_rules", []):
        if not evaluate_rule(profile, rule):
            hard_failures.append(rule["message"])

    conditional_failures = []

    for conditional_rule in scheme.get("conditional_rules", []):
        if evaluate_condition(profile, conditional_rule["when"]):
            for requirement in conditional_rule["requirements"]:
                if not evaluate_rule(profile, requirement):
                    conditional_failures.append(requirement["message"])

    soft_matches = []

    for rule in scheme.get("soft_rules", []):
        if evaluate_rule(profile, rule):
            soft_matches.append(rule)

    soft_score = sum(rule.get("weight", 1) for rule in soft_matches)
    failures = hard_failures + conditional_failures

    if not failures and scheme.get("requires_manual_verification", False):
        status = "NEAR MATCH"
        summary = scheme["manual_verification_message"]
    elif not failures:
        status = "ELIGIBLE"
        summary = "All modelled hard and conditional checks passed."
    elif len(failures) == 1 and soft_score >= 2:
        status = "NEAR MATCH"
        summary = "Potential fit, but the listed item needs confirmation before applying."
    else:
        status = "NOT ELIGIBLE"
        summary = "One or more mandatory checks did not pass."
    return {
        "name": scheme["name"],
        "status": status,
        "summary": summary,
        "failures": failures,
        "soft_matches": [rule["message"] for rule in soft_matches],
        "official_url": scheme["official_url"]
    }


def match_profile(profile):
    """Match one entrepreneur profile against every scheme."""
    catalogue = load_schemes()
    results = []

    for scheme in catalogue["schemes"]:
        results.append(evaluate_scheme(profile, scheme))

    return results


def print_results(results):
    """Print a simple terminal report."""
    for result in results:
        print(f"\n[{result['status']}] {result['name']}")
        print(f"  {result['summary']}")

        for failure in result["failures"]:
            print(f"  - Check: {failure}")

        for signal in result["soft_matches"]:
            print(f"  - Signal: {signal}")

        print(f"  Verify: {result['official_url']}")


SAMPLE_ENTREPRENEUR_PROFILE = {
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
    "is_artisan_or_craftsperson": True,
    "trade": "embroidery",
    "work_type": "traditional_craft",
    "is_self_employed": True,
    "family_member_already_enrolled_in_pmv": False,
    "is_government_employee_or_family_member": False
}


if __name__ == "__main__":
    print("Yojana Disha — isolated matcher demo")
    results = match_profile(SAMPLE_ENTREPRENEUR_PROFILE)
    print_results(results)