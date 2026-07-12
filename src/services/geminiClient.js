/**
 * @fileoverview Client service for communicating with the serverless Gemini API endpoint.
 */

/**
 * Sends a prompt to the server-side Gemini API.
 * @param {string} prompt - The prompt text to process
 * @returns {Promise<string>} The generated response text
 * @throws {Error} If the server returns an error or is unreachable
 */
export async function generateText(prompt) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      let errMsg = `HTTP Error ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errMsg = errJson.error;
        }
      } catch (_) {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (!data || typeof data.text !== 'string') {
      throw new Error('Invalid response payload from serverless function');
    }

    return data.text;
  } catch (error) {
    console.error('geminiClient.generateText error:', error);
    throw error;
  }
}

/**
 * Verifies the safety evacuation passcode via the serverless verification endpoint.
 * @param {string} passcode - The passcode to verify
 * @returns {Promise<boolean>} Whether the passcode is valid
 */
export async function verifyPasscode(passcode) {
  try {
    const response = await fetch('/api/verify-passcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ passcode })
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return !!(data && data.valid);
  } catch (error) {
    console.error('geminiClient.verifyPasscode error:', error);
    return false;
  }
}
