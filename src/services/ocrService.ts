import { createWorker } from 'tesseract.js';

interface OCRResult {
  text: string;
  engine: 'Tesseract' | 'OCR.space';
  error?: string;
}

export class OCRService {
  private static instance: OCRService;
  private readonly apiKey = import.meta.env.VITE_OCR_SPACE_API_KEY;

  private constructor() { }

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  private async ocrSpaceProcess(imageFile: File): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': this.apiKey
        },
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OCR processing failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage || 'OCR processing failed');
      }

      const extractedText = result.ParsedResults?.[0]?.ParsedText;
      if (!extractedText) {
        throw new Error('No text extracted from image');
      }

      return { text: extractedText, engine: 'OCR.space' };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error occurred');
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('OCR processing error:', errorMessage);
      return { text: '', engine: 'OCR.space', error: errorMessage };
    }
  }

  private async tesseractProcess(imageFile: File): Promise<OCRResult> {
    try {
      const worker = await createWorker('eng');
      const imageUrl = URL.createObjectURL(imageFile);

      const { data } = await worker.recognize(imageUrl);
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No text could be extracted from the image');
      }

      return { text: data.text, engine: 'Tesseract' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Tesseract processing error:', errorMessage);
      return { text: '', engine: 'Tesseract', error: errorMessage };
    }
  }

  public async processImage(imageFile: File, forceTesseract = false): Promise<OCRResult> {
    if (forceTesseract || !this.apiKey) {
      console.log('Using Tesseract.js for OCR processing');
      return await this.tesseractProcess(imageFile);
    }

    // try {
    const result = await this.ocrSpaceProcess(imageFile);
    if (result.error) {
      console.warn('OCR.space failed/error, falling back to Tesseract.js:', result.error);
      return await this.tesseractProcess(imageFile);
    }
    return result;
    // } catch (error) { ... } // remove catch since we handle result.error
  }
}

export default OCRService;
