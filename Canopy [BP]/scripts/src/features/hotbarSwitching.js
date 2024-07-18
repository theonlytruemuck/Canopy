import { system, world } from '@minecraft/server';
import HotbarManager from 'src/classes/HotbarManager';

const ARROW_SLOT = 17;
const lastSelectedSlots = {};
const lastLoadedSlots = {};
const hotbarManagers = {};

system.runInterval(() => {
    if (!world.getDynamicProperty('hotbarSwitching')) return;
    const players = world.getAllPlayers();
    for (const player of players) {
        processHotbarSwitching(player);
    }
});

function processHotbarSwitching(player) {
    if (!hasArrowInTopRight(player) || !isInAppropriateGameMode(player)) {
        delete lastSelectedSlots[player.id];
        return;
    }
    if (hasScrolled(player) && player.isSneaking) {
        switchToHotbar(player, player.selectedSlotIndex);
    }
    lastSelectedSlots[player.id] = player.selectedSlotIndex;
}

function isInAppropriateGameMode(player) {
    return world.getDynamicProperty('hotbarSwitchingInSurvival') || player.getGameMode() === 'creative';
}

function hasArrowInTopRight(player) {
    const container = player.getComponent('inventory')?.container;
    return container?.getItem(ARROW_SLOT)?.typeId === 'minecraft:arrow';
}

function hasScrolled(player) {
    return player.selectedSlotIndex !== lastSelectedSlots[player.id];
}

function switchToHotbar(player, index) {
    if (!hotbarManagers[player.id]) hotbarManagers[player.id] = new HotbarManager(player);
    if (!lastLoadedSlots[player.id]) lastLoadedSlots[player.id] = lastSelectedSlots[player.id];
    const hotbarMgr = hotbarManagers[player.id];
    hotbarMgr.saveHotbar(lastLoadedSlots[player.id], hotbarMgr.getActiveHotbarItems());
    hotbarMgr.loadHotbar(index);
    lastLoadedSlots[player.id] = index;
    player.onScreenDisplay.setActionBar(`§a${index + 1}`);
}
