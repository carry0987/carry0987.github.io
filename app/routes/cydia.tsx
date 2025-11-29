import type { Route } from './+types/cydia';
import { Cydia } from '@/lib/cydia';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Cydia' }, { name: 'description', content: 'Cydia is a package manager for iOS' }];
}

export default function CydiaPage() {
    return <Cydia />;
}
