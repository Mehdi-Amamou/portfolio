// Saisie du terminal : le texte reste dans le DOM, seule son apparition est animée.
const CHAR_MS = 35;
const PAUSE_MS = 300;

export function playTerminal(root: HTMLElement, speed: number) {
  const lines = Array.from(root.querySelector(".mh-term-body")?.children ?? []);
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speed));
  let stopped = false;

  lines.forEach((line) => line.classList.add("is-off"));
  root.classList.remove("is-armed");

  const run = async () => {
    for (const line of lines) {
      if (stopped) return;
      line.classList.remove("is-off");
      const command = line.querySelector<HTMLElement>(".mh-p-cmd");
      if (!command) continue;

      const length = command.textContent?.length ?? 0;
      command.style.setProperty("--n", "0");
      command.classList.add("is-typing");
      for (let count = 1; count <= length; count += 1) {
        await wait(CHAR_MS);
        if (stopped) return;
        command.style.setProperty("--n", String(count));
      }
      command.classList.remove("is-typing");
      await wait(PAUSE_MS);
    }
  };

  run();

  return () => {
    stopped = true;
    lines.forEach((line) => {
      line.classList.remove("is-off");
      line.querySelector(".mh-p-cmd")?.classList.remove("is-typing");
    });
  };
}
