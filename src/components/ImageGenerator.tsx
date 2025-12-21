import React, { useState } from 'react';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  model: 'dall-e-3' | 'gemini-imagen';
}

interface ImageGeneratorProps {
  openaiApiKey?: string;
  geminiApiKey?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  openaiApiKey,
  geminiApiKey
}) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9'>('1:1');
  const [model, setModel] = useState<'dall-e-3' | 'gemini-imagen'>('dall-e-3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image prompt');
      return;
    }

    if (model === 'dall-e-3' && !openaiApiKey) {
      setError('OpenAI API key required for DALL-E 3');
      return;
    }

    if (model === 'gemini-imagen' && !geminiApiKey) {
      setError('Gemini API key required for Imagen');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      if (model === 'dall-e-3') {
        await generateWithDallE();
      } else {
        await generateWithGemini();
      }
    } catch (err: any) {
      setError(err.message || 'Image generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithDallE = async () => {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: aspectRatio === '1:1' ? '1024x1024' : '1792x1024',
        quality: 'hd'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'DALL-E generation failed');
    }

    const data = await response.json();
    const newImages: GeneratedImage[] = data.data.map((img: any) => ({
      url: img.url,
      prompt,
      timestamp: Date.now(),
      model: 'dall-e-3'
    }));

    setGeneratedImages(prev => [...newImages, ...prev]);
  };

  const generateWithGemini = async () => {
    // Gemini Imagen API implementation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{
          prompt: prompt
        }],
        parameters: {
          sampleCount: numImages,
          aspectRatio: aspectRatio === '1:1' ? '1:1' : '16:9'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gemini Imagen generation failed');
    }

    const data = await response.json();
    const newImages: GeneratedImage[] = data.predictions.map((pred: any) => ({
      url: `data:image/png;base64,${pred.bytesBase64Encoded}`,
      prompt,
      timestamp: Date.now(),
      model: 'gemini-imagen'
    }));

    setGeneratedImages(prev => [...newImages, ...prev]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎨 SOTA Image Generator</h2>
        <p style={styles.subtitle}>Create high-quality images with DALL-E 3 or Gemini Imagen</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.field}>
          <label style={styles.label}>Image Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want in detail..."
            style={styles.textarea}
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>AI Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              style={styles.select}
              disabled={isGenerating}
            >
              <option value="dall-e-3">DALL-E 3 (OpenAI)</option>
              <option value="gemini-imagen">Gemini Imagen</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Number of Images</label>
            <input
              type="number"
              min={1}
              max={4}
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value))}
              style={styles.input}
              disabled={isGenerating || model === 'dall-e-3'}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              style={styles.select}
              disabled={isGenerating}
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Landscape)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          style={styles.generateButton}
        >
          {isGenerating ? '⏳ Generating...' : '🚀 Generate Images'}
        </button>

        {error && (
          <div style={styles.error}>{error}</div>
        )}
      </div>

      {generatedImages.length > 0 && (
        <div style={styles.gallery}>
          <h3 style={styles.galleryTitle}>Generated Images ({generatedImages.length})</h3>
          <div style={styles.grid}>
            {generatedImages.map((img, idx) => (
              <div key={`${img.timestamp}-${idx}`} style={styles.imageCard}>
                <img src={img.url} alt={img.prompt} style={styles.image} />
                <div style={styles.imageInfo}>
                  <div style={styles.imagePrompt}>{img.prompt}</div>
                  <div style={styles.imageMeta}>
                    <span>{img.model}</span>
                    <span>{new Date(img.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = img.url;
                      link.download = `generated-${img.timestamp}.png`;
                      link.click();
                    }}
                    style={styles.downloadButton}
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.95rem'
  },
  controls: {
    background: 'rgba(12, 12, 16, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  field: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#E2E8F0'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
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
  generateButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1rem'
  },
  error: {
    marginTop: '1rem',
    padding: '0.75rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#EF4444',
    fontSize: '0.9rem'
  },
  gallery: {
    marginTop: '2rem'
  },
  galleryTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#E2E8F0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  imageCard: {
    background: 'rgba(12, 12, 16, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  imageInfo: {
    padding: '1rem'
  },
  imagePrompt: {
    fontSize: '0.9rem',
    color: '#E2E8F0',
    marginBottom: '0.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  imageMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#94A3B8',
    marginBottom: '0.75rem'
  },
  downloadButton: {
    width: '100%',
    padding: '0.5rem',
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '6px',
    color: '#3B82F6',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default ImageGenerator;