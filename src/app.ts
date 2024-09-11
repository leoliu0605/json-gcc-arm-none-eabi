import * as fs from 'fs';
import * as gcc from './gcc';

async function main() {
    try {
        const versionsList = gcc.availableVersions();
        const versionsData: { [gccRelease: string]: { [platform: string]: { url: string; md5: string | null } } } = {};

        const platforms = ['win32', 'linux', 'darwin'];
        const architectures = ['x86_64', 'arm64'];

        for (const version of versionsList) {
            versionsData[version] = {};
            for (const platform of platforms) {
                for (const arch of architectures) {
                    try {
                        const urlData = gcc.distributionUrl(version, platform, arch);
                        versionsData[version][`${platform}_${arch}`] = {
                            url: urlData.url,
                            md5: urlData.md5,
                        };
                    } catch (error) {
                        console.warn(`Skipping version ${version} for platform ${platform} and architecture ${arch}: ${error.message}`);
                    }
                }
            }
        }

        const jsonContent = JSON.stringify(versionsData, null, 2);
        fs.writeFileSync('versions.json', jsonContent, 'utf8');
        console.log('Versions saved to versions.json');
    } catch (error) {
        console.error('Error generating versions JSON:', error);
    }
}

main();
