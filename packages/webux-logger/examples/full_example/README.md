```bash
npm install
```

**In a new terminal, launch ELK Stack:**
```
cd infrastructure/elk
bash launch.sh
```

**In a new terminal, launch Jaeger:**
```
cd infrastructure/tracing
docker compose up
```

**Launch the example application:**
```
node index.js
```

Check the code to see how it works.

---

Future Ideas:

- Add Prometheus Server
- Add Prometheus Alert Manager
- Add Grafana
- Send Metrics to ELK
- Implement ELK APM