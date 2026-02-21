const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.26,
};

const TRACKS = {
  happyA: {
    stepMs: 340,
    waveform: 'triangle',
    notes: [
      ['C4', 'E4'],
      ['G4'],
      ['E4'],
      ['D4', 'F4'],
      ['E4'],
      ['G4'],
      ['C5'],
      ['G4'],
    ],
  },
  happyB: {
    stepMs: 300,
    waveform: 'square',
    notes: [
      ['E4'],
      ['G4'],
      ['A4'],
      ['G4'],
      ['E4'],
      ['C4'],
      ['D4'],
      ['G4'],
    ],
  },
  calm: {
    stepMs: 560,
    waveform: 'sine',
    notes: [
      ['C4'],
      ['E4'],
      ['D4'],
      ['E4'],
      ['G4'],
      ['E4'],
      ['D4'],
      ['C4'],
    ],
  },
};

function withAttackRelease(gainNode, now, volume, duration = 0.25) {
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
}

export function createAudioManager(stateProvider) {
  let ctx = null;
  let musicGain = null;
  let sfxGain = null;
  let sequencer = null;
  let step = 0;
  let unlocked = false;
  let currentTrack = 'happyA';

  function ensureContext() {
    if (ctx) {
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }
    ctx = new AudioCtx();
    musicGain = ctx.createGain();
    sfxGain = ctx.createGain();
    musicGain.gain.value = 0.16;
    sfxGain.gain.value = 0.2;
    musicGain.connect(ctx.destination);
    sfxGain.connect(ctx.destination);
  }

  function stateSettings() {
    return stateProvider().settings;
  }

  function playTone(freq, duration, gainValue, waveform, output) {
    if (!ctx || !output) {
      return;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gain);
    gain.connect(output);
    withAttackRelease(gain, ctx.currentTime, gainValue, duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  function stopSequencer() {
    if (sequencer) {
      clearInterval(sequencer);
      sequencer = null;
    }
  }

  function startSequencer(trackName) {
    if (!ctx || !musicGain) {
      return;
    }
    stopSequencer();
    const track = TRACKS[trackName] || TRACKS.happyA;
    step = 0;
    sequencer = setInterval(() => {
      const settings = stateSettings();
      if (!settings.musicOn) {
        return;
      }
      const chord = track.notes[step % track.notes.length];
      const baseGain = trackName === 'calm' ? 0.08 : 0.1;
      chord.forEach((name, index) => {
        const freq = NOTE[name];
        if (!freq) {
          return;
        }
        playTone(freq, 0.22, baseGain / (index + 1), track.waveform, musicGain);
      });
      step += 1;
    }, track.stepMs);
  }

  async function unlock() {
    ensureContext();
    if (!ctx) {
      return false;
    }
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    unlocked = true;
    const settings = stateSettings();
    if (settings.musicOn) {
      startSequencer(currentTrack);
    }
    return true;
  }

  function syncSettings() {
    if (!ctx || !musicGain || !sfxGain) {
      return;
    }
    const settings = stateSettings();
    musicGain.gain.value = settings.musicOn ? 0.16 : 0.0001;
    sfxGain.gain.value = settings.sfxOn ? 0.2 : 0.0001;

    if (settings.musicOn && unlocked && !sequencer) {
      startSequencer(currentTrack);
    }
    if (!settings.musicOn) {
      stopSequencer();
    }
  }

  function setTrack(trackName) {
    currentTrack = trackName in TRACKS ? trackName : 'happyA';
    const settings = stateSettings();
    if (!settings.musicOn || !unlocked) {
      return;
    }
    startSequencer(currentTrack);
  }

  function playSfx(kind = 'tap') {
    const settings = stateSettings();
    if (!settings.sfxOn) {
      return;
    }
    ensureContext();
    if (!ctx || ctx.state !== 'running') {
      return;
    }

    if (kind === 'tap') {
      playTone(660, 0.09, 0.09, 'triangle', sfxGain);
      return;
    }
    if (kind === 'success') {
      playTone(523.25, 0.12, 0.1, 'triangle', sfxGain);
      setTimeout(() => playTone(659.26, 0.12, 0.1, 'triangle', sfxGain), 90);
      setTimeout(() => playTone(783.99, 0.2, 0.12, 'triangle', sfxGain), 180);
      return;
    }
    if (kind === 'sticker') {
      playTone(740, 0.14, 0.12, 'sine', sfxGain);
      setTimeout(() => playTone(988, 0.1, 0.1, 'sine', sfxGain), 110);
      return;
    }
    if (kind === 'error') {
      playTone(240, 0.16, 0.07, 'square', sfxGain);
      return;
    }
    if (kind === 'confetti') {
      for (let i = 0; i < 4; i += 1) {
        setTimeout(() => {
          playTone(450 + Math.random() * 500, 0.08, 0.07, 'triangle', sfxGain);
        }, i * 60);
      }
    }
  }

  function isUnlocked() {
    return unlocked;
  }

  function dispose() {
    stopSequencer();
    if (ctx) {
      ctx.close();
    }
    ctx = null;
    unlocked = false;
  }

  return {
    unlock,
    syncSettings,
    setTrack,
    playSfx,
    isUnlocked,
    dispose,
  };
}
