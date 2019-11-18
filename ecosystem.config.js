module.exports = {
  apps : [{
    name: 'mFilter',
    script: './bin/www',
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    ignore_watch: ['views', 'public'],
    env: {
      PORT: 4000,
      watch: true,
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 4000,
      watch: false,
      NODE_ENV: 'production'
    }
  }],

  /*
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
  */
};
