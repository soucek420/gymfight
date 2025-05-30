// frontend/src/pages/CombatPage.js
import React, { useState, useEffect, useCallback } from 'react';
import OpponentSelect from '../components/OpponentSelect';
import { useAuth } from '../authContext';
import rpgApi from '../api/rpgApi';
import './CombatPage.css'; // For styling

function CombatPage() {
    const { user } = useAuth();

    // State Management
    const [playerCharacter, setPlayerCharacter] = useState(null);
    const [opponentDetails, setOpponentDetails] = useState({ name: '', level: null, initialHealth: 100, type: '' });
    const [combatResult, setCombatResult] = useState(null);
    const [displayedLogEntries, setDisplayedLogEntries] = useState([]);
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
    const [opponentCurrentHp, setOpponentCurrentHp] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [combatStarted, setCombatStarted] = useState(false);


    // Fetch Player Character
    useEffect(() => {
        const fetchCharacter = async () => {
            if (user && user._id) {
                setIsLoading(true);
                try {
                    // Ensure user.token is passed correctly for authentication
                    const characterData = await rpgApi.getCharacter(user.token, user._id);
                    setPlayerCharacter(characterData);
                    setPlayerCurrentHp(characterData.stats.health_points);
                    setError(null);
                } catch (err) {
                    console.error('Error fetching character:', err);
                    setError(err.response?.data?.message || 'Failed to fetch character data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchCharacter();
    }, [user]);

    // Helper to parse names and initial HP from the first log entry
    const parseInitialCombatState = (logEntry) => {
        if (typeof logEntry !== 'string') return { pName: "Player", pHP: 100, oName: "Opponent", oHP: 100 };
        
        // Example: "Battle starts: PlayerName (HP: 100) vs OpponentName (HP: 50)"
        const match = logEntry.match(/Battle starts: (.*) \(HP: (\d+)\) vs (.*) \(HP: (\d+)\)/);
        if (match) {
            return {
                pName: match[1],
                pHP: parseInt(match[2], 10),
                oName: match[3],
                oHP: parseInt(match[4], 10),
            };
        }
        return { pName: playerCharacter?.name || "Player", pHP: playerCharacter?.stats.health_points || 100, oName: "Opponent", oHP: 100 };
    };
    
    // Combat Initiation
    const handleOpponentSelect = async (aiOpponentId) => {
        if (!playerCharacter) {
            setError("Player character data not loaded yet.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setCombatStarted(true);
        setDisplayedLogEntries([]);
        setCurrentTurnIndex(0);
        setCombatResult(null);

        try {
            const result = await rpgApi.startCombat({ aiOpponentId }, user.token);
            setCombatResult(result);
            
            let initialPlayerHp = playerCharacter.stats.health_points;
            let initialOpponentHp = 100; // Default
            let parsedOpponentName = "Opponent"; // Default
            let opponentLevel = 1; // Default
            let opponentType = "Unknown"; // Default

            if (result.combatLog && result.combatLog.length > 0) {
                const firstLog = result.combatLog[0];
                const initialState = parseInitialCombatState(firstLog);
                
                // Use playerCharacter data as the source of truth for player's initial HP
                initialPlayerHp = playerCharacter.stats.health_points; 
                parsedOpponentName = initialState.oName;
                initialOpponentHp = initialState.oHP;

                setDisplayedLogEntries([formatLogEntry(firstLog, parsedOpponentName, playerCharacter.name)]);
                setCurrentTurnIndex(1);
            }
            
            // Attempt to get more concrete opponent details if backend sends them
            // This is a fallback if the backend doesn't send opponent details directly in the combat result.
            // Ideally, backend `startCombat` response should include `opponentDetails` { name, level, type, stats: { health_points } }
            // For now, we rely on parsing and defaults.
            const fetchedOpponent = await rpgApi.getAiOpponent(aiOpponentId, user.token); // Assuming such an API exists or is added.
            if (fetchedOpponent) {
                parsedOpponentName = fetchedOpponent.name || parsedOpponentName;
                initialOpponentHp = fetchedOpponent.stats?.health_points || initialOpponentHp;
                opponentLevel = fetchedOpponent.level || opponentLevel;
                opponentType = fetchedOpponent.type || opponentType;
            }


            setPlayerCurrentHp(initialPlayerHp);
            setOpponentDetails({ name: parsedOpponentName, level: opponentLevel, initialHealth: initialOpponentHp, type: opponentType });
            setOpponentCurrentHp(initialOpponentHp);

        } catch (err) {
            console.error('Error starting combat:', err);
            setError(err.response?.data?.message || 'Failed to start combat.');
            setCombatStarted(false);
        } finally {
            setIsLoading(false);
        }
    };

    const formatLogEntry = (logEntry, oppName, playerName) => {
        if (typeof logEntry === 'string') {
            return logEntry;
        }
        // Assuming logEntry is an object from backend's applyAbility's combatLogEntry
        // { attacker: "Name", defender: "Name", abilityName: "Ability", damage: X, heal: Y, effect: "Description", missed: false }
        if (typeof logEntry === 'object' && logEntry !== null && logEntry.combatLogEntry) {
             const entry = logEntry.combatLogEntry; // The actual message from backend
             if (entry && typeof entry.effect === 'string') return entry.effect; // Prefer the pre-formatted message
             if (entry && typeof entry === 'string') return entry; // If combatLogEntry itself is a string
        }
        // Fallback for older or direct object structures (less ideal)
        if (typeof logEntry === 'object' && logEntry !== null) {
            let message = `${logEntry.attacker || 'Someone'} used ${logEntry.abilityName || logEntry.ability?.name || 'an ability'}`;
            if (logEntry.defender) message += ` on ${logEntry.defender || 'someone'}`;
            if (logEntry.missed) message += `, but it missed!`;
            else if (logEntry.damage > 0) message += ` for ${logEntry.damage} damage.`;
            else if (logEntry.heal > 0) message += `, healing for ${logEntry.heal} HP.`;
            else if (logEntry.effect && typeof logEntry.effect === 'string') message += `. ${logEntry.effect}`;
            else message += '.';
            return message;
        }
        return "Unknown log entry format.";
    };
    

    // Handle Next Event/Turn
    const handleNextEvent = useCallback(() => {
        if (!combatResult || currentTurnIndex >= combatResult.combatLog.length) {
            return;
        }

        const logEntry = combatResult.combatLog[currentTurnIndex];
        let newPlayerHp = playerCurrentHp;
        let newOpponentHp = opponentCurrentHp;

        // Try to parse HP changes from structured log entries
        if (typeof logEntry === 'object' && logEntry !== null) {
            // The backend `combatService.js` `applyAbility` returns a `combatLogEntry` object
            // which has an `effect` string. The actual HP changes are best derived from `finalCharHp` and `finalOppHp`
            // at the end of combat, or if the backend were to send per-turn HP updates.
            // For simplicity here, we'll assume the string message might contain clues, or
            // we rely on the final HP values if this is the last log entry.
            
            // Example of more direct HP update if backend log objects had this structure:
            // if(logEntry.updatedStats) {
            //    if(logEntry.updatedStats.character) newPlayerHp = logEntry.updatedStats.character.hp;
            //    if(logEntry.updatedStats.opponent) newOpponentHp = logEntry.updatedStats.opponent.hp;
            // }

            // Heuristic parsing from the formatted message (less reliable)
            const message = formatLogEntry(logEntry, opponentDetails.name, playerCharacter.name).toLowerCase();
            const damageMatch = message.match(/for (\d+) damage/);
            const healMatch = message.match(/healing for (\d+) hp/);
            const takesDamageMatch = message.match(/takes (\d+) damage/); // For DoTs

            if (damageMatch) {
                const damage = parseInt(damageMatch[1]);
                if (message.includes(playerCharacter.name.toLowerCase()) && message.includes(opponentDetails.name.toLowerCase())) { // Player attacks opponent
                    newOpponentHp = Math.max(0, opponentCurrentHp - damage);
                } else if (message.includes(opponentDetails.name.toLowerCase()) && message.includes(playerCharacter.name.toLowerCase())) { // Opponent attacks player
                    newPlayerHp = Math.max(0, playerCurrentHp - damage);
                }
            }
            if (healMatch) {
                const heal = parseInt(healMatch[1]);
                 if (message.includes(playerCharacter.name.toLowerCase())) {
                    newPlayerHp = Math.min(playerCharacter.stats.health_points, playerCurrentHp + heal);
                } else if (message.includes(opponentDetails.name.toLowerCase())) {
                    newOpponentHp = Math.min(opponentDetails.initialHealth, opponentCurrentHp + heal);
                }
            }
            if (takesDamageMatch) { // DoT damage
                const dotDamage = parseInt(takesDamageMatch[1]);
                if (message.includes(playerCharacter.name.toLowerCase())) {
                    newPlayerHp = Math.max(0, playerCurrentHp - dotDamage);
                } else if (message.includes(opponentDetails.name.toLowerCase())) {
                    newOpponentHp = Math.max(0, opponentCurrentHp - dotDamage);
                }
            }
        }
        
        // If it's the last event, use the definitive final HP values from combatResult
        if (currentTurnIndex === combatResult.combatLog.length - 1) {
            newPlayerHp = combatResult.finalCharHp !== undefined ? combatResult.finalCharHp : newPlayerHp;
            newOpponentHp = combatResult.finalOppHp !== undefined ? combatResult.finalOppHp : newOpponentHp;
        }

        setPlayerCurrentHp(newPlayerHp);
        setOpponentCurrentHp(newOpponentHp);

        setDisplayedLogEntries(prev => [...prev, formatLogEntry(logEntry, opponentDetails.name, playerCharacter.name)]);
        setCurrentTurnIndex(prev => prev + 1);

    }, [combatResult, currentTurnIndex, playerCharacter, opponentDetails, playerCurrentHp, opponentCurrentHp]);


    const getHpPercentage = (currentHp, maxHp) => {
        if (!maxHp || maxHp <= 0 || currentHp === undefined) return 0;
        return Math.max(0, (currentHp / maxHp) * 100);
    };

    const renderCombatOutcome = () => {
        if (!combatResult || currentTurnIndex < combatResult.combatLog.length) return null;
        if (isLoading && combatStarted) return <p>Loading results...</p>;

        const { winner, rewards } = combatResult;
        let message = "";
        if (winner === 'character') message = "You Win!";
        else if (winner === 'opponent') message = "You Lose!";
        else message = "It's a Draw!";

        return (
            <div className="combat-outcome">
                <h3>{message}</h3>
                {winner === 'character' && rewards && (
                    <div>
                        <h4>Rewards:</h4>
                        <p>Experience: {rewards.experience || 0}</p>
                        <p>Currency: {rewards.currency || 0}</p>
                        {rewards.items && rewards.items.length > 0 && (
                            <p>Items: {rewards.items.join(', ')}</p>
                        )}
                    </div>
                )}
                <button onClick={() => {
                setCombatStarted(false);
                setCombatResult(null);
                setDisplayedLogEntries([]);
                setCurrentTurnIndex(0);
                    // Reset HPs to full for player for next potential fight
                    if(playerCharacter) setPlayerCurrentHp(playerCharacter.stats.health_points);
                    setOpponentCurrentHp(0); 
                }}>Fight Another Opponent</button>
            </div>
        );
    };
    

    if (!user) return <p>Please log in to access the Combat Arena.</p>;
    if (isLoading && !combatStarted && !playerCharacter) return <p>Loading Character Data...</p>;
    if (error && !combatStarted) return <p className="error-message">{error}</p>;
    if (!playerCharacter && !isLoading) return <p>Player character could not be loaded. Please refresh or check your connection.</p>;

    return (
        <div className="combat-page">
            <h2>Combat Arena</h2>
            {!combatStarted && playerCharacter && <OpponentSelect onOpponentSelect={handleOpponentSelect} currentCharacterId={playerCharacter?._id} />}
            {isLoading && !combatStarted && playerCharacter && <p>Loading opponents...</p>}


            {combatStarted && playerCharacter && (
                <>
                    <div className="combat-interface">
                        {/* Player Section */}
                        <div className="combatant-section player-section">
                            <h3>{playerCharacter.name}</h3>
                            <p>Level: {playerCharacter.level} ({playerCharacter.type})</p>
                            <div className="hp-bar-container">
                                <div 
                                    className="hp-bar" 
                                    style={{ width: `${getHpPercentage(playerCurrentHp, playerCharacter.stats.health_points)}%` }}
                                    title={`${playerCurrentHp} / ${playerCharacter.stats.health_points}`}
                                ></div>
                            </div>
                            <p>HP: {playerCurrentHp} / {playerCharacter.stats.health_points}</p>
                            <p>Abilities: {playerCharacter.abilities.join(', ')}</p>
                        </div>

                        {/* Opponent Section */}
                        <div className="combatant-section opponent-section">
                            <h3>{opponentDetails.name}</h3>
                            <p>Level: {opponentDetails.level} ({opponentDetails.type})</p>
                             <div className="hp-bar-container">
                                <div 
                                    className="hp-bar opponent-hp-bar" 
                                    style={{ width: `${getHpPercentage(opponentCurrentHp, opponentDetails.initialHealth)}%` }}
                                    title={`${opponentCurrentHp} / ${opponentDetails.initialHealth}`}
                                ></div>
                            </div>
                            <p>HP: {opponentCurrentHp} / {opponentDetails.initialHealth}</p>
                        </div>
                    </div>

                    {/* Combat Log Display */}
                    <div className="combat-log-area">
                        <h4>Combat Log</h4>
                        <div className="log-entries">
                            {displayedLogEntries.map((entry, index) => (
                                <p key={index}>{entry}</p>
                            ))}
                        </div>
                    </div>

                    {/* Controls and Outcome */}
                    {combatResult && currentTurnIndex < combatResult.combatLog.length && !isLoading ? (
                        <button onClick={handleNextEvent} disabled={isLoading || currentTurnIndex >= combatResult.combatLog.length}>
                            Next Event
                        </button>
                    ) : null}
                    {isLoading && combatStarted && <p>Simulating...</p>}
                    {renderCombatOutcome()}
                </>
            )}
        </div>
    );
}

export default CombatPage;
