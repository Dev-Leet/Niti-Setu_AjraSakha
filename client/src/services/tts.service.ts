import apiClient from './api';

export const ttsService = {
  async speak(text: string, language: 'en' | 'hi' | 'mr' | 'ta' = 'en'): Promise<Blob> {
    const response = await apiClient.post('/tts/speak', { text, language }, {
      responseType: 'blob',
    });
    return response.data;
  },

  async playAudio(text: string, language: 'en' | 'hi' | 'mr' | 'ta' = 'en'): Promise<void> {
    const audioBlob = await this.speak(text, language);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = reject;
      audio.play();
    });
  },
};