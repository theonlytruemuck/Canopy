import * as mc from '@minecraft/server'
import Utils from 'stickycore/utils'

let brokenBlockEventsThisTick = [];

mc.system.runInterval(() => {
    brokenBlockEventsThisTick = [];
});

mc.world.afterEvents.playerBreakBlock.subscribe(blockEvent => {
    if (blockEvent.player.getGameMode() === 'creative' || !mc.world.getDynamicProperty('pickupOnMine')) return;
    brokenBlockEventsThisTick.push(blockEvent);
});

mc.world.afterEvents.entitySpawn.subscribe(entityEvent => {
    if (entityEvent.cause !== 'Spawned' || entityEvent.entity.typeId !== 'minecraft:item') return;
    if (!mc.world.getDynamicProperty('pickupOnMine')) return;

    const item = entityEvent.entity;
    const brokenBlockEvent = brokenBlockEventsThisTick.find(blockEvent => Utils.calcDistance(blockEvent.block.location, item.location) < 2);
    if (!brokenBlockEvent) return;

    const itemStack = item.getComponent('minecraft:item').itemStack;
    const inventory = brokenBlockEvent.player.getComponent('minecraft:inventory').container;
    if (canAdd(inventory, itemStack)) {
        inventory.addItem(itemStack)
        item.remove();
    }
});

function canAdd(inventory, itemStack) {
    if (inventory.emptySlotsCount !== 0) return true;
    for (let i = 0; i < inventory.size; i++) {
        const slot = inventory.getSlot(i);
        if (slot.hasItem() && slot.isStackableWith(itemStack)) return true;
    }
    return false;
}

export default { brokenBlockEventsThisTick }