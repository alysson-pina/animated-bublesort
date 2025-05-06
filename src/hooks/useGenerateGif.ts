import html2canvas from 'html2canvas';
import GIF from 'gif.js';

export default function useGifCapture() {
  const captureAnimation = async (componentRef: React.RefObject<HTMLDivElement | null>, duration = 4000, frameRate = 50): Promise<{ url: string, download: (filename?: string) => void}> => {
    if (!componentRef.current) return;
    
    const workerUrl = await getGifWorkerUrl();
    const frames = [];
    const frameDelay = 1000 / frameRate;
    const startTime = Date.now();
    
    // Capture frames
    while (Date.now() - startTime < duration) {
      const canvas = await html2canvas(componentRef.current);
      frames.push(canvas);
      await new Promise(r => setTimeout(r, frameDelay));
    }
    
    // Create GIF
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: workerUrl,
      width: componentRef.current.offsetWidth,
      height: componentRef.current.offsetHeight
    });
    
    frames.forEach(canvas => {
      gif.addFrame(canvas, { delay: frameDelay });
    });
    
    return new Promise((resolve) => {
      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        
        const download = (filename = 'animation.gif') => {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Clean up after download
          setTimeout(() => URL.revokeObjectURL(url), 100);
        };

        resolve({ url, download });
      });
      gif.render();
    });
  };

  return captureAnimation;
}


async function getGifWorkerUrl(): Promise<string> {
  try {
    // Method 1: Try to load from node_modules
    const workerPath = new URL('gif.js/dist/gif.worker.js', import.meta.url).href;
    const response = await fetch(workerPath);
    
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    // Method 2: Fallback to public directory
    const publicWorkerUrl = '/gif.worker.js';
    const publicResponse = await fetch(publicWorkerUrl);
    
    if (publicResponse.ok) {
      const blob = await publicResponse.blob();
      return URL.createObjectURL(blob);
    }
    
    throw new Error('GIF worker not found');
  } catch (error) {
    console.error('Failed to load GIF worker:', error);
    throw error;
  }
}
