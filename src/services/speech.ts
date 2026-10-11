// Voice speech synthesis service for Aura two-way voice conversations

class AuraSpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private autoSpeak: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setAutoSpeak(enabled: boolean) {
    this.autoSpeak = enabled;
  }

  public getAutoSpeak(): boolean {
    return this.autoSpeak;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      force?: boolean;
    }
  ): void {
    if (!this.synth) return;

    if (!this.autoSpeak && !options?.force) {
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of quotes and special characters for natural voice
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural, crisp voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
         v.name.includes('Natural') ||
         v.name.includes('Samantha') ||
         v.name.includes('Karen') ||
         v.name.includes('Victoria') ||
         v.name.includes('Serena'))
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      options?.onError?.();
    };

    this.synth.speak(utterance);
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking || (this.synth ? this.synth.speaking : false);
  }
}

export const speechService = new AuraSpeechService();
