/** 山屿西山著 东/西区楼栋配置 */
const UNITS_3 = ['1单元', '2单元', '3单元'] as const;

export function buildZoneBuildings(zonePrefix: 'E' | 'W', from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => {
    const n = from + i;
    return {
      id: `${zonePrefix}-B${String(n).padStart(3, '0')}`,
      name: `${n}栋`,
      units: [...UNITS_3],
    };
  });
}

/** 东区 1–21 号楼，每栋 3 单元 */
export const EAST_BUILDINGS = buildZoneBuildings('E', 1, 21);

/** 西区 1–17 号楼，每栋 3 单元 */
export const WEST_BUILDINGS = buildZoneBuildings('W', 1, 17);
