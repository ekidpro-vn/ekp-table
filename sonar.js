const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'https://sonar.ekidpro.com',
    token: '09f775f26e1a99369b7793c4cc275f78a7841582',
    options: {
      'sonar.projectName': 'ekp-table',
      'sonar.projectDescription': 'quick review for ekp table on github',
    },
  },
  () => process.exit()
);
