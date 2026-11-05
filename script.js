// =========================================================
// Terminal: Befehle tippen, Fortschrittsbalken füllen
// =========================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lines = document.querySelectorAll('#terminal .t-line');
const progressBar = document.getElementById('progress');
const percentText = document.getElementById('percent');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Setzt den Balken auf einen Prozentwert (Breite in %)
function drawProgress(percent) {
  progressBar.style.width = percent + '%';
  progressBar.parentElement.setAttribute('aria-valuenow', percent);
  percentText.textContent = percent + ' %';
}

// Füllt den Balken von 0 bis 100 in unregelmässigen Schritten
async function runProgress() {
  let percent = 0;
  while (percent < 100) {
    percent = Math.min(100, percent + Math.ceil(Math.random() * 9));
    drawProgress(percent);
    await wait(80 + Math.random() * 160);
  }
}

async function runTerminal() {
  for (const line of lines) {
    const cmd = line.querySelector('.t-cmd');

    // "Weniger Bewegung" eingestellt: alles sofort fertig zeigen
    if (reduceMotion) {
      if (line.contains(progressBar)) drawProgress(100);
      line.classList.add('show');
      continue;
    }

    // Befehlszeile: Buchstabe für Buchstabe tippen
    if (cmd) {
      const text = cmd.textContent;
      cmd.textContent = '';
      line.classList.add('show');
      await wait(450);

      for (const char of text) {
        cmd.textContent += char;
        await wait(55 + Math.random() * 65); // leicht unregelmässig = wirkt echter
      }
      await wait(350);
      continue;
    }

    // Ausgabezeile: sofort zeigen – beim Balken zusätzlich animieren
    line.classList.add('show');
    if (line.contains(progressBar)) {
      await runProgress();
      await wait(300);
    } else {
      await wait(200);
    }
  }
}

drawProgress(0);
runTerminal();
