import { db } from './database.js';
const DELAY_MS = 600;

export default function mockServer() {
  return {
    name: 'mock-server',
    configureServer(server) {
      server.middlewares.use('/api/booking/today', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        setTimeout(() => res.end(JSON.stringify(db.today)), DELAY_MS);
      });
      server.middlewares.use('/api/slots', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const url = new URL(req.url, `http://${req.headers.host}`);
        const day = parseInt(url.searchParams.get('day'), 10);
        const month = parseInt(url.searchParams.get('month'), 10);
        const year = parseInt(url.searchParams.get('year'), 10);
        const slots = db.slots[`${day}-${month}-${year}`] || [];
        setTimeout(() => {
          if (Math.random() < 0.01) {
            res.statusCode = 500; res.end(JSON.stringify({ error: 'Ошибка на сервере' }));
          } else {
            res.end(JSON.stringify({ date: { day, month, year }, slots }));
          }
        }, DELAY_MS);
      });
    },
  };
}
