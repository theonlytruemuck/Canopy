import { Rule } from "lib/canopy/Canopy";
import { world } from "@minecraft/server";

new Rule({
    category: 'Rules',
    identifier: 'explosionOff',
    description: 'Disables explosions entirely.',
    independentRules: ['explosionChainReactionOnly', 'explosionNoBlockDamage']
});

world.beforeEvents.explosion.subscribe((event) => {
    if (!Rule.getNativeValue('explosionOff')) return;
    event.cancel = true;
});