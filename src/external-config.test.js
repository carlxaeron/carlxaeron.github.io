import { SKILLS } from "./external-config";

const EXPECTED_YEARS = {
  "Javascript (JS)": "14",
  ReactJS: "4",
  "NodeJS (Backend)": "3",
  VueJS: "4",
  "Mobile Development": "2",
  Flutter: "2",
  "React Native": "2",
  PHP: "13",
  Laravel: "10",
  "SQL (MYSQL)": "10",
  "CSS/CSS3": "14",
  "HTML/HTML5": "14",
  "Git/SVN": "12",
};

describe("SKILLS experience years", () => {
  test.each(Object.entries(EXPECTED_YEARS))(
    "%s is %s years",
    (name, years) => {
      const skill = SKILLS.find((entry) => entry.name === name);
      expect(skill).toBeDefined();
      expect(skill.experience).toBe(years);
    }
  );
});
