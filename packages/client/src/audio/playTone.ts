const playUIContext = new window.AudioContext();

type ToneType = 'sent' | 'received';

export function playTone(type: ToneType) {
  const osc = playUIContext.createOscillator();
  const gain = playUIContext.createGain();

  osc.connect(gain);
  gain.connect(playUIContext.destination);

  const now = playUIContext.currentTime;

  switch (type) {
    case 'sent':
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      break;
    case 'received':
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.setValueAtTime(400, now + 0.1);
      break;
  }

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

  osc.start();
  osc.stop(now + 0.2);
}
