import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

function loadGameLogic() {
  const source = readFileSync(resolve(repoRoot, 'js/game.js'), 'utf8');
  const start = source.indexOf("const SETTINGS_KEY = 'si_settings';");
  const end = source.indexOf('let gameSettings = loadSettings();');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No se pudo localizar el bloque testeable de js/game.js');
  }

  const sandbox = {
    console,
    Math,
    Date,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    window: {
      matchMedia: () => ({ matches: false })
    }
  };
  vm.createContext(sandbox);

  const logicSource = source.slice(start, end);
  vm.runInContext(
    `${logicSource}
    globalThis.__gameLogic = {
      normalizeDifficulty,
      normalizeGameMode,
      isWavesMode,
      normalizeAudioVolume,
      normalizeFontScale,
      normalizeStartLevel,
      normalizeCampaignLevelRecord,
      normalizeHistoryEntry,
      normalizePlayerRunStats,
      createDefaultCampaignState,
      createDefaultAggregateStats,
      getAccuracyPercent,
      formatDuration,
      formatDifficultyLabel,
      formatModeLabel,
      getCampaignCompletedThrough,
      getCampaignEntryRemainingLives,
      doesCampaignEntryDominate,
      getBossSequenceForLevel,
      getLevelEncounterTag,
      getWavesModeProfile,
      getWavesBossProfileId,
      getWavesMiniBossProfileId,
      getWaveEventForLevel,
      getWavePatternForLevel,
      getEnemyBasePoints,
      getEnemyScore,
      getRewardLabel,
      buildCountStatus,
      buildBinaryStatus,
      buildDurationStatus,
      countBestiarySeen,
      countBestiaryDefeated
    };`,
    sandbox
  );

  return sandbox.__gameLogic;
}

const logic = loadGameLogic();

describe('normalizacion de settings y datos persistidos', () => {
  it('devuelve valores seguros para dificultad, modo, volumen y nivel inicial', () => {
    expect(logic.normalizeDifficulty('hard')).toBe('hard');
    expect(logic.normalizeDifficulty('nightmare')).toBe('normal');
    expect(logic.normalizeGameMode('coop')).toBe('coop');
    expect(logic.normalizeGameMode('waves')).toBe('waves');
    expect(logic.normalizeGameMode('arcade')).toBe('classic');
    expect(logic.isWavesMode('waves')).toBe(true);
    expect(logic.normalizeAudioVolume(2)).toBe(0.6);
    expect(logic.normalizeAudioVolume(-1)).toBe(0);
    expect(logic.normalizeAudioVolume('bad', 0.35)).toBe(0.35);
    expect(logic.normalizeFontScale('large')).toBe('large');
    expect(logic.normalizeFontScale('huge')).toBe('medium');
    expect(logic.normalizeStartLevel(99, 7)).toBe(7);
    expect(logic.normalizeStartLevel(-5, 30)).toBe(1);
  });

  it('sanea records de campaña y estadisticas de jugador', () => {
    expect(
      logic.normalizeCampaignLevelRecord({
        bestScore: '-20',
        bestAccuracy: '75',
        completedAt: '2026-05-14T00:00:00.000Z',
        dominatedAt: 42
      })
    ).toMatchObject({
      bestScore: 0,
      bestAccuracy: 75,
      bestReach: 0,
      bestLivesEnd: 0,
      completedAt: '2026-05-14T00:00:00.000Z',
      dominatedAt: null
    });

    expect(logic.normalizePlayerRunStats({ id: 1, score: -10, hits: '4', activeAtEnd: false }, 1)).toMatchObject({
      id: 1,
      label: 'P2',
      score: 0,
      hits: 4,
      activeAtEnd: false
    });
  });

  it('normaliza entradas legacy de historial sin perder compatibilidad', () => {
    expect(logic.normalizeHistoryEntry(1200)).toMatchObject({
      score: 1200,
      level: 1,
      mode: 'classic',
      reason: 'defeat'
    });

    expect(
      logic.normalizeHistoryEntry({
        score: '2300',
        level: '6',
        maxCombo: '-1',
        difficulty: 'invalid',
        mode: 'timeattack',
        reason: 'timeout'
      })
    ).toMatchObject({
      score: 2300,
      level: 6,
      maxCombo: 1,
      difficulty: 'normal',
      mode: 'timeattack',
      reason: 'timeout'
    });
  });
});

describe('reglas de campaña', () => {
  it('calcula hasta que nivel cuenta una run de campaña', () => {
    expect(logic.getCampaignCompletedThrough({ mode: 'classic', reason: 'victory', level: 10 })).toBe(10);
    expect(logic.getCampaignCompletedThrough({ mode: 'classic', reason: 'defeat', level: 10 })).toBe(9);
    expect(logic.getCampaignCompletedThrough({ mode: 'coop', reason: 'victory', level: 99 })).toBe(30);
    expect(logic.getCampaignCompletedThrough({ mode: 'survival', reason: 'victory', level: 20 })).toBe(0);
    expect(logic.getCampaignCompletedThrough({ mode: 'waves', reason: 'victory', level: 20 })).toBe(0);
  });

  it('distingue vidas restantes para classic y coop', () => {
    expect(logic.getCampaignEntryRemainingLives({ mode: 'classic', lives: 4 })).toBe(4);
    expect(logic.getCampaignEntryRemainingLives({ mode: 'coop', squadLivesEnd: 6, lives: 1 })).toBe(6);
    expect(logic.getCampaignEntryRemainingLives(null)).toBe(0);
  });

  it('solo marca dominacion con minimo de vidas y precision', () => {
    expect(logic.doesCampaignEntryDominate({ mode: 'classic', lives: 3, accuracy: 60 })).toBe(true);
    expect(logic.doesCampaignEntryDominate({ mode: 'classic', lives: 2, accuracy: 80 })).toBe(false);
    expect(logic.doesCampaignEntryDominate({ mode: 'classic', lives: 5, accuracy: 59 })).toBe(false);
  });
});

