import { BlockPermutation, world } from '@minecraft/server'
import DirectionStateFinder from 'src/classes/DirectionState'

const insideBedrockPistonList = [];

world.afterEvents.pistonActivate.subscribe(event => {
    if (!world.getDynamicProperty('pistonBedrockBreaking' || !['expanding', 'retracting'].includes(event.piston.state))) return;
    const piston = event.piston;
    const block = event.block;
    let directionState = DirectionStateFinder.getDirectionState(block.permutation);
    directionState.value = DirectionStateFinder.getRawMirroredDirection(block);
    if (piston.state === 'Expanding') {
        const behindBlock = DirectionStateFinder.getRelativeBlock(block, directionState);
        if (behindBlock.typeId === 'minecraft:bedrock') {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { [directionState.name]: directionState.value }));
            insideBedrockPistonList.push({ dimensionId: block.dimension.id, location: block.location });
        }
    } else if (piston.state === 'Retracting') {
        const oldPiston = getBlockFromPistonList(block);
        if (oldPiston !== undefined) {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { [directionState.name]: directionState.value }));
            insideBedrockPistonList.splice(insideBedrockPistonList.indexOf(oldPiston), 1);
        }
    }
});

function getBlockFromPistonList(block) {
    for (const pistonBlock of insideBedrockPistonList) {
        if (pistonBlock.dimensionId === block.dimension.id 
            && pistonBlock.location.x === block.location.x 
            && pistonBlock.location.y === block.location.y 
            && pistonBlock.location.z === block.location.z) {
            return pistonBlock;
        }
    }
    return undefined;
}