const chokidar = require('chokidar')

const watcher = chokidar.watch('.', {
  ignored: /\.git|node_module|public\/dist/,
  ignoreInitial: true
})

const log = console.log.bind(console)

watcher
  .on('ready', () => log('Watcher: Initial scan complete. Ready for changes'))
  .on('change', (path, stats) =>
    log(`File ${path} has been changed (size:${stats.size})`)
  )
  .on('add', path => log(`File ${path} has been added`))
  .on('unlink', path => log(`File ${path} has been removed`))
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
