/* يضبط أيقونة ملف exe وبياناته دون الحاجة إلى wine (resedit خالص بـJS) */
'use strict';
const fs = require('fs');
const path = require('path');

module.exports = async function afterPack(context){
  if(context.electronPlatformName !== 'win32') return;
  const ResEdit = require('resedit');
  const exes = fs.readdirSync(context.appOutDir).filter(f => f.toLowerCase().endsWith('.exe'));
  if(exes.length !== 1) throw new Error('afterPack: توقّعنا ملف exe واحداً في ' + context.appOutDir + ' فوجدنا ' + exes.length);
  const exe = path.join(context.appOutDir, exes[0]);

  const data = ResEdit.NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true });
  const res  = ResEdit.NtExecutableResource.from(data);

  const icoBuf = fs.readFileSync(path.join(__dirname, 'build', 'icon.ico'));
  const icon   = ResEdit.Data.IconFile.from(icoBuf);
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries, 1, 1033, icon.icons.map(i => i.data)
  );

  const v = context.packager.appInfo.version;
  const vi = ResEdit.Resource.VersionInfo.createEmpty();
  vi.setFileVersion(...v.split('.').map(Number).concat([0,0,0,0]).slice(0,4));
  vi.setProductVersion(...v.split('.').map(Number).concat([0,0,0,0]).slice(0,4));
  vi.setStringValues({ lang: 1033, codepage: 1200 }, {
    CompanyName:      'Abu Janan Productions',
    FileDescription:  'AbuJanan Games',
    ProductName:      'AbuJanan Games',
    LegalCopyright:   'Abu Janan Productions',
    InternalName:     exes[0],
    OriginalFilename: exes[0],
  });
  vi.outputToResourceEntries(res.entries);

  res.outputResource(data);
  fs.writeFileSync(exe, Buffer.from(data.generate()));
  console.log('afterPack: ضُبطت أيقونة وبيانات ' + path.basename(exe));
};
