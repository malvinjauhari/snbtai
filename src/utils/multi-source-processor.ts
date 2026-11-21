import Tesseract from 'tesseract.js';

const MAX_TEXT_LENGTH = 8000;

export interface FileData {
  name: string;
  type: string;
  data: string;
  isImage: boolean;
}

export const extractTextFromImage = async (imageDataUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const { data: { text } } = await Tesseract.recognize(
      blob,
      'ind+eng',
      { logger: () => {} }
    );
    return text || '';
  } catch (error: any) {
    console.error('OCR error:', error);
    // Suppress unhandled rejection by returning empty string safely
    return '';
  }
};

const cleanText = (text: string): string => {
  return text
    .replace(/[^\w\s\d.,;:!?()\-+=\/*%$@#&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const processMultipleFiles = async (
  files: FileData[], 
  onProgress?: (current: number, total: number) => void
): Promise<string> => {
  if (!files || files.length === 0) return '';

  const extractionPromises = files.map(async (file, index) => {
    try {
      let extractedText = '';

      if (file.isImage) {
        extractedText = await extractTextFromImage(file.data);
      }

      if (onProgress) onProgress(index + 1, files.length);

      return {
        index,
        name: file.name,
        text: cleanText(extractedText)
      };
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      return {
        index,
        name: file.name,
        text: ''
      };
    }
  });

  const results = await Promise.all(extractionPromises);

  let combinedText = '';
  results.forEach((result, idx) => {
    if (result.text) {
      combinedText += `\n\n=== SUMBER ${idx + 1}: ${result.name} ===\n${result.text}`;
    }
  });

  if (combinedText.length > MAX_TEXT_LENGTH) {
    combinedText = combinedText.substring(0, MAX_TEXT_LENGTH) + '\n\n[Teks dipotong untuk efisiensi token]';
  }

  return combinedText.trim();
};

export const generateMultiSourcePrompt = (combinedText: string, sourceCount: number): string => {
  return `
=== MULTI-SOURCE INPUT (${sourceCount} SUMBER) ===

Anda menerima teks dari ${sourceCount} sumber berbeda (hasil OCR).
Setiap sumber dipisahkan dengan marker "=== SUMBER X ===".

TUGAS ANDA:
1. **Sintesis Informasi**: Hubungkan informasi dari semua sumber untuk memahami konsep yang utuh
2. **Identifikasi Pola**: Cari pola soal dominan di antara semua sumber
3. **Variasi Isomorfik**: Buat soal baru dengan logika gabungan, tapi narasi dan angka baru
4. **Formatting**: Output JSON valid dengan format bebas menggunakan bahasa Indonesia yang santai. Jangan lupa gunakan LaTeX murni secara presisi jika ada rumus.

CRITICAL RULES:
- JANGAN copy-paste nama, angka, atau skenario dari input
- WAJIB ubah konteks tapi pertahankan logika (isomorfik)
- Gunakan LaTeX dengan TEPAT DUA backslash (\\\\frac, \\\\circ)
- Escape tanda petik dengan \\" (satu backslash)

INPUT TEKS:
${combinedText}
`;
};
