let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === "suspended") {
    void sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playPackSwitchSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(240, t + 0.045);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.045, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}

export function playPlateTapSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1620, t);
  osc1.frequency.exponentialRampToValueAtTime(1540, t + 0.12);
  gain1.gain.setValueAtTime(0.0001, t);
  gain1.gain.linearRampToValueAtTime(0.09, t + 0.004);
  gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(t);
  osc1.stop(t + 0.15);

  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = "triangle";
  thud.frequency.setValueAtTime(280, t);
  thud.frequency.exponentialRampToValueAtTime(125, t + 0.065);
  thudGain.gain.setValueAtTime(0.0001, t);
  thudGain.gain.linearRampToValueAtTime(0.08, t + 0.003);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
  thud.connect(thudGain);
  thudGain.connect(ctx.destination);
  thud.start(t);
  thud.stop(t + 0.09);
}
