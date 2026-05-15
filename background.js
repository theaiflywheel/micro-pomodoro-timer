const WORK_MINS = 10;
const BREAK_MINS = 2;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    chrome.storage.local.set({ isRunning: true, mode: "WORK", timeLeft: WORK_MINS * 60 });
    chrome.alarms.create("loopAlarm", { periodInMinutes: 1/60 });
  }
  if (msg.action === "stop") {
    chrome.alarms.clearAll();
    chrome.storage.local.set({ isRunning: false, mode: "READY", timeLeft: WORK_MINS * 60 });
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "loopAlarm") {
    let data = await chrome.storage.local.get(["timeLeft", "mode"]);
    let nextTime = data.timeLeft - 1;
    let mode = data.mode;

    if (nextTime <= 0) {
      // TRIGGER BEEP
      playAlarmSound();
      
      // INFINITE LOOP LOGIC
      if (mode === "WORK") {
        mode = "BREAK";
        nextTime = BREAK_MINS * 60;
      } else {
        mode = "WORK";
        nextTime = WORK_MINS * 60;
      }
    }
    chrome.storage.local.set({ timeLeft: nextTime, mode: mode });
  }
});

async function playAlarmSound() {
  if (!(await chrome.offscreen.hasDocument?.())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html', reasons: ['AUDIO_PLAYBACK'], justification: 'Alarm'
    });
  }
  chrome.runtime.sendMessage({ action: "beep" });
}