// lib/api.js
const API_BASE_URL = 'http://localhost:8000';

export async function submitDiagnosis(answers) {
  // Transform frontend answers to backend format
  const requestData = {
    session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    q1_hair_struggles: answers[1] || [], // array from multi-select
    q2_tangled: answers[2] || '', // string from mcq
    q3_scalp_vibe: answers[3] || '', // string from mcq
    q4_hair_habits: answers[4] || [], // array from multi-select
    q5_dream_goal: answers[5] || '', // string from mcq
    q6_effort_level: answers[6] || '', // string from mcq
  };

  try {
    const response = await fetch(`${API_BASE_URL}/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting diagnosis:', error);
    throw error;
  }
}

export async function getQuestionsFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
}