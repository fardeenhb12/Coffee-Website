import cp from 'node:child_process';
import fs from 'node:fs';

const [,, url, outputPath, scrollArg] = process.argv;
const scrollY = scrollArg ? parseInt(scrollArg, 10) : 0;

const chrome = cp.spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9255',
  '--window-size=1440,1050',
  url || 'http://localhost:3000'
]);

await new Promise(r => setTimeout(r, 1200));

try {
  const targets = await (await fetch('http://localhost:9255/json')).json();
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.onopen = resolve);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const listener = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === curId) {
          ws.removeEventListener('message', listener);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  if (scrollY > 0) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 600));
  }

  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync(outputPath || '/tmp/shot.jpg', Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot to:', outputPath || '/tmp/shot.jpg');
} catch (e) {
  console.error('Screenshot error:', e);
} finally {
  chrome.kill();
}

