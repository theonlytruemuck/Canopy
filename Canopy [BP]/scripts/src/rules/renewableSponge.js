import { world } from '@minecraft/server';
import { Rule } from 'lib/canopy/Canopy';

new Rule({
    category: 'Rules',
    identifier: 'renewableSponge',
    description: { translate: 'rules.renewableSponge' },
});

world.afterEvents.entityHurt.subscribe(async (event) => {
    if (event.hurtEntity?.typeId !== 'minecraft:guardian' || !await Rule.getValue('renewableSponge') || event.damageSource.cause !== 'lightning') 
        return;

    const guardian = event.hurtEntity;
    guardian.dimension.spawnEntity('minecraft:elder_guardian', guardian.location);
    guardian.remove();
});