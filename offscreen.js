chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "beep") {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square'; // Harsh, loud beep
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, 1500); // 1.5 second beep
  }
});