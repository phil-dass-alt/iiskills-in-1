// ─────────────────────────────────────────────────────────────────────────────
// PM2 Ecosystem Configuration — iiskills.in monorepo
//
// All 11 Next.js apps running as standalone Node.js servers.
// Start / reload:
//   pm2 start ecosystem.config.js
//   pm2 reload ecosystem.config.js --update-env
//   pm2 save && pm2 startup
//
// Logs are written to /var/log/pm2/<name>-{out,err}.log
// Log rotation is handled by pm2-logrotate (install once):
//   pm2 install pm2-logrotate
//   pm2 set pm2-logrotate:max_size 50M
//   pm2 set pm2-logrotate:retain 14
//   pm2 set pm2-logrotate:compress true
// ─────────────────────────────────────────────────────────────────────────────

const DEPLOY_PATH = process.env.DEPLOY_PATH || '/srv/iiskills-in';
const LOG_DIR     = '/var/log/pm2';

/** Build a process entry for a Next.js standalone app. */
function app({ name, port, dir }) {
  return {
    name,
    script: `${DEPLOY_PATH}/apps/${dir}/.next/standalone/server.js`,
    cwd: `${DEPLOY_PATH}/apps/${dir}`,

    // Next.js standalone reads PORT from env
    env: {
      NODE_ENV: 'production',
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
    },

    // Single instance per app on a single VPS.
    // Set instances: 'max' and exec_mode: 'cluster' if you add CPU cores later.
    instances: 1,
    exec_mode: 'fork',

    autorestart: true,
    watch: false,
    max_memory_restart: '512M',

    // Graceful shutdown: give Next.js 10 s to drain in-flight requests
    kill_timeout: 10000,
    wait_ready: true,
    listen_timeout: 15000,

    // Structured logging
    out_file: `${LOG_DIR}/${name}-out.log`,
    error_file: `${LOG_DIR}/${name}-err.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // Exponential backoff on crash (ms)
    min_uptime: '10s',
    max_restarts: 10,
  };
}

module.exports = {
  apps: [
    app({ name: 'main',             port: 3000, dir: 'main'            }),
    app({ name: 'learn-ai',         port: 3002, dir: 'learn-ai'        }),
    app({ name: 'learn-chemistry',  port: 3005, dir: 'learn-chemistry' }),
    app({ name: 'learn-developer',  port: 3006, dir: 'learn-developer' }),
    app({ name: 'learn-geography',  port: 3007, dir: 'learn-geography' }),
    app({ name: 'learn-management', port: 3008, dir: 'learn-management'}),
    app({ name: 'learn-math',       port: 3009, dir: 'learn-math'      }),
    app({ name: 'learn-physics',    port: 3010, dir: 'learn-physics'   }),
    app({ name: 'learn-pr',         port: 3011, dir: 'learn-pr'        }),
    app({ name: 'learn-apt',        port: 3012, dir: 'learn-apt'       }),
    app({ name: 'admin',            port: 3040, dir: 'web'             }),
  ],
};
