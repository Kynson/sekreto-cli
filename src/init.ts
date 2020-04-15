(() => {
  process.title = 'Sekreto';

  const VERSION = process.versions.node.split('.').map((versionPart) => Number(versionPart));
  // Only support latest Active LTS (v10.20) versions, and current versions.
  if (VERSION[0] < 10 || (VERSION[0] === 10 && VERSION[1] < 20)) {
    process.exitCode = 1;

    return;
  }

  // tslint:disable-next-line:no-var-requires
  require('./index');
})();
