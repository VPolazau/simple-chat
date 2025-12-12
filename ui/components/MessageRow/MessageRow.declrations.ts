import type { Message } from '@/types';

type MessageWithFlags = Message & { isOptimistic?: boolean };

export type MessageRowExtraProps = {
    items: MessageWithFlags[];
};