describe('encounters, waves y scoring', () => {
  it('respeta bosses guionizados y gauntlet final', () => {
    expect(logic.getBossSequenceForLevel(6, 'classic')).toEqual(['striker']);
    expect(logic.getBossSequenceForLevel(29, 'classic')).toEqual(['striker', 'pulse', 'warden', 'overlord']);
    expect(logic.getBossSequenceForLevel(30, 'classic')).toEqual(['nemesis']);
    expect(logic.getLevelEncounterTag(29, 'classic')).toBe('GAUNTLET');
    expect(logic.getLevelEncounterTag(6, 'classic')).toBe('BOSS');
  });

  it('escala el modo oleadas de basicos a elites y bosses', () => {
    const wave1 = logic.getWavesModeProfile(1);
    const wave8 = logic.getWavesModeProfile(8);
    const wave18 = logic.getWavesModeProfile(18);

    expect(wave1.enemyCount).toBeLessThan(wave8.enemyCount);
    expect(wave8.roleWeights.some(([role]) => role === 'tank')).toBe(true);
    expect(wave8.roleWeights.some(([role]) => role === 'shooter')).toBe(true);
    expect(wave18.enemyCount).toBeGreaterThan(wave8.enemyCount);
    expect(wave18.hpBonus).toBeGreaterThanOrEqual(0);
    expect(logic.getWavesMiniBossProfileId(10)).toBe('squad_basic_plus');
    expect(logic.getWavesBossProfileId(18)).toBe('striker');
    expect(logic.getBossSequenceForLevel(18, 'waves')).toEqual(['striker']);
    expect(logic.getLevelEncounterTag(10, 'waves')).toBe('ELITE');
    expect(logic.getLevelEncounterTag(18, 'waves')).toBe('BOSS');
  });

  it('selecciona eventos y patrones de oleada de forma determinista por nivel', () => {
    expect(logic.getWaveEventForLevel(2, 'classic').id).toBe('standard');
    expect(logic.getWaveEventForLevel(5, 'classic').id).toBe('bonus');
    expect(logic.getWaveEventForLevel(7, 'classic').id).toBe('hunter');
    expect(logic.getWavePatternForLevel(1, 'classic').id).toBe('classic_grid');
    expect(logic.getWavePatternForLevel(4, 'classic').id).toBe('staggered');
  });

  it('calcula score base por fila y multiplicador de rol', () => {
    expect(logic.getEnemyBasePoints(0)).toBe(30);
    expect(logic.getEnemyBasePoints(1)).toBe(20);
    expect(logic.getEnemyBasePoints(2)).toBe(10);
    expect(logic.getEnemyScore({ row: 0, type: 'tank' })).toBe(54);
    expect(logic.getEnemyScore({ row: 2, type: 'unknown' })).toBe(10);
  });
});

describe('presentacion y progreso meta', () => {
  it('formatea porcentajes, duraciones, dificultad y modo', () => {
    expect(logic.getAccuracyPercent(10, 7)).toBe(70);
    expect(logic.getAccuracyPercent(0, 7)).toBe(0);
    expect(logic.formatDuration(65000)).toBe('1:05');
    expect(logic.formatDifficultyLabel('hard')).toBe('DIFICIL');
    expect(logic.formatModeLabel('competitive')).toBe('2P COMP');
    expect(logic.formatModeLabel('waves')).toBe('OLEADAS');
  });

  it('genera etiquetas de recompensa reconocibles', () => {
    expect(logic.getRewardLabel(null)).toBe('SIN RECOMPENSA EXTRA');
    expect(logic.getRewardLabel({ type: 'skin', id: 'aurora' })).toBe('SKIN AURORA');
    expect(logic.getRewardLabel({ type: 'shipSkin', id: 'dreadnought' })).toBe('NAVE DREADNOUGHT');
    expect(logic.getRewardLabel({ type: 'starterLoadout', id: 'drone' })).toBe('EQUIPO DRONES');
    expect(logic.getRewardLabel({ type: 'unknown', id: 'x' })).toBe('RECOMPENSA META');
  });

  it('construye estados de progreso consistentes', () => {
    expect(logic.buildCountStatus(7, 10, 'UFO')).toMatchObject({
      value: 7,
      target: 10,
      ratio: 0.7,
      complete: false,
      label: '7/10 UFO'
    });

    expect(logic.buildBinaryStatus(true, 'LISTO')).toMatchObject({
      value: 1,
      ratio: 1,
      complete: true,
      label: 'LISTO'
    });

    expect(logic.buildDurationStatus(90000, 120000)).toMatchObject({
      ratio: 0.75,
      complete: false,
      label: '1:30/2:00'
    });
  });

  it('cuenta amenazas vistas y derrotadas desde metaState saneado', () => {
    const meta = {
      bestiary: {
        seen: { enemy_classic: true, enemy_tank: false, boss_striker: true },
        defeated: { enemy_classic: 3, enemy_tank: 0, boss_striker: 1 }
      }
    };

    expect(logic.countBestiarySeen(meta, ['enemy_classic', 'enemy_tank', 'boss_striker'])).toBe(2);
    expect(logic.countBestiaryDefeated(meta, ['enemy_classic', 'enemy_tank', 'boss_striker'])).toBe(2);
  });
});
