'use strict'

const defaults = {
  autorestart: false,
  min_uptime: '3s',
  combine_logs: true,
  out_file: 'NULL',
  watch: true,
  ignore_watch: [
    '.git',
    '.github',
    '.vscode',
    'migrations',
    'node_modules',
    'scripts',
    'temp',
    'tmp',
    'test',
    '.env',
    '.env.example',
    '.git-blame-ignore-revs',
    '.gitignore',
    '.labrc.js',
    '.nvmrc',
    'CHANGELOG.MD',
    'ecosystem.config.json',
    'LICENCE',
    'README.md',
    'sonar-project.properties',
    'app/views',
    'app/public',
    'test',
    'eslint.config.js',
    'lcov.info',
    'Dockerfile',
    'docker-compose.yml',
    'scripts',
    'db',
    'config',
    '.editorconfig',
    'package.json',
    'package-lock.json'
  ]
}

module.exports = {
  apps: [
    {
      name: 'node-test',
      cwd: '/home',
      script: 'index.js',
      node_args: '--inspect=0.0.0.0:9044',
      ...defaults
    }
  ]
}
