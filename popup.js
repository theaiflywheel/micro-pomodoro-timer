function update() {
  chrome.storage.local.get(["timeLeft", "mode", "isRunning"], (d) => {
    const m = Math.floor(d.timeLeft / 60);
    const s = d.timeLeft % 60;
    document.getElementById("time").textContent = `${m}:${s.toString().padStart(2, '0')}`;
    document.getElementById("status").textContent = d.isRunning ? d.mode : "Ready";
  });
}

document.getElementById("start").onclick = () => chrome.runtime.sendMessage({action: "start"});
document.getElementById("stop").onclick = () => chrome.runtime.sendMessage({action: "stop"});
setInterval(update, 1000);
update();