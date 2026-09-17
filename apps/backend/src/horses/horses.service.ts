import { Injectable, NotFoundException } from '@nestjs/common';
import { Horse } from '@asbaan/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class HorsesService {
  // In-memory store for local dev/demo. Swap for the PostgreSQL "Horses/Health"
  // service described in the platform architecture doc for production.
  private horses: Horse[] = [
    { id: 'horse-1', ownerId: 'owner-1', name: 'شبدیز', breed: 'عرب', ageYears: 9, discipline: 'jumping' },
  ];

  findAll(ownerId?: string): Horse[] {
    return ownerId ? this.horses.filter((h) => h.ownerId === ownerId) : this.horses;
  }

  findOne(id: string): Horse {
    const horse = this.horses.find((h) => h.id === id);
    if (!horse) throw new NotFoundException(`Horse ${id} not found`);
    return horse;
  }

  create(input: Omit<Horse, 'id'>): Horse {
    const horse: Horse = { id: randomUUID(), ...input };
    this.horses.push(horse);
    return horse;
  }
}
