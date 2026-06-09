export function parseArgs(argv) {
  const args = { user: null, sort: 'stars', top: null, includeForks: false, json: false, markdown: false, help: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--user':
        args.user = argv[++i];
        break;
      case '--sort':
        args.sort = argv[++i];
        break;
      case '--top':
        args.top = parseInt(argv[++i], 10);
        break;
      case '--include-forks':
        args.includeForks = true;
        break;
      case '--json':
        args.json = true;
        break;
      case '--markdown':
        args.markdown = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
    }
  }

  return args;
}
