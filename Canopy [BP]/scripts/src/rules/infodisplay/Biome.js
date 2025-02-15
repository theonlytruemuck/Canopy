import InfoDisplayElement from './InfoDisplayElement.js';
import ProbeManager from 'src/classes/ProbeManager';

class Biome extends InfoDisplayElement {
    player;

    constructor(player, displayLine) {
        const ruleData = { identifier: 'biome', description: { translate: 'rules.infoDisplay.biome' } };
        super(ruleData, displayLine);
        this.player = player;
    }

    getFormattedDataOwnLine() {
        return { translate: 'rules.infoDisplay.biome.display', with: [ProbeManager.getBiome(this.player)] };
    }

    getFormattedDataSharedLine() {
        return this.getFormattedDataOwnLine();
    }
}

export default Biome;