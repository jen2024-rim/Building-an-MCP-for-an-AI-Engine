# Computer Engineering Course Planner MCP Server

An MCP (Model Context Protocol) server that helps Computer Engineering students organize their courses, check prerequisites, and generate a suggested semester plan — powered by an AI assistant.

---

## 📌 Overview

Many Computer Engineering students struggle with planning their academic path, understanding course prerequisites, and choosing suitable courses for each semester. This project provides a set of MCP tools that let an AI assistant help students:

- Search Computer Engineering course information
- Check prerequisites before registering for a course
- Track completed courses
- Generate a simplified suggested semester plan based on progress and preferences

The system uses stored course and student data in JSON files — no external database or university API integration is required.

---

## 💡 Example Use Case

> **Student:** "I completed Data Structures and Computer Architecture. What courses can I take next semester with around 15 credits, and I prefer AI and Networks courses?"

The AI assistant uses the Course Planner MCP server to:
1. Check the student's completed courses
2. Verify prerequisites for candidate courses
3. Search available courses matching the preferred categories
4. Generate a recommended semester plan

**Output:** A list of recommended courses with credits, categories, and short explanations for each pick.

---

## 🛠️ Tools

| Tool | Description | Inputs | Output | Priority |
|------|-------------|--------|--------|----------|
| `search_courses` | Search for Computer Engineering courses and return detailed information about matching courses. | Course name, code, or category keyword | Course details (code, credits, level, category, prerequisites, description) | P0 |
| `check_prerequisites` | Check whether a student can take a specific course based on completed courses. | Course name/code, completed courses list | Eligibility result + missing prerequisites (if any) | P0 |
| `generate_study_plan` | Generate a simplified suggested semester plan based on student progress and preferences. | Credit limit, preferred categories, completed courses | Recommended courses with total credits | P0 |
| `list_completed_courses` | Display courses the student has already completed. | Student information | List of completed courses | P1 |
| `list_remaining_courses` | Display courses the student still needs to complete. | Student information, course catalog | List of remaining courses | P1 |
| `add_course_to_plan` | Add a selected course to the student's planned semester courses. | Course name/code | Updated planned courses list | P1 |

---

## 🗂️ Data Model

Data is stored in JSON files (no external database).

### `courses.json`
Stores Computer Engineering course information:
- Course code
- Course name
- Credits
- Academic level/year
- Category (AI, Hardware, Networks, Software, Elective, University Requirement)
- Course type (Core/Elective)
- Prerequisites
- Course description

### `student.json`
Stores student progress information:
- Completed courses
- Planned courses

---

## 🚫 Out of Scope

- Official university registration system
- Connecting to university databases or external APIs
- Supporting all university majors
- Web or mobile application
- User authentication and accounts
- Automatic official graduation requirement calculation

---

## ✅ Demo Day Success Criteria

- [ ] The AI assistant can search and return accurate information about Computer Engineering courses from stored data.
- [ ] The AI assistant can check course prerequisites and explain whether a student can take a specific course.
- [ ] The AI assistant can generate a simple semester plan based on student progress, credit limit, and preferred course categories.

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Creating a complete and accurate Computer Engineering curriculum dataset may take a lot of time. | Start with a simplified dataset containing the most important courses and expand if time allows. |
| Study plan generation logic may become complex. | Implement a simple rule-based recommendation system using prerequisites, credits, and course categories. |

---

## 📦 Project Status

This project is part of the **NxtFlows Academy — "Building an MCP for an AI Engine"** training cohort.

---
