import React, { useState } from 'react';

interface ManualModelInputProps {
  provider: 'openrouter' | 'groq' | 'openai' | 'anthropic' | 'gemini';
  value: string;
  onChange: (model: string) => void;
  presets?: string[];
}

export const ManualModelInput: React.FC<ManualModelInputProps> = ({
  provider,
  value,
  onChange,
  presets = []
}) => {
  const [useCustom, setUseCustom] = useState(false);

  const defaultPresets: Record<string, string[]> = {
    openrouter: [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'meta-llama/llama-3.3-70b-instruct',
      'google/gemini-pro-1.5',
      'mistralai/mistral-large'
    ],
    groq: [
      'llama-3.3-70b-versatile',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ],
    openai: [
      'gpt-4o',
      'gpt-4-turbo',
      'gpt-3.5-turbo'
    ],
    anthropic: [
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307'
    ],
    gemini: [
      'gemini-2.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest'
    ]
  };

  const availablePresets = presets.length > 0 ? presets : (defaultPresets[provider] || []);

  return (
    <div style={styles.container}>
      <div style={styles.toggle}>
        <button
          onClick={() => setUseCustom(false)}
          style={{
            ...styles.toggleButton,
            ...(useCustom ? {} : styles.toggleButtonActive)
          }}
        >
          📋 Use Presets
        </button>
        <button
          onClick={() => setUseCustom(true)}
          style={{
            ...styles.toggleButton,
            ...(useCustom ? styles.toggleButtonActive : {})
          }}
        >
          ✏️ Custom Model
        </button>
      </div>

      {useCustom ? (
        <div style={styles.customInput}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${provider} model name (e.g., ${availablePresets[0] || 'model-name'})`}
            style={styles.input}
          />
          <div style={styles.hint}>
            💡 Enter any model available on {provider}. Check their documentation for model names.
          </div>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.select}
        >
          <option value="">Select a model...</option>
          {availablePresets.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: '1rem'
  },
  toggle: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  toggleButton: {
    flex: 1,
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#94A3B8',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toggleButtonActive: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    color: '#3B82F6'
  },
  customInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    cursor: 'pointer'
  },
  hint: {
    fontSize: '0.8rem',
    color: '#94A3B8',
    fontStyle: 'italic'
  }
};

export default ManualModelInput;