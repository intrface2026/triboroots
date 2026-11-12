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

function scheduleWhoosh(ctx: AudioContext, startTime: number) {
  const duration = 0.2;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.setValueAtTime(1.8, startTime);
  filter.frequency.setValueAtTime(1100, startTime);
  filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(0.04, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(startTime);
  noise.stop(startTime + duration + 0.02);
}

function scheduleCeramicClink(
  ctx: AudioContext,
  impactTime: number,
  pitchRatio: number
) {
  // Primary ceramic ring
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1480 * pitchRatio, impactTime);
  osc1.frequency.exponentialRampToValueAtTime(1420 * pitchRatio, impactTime + 0.14);
  gain1.gain.setValueAtTime(0.0001, impactTime);
  gain1.gain.linearRampToValueAtTime(0.11, impactTime + 0.004);
  gain1.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.17);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(impactTime);
  osc1.stop(impactTime + 0.19);

  // High ceramic overtone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(3120 * pitchRatio, impactTime);
  gain2.gain.setValueAtTime(0.0001, impactTime);
  gain2.gain.linearRampToValueAtTime(0.05, impactTime + 0.003);
  gain2.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.09);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(impactTime);
  osc2.stop(impactTime + 0.11);

  // Soft stoneware body thud
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = "triangle";
  thud.frequency.setValueAtTime(240 * pitchRatio, impactTime);
  thud.frequency.exponentialRampToValueAtTime(115, impactTime + 0.075);
  thudGain.gain.setValueAtTime(0.0001, impactTime);
  thudGain.gain.linearRampToValueAtTime(0.095, impactTime + 0.004);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.085);
  thud.connect(thudGain);
  thudGain.connect(ctx.destination);
  thud.start(impactTime);
  thud.stop(impactTime + 0.1);
}

const PITCH_RATIOS = [1.0, 1.07, 0.94, 1.13, 1.03];

/**
 * Schedules staggered falling whoosh + ceramic plate clink SFX for menu drops.
 * Returns a cleanup callback that mutes scheduled sounds if closed early.
 */
export function playMenuDropSequence(
  itemCount: number,
  staggerMs: number,
  impactOffsetMs: number
): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1, ctx.currentTime);
  masterGain.connect(ctx.destination);

  const timers: number[] = [];

  for (let i = 0; i < itemCount; i++) {
    const startSec = (i * staggerMs) / 1000;
    const impactSec = (i * staggerMs + impactOffsetMs) / 1000;
    const ratio = PITCH_RATIOS[i % PITCH_RATIOS.length];

    const t1 = window.setTimeout(() => {
      if (masterGain.gain.value > 0) {
        scheduleWhoosh(ctx, ctx.currentTime);
      }
    }, Math.max(0, Math.round(startSec * 1000 + 60)));

    const t2 = window.setTimeout(() => {
      if (masterGain.gain.value > 0) {
        scheduleCeramicClink(ctx, ctx.currentTime, ratio);
      }
    }, Math.round(impactSec * 1000));

    timers.push(t1, t2);
  }

  return () => {
    timers.forEach((id) => window.clearTimeout(id));
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
  };
}

export function playPlateTapSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  scheduleCeramicClink(ctx, ctx.currentTime, 1.18);
}
