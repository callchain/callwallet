const packager = require('electron-packager');
const os = require('os');
const { exit } = require('process');
const support_os = ['darwin', 'linux', 'win32'];
const createDMG = require('electron-installer-dmg');
const fs = require('fs');
const nodeCmd = require('node-cmd');

var packageJson = fs.readFileSync('package.json');
var package = JSON.parse(packageJson);

var platform = os.platform();

if (support_os.indexOf(platform) === -1) {
  console.error("Not support platform: " + platform);
  exit();
}

async function bundleElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

async function createMacOsDMG(options) {
  try {
    await createDMG(options);
    console.log('Callwallet dmg create success');
  }
  catch (e)
  {
    console.log('Fail to create MacOS DMG: ' + e);
  }
}

bundleElectronApp({
  dir: ".",
  ignore: /src|public|packager.js|package.json|package-lock.json|node_modules|main.js|README.md|babel.config.js|.gitignore|.git|.editorconfig|LICENSE|vue.config.js/
});

var pkg_name = package.name + '-' + os.platform() + '-' + os.arch + '-' + package.version;

if (platform === 'darwin') {
  createMacOsDMG({
    appPath: './callwallet-darwin-x64/callwallet.app',
    name: pkg_name,
    overwrite: true
  });
}

if (platform === 'linux') {
  var target = pkg_name + '.tar.gz';
  nodeCmd.run('tar cvfz ' + target + ' callwallet-linux-x64/');
}


