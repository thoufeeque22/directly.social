"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistributionChannels = void 0;
var utils_1 = require("@/lib/utils/utils");
/**
 * Expands connected accounts into individual distribution channels
 * (e.g., splitting a Facebook account into Facebook and Instagram channels).
 */
var getDistributionChannels = function (accounts, preferences) {
    var isPlatformEnabled = function (platformId) {
        var pref = (preferences || []).find(function (p) { return p.platformId === platformId; });
        return pref ? pref.isEnabled : true;
    };
    return accounts.flatMap(function (account) {
        var items = [];
        if (account.provider === 'facebook') {
            items.push({
                id: "facebook:".concat(account.id),
                platform: 'facebook',
                displayName: (0, utils_1.formatHandle)(account.accountName, 'facebook'),
            });
            items.push({
                id: "instagram:".concat(account.id),
                platform: 'instagram',
                displayName: (0, utils_1.formatHandle)(account.accountName, 'instagram'),
            });
        }
        else {
            var platform = account.provider === 'google' ? 'youtube' : account.provider;
            items.push({
                id: account.id,
                platform: platform,
                displayName: (0, utils_1.formatHandle)(account.accountName, platform),
            });
        }
        return items.filter(function (item) { return isPlatformEnabled(item.platform); });
    });
};
exports.getDistributionChannels = getDistributionChannels;
