import type { MissionDefinition } from '../types';

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'bluegrass-surveillance',
    number: 1,
    title: 'Bluegrass Surveillance',
    district: 'estates',
    briefing: 'Infiltrate the Bluegrass Horse Estates and expose three hidden ledger assets without entering any guard memory bank.',
    mechanic: 'Hold UV Scan to expose hidden ledger assets across Zone 1.',
    failureCondition: 'Any Estates guard entering suspicion or hostility fails the operation.',
    objectives: [
      { id: 'locate-ledgers', label: 'Locate hidden ledger assets with UV Vision', target: 3 },
      { id: 'remain-undetected', label: 'Complete the infiltration without suspicion', target: 1 }
    ]
  },
  {
    id: 'transit-ambush',
    number: 2,
    title: 'The Transit Ambush',
    district: 'city',
    briefing: 'Intercept a high-value Syndicate courier inside the Lexington Grid choke points before the target crosses a bridge node.',
    mechanic: 'Draw the Velvet Compact near the courier to force the target into the alley escape route.',
    failureCondition: 'The courier escaping across the north bridge fails the mission.',
    unlockAfter: 'bluegrass-surveillance',
    objectives: [
      { id: 'force-courier', label: 'Draw your weapon and force the courier to flee', target: 1 },
      { id: 'neutralize-courier', label: 'Neutralize the courier before bridge escape', target: 1 }
    ]
  },
  {
    id: 'velvet-lockdown',
    number: 3,
    title: 'Velvet Lockdown',
    district: 'all',
    briefing: 'Break through a five-star regional dragnet and reach the eastern safehouse before the pursuit burns through your health.',
    mechanic: 'Hold Shift or FLOW to engage Velvet Flow, increasing movement while slowing hostile simulation.',
    failureCondition: 'Health reaching zero before safehouse extraction fails the mission.',
    unlockAfter: 'transit-ambush',
    objectives: [
      { id: 'engage-flow', label: 'Engage Velvet Flow', target: 1 },
      { id: 'reach-safehouse', label: 'Reach the Coal-Hollows safehouse alive', target: 1 }
    ]
  },
  {
    id: 'hollows-retaliation',
    number: 4,
    title: 'Hollows Retaliation',
    district: 'hollows',
    briefing: 'Defend the allied Hollows stronghold against ten retaliatory units advancing on the grid coordinate.',
    mechanic: 'Suppress hostile waves while enemy projectile vectors pressure the defense perimeter.',
    failureCondition: 'Any active hostile breaching the stronghold core fails the defense.',
    unlockAfter: 'velvet-lockdown',
    objectives: [
      { id: 'suppress-retaliators', label: 'Suppress retaliatory units', target: 10 },
      { id: 'hold-stronghold', label: 'Keep the stronghold coordinate clear', target: 1 }
    ]
  },
  {
    id: 'kentahten-sovereign',
    number: 5,
    title: 'The Kentahten Sovereign',
    district: 'all',
    briefing: 'Hunt the corrupt regional overseer from the Estates Manor to the Coal-Hollow rail yards while every faction remembers your face.',
    mechanic: 'Trigger a multi-zone pursuit that permanently flags the full regional NPC memory grid.',
    failureCondition: 'Health reaching zero before the overseer is eliminated fails the final operation.',
    unlockAfter: 'hollows-retaliation',
    objectives: [
      { id: 'trigger-pursuit', label: 'Trigger the manor-to-rail pursuit', target: 1 },
      { id: 'flag-memory-grid', label: 'Flag every regional memory bank', target: 1 },
      { id: 'eliminate-overseer', label: 'Permanently eliminate the regional overseer', target: 1 }
    ]
  }
];

export const getMission = (id: string): MissionDefinition => {
  const mission = MISSIONS.find((candidate) => candidate.id === id);
  if (!mission) throw new Error(`Unknown mission: ${id}`);
  return mission;
};
