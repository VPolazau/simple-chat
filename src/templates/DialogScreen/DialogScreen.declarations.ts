import type { Message } from '@/types';

export type TMessageWithFlags = Message & { isOptimistic?: boolean };