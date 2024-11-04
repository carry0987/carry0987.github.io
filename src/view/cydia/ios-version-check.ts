const VERSION_CHECK_SUPPORTED = 'Your iOS version is supported! &#x1f60a;';
const VERSION_CHECK_NEEDS_UPGRADE = 'Requires at least iOS %s &#x1f615;';
const VERSION_CHECK_UNCONFIRMED = 'Not yet tested on iOS %s &#x1f601;';
const VERSION_CHECK_UNSUPPORTED = 'Only compatible with iOS %s to %s &#x1f61e;';

export const iosVersionCheck = (
    minIOS: string, 
    maxIOS: string | null, 
    otherIOS: string, 
    callBack: (message: string, isBad: boolean) => void
): number => {
    'use strict';

    function parseVersionString(version: string): number[] {
        const bits = version.split('.');
        return [parseInt(bits[0], 10), parseInt(bits[1] || '0', 10), parseInt(bits[2] || '0', 10)];
    }

    function compareVersions(one: number[], two: number[]): number {
        // https://gist.github.com/TheDistantSea/8021359
        for (let i = 0; i < one.length; ++i) {
            if (two.length == i) {
                return 1;
            }
            if (one[i] == two[i]) {
                continue;
            } else if (one[i] > two[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        if (one.length != two.length) {
            return -1;
        }
        return 0;
    }

    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/i);

    if (!versionMatch) {
        return 0;
    }

    const osVersion = [
            parseInt(versionMatch[1], 10),
            parseInt(versionMatch[2], 10),
            parseInt(versionMatch[3] || '0', 10)
        ],
        osString = osVersion[0] + '.' + osVersion[1] + (osVersion[2] && osVersion[2] != 0 ? '.' + osVersion[2] : ''),
        minString = minIOS,
        maxString = maxIOS,
        minVersion = parseVersionString(minString),
        maxVersion = maxString ? parseVersionString(maxString) : null;
        
    let message = VERSION_CHECK_SUPPORTED;
    let isBad = false;

    if (compareVersions(minVersion, osVersion) == 1) {
        message = VERSION_CHECK_NEEDS_UPGRADE.replace('%s', minString);
        isBad = true;
    } else if (maxVersion && compareVersions(maxVersion, osVersion) == -1) {
        if ('unsupported' == otherIOS) {
            message = VERSION_CHECK_UNSUPPORTED.replace('%s', minString).replace('%s', maxString ?? '');
        } else {
            message = VERSION_CHECK_UNCONFIRMED.replace('%s', osString);
        }
        isBad = true;
    }
    callBack(message, isBad);

    return isBad ? -1 : 1;
}
