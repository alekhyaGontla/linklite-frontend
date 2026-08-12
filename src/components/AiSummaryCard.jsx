import { useState } from 'react';
import aiApi from '../services/aiApi';

export default function AiSummaryCard({ linkData }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.post('/ai/summarize-link', { shortId: linkData.shortCode });
      setSummary(response.data.summary);
    } catch (err) {
      console.error('AI summary request failed:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold mb-0">✨ AI Link Insights</h6>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="btn btn-primary btn-sm"
        >
          {loading ? 'Analyzing...' : 'Generate Summary'}
        </button>
      </div>

      {error && <p className="text-danger small mt-2 mb-0">{error}</p>}

      {summary && (
        <div className="mt-3 p-3 bg-white rounded border small" style={{ whiteSpace: 'pre-line' }}>
          {summary}
        </div>
      )}
    </div>
  );
}
