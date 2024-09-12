import * as fs from 'fs';
import * as gcc from './gcc';

async function main() {
    try {
        let versionsList = gcc.availableVersions();

        versionsList = versionsList.reverse();

        const versionsData: { [versionLabel: string]: { [gccRelease: string]: { [platform: string]: { url: string; md5: string | null } } } } = {};
        const platforms = ['win32', 'linux', 'darwin'];
        const architectures = ['x86_64', 'arm64'];

        let versionIndex = 1;

        for (const version of versionsList) {
            const versionLabel = `v${String(versionIndex).padStart(2, '0')}`;
            versionsData[versionLabel] = {};
            versionsData[versionLabel][version] = {};

            for (const platform of platforms) {
                for (const arch of architectures) {
                    try {
                        const urlData = gcc.distributionUrl(version, platform, arch);
                        versionsData[versionLabel][version][`${platform}_${arch}`] = {
                            url: urlData.url,
                            md5: urlData.md5,
                        };
                    } catch (error) {
                        console.warn(`Skipping version ${version} for platform ${platform} and architecture ${arch}: ${error.message}`);
                    }
                }
            }
            versionIndex++;
        }

        const reversedVersionsData: { [versionLabel: string]: any } = {};
        const versionKeys = Object.keys(versionsData).reverse();
        for (const key of versionKeys) {
            reversedVersionsData[key] = versionsData[key];
        }

        const jsonContent = JSON.stringify(reversedVersionsData, null, 2);
        fs.writeFileSync('versions.json', jsonContent, 'utf8');
        console.log('Versions saved to versions.json');
    } catch (error) {
        console.error('Error generating versions JSON:', error);
    }
}

main();
