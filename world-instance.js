import { type } from "node:os";
import { Bank } from "./bank.js";
import { Sheep } from "./resources/herdables.js";
import { Boar, Deer } from "./resources/huntables.js";

let resources = {
    treeForests: [],
    goldMines: [],
    stoneMines: [],
    foodSources: {
        herdables: [new Sheep(), new Sheep(), new Sheep(), new Sheep(), new Sheep(), new Sheep(), new Sheep(), new Sheep()],
        huntables: [new Boar(20), new Boar(20), new Deer(), new Deer(), new Deer(), new Deer()],
        foragables: [],
        //TODO: add fish
        farms: []
    }
}

const world = {
    bank: new Bank(),
    resources: resources,
    buildings: {
        lumbercamps: []
    },
    currentAge: "Dark Age"
}

export default world;
