module.exports = {
  apps : [{
    name: 'mFilter',
    script: './bin/www',
    PORT: 4000,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    ignore_watch: ['views', 'public'],
    env: {
      watch: true,
      NODE_ENV: 'development'
    },
    env_production: {
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
