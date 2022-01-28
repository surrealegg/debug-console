import CommandHandler from "../handler";
import { addQuotes, findFromVariable } from "../utils";

let namedTroops: string[] | null = null;

const getTroopsByName = (): string[] => {
    const result: string[] = [];
    for (let i = 1; i < $dataTroops.length; ++i) {
        if ($dataTroops[i].members.length > 0) {
            result.push(addQuotes($dataTroops[i].name));
        }
    }
    return result;
};

Game_Troop.prototype.addTroopReinforcementsWithRelativePosition =
    function (troopId: number, x: number, y: number): void {
        const troop = $dataTroops[troopId];
        for (let i = 0; i < troop.members.length; ++i) {
            const member = troop.members[i];
            if ($dataEnemies[member.enemyId]) {
                const newX = member.x + x;
                const newY = member.y + y;
                const enemyId = member.enemyId;

                const enemy = new Game_Enemy(enemyId, newX, newY);
                enemy.setTroopId(troopId);
                enemy.setTroopMemberId(i);
                if (member.hidden) {
                    enemy.hide();
                }
                this._enemies.push(enemy);
                this._newEnemies.push(enemy);
            }
        }
        this.makeUniqueNames();

        BattleManager.refreshEnemyReinforcements();
    };

const onCommand = (handler: CommandHandler, args: string[]): void => {
    // Check if argument passed
    if (args.length < 2) {
        handler.log("Usage: /battle [id | name] [x = 0] [y = 0]");
        return;
    }

    // Check if battle exists
    const battle = findFromVariable($dataTroops, args[1]);
    if (battle === null) {
        handler.log(`Battle "${args[1]}" not found`, "red");
        return;
    }

    if ($gameParty.inBattle()) {
        const x = parseInt(args[2] || "0");
        const y = parseInt(args[3] || "0");
        $gameTroop.addTroopReinforcementsWithRelativePosition(
            battle.id,
            x,
            y,
        );
        handler.log(`${battle.name} joined the battle!`);
        return;
    }

    // Check if the player is in map
    if (!SceneManager._scene._mapLoaded) {
        handler.log("Player must be in map", "red");
        return;
    }

    handler.log(`Starting a battle with "${battle.name}"`);

    // Closes console.
    handler.setConsole(false);

    // TODO: Give an option to set canEscape and canLose
    SoundManager.playBattleStart();
    BattleManager.setup(battle.id, true, true);
    BattleManager.setEventCallback(() => {
        // There's a bug where when you select Run
        // You will see a black screen. This fixes the issue.
        $gameScreen.clear();
    });
    $gamePlayer.makeEncounterCount();
    SceneManager.push(Scene_Battle);
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        if (namedTroops === null) {
            namedTroops = getTroopsByName();
        }
        return namedTroops;
    }
    return [];
};

export default { onCommand, onSuggestion };
