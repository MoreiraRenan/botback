module.exports = {
  apps: [
    {
      name: 'GlobalChat',
      script: 'dist/main.js',
      watch: ['server', 'client'],
      ignore_watch: ['node_modules', 'anexos'],
      watch_options: {
        followSymlinks: false,
      },
      env: {
        PORT: 3330,
        NODE_ENV: 'production',
      },
    },
  ],
};